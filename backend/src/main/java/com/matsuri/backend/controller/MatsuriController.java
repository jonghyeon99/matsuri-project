package com.matsuri.backend.controller;

import com.matsuri.backend.entity.Matsuri;
import com.matsuri.backend.repository.MatsuriRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
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
}