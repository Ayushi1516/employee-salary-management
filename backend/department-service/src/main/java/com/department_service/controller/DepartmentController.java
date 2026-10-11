package com.department_service.controller;

import com.department_service.exception.DepartmentInUseException;
import com.department_service.exception.DepartmentNotFoundException;
import com.department_service.services.DepartmentService;
import com.department_service.services.DepartmentService.DepartmentSummary;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.ResourceAccessException;
import io.github.resilience4j.circuitbreaker.CallNotPermittedException;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/departments")
public class DepartmentController {

    public record DepartmentRequest(@NotBlank @Size(max = 16) String code, @NotBlank @Size(max = 120) String name) { }

    private final DepartmentService service;

    DepartmentController(DepartmentService service) {
        this.service = service;
    }

    @GetMapping
    public List<DepartmentSummary> list() { return service.list(); }

    @GetMapping("/{id}")
    public DepartmentSummary get(@PathVariable long id) { return service.get(id); }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public DepartmentSummary create(@Valid @RequestBody DepartmentRequest r) { return service.create(r.code(), r.name()); }

    @PutMapping("/{id}")
    public DepartmentSummary update(@PathVariable long id, @Valid @RequestBody DepartmentRequest r) {
        return service.update(id, r.code(), r.name());
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable long id) { service.delete(id); }

    // ---- error mapping (kept next to the controller: this service has few error types)
    @ExceptionHandler(DepartmentNotFoundException.class)
    ProblemDetail notFound(DepartmentNotFoundException e) { return problem(HttpStatus.NOT_FOUND, e.getMessage()); }

    @ExceptionHandler(DepartmentInUseException.class)
    ProblemDetail conflict(DepartmentInUseException e) { return problem(HttpStatus.CONFLICT, e.getMessage()); }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    ProblemDetail invalid(MethodArgumentNotValidException e) {
        return problem(HttpStatus.BAD_REQUEST, e.getBindingResult().getFieldErrors().stream()
                .map(f -> f.getField() + " " + f.getDefaultMessage()).collect(Collectors.joining("; ")));
    }

    @ExceptionHandler({ResourceAccessException.class, HttpServerErrorException.class, CallNotPermittedException.class})
    ProblemDetail unavailable(Exception e) {
        return problem(HttpStatus.SERVICE_UNAVAILABLE, "Employee service unavailable; try again shortly");
    }

    private ProblemDetail problem(HttpStatus s, String detail) { return ProblemDetail.forStatusAndDetail(s, detail); }
}
