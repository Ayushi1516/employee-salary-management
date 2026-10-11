package com.salary_service.exceptions;

public final class Exceptions {
    private Exceptions() { }
}

class EmployeeNotFoundException extends RuntimeException {
    EmployeeNotFoundException(long id) { super("Employee " + id + " not found"); }
}

class SalaryNotFoundException extends RuntimeException {
    public SalaryNotFoundException(long id) { super("Salary " + id + " not found"); }
}

class InvalidSalaryException extends RuntimeException {
    public InvalidSalaryException(String message) { super(message); }
}

