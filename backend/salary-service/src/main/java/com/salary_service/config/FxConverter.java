package com.salary_service.config;

import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.HashMap;
import java.util.Map;
import java.util.TreeSet;

@Component
public class FxConverter {


    private final Map<String, BigDecimal> rates = new HashMap<>(DEFAULTS);

    private static final Map<String, BigDecimal> DEFAULTS = Map.of(
            "USD", new BigDecimal("1.0"),   "EUR", new BigDecimal("1.08"),
            "GBP", new BigDecimal("1.27"),  "INR", new BigDecimal("0.012"),
            "CAD", new BigDecimal("0.73"),  "AUD", new BigDecimal("0.66"),
            "SGD", new BigDecimal("0.74"),  "JPY", new BigDecimal("0.0067"),
            "BRL", new BigDecimal("0.18"));

    public FxConverter(FxProperties props) {
        if (props.rates() != null) {
            props.rates().forEach((code, rate) -> rates.put(code.trim().toUpperCase(), rate));
        }
    }
//    /** @throws IllegalArgumentException for an unsupported currency (mapped to HTTP 400) */
//    public BigDecimal toUsd(BigDecimal amount, String currency) {
//        BigDecimal rate = props.rates().get(currency.toUpperCase());
//        if (rate == null) {
//            throw new IllegalArgumentException("Unsupported currency: " + currency);
//        }
//        return amount.multiply(rate).setScale(2, RoundingMode.HALF_UP);
//    }

    /** @throws IllegalArgumentException for an unsupported currency (mapped to HTTP 400) */
    public BigDecimal toUsd(BigDecimal amount, String currency) {
        BigDecimal rate = rates.get(currency.trim().toUpperCase());
        if (rate == null) {
            throw new IllegalArgumentException(
                    "Unsupported currency: " + currency + ". Supported: " + new TreeSet<>(rates.keySet()));
        }
        return amount.multiply(rate).setScale(2, RoundingMode.HALF_UP);
    }
}
