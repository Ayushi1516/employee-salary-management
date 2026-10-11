package com.salary_service.controllers;

import com.salary_service.Services.SalaryService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import com.salary_service.Dtos.SalaryDtos.SalaryResponse;
import com.salary_service.Dtos.SalaryDtos.CreateSalaryRequest;
import com.salary_service.Dtos.SalaryDtos.UpdateSalaryRequest;
import com.salary_service.Dtos.SalaryDtos.AnalyticsResponse;

@RestController
@RequestMapping("/salaries")
public class SalaryController {

    private final SalaryService service;

    public SalaryController(SalaryService service) {
        this.service = service;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public SalaryResponse create(@Valid @RequestBody CreateSalaryRequest request) {
        return service.create(request);
    }

    @GetMapping("/{id}")
    public SalaryResponse get(@PathVariable long id) {
        return service.get(id);
    }

    /** Full salary history, newest first. */
    @GetMapping("/employee/{employeeId}")
    public List<SalaryResponse> history(@PathVariable long employeeId) {
        return service.history(employeeId);
    }

    @PutMapping("/{id}")
    public SalaryResponse correct(@PathVariable long id, @Valid @RequestBody UpdateSalaryRequest request) {
        return service.correct(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable long id) {
        service.delete(id);
    }

    @GetMapping("/analytics")
    public AnalyticsResponse analytics() {
        return service.analytics();
    }
}

