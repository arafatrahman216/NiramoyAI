package com.example.niramoy.service;

import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ImageService {
    //FIXME: shift to .env file
    private final RestTemplate restTemplate = new RestTemplate();
    private static final String STORAGE_URL = "https://fazcrlmvdczokbxfvyyn.supabase.co/storage/v1/object/public/";
    private static final String BUCKET_NAME = "images";
    private static final String anonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZhemNybG12ZGN6b2tieGZ2eXluIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Njk5NTg1NiwiZXhwIjoyMDcyNTcxODU2fQ.9-F1Jlym4IA-4FH9egAgk_r0WQs8T9BATs22IehvpeU";


    public String uploadImage(MultipartFile image) {
        try {
            // Validate file
            if (image.isEmpty()) {
                throw new RuntimeException("File is empty");
            }

            // Validate file type
            String contentType = image.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                throw new RuntimeException("File must be an image");
            }

            // Generate unique filename
            String originalFilename = image.getOriginalFilename();
            String extension = originalFilename != null && originalFilename.contains(".")
                ? originalFilename.substring(originalFilename.lastIndexOf("."))
                : ".jpg";
            String filename = UUID.randomUUID() + extension;

            // Upload to Supabase Storage using S3 API
            return uploadToSupabase(image, filename, contentType);

        } catch (Exception e) {
            throw new RuntimeException("Failed to upload image: " + e.getMessage(), e);
        }
    }

    private String uploadToSupabase(MultipartFile file, String filename, String contentType) throws IOException {
        try {
            //FIXME: Fix this hardcoded URL
            String url = "https://fazcrlmvdczokbxfvyyn.storage.supabase.co/storage/v1/object/" + BUCKET_NAME + "/" + filename;

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);
            headers.set("Authorization", "Bearer " + anonKey);

            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("file", file.getResource());

            HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

            ResponseEntity<String> response = restTemplate.exchange(
                    url,
                    HttpMethod.POST,
                    requestEntity,
                    String.class
            );

            if (response.getStatusCode() == HttpStatus.OK) {
                return url;
            } else {
                throw new RuntimeException("Upload failed with status: " + response.getStatusCode());
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to upload to Supabase Storage: " + e.getMessage(), e);
        }
    }
}
