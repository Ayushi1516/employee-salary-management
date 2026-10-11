package com.salary_service.exceptions;

import io.github.resilience4j.circuitbreaker.CallNotPermittedException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.ResourceAccessException;

import java.util.stream.Collectors;

@RestControllerAdvice
public class ApiExceptionHandler {

    @ExceptionHandler({EmployeeNotFoundException.class, SalaryNotFoundException.class})
    ProblemDetail notFound(RuntimeException e) {
        return problem(HttpStatus.NOT_FOUND, "Not found", e.getMessage());
    }

    @ExceptionHandler({InvalidSalaryException.class, IllegalArgumentException.class})
    ProblemDetail badRequest(RuntimeException e) {
        return problem(HttpStatus.BAD_REQUEST, "Invalid salary", e.getMessage());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    ProblemDetail invalid(MethodArgumentNotValidException e) {
        String detail = e.getBindingResult().getFieldErrors().stream()
                .map(f -> f.getField() + " " + f.getDefaultMessage()).collect(Collectors.joining("; "));
        return problem(HttpStatus.BAD_REQUEST, "Validation failed", detail);
    }

    /** Employee service down, slow, or circuit open: fail fast with a retryable status. */
    @ExceptionHandler({ResourceAccessException.class, HttpServerErrorException.class, CallNotPermittedException.class})
    ProblemDetail dependencyDown(Exception e) {
        return problem(HttpStatus.SERVICE_UNAVAILABLE, "Employee service unavailable",
                "Could not verify the employee right now. Please retry shortly.");
    }

    private ProblemDetail problem(HttpStatus status, String title, String detail) {
        ProblemDetail p = ProblemDetail.forStatusAndDetail(status, detail);
        p.setTitle(title);
        return p;
    }
}
