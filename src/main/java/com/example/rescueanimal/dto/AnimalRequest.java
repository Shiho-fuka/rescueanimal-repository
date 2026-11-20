package com.example.rescueanimal.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record AnimalRequest(
    @NotBlank(message = "動物の種類の選択は必須です")
    @Size(max = 10, message = "動物の種類は10文字以内で入力してください")
    String animal_type,

    @NotBlank(message = "地域の入力は必須です")
    @Size(max = 20, message = "地域は20文字以内で入力してください")
    String region,

    @Size(max = 10, message = "性別は10文字以内で入力してください")
    String malefemale,

    @Size(max = 50, message = "年齢は50文字以内で入力してください")
    String age,

    @Size(max = 255, message = "特徴・健康状態は255文字以内で入力してください")
    String medical,

    String image_url
) {
}
