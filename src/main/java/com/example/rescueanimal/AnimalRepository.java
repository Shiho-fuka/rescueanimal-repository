package com.example.rescueanimal;

import org.springframework.data.jpa.repository.JpaRepository;

//import com.example.rescueanimal.AnimalEntity;
public interface AnimalRepository extends JpaRepository<AnimalEntity,Integer> {
}
