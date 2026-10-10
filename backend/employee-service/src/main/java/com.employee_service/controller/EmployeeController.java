package com.employee_service.controller;


import com.employee_service.dto.EmployeeDtos.EmployeeRequest;
import com.employee_service.dto.EmployeeDtos.EmployeeResponse;
import com.employee_service.dto.EmployeeDtos.PageResponse;
import com.employee_service.services.EmployeeService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employees")
public class EmployeeController {

    private final EmployeeService service;

    public EmployeeController(EmployeeService service) {
        this.service = service;
    }

    @GetMapping
    public PageResponse<EmployeeResponse> search(@RequestParam(required = false) String q,
                                                              @RequestParam(required = false) Long departmentId,
                                                              @RequestParam(required = false) String countryCode,
                                                              @RequestParam(defaultValue = "0") int page,
                                                              @RequestParam(defaultValue = "25") int size) {
        return service.search(q, departmentId, countryCode, page, size);
    }

    @GetMapping("/{id}")
    public EmployeeResponse get(@PathVariable long id) {
        return service.get(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public EmployeeResponse create(@Valid @RequestBody EmployeeRequest request) {
        return service.create(request);
    }

    @PutMapping("/{id}")
    public EmployeeResponse update(@PathVariable long id, @Valid @RequestBody EmployeeRequest request) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void terminate(@PathVariable long id) {
        service.terminate(id);
    }

}

