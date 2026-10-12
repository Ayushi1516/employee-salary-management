package com.salary_service.client;

import com.salary_service.Dtos.SalaryDtos;
import com.salary_service.exceptions.EmployeeNotFoundException;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.retry.annotation.Retry;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.client.loadbalancer.LoadBalanced;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClient;

@Component
public class EmployeeClient {

    private final RestClient rest;

    // Inject the load-balanced RestClient.Builder directly
    public EmployeeClient(RestClient.Builder builder) {
        // baseUrl uses the service name registered in Eureka
        this.rest = builder.baseUrl("http://employee-service").build();
    }

    @Retry(name = "employeeService")
    @CircuitBreaker(name = "employeeService")
    public SalaryDtos.EmployeeSnapshot get(long employeeId) {
        try {
            return rest.get().uri("/employees/{id}", employeeId).retrieve().body(SalaryDtos.EmployeeSnapshot.class);
        } catch (HttpClientErrorException.NotFound e) {
            throw new EmployeeNotFoundException(employeeId);
        }
    }
}
