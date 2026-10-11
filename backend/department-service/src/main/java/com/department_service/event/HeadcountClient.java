package com.department_service.event;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.retry.annotation.Retry;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
public class HeadcountClient {

    public record Row(Long departmentId, long headcount) { }

    private final RestClient rest;

    HeadcountClient(RestClient.Builder loadBalanced,
                    @Value("${acme.employee-service.url:http://employee-service}") String baseUrl) {
        this.rest = loadBalanced.baseUrl(baseUrl).build();
    }

    @Retry(name = "employeeService")
    @CircuitBreaker(name = "employeeService")
    public Map<Long, Long> headcountByDepartment() {
        List<Row> rows = rest.get().uri("/employees/stats/headcount").retrieve()
                .body(new ParameterizedTypeReference<>() { });
        return rows == null ? Map.of() : rows.stream().collect(Collectors.toMap(Row::departmentId, Row::headcount));
    }
}
