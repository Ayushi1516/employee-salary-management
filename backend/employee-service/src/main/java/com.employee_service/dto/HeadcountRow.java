package com.acme.salary.employee;

/** Active (non-terminated) employees in one department. */
public record HeadcountRow(Long departmentId, long headcount) { }
