package com.matsuri.backend.repository;

import com.matsuri.backend.entity.Matsuri;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MatsuriRepository extends JpaRepository<Matsuri, Long> {
}