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
    private final RestTemplate restTemplate = new RestTemplate();
    private static final String STORAGE_URL = "https://gbnroyjolasnhydnpxwp.supabase.co/storage/v1/object/public/";
    private static final String BUCKET_NAME = "images";
    private static final String anonKey = " eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNheWJwbGV0cGN0ZWRreWxwdG1oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM4MTA2NTEsImV4cCI6MjA2OTM4NjY1MX0.AR65YS0jDcGIPXf2FAmi5aX0P5tLSK0gOzQ3rwJbHk0";


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
            String url = "https://caybpletpctedkylptmh.storage.supabase.co/storage/v1/object/" + BUCKET_NAME + "/" + filename;

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
                return STORAGE_URL + BUCKET_NAME + "/" + filename;
            } else {
                throw new RuntimeException("Upload failed with status: " + response.getStatusCode());
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to upload to Supabase Storage: " + e.getMessage(), e);
        }
    }
}
