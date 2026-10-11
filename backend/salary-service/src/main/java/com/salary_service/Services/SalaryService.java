package com.salary_service.Services;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

import com.salary_service.client.EmployeeClient;
import com.salary_service.config.FxConverter;
import com.salary_service.entity.Salary;
import com.salary_service.exceptions.InvalidSalaryException;
import com.salary_service.exceptions.SalaryNotFoundException;
import com.salary_service.repositories.SalaryRepository;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.salary_service.Dtos.SalaryDtos.SalaryResponse;
import com.salary_service.Dtos.SalaryDtos.CreateSalaryRequest;
import com.salary_service.Dtos.SalaryDtos.UpdateSalaryRequest;
import com.salary_service.Dtos.SalaryDtos.EmployeeSnapshot;
import com.salary_service.Dtos.SalaryDtos.AnalyticsResponse;
import com.common.event.SalaryChangedEvent;
import com.common.event.SalaryChangedEvent.Type;

@Service
@Transactional(readOnly = true)
public class SalaryService {

    private final SalaryRepository repository;
    private final EmployeeClient employees;
    private final FxConverter fx;
    private final ApplicationEventPublisher events;

    public SalaryService(SalaryRepository repository, EmployeeClient employees, FxConverter fx,
                         ApplicationEventPublisher events) {
        this.repository = repository;
        this.employees = employees;
        this.fx = fx;
        this.events = events;
    }

    public List<SalaryResponse> history(long employeeId) {
        return repository.findByEmployeeIdOrderByEffectiveFromDesc(employeeId).stream().map(SalaryResponse::from).toList();
    }

    public SalaryResponse get(long id) {
        return SalaryResponse.from(find(id));
    }

    /**
     * Records a new salary. The previous current row (if any) is closed the day before the new one starts,
     * so history has no gaps or overlaps. Remote validation happens BEFORE the DB write.
     */
    @Transactional
    public SalaryResponse create(CreateSalaryRequest r) {
        EmployeeSnapshot employee = employees.get(r.employeeId());   // 404 / 503 propagate to the client
        if ("TERMINATED".equals(employee.status())) {
            throw new InvalidSalaryException("Cannot set a salary for a terminated employee");
        }
        BigDecimal usd = fx.toUsd(r.amount(), r.currency());

        var previous = repository.findByEmployeeIdAndEffectiveToIsNull(r.employeeId());
        previous.ifPresent(p -> {
            if (!r.effectiveFrom().isAfter(p.getEffectiveFrom())) {
                throw new InvalidSalaryException("effectiveFrom must be after the current salary's start date ("
                        + p.getEffectiveFrom() + ")");
            }
            p.closeOn(r.effectiveFrom().minusDays(1));
            repository.saveAndFlush(p);
        });

        Salary saved = repository.save(new Salary(r.employeeId(), employee.departmentId(), employee.countryCode(),
                r.amount(), r.currency().toUpperCase(), usd, r.effectiveFrom()));

        publish(previous.isPresent() ? Type.UPDATED : Type.CREATED, saved,
                previous.map(Salary::getAmountUsd).orElse(null), saved.getAmountUsd());
        return SalaryResponse.from(saved);
    }

    @Transactional
    public SalaryResponse correct(long id, UpdateSalaryRequest r) {
        Salary s = find(id);
        BigDecimal before = s.getAmountUsd();
        s.correct(r.amount(), r.currency().toUpperCase(), fx.toUsd(r.amount(), r.currency()));
        if (s.isCurrent()) {   // history rows do not affect current payroll
            publish(Type.UPDATED, s, before, s.getAmountUsd());
        }
        return SalaryResponse.from(s);
    }

    @Transactional
    public void delete(long id) {
        Salary s = find(id);
        repository.delete(s);
        if (s.isCurrent()) {
            publish(Type.DELETED, s, s.getAmountUsd(), null);
        }
    }

    public AnalyticsResponse analytics() {
        return new AnalyticsResponse(repository.overall(), repository.byDepartment(), repository.byCountry());
    }

    private Salary find(long id) {
        return repository.findById(id).orElseThrow(() -> new SalaryNotFoundException(id));
    }

    /** Published in-process; {@link SalaryEventPublisher} sends it to Kafka only AFTER the DB commit. */
    private void publish(Type type, Salary s, BigDecimal oldUsd, BigDecimal newUsd) {
        events.publishEvent(new SalaryChangedEvent(UUID.randomUUID(), type, s.getEmployeeId(), s.getDepartmentId(),
                s.getCountryCode(), oldUsd, newUsd, Instant.now()));
    }
}

