package com.salary_service.entity;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * One row of an employee's salary history. The current salary is the row with effective_to = NULL.
 * (The DB-generated current_flag column is deliberately not mapped; it only enforces uniqueness.)
 */
@Entity
@Table(name = "salary")
public class Salary {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(name = "employee_id", nullable = false) private Long employeeId;
    @Column(name = "department_id", nullable = false) private Long departmentId;
    @Column(name = "country_code", nullable = false, length = 2) private String countryCode;
    @Column(nullable = false, precision = 14, scale = 2) private BigDecimal amount;
    @Column(nullable = false, length = 3) private String currency;
    @Column(name = "amount_usd", nullable = false, precision = 14, scale = 2) private BigDecimal amountUsd;
    @Column(name = "effective_from", nullable = false) private LocalDate effectiveFrom;
    @Column(name = "effective_to") private LocalDate effectiveTo;

    protected Salary() { } // JPA

    public Salary(Long employeeId, Long departmentId, String countryCode, BigDecimal amount,
                  String currency, BigDecimal amountUsd, LocalDate effectiveFrom) {
        this.employeeId = employeeId;
        this.departmentId = departmentId;
        this.countryCode = countryCode;
        this.amount = amount;
        this.currency = currency;
        this.amountUsd = amountUsd;
        this.effectiveFrom = effectiveFrom;
    }

    public boolean isCurrent() { return effectiveTo == null; }

    public void correct(BigDecimal amount, String currency, BigDecimal amountUsd) {
        this.amount = amount;
        this.currency = currency;
        this.amountUsd = amountUsd;
    }

    public void closeOn(LocalDate date) { this.effectiveTo = date; }

    public Long getId() { return id; }
    public Long getEmployeeId() { return employeeId; }
    public Long getDepartmentId() { return departmentId; }
    public String getCountryCode() { return countryCode; }
    public BigDecimal getAmount() { return amount; }
    public String getCurrency() { return currency; }
    public BigDecimal getAmountUsd() { return amountUsd; }
    public LocalDate getEffectiveFrom() { return effectiveFrom; }
    public LocalDate getEffectiveTo() { return effectiveTo; }
}

