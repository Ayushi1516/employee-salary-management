package com.department_service.services;


import com.department_service.entity.Department;
import com.department_service.entity.DepartmentStats;
import com.department_service.event.HeadcountClient;
import com.department_service.exception.DepartmentInUseException;
import com.department_service.exception.DepartmentNotFoundException;
import com.department_service.repositories.DepartmentRepository;
import com.department_service.repositories.DepartmentStatsRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Map;

@Service
@Transactional(readOnly = true)
public class DepartmentService {

    private static final Logger log = LoggerFactory.getLogger(DepartmentService.class);

    /** headcount and avgSalaryUsd are null when employee-service is unavailable (graceful degradation). */
    public record DepartmentSummary(Long id, String code, String name, BigDecimal payrollTotalUsd,
                                    Long headcount, BigDecimal avgSalaryUsd) { }

    private final DepartmentRepository departments;
    private final DepartmentStatsRepository stats;
    private final HeadcountClient headcountClient;

    DepartmentService(DepartmentRepository departments, DepartmentStatsRepository stats, HeadcountClient headcountClient) {
        this.departments = departments;
        this.stats = stats;
        this.headcountClient = headcountClient;
    }

    public List<DepartmentSummary> list() {
        Map<Long, Long> headcounts = headcounts();
        Map<Long, BigDecimal> payroll = payrollByDepartment();
        return departments.findAll().stream()
                .map(d -> summarise(d, payroll.getOrDefault(d.getId(), BigDecimal.ZERO), headcounts))
                .sorted((a, b) -> a.name().compareToIgnoreCase(b.name()))
                .toList();
    }

    public DepartmentSummary get(long id) {
        Department d = departments.findById(id).orElseThrow(() -> new DepartmentNotFoundException(id));
        BigDecimal payroll = stats.findById(id).map(DepartmentStats::getPayrollTotalUsd).orElse(BigDecimal.ZERO);
        return summarise(d, payroll, headcounts());
    }

    @Transactional
    public DepartmentSummary create(String code, String name) {
        Department d = departments.save(new Department(code, name));
        stats.save(new DepartmentStats(d.getId()));   // payroll projection row starts at 0
        return summarise(d, BigDecimal.ZERO, Map.of(d.getId(), 0L));
    }

    @Transactional
    public DepartmentSummary update(long id, String code, String name) {
        Department d = departments.findById(id).orElseThrow(() -> new DepartmentNotFoundException(id));
        d.rename(code, name);
        return get(id);
    }

    /** A department with active people cannot be deleted. If headcount is unknown we refuse rather than guess. */
    @Transactional
    public void delete(long id) {
        if (!departments.existsById(id)) {
            throw new DepartmentNotFoundException(id);
        }
        Long count = headcountClient.headcountByDepartment().getOrDefault(id, 0L);
        if (count > 0) {
            throw new DepartmentInUseException(id, count);
        }
        stats.deleteById(id);
        departments.deleteById(id);
    }

    private Map<Long, BigDecimal> payrollByDepartment() {
        return stats.findAll().stream()
                .collect(java.util.stream.Collectors.toMap(DepartmentStats::getDepartmentId, DepartmentStats::getPayrollTotalUsd));
    }

    /** Returns null (not an empty map) when unknown, so "no employees" and "no answer" stay distinguishable. */
    private Map<Long, Long> headcounts() {
        try {
            return headcountClient.headcountByDepartment();
        } catch (RuntimeException e) {
            log.warn("Headcount unavailable, returning payroll-only summaries: {}", e.toString());
            return null;
        }
    }

    private DepartmentSummary summarise(Department d, BigDecimal payroll, Map<Long, Long> headcounts) {
        Long head = headcounts == null ? null : headcounts.getOrDefault(d.getId(), 0L);
        BigDecimal avg = (head == null || head == 0) ? null
                : payroll.divide(BigDecimal.valueOf(head), 2, RoundingMode.HALF_UP);
        return new DepartmentSummary(d.getId(), d.getCode(), d.getName(), payroll, head, avg);
    }
}


