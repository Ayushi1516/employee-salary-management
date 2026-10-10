package com.employee_service.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "employee",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = "email")
        })
public class Employee {

    public enum Status { ACTIVE, ON_LEAVE, TERMINATED }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "first_name", nullable = false) private String firstName;
    @Column(name = "last_name", nullable = false) private String lastName;
    @Column(nullable = false, unique = true) private String email;
    @Column(name = "job_title", nullable = false) private String jobTitle;
    @Column(name = "department_id", nullable = false) private Long departmentId;
    @Column(name = "country_code", nullable = false, length = 2) private String countryCode;
    @Column(name = "hire_date", nullable = false) private LocalDate hireDate;
    @Enumerated(EnumType.STRING) @Column(nullable = false) private Status status = Status.ACTIVE;

    protected Employee() { } // JPA

    public Employee(String firstName, String lastName, String email, String jobTitle,
                    Long departmentId, String countryCode, LocalDate hireDate, Status status) {
        apply(firstName, lastName, email, jobTitle, departmentId, countryCode, hireDate, status);
    }

    public void apply(String firstName, String lastName, String email, String jobTitle,
                      Long departmentId, String countryCode, LocalDate hireDate, Status status) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.jobTitle = jobTitle;
        this.departmentId = departmentId;
        this.countryCode = countryCode.toUpperCase();
        this.hireDate = hireDate;
        this.status = status == null ? Status.ACTIVE : status;
    }

    public void terminate() { this.status = Status.TERMINATED; }

}
