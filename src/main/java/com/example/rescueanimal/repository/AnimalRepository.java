package com.example.rescueanimal.repository;

import com.example.rescueanimal.entity.AnimalEntity;
import org.springframework.data.jpa.repository.JpaRepository;

//import com.example.rescueanimal.entity.AnimalEntity;
public interface AnimalRepository extends JpaRepository<AnimalEntity,Integer> {
}
