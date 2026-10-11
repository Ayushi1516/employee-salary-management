package com.salary_service.exceptions;

public class EmployeeNotFoundException extends RuntimeException {
    public EmployeeNotFoundException(long id) { super("Employee " + id + " not found"); }
}
