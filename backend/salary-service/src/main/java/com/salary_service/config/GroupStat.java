package com.salary_service.config;

import java.math.BigDecimal;

/** Aggregate over current salaries for one group (a department id, a country code, or "ALL"). */
public record GroupStat(String key, long employees, Double avgUsd, BigDecimal minUsd, BigDecimal maxUsd, BigDecimal totalUsd) { }
