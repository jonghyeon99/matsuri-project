package com.matsuri.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "matsuris")
@Getter
@Setter
public class Matsuri {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "detail_id", unique = true, nullable = false)
    private Long detailId;

    @Column(name = "source_url")
    private String sourceUrl;

    @Column(name = "name_ko")
    private String nameKo;

    @Column(name = "city_ko")
    private String cityKo;

    @Column(name = "is_ended")
    private Integer isEnded;

    @Column(name = "image_urls")
    private String imageUrls;

    @Column(name = "short_desc_ko")
    private String shortDescKo;

    @Column(name = "long_desc_ko", columnDefinition = "TEXT")
    private String longDescKo;

    @Column(name = "event_dates_ko")
    private String eventDatesKo;

    @Column(name = "event_time_ko")
    private String eventTimeKo;

    @Column(name = "venue_ko")
    private String venueKo;

    @Column(name = "address_ko")
    private String addressKo;

    @Column(name = "contact")
    private String contact;

    @Column(name = "access_train_ko")
    private String accessTrainKo;

    @Column(name = "access_car_ko")
    private String accessCarKo;

    @Column(name = "related_url")
    private String relatedUrl;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(name = "crawled_at")
    private LocalDateTime crawledAt;
}