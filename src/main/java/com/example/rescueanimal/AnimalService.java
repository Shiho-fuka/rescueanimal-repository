package com.example.rescueanimal;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class AnimalService {

    private final AnimalRepository animalRepository;

    public AnimalService(AnimalRepository animalRepository) {
        this.animalRepository = animalRepository;
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

    // 新規登録用（owner_idは自動セット）
    @Transactional
    public AnimalResponse createAnimal(AnimalRequest request) {
        // ※ログイン機能ができるまでは、利用者テーブルに存在する仮のID（例: 101）をセット
        Integer autoOwnerId = 101;

        AnimalEntity animal = new AnimalEntity(
                request.animal_type(),
                request.region(),
                request.malefemale(),
                request.age(),
                request.madical(),
                request.image_url(),
                autoOwnerId
        );

        AnimalEntity savedAnimal = animalRepository.save(animal);
        return toResponse(savedAnimal);
    }

    // 更新用（owner_idは変更不可のためそのまま維持）
    @Transactional
    public AnimalResponse updateAnimal(Integer id, AnimalRequest request) {
        AnimalEntity existingAnimal = animalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("指定されたIDの動物が見つかりません: " + id));

        // AnimalEntityに追記したupdateメソッドで変更可能な項目だけ更新
        existingAnimal.update(
                request.animal_type(),
                request.region(),
                request.malefemale(),
                request.age(),
                request.madical(),
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

    // Entity を Response DTO に変換する共通メソッド
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
