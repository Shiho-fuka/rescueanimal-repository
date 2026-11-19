package com.example.rescueanimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;
import lombok.Getter;

@Getter
@Entity
@Table(name = "rescueanimal")
public class AnimalEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer animal_id;

    @Column(nullable = false)
    private String animal_type;

    @Column(nullable = false)
    private String region;

    private String malefemale;

    private String age;

    private String medical;

    @Lob
    private String image_url;

    @Column(nullable = false)
    private Integer owner_id;

    // 外部から空で作られるのを防ぐためのprotected
    protected AnimalEntity() {
    }

    // 新規登録用のコンストラクタ
    public AnimalEntity(String animal_type, String region, String malefemale, String age, String medical, String image_url, Integer owner_id) {
        this.animal_type = animal_type;
        this.region = region;
        this.malefemale = malefemale;
        this.age = age;
        this.medical = medical;
        this.image_url = image_url;
        this.owner_id = owner_id;
    }

    // 更新用メソッド
    public void update(String animal_type, String region, String malefemale, String age, String medical, String image_url) {
        this.animal_type = animal_type;
        this.region = region;
        this.malefemale = malefemale;
        this.age = age;
        this.medical = medical;
        this.image_url = image_url;
    }

}
