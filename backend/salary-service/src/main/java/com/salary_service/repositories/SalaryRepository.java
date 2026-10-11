package com.salary_service.repositories;

import com.salary_service.entity.Salary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import com.salary_service.Dtos.GroupStat;

import java.util.List;
import java.util.Optional;

public interface SalaryRepository extends JpaRepository<Salary, Long> {

    List<Salary> findByEmployeeIdOrderByEffectiveFromDesc(Long employeeId);

    Optional<Salary> findByEmployeeIdAndEffectiveToIsNull(Long employeeId);

    // Aggregation runs in MySQL (index ix_salary_report) so the service never loads 10k rows into memory.
    @Query("""
            select new com.salary_service.Dtos.GroupStat('ALL', count(s), avg(s.amountUsd), min(s.amountUsd), max(s.amountUsd), sum(s.amountUsd))
            from Salary s where s.effectiveTo is null
            """)
    GroupStat overall();

//    @Query("""
//            select new com.salary_service.Dtos.GroupStat(cast(s.departmentId as string), count(s), avg(s.amountUsd), min(s.amountUsd), max(s.amountUsd), sum(s.amountUsd))
//            from Salary s where s.effectiveTo is null group by s.departmentId order by s.departmentId
//            """)
//    List<GroupStat> byDepartment();

    @Query("select new com.salary_service.Dtos.GroupStat(" +
            "cast(s.departmentId as string), count(s), avg(s.amountUsd), " +
            "min(s.amountUsd), max(s.amountUsd), sum(s.amountUsd)) " +
            "from Salary s where s.effectiveTo is null group by s.departmentId order by s.departmentId")
    List<GroupStat> byDepartment();

    @Query("""
            select new com.salary_service.Dtos.GroupStat (s.countryCode, count(s), avg(s.amountUsd), min(s.amountUsd), max(s.amountUsd), sum(s.amountUsd))
            from Salary s where s.effectiveTo is null group by s.countryCode order by s.countryCode
            """)
    List<GroupStat> byCountry();
}
