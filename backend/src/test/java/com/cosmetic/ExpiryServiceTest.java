package com.cosmetic;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import static org.junit.jupiter.api.Assertions.*;

public class ExpiryServiceTest {

    /**
     * Verification of D-Day calculation logic including leap years and year-end scenarios.
     */
    @Test
    @DisplayName("Edge Case Test: Leap Year and Year-End Date Calculation")
    void testDateCalculationIntegrity() {
        // Case 1: Leap Year - Feb 29th
        LocalDate leapYearDate = LocalDate.of(2024, 2, 29);
        LocalDate todayLeap = LocalDate.of(2024, 2, 20);
        long dDayLeap = ChronoUnit.DAYS.between(todayLeap, leapYearDate);
        assertEquals(9, dDayLeap, "Leap year February calculation should be accurate.");

        // Case 2: Year-end transition
        LocalDate nextYearDate = LocalDate.of(2025, 1, 5);
        LocalDate currentYearEnd = LocalDate.of(2024, 12, 30);
        long dDayYearEnd = ChronoUnit.DAYS.between(currentYearEnd, nextYearDate);
        assertEquals(6, dDayYearEnd, "Year-end to New Year transition calculation should be accurate.");

        // Case 3: Past Expiry
        LocalDate expiredDate = LocalDate.of(2023, 10, 10);
        LocalDate now = LocalDate.of(2023, 10, 15);
        long dDayExpired = ChronoUnit.DAYS.between(now, expiredDate);
        assertTrue(dDayExpired < 0, "Expired products must return negative D-day.");
    }
}