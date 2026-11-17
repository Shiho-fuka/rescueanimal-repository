package com.example.rescueanimal;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public record AnimalRequest(
    @NotBlank(message = "動物の種類の入力は必須です")
    String animal_type,

    @NotBlank(message = "地域の入力は必須です")
    String region,

    String malefemale,

    @Min(value = 0, message = "年齢は0以上で入力してください")
    Integer age,

    String medical
) {
}
