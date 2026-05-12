package com.matsuri.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "MATSURIS")
@Getter
@Setter
public class Matsuri {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "DETAIL_ID", unique = true, nullable = false)
    private Long detailId;

    @Column(name = "SOURCE_URL")
    private String sourceUrl;

    @Column(name = "NAME_KO")
    private String nameKo;

    @Column(name = "CITY_KO")
    private String cityKo;

    @Column(name = "IS_ENDED")
    private Integer isEnded;

    @Column(name = "IMAGE_URLS")
    private String imageUrls;

    @Column(name = "SHORT_DESC_KO")
    private String shortDescKo;

    @Lob
    @Column(name = "LONG_DESC_KO")
    private String longDescKo;

    @Column(name = "EVENT_DATES_KO")
    private String eventDatesKo;

    @Column(name = "EVENT_TIME_KO")
    private String eventTimeKo;

    @Column(name = "VENUE_KO")
    private String venueKo;

    @Column(name = "ADDRESS_KO")
    private String addressKo;

    @Column(name = "CONTACT")
    private String contact;

    @Column(name = "ACCESS_TRAIN_KO")
    private String accessTrainKo;

    @Column(name = "ACCESS_CAR_KO")
    private String accessCarKo;

    @Column(name = "RELATED_URL")
    private String relatedUrl;

    @Column(name = "START_DATE")
    private LocalDate startDate;

    @Column(name = "END_DATE")
    private LocalDate endDate;

    @Column(name = "CRAWLED_AT")
    private LocalDateTime crawledAt;
}