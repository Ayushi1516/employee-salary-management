package com.employee_service.repositories;

import java.util.List;

import com.employee_service.dto.HeadcountRow;
import com.employee_service.entity.Employee;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {

    @Query("""
            select e from Employee e
            where (:q is null
                   or lower(e.firstName) like lower(concat('%', :q, '%'))
                   or lower(e.lastName)  like lower(concat('%', :q, '%'))
                   or lower(e.email)     like lower(concat('%', :q, '%')))
              and (:departmentId is null or e.departmentId = :departmentId)
              and (:countryCode is null or e.countryCode = :countryCode)
            """)
    Page<Employee> search(@Param("q") String q,
                          @Param("departmentId") Long departmentId,
                          @Param("countryCode") String countryCode,
                          Pageable pageable);
    @Query("""
            select new com.employee_service.dto.HeadcountRow(e.departmentId, count(e))
            from Employee e where e.status <> com.employee_service.entity.Employee.Status.TERMINATED
            group by e.departmentId
            """)
    List<HeadcountRow> headcountByDepartment();

}
