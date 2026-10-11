package com.salary_service.exceptions;

public class SalaryNotFoundException extends RuntimeException {
    public SalaryNotFoundException(long id) {
        super("Salary " + id + " not found");
    }
}
