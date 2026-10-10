package com.employee_service.services;

import java.util.List;

import com.employee_service.dto.EmployeeDtos.EmployeeResponse;
import com.employee_service.dto.EmployeeDtos.EmployeeRequest;
import com.employee_service.dto.EmployeeDtos.PageResponse;
import com.employee_service.entity.Employee;
import com.employee_service.exception.EmployeeNotFoundException;
import com.employee_service.repositories.EmployeeRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class EmployeeService {

    /** Guard rail: a client cannot ask for the whole 10k table in one response. */
    static final int MAX_PAGE_SIZE = 100;

    private final EmployeeRepository repository;

    public EmployeeService(EmployeeRepository repository) {
        this.repository = repository;
    }

    public PageResponse<EmployeeResponse> search(String q, Long departmentId, String countryCode, int page, int size) {
        String query = (q == null || q.isBlank()) ? null : q.trim();
        String country = (countryCode == null || countryCode.isBlank()) ? null : countryCode.toUpperCase();
        PageRequest pageable = PageRequest.of(Math.max(page, 0), Math.min(Math.max(size, 1), MAX_PAGE_SIZE),
                Sort.by("lastName", "firstName", "id"));   // "id" makes ordering total => stable paging

        Page<Employee> result = repository.search(query, departmentId, country, pageable);
        return new PageResponse<>(result.map(EmployeeResponse::from).getContent(),
                result.getNumber(), result.getSize(), result.getTotalElements(), result.getTotalPages());
    }

    public EmployeeResponse get(long id) {
        return EmployeeResponse.from(find(id));
    }

    @Transactional
    public EmployeeResponse create(EmployeeRequest r) {
        Employee e = new Employee(r.firstName(), r.lastName(), r.email(), r.jobTitle(),
                r.departmentId(), r.countryCode(), r.hireDate(), r.status());
        return EmployeeResponse.from(repository.save(e));
    }

    @Transactional
    public EmployeeResponse update(long id, EmployeeRequest r) {
        Employee e = find(id);
        e.apply(r.firstName(), r.lastName(), r.email(), r.jobTitle(),
                r.departmentId(), r.countryCode(), r.hireDate(), r.status());
        return EmployeeResponse.from(e); // dirty checking flushes on commit
    }

    /** Soft delete: salary history must stay explainable after someone leaves. */
    @Transactional
    public void terminate(long id) {
        find(id).terminate();
    }

    private Employee find(long id) {
        return repository.findById(id).orElseThrow(() -> new EmployeeNotFoundException(id));
    }
}

