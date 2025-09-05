package com.example.NiramoyAI.dto;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ImageUploadResponseDTO {
    private String message;
    private String imageUrl;
    private String filename;
    private boolean success;

    public static ImageUploadResponseDTO success(String imageUrl, String filename) {
        return new ImageUploadResponseDTO(
                "Image uploaded successfully",
                imageUrl,
                filename,
                true
        );
    }

    public static ImageUploadResponseDTO error(String message) {
        return new ImageUploadResponseDTO(
                message,
                null,
                null,
                false
        );
    }
}
