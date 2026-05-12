package com.matsuri.backend.repository;

import com.matsuri.backend.entity.Matsuri;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface MatsuriRepository extends JpaRepository<Matsuri, Long> {

    // 오늘 기준 진행 중인 마츠리 (start_date <= 오늘 <= end_date)
    @Query("SELECT m FROM Matsuri m WHERE m.startDate <= :today AND m.endDate >= :today AND m.isEnded = 0 ORDER BY m.startDate ASC")
    List<Matsuri> findOngoing(@Param("today") LocalDate today);

    // 오늘 이후 예정된 마츠리
    @Query("SELECT m FROM Matsuri m WHERE m.startDate > :today AND m.isEnded = 0 ORDER BY m.startDate ASC")
    List<Matsuri> findUpcoming(@Param("today") LocalDate today);
}