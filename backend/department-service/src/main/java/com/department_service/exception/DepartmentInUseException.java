package com.department_service.exception;

public class DepartmentInUseException extends RuntimeException {
    public DepartmentInUseException(long id, long count) {
        super("Department " + id + " still has " + count + " active employees");
    }
}
