package com.department_service.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "department")
public class Department {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(nullable = false) private String code;
    @Column(nullable = false) private String name;

    protected Department() { }
    public Department(String code, String name) { this.code = code.toUpperCase(); this.name = name; }

    public void rename(String code, String name) { this.code = code.toUpperCase(); this.name = name; }
    public Long getId() { return id; }
    public String getCode() { return code; }
    public String getName() { return name; }
}