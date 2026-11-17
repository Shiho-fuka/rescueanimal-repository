package com.example.rescueanimal;

public record AnimalResponse(
        Integer animal_id,
        String animal_type,
        String region,
        String malefemale,
        Integer age,
        String medical,
        Integer owner_id
) {
}
