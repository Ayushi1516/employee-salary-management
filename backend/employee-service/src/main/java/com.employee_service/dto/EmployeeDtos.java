package com.employee_service.dto;
import com.employee_service.entity.Employee;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import java.util.List;

/** Request/response shapes kept separate from the JPA entity so the API can evolve independently. */
public final class EmployeeDtos {
    private EmployeeDtos() { }

    public record EmployeeRequest(
            @NotBlank @Size(max = 80) String firstName,
            @NotBlank @Size(max = 80) String lastName,
            @NotBlank @Email @Size(max = 160) String email,
            @NotBlank @Size(max = 120) String jobTitle,
            @NotNull @Positive Long departmentId,
            @NotBlank @Pattern(regexp = "[A-Za-z]{2}", message = "must be an ISO 3166-1 alpha-2 code") String countryCode,
            @NotNull @PastOrPresent LocalDate hireDate,
            Employee.Status status) { }

    public record EmployeeResponse(Long id, String firstName, String lastName, String email, String jobTitle,
                                   Long departmentId, String countryCode, LocalDate hireDate, Employee.Status status) {
        public static EmployeeResponse from(Employee e) {
            return new EmployeeResponse(e.getId(), e.getFirstName(), e.getLastName(), e.getEmail(), e.getJobTitle(),
                    e.getDepartmentId(), e.getCountryCode(), e.getHireDate(), e.getStatus());
        }
    }

    public record PageResponse<T>(List<T> content, int page, int size, long totalElements, int totalPages) { }
}
