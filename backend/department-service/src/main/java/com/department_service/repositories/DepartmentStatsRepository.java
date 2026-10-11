package com.department_service.repositories;

import com.department_service.entity.DepartmentStats;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;

public interface DepartmentStatsRepository extends JpaRepository<DepartmentStats, Long> {

    /**
     * Atomic in-database increment. A read-modify-write in Java would lose updates when two consumer threads
     * touch the same department concurrently (events for different employees sit on different partitions).
     *
     * @return rows updated (0 => unknown department)
     */
    @Modifying
    @Query("update DepartmentStats s set s.payrollTotalUsd = s.payrollTotalUsd + :delta where s.departmentId = :id")
    int addToPayroll(@Param("id") Long departmentId, @Param("delta") BigDecimal delta);
}
