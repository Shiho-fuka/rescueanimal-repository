package com.example.rescueanimal.service;

import com.example.rescueanimal.dto.AnimalRequest;
import com.example.rescueanimal.dto.AnimalResponse;
import com.example.rescueanimal.entity.AnimalEntity;
import com.example.rescueanimal.entity.OwnerEntity;
import com.example.rescueanimal.repository.AnimalRepository;
import com.example.rescueanimal.repository.OwnerRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class AnimalService {

    private final AnimalRepository animalRepository;
    private final OwnerRepository ownerRepository;

    public AnimalService(AnimalRepository animalRepository, OwnerRepository ownerRepository) { // ★引数追加
        this.animalRepository = animalRepository;
        this.ownerRepository = ownerRepository;
    }

    // 一覧表示用（全件取得）
    public List<AnimalResponse> findAllAnimals() {
        return animalRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    // 詳細表示・編集画面初期表示用（１件取得）
    public AnimalResponse findAnimalById(Integer id) {
        AnimalEntity animal = animalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("指定されたIDの動物が見つかりません"));
        return toResponse(animal);
    }

    // 新規登録用（ログイン中の利用者のowner_idを自動セット）
    @Transactional
    public AnimalResponse createAnimal(AnimalRequest request) {
        // 現在ログインしているユーザー名を取得
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();

        // 利用者テーブルから該当ユーザーのowner_idを取得
        OwnerEntity owner = ownerRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("ログイン利用者が見つかりません: " + username));

        AnimalEntity animal = new AnimalEntity(
                request.animal_type(),
                request.region(),
                request.malefemale(),
                request.age(),
                request.medical(),
                request.image_url(),
                owner.getOwner_id()
        );

        AnimalEntity savedAnimal = animalRepository.save(animal);
        return toResponse(savedAnimal);
    }

    // 更新用（owner_idは変更不可のためそのまま維持）
    @Transactional
    public AnimalResponse updateAnimal(Integer id, AnimalRequest request) {
        AnimalEntity existingAnimal = animalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("指定されたIDの動物が見つかりません: " + id));

        existingAnimal.update(
                request.animal_type(),
                request.region(),
                request.malefemale(),
                request.age(),
                request.medical(),
                request.image_url()
        );

        AnimalEntity updatedAnimal = animalRepository.save(existingAnimal);
        return toResponse(updatedAnimal);
    }

    // 削除用
    @Transactional
    public void deleteAnimal(Integer id) {
        animalRepository.deleteById(id);
    }

    private AnimalResponse toResponse(AnimalEntity animal) {
        return new AnimalResponse(
                animal.getAnimal_id(),
                animal.getAnimal_type(),
                animal.getRegion(),
                animal.getMalefemale(),
                animal.getAge(),
                animal.getMedical(),
                animal.getImage_url(),
                animal.getOwner_id()
        );
    }
}
