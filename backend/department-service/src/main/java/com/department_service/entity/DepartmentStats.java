package com.department_service.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.math.BigDecimal;

@Entity
@Table(name = "department_stats")
public class DepartmentStats {
    @Id
    @Column(name = "department_id") private Long departmentId;
    @Column(name = "payroll_total_usd", nullable = false) private BigDecimal payrollTotalUsd = BigDecimal.ZERO;

    protected DepartmentStats() { }
    public DepartmentStats(Long departmentId) { this.departmentId = departmentId; }

    public Long getDepartmentId() { return departmentId; }
    public BigDecimal getPayrollTotalUsd() { return payrollTotalUsd; }
}
