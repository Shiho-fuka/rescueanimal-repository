package com.example.rescueanimal.dto;

import java.time.LocalDate;

public record AnimalResponse(
        Integer animal_id,
        String animal_type,
        String region,
        String malefemale,
        String age,
        String medical,
        String image_url,
        LocalDate posted_date,
        Integer owner_id
) {
}
