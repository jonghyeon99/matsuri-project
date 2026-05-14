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

    // 오늘 기준 진행 중인 마츠리
    @Query("SELECT m FROM Matsuri m WHERE m.startDate <= :today AND m.endDate >= :today AND m.isEnded = 0 ORDER BY m.startDate ASC")
    List<Matsuri> findOngoing(@Param("today") LocalDate today);

    // 오늘 이후 예정된 마츠리
    @Query("SELECT m FROM Matsuri m WHERE m.startDate > :today AND m.isEnded = 0 ORDER BY m.startDate ASC")
    List<Matsuri> findUpcoming(@Param("today") LocalDate today);

    // 도시별 마츠리 목록
    @Query("SELECT m FROM Matsuri m WHERE m.cityKo = :city AND m.isEnded = 0 ORDER BY m.startDate ASC")
    List<Matsuri> findByCity(@Param("city") String city);

    // 도시 목록 (중복 제거)
    @Query("SELECT DISTINCT m.cityKo FROM Matsuri m WHERE m.cityKo IS NOT NULL ORDER BY m.cityKo ASC")
    List<String> findAllCities();

    // 특정 날짜에 진행 중인 마츠리
    @Query("SELECT m FROM Matsuri m WHERE m.startDate <= :date AND m.endDate >= :date AND m.isEnded = 0 ORDER BY m.startDate ASC")
    List<Matsuri> findByDate(@Param("date") LocalDate date);

    // 검색 기능
    @Query("SELECT m FROM Matsuri m WHERE (m.nameKo LIKE %:keyword% OR m.shortDescKo LIKE %:keyword% OR m.cityKo LIKE %:keyword%) AND m.isEnded = 0 ORDER BY m.startDate ASC")
    List<Matsuri> findByKeyword(@Param("keyword") String keyword);
}