package com.department_service.exception;

public class DepartmentNotFoundException extends RuntimeException {
    public DepartmentNotFoundException(long id) { super("Department " + id + " not found"); }
}
