package com.salary_service.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Map;

@Component
@ConfigurationProperties(prefix = "acme.fx")
public record FxProperties(Map<String, BigDecimal> rates) { }
