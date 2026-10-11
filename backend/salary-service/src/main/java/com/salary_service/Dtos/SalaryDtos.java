package com.salary_service.Dtos;

import com.salary_service.entity.Salary;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public final class SalaryDtos {
    private SalaryDtos() { }

    public record CreateSalaryRequest(
            @NotNull @Positive Long employeeId,
            @NotNull @DecimalMin(value = "0.01") BigDecimal amount,
            @NotBlank @Pattern(regexp = "[A-Za-z]{3}") String currency,
            @NotNull LocalDate effectiveFrom) { }

    /** Correction of an existing row (typo fix); use POST to record a genuine raise. */
    public record UpdateSalaryRequest(
            @NotNull @DecimalMin(value = "0.01") BigDecimal amount,
            @NotBlank @Pattern(regexp = "[A-Za-z]{3}") String currency) { }

    public record SalaryResponse(Long id, Long employeeId, Long departmentId, String countryCode,
                                 BigDecimal amount, String currency, BigDecimal amountUsd,
                                 LocalDate effectiveFrom, LocalDate effectiveTo) {
        public static SalaryResponse from(Salary s) {
            return new SalaryResponse(s.getId(), s.getEmployeeId(), s.getDepartmentId(), s.getCountryCode(),
                    s.getAmount(), s.getCurrency(), s.getAmountUsd(), s.getEffectiveFrom(), s.getEffectiveTo());
        }
    }


    /** Subset of employee-service's response that this service needs. */
    public record EmployeeSnapshot(Long id, Long departmentId, String countryCode, String status) { }
}
