package com.salary_service.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

import java.math.BigDecimal;
import java.util.Map;

/** Static USD conversion rates (USD per 1 unit of currency). Production: replace with a rates feed. */
@ConfigurationProperties(prefix = "acme.fx")
public record FxProperties(Map<String, BigDecimal> rates) { }
