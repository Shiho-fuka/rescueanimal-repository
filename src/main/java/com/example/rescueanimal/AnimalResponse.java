package com.example.rescueanimal;

public record AnimalResponse(
        Integer animal_id,
        String animal_type,
        String region,
        String malefemale,
        String age,
        String medical,
        String image_url,
        Integer owner_id
) {
}
