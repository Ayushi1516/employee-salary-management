package com.employee_service.exception;

public class EmployeeNotFoundException extends RuntimeException {
    public EmployeeNotFoundException(long id) {
        super("Employee " + id + " not found");
    }
}
