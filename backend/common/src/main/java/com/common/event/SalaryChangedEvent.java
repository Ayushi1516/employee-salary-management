package com.common.event;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

/**
 * Published by salary-service whenever a CURRENT salary is created, corrected or removed.
 * Carries old and new USD amounts so consumers can apply a delta without calling back.
 * Historical (closed) salary rows never produce events: they do not affect current payroll.
 *
 * @param eventId       unique per event; consumers use it for idempotency (Kafka is at-least-once)
 * @param type          CREATED | UPDATED | DELETED
 * @param oldAmountUsd  null for CREATED
 * @param newAmountUsd  null for DELETED
 */
public record SalaryChangedEvent(
        UUID eventId,
        Type type,
        long employeeId,
        long departmentId,
        String countryCode,
        BigDecimal oldAmountUsd,
        BigDecimal newAmountUsd,
        Instant occurredAt) {

    public enum Type { CREATED, UPDATED, DELETED }

    /** Change in department payroll caused by this event. */
    public BigDecimal payrollDeltaUsd() {
        BigDecimal before = oldAmountUsd == null ? BigDecimal.ZERO : oldAmountUsd;
        BigDecimal after = newAmountUsd == null ? BigDecimal.ZERO : newAmountUsd;
        return after.subtract(before);
    }
}
