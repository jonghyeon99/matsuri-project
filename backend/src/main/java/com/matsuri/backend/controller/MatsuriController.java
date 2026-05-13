package com.matsuri.backend.controller;

import com.matsuri.backend.entity.Matsuri;
import com.matsuri.backend.repository.MatsuriRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/matsuris")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class MatsuriController {

    private final MatsuriRepository matsuriRepository;

    // 전체 목록
    @GetMapping
    public List<Matsuri> getAll() {
        return matsuriRepository.findAll();
    }

    // 상세 조회
    @GetMapping("/{id}")
    public Matsuri getById(@PathVariable Long id) {
        return matsuriRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Matsuri not found"));
    }

    // 진행 중인 마츠리
    @GetMapping("/ongoing")
    public List<Matsuri> getOngoing() {
        return matsuriRepository.findOngoing(LocalDate.now());
    }

    // 예정된 마츠리
    @GetMapping("/upcoming")
    public List<Matsuri> getUpcoming() {
        return matsuriRepository.findUpcoming(LocalDate.now());
    }

    // 도시 목록
    @GetMapping("/cities")
    public List<String> getCities() {
        return matsuriRepository.findAllCities();
    }

    // 도시별 마츠리
    @GetMapping("/city/{city}")
    public List<Matsuri> getByCity(@PathVariable String city) {
        return matsuriRepository.findByCity(city);
    }

    // 날짜별 마츠리
    @GetMapping("/date/{date}")
    public List<Matsuri> getByDate(@PathVariable String date) {
        LocalDate localDate = LocalDate.parse(date);
        return matsuriRepository.findByDate(localDate);
    }
}