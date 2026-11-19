package com.example.rescueanimal.controller;

import com.example.rescueanimal.dto.AnimalRequest;
import com.example.rescueanimal.dto.AnimalResponse;
import com.example.rescueanimal.service.AnimalService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"}, allowCredentials = "true")
public class AnimalController {

    private final AnimalService animalService;

    public AnimalController(AnimalService animalService) {
        this.animalService = animalService;
    }

    // 新規登録: POST
    @PostMapping("/animals")
    public AnimalResponse createAnimal(@Valid @RequestBody AnimalRequest request) {
        return animalService.createAnimal(request);
    }

    // 一覧取得: GET
    @GetMapping("/animals")
    public List<AnimalResponse> findAllAnimals() {
        return animalService.findAllAnimals();
    }

    // 1件取得（詳細・編集画面用）: GET
    @GetMapping("/animals/{id}")
    public AnimalResponse findAnimalById(@PathVariable Integer id) {
        return animalService.findAnimalById(id);
    }

    // 更新: PUT
    @PutMapping("/animals/{id}")
    public AnimalResponse updateAnimal(@PathVariable Integer id, @Valid @RequestBody AnimalRequest request) {
        return animalService.updateAnimal(id, request);
    }

    // 削除: DELETE
    @DeleteMapping("/animals/{id}")
    public void deleteAnimal(@PathVariable Integer id) {
        animalService.deleteAnimal(id);
    }
}
