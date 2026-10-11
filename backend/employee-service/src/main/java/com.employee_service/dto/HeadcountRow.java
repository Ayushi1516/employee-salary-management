package com.employee_service.dto;

/** Active (non-terminated) employees in one department. */
public record HeadcountRow(Long departmentId, long headcount) { }
