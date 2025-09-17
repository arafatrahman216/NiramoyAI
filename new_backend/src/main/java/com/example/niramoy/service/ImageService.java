package com.example.niramoy.service;

import dev.langchain4j.data.image.Image;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.net.URI;
import java.net.URLConnection;
import java.util.Base64;
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







































    //---------------------------------------------------------------------------------------------------
    // functions related to gemini image analyzer


    public void validateImageFile(MultipartFile imageFile) {
        if (imageFile == null || imageFile.isEmpty()) {
            throw new IllegalArgumentException("Image file cannot be null or empty");
        }

        // Check file size (max 10MB)
        if (imageFile.getSize() > 10 * 1024 * 1024) {
            throw new IllegalArgumentException("Image file size cannot exceed 10MB");
        }

        // Check content type
        String contentType = imageFile.getContentType();
        if (contentType == null || !isValidImageType(contentType)) {
            throw new IllegalArgumentException("Invalid image format. Supported formats: JPEG, PNG, GIF, WebP");
        }
    }

    /**
     * Validate prompt
     */
    public void validatePrompt(String prompt) {
        if (prompt == null || prompt.trim().isEmpty()) {
            throw new IllegalArgumentException("Prompt cannot be null or empty");
        }
        if (prompt.length() > 2000) {
            throw new IllegalArgumentException("Prompt cannot exceed 2000 characters");
        }
    }

    /**
     * Check if content type is valid image format
     */
    private boolean isValidImageType(String contentType) {
        return contentType.equals("image/jpeg") || contentType.equals("image/jpg") || contentType.equals("image/png") ||
                contentType.equals("image/gif") || contentType.equals("image/webp");
    }



    private byte[] downloadImageFromUrl(String imageUrl) throws IOException {
        try {
            URI uri = URI.create(imageUrl);
            URLConnection connection = uri.toURL().openConnection();
            // Set user agent to avoid being blocked
            connection.setRequestProperty("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36");
            try (InputStream inputStream = connection.getInputStream()) {
                return inputStream.readAllBytes();
            }
        } catch (Exception e) {
            throw new IOException("Failed to download image from URL: " + imageUrl, e);
        }
    }

    /**
     * Determine content type from URL extension
     */
    private String getContentTypeFromUrl(String imageUrl) {
        String lowerUrl = imageUrl.toLowerCase();
        if (lowerUrl.endsWith(".png")) {
            return "image/png";
        } else if (lowerUrl.endsWith(".jpg") || lowerUrl.endsWith(".jpeg")) {
            return "image/jpeg";
        } else if (lowerUrl.endsWith(".gif")) {
            return "image/gif";
        } else if (lowerUrl.endsWith(".webp")) {
            return "image/webp";
        } else {
            // Default to JPEG if unknown
            return "image/jpeg";
        }
    }

    /**
     * Validate URL format and accessibility
     */
    private void validateUrl(String imageUrl) {
        if (imageUrl == null || imageUrl.trim().isEmpty()) {
            throw new IllegalArgumentException("Image URL cannot be null or empty");
        }
        if (!imageUrl.startsWith("http://") && !imageUrl.startsWith("https://")) {
            throw new IllegalArgumentException("Image URL must start with http:// or https://");
        }
        // Check if it's likely an image URL
        String lowerUrl = imageUrl.toLowerCase();
        if (!lowerUrl.contains(".png") && !lowerUrl.contains(".jpg") &&
                !lowerUrl.contains(".jpeg") && !lowerUrl.contains(".gif") &&
                !lowerUrl.contains(".webp")) {
            System.out.println("Warning: URL does not appear to be an image file: " + imageUrl);
        }
    }

    public Image buildImageFromMultipartFile(MultipartFile imageFile, String prompt) {
        validateImageFile(imageFile);
        validatePrompt(prompt);
        try{
            // Convert image to base64
            byte[] imageBytes = imageFile.getBytes();
            String base64Image = Base64.getEncoder().encodeToString(imageBytes);
            // Create image object for LangChain4j
            Image image = Image.builder().base64Data(base64Image).mimeType(imageFile.getContentType()).build();
            return image;
        }
        catch (Exception e) {
            System.out.println("Error: " + e.getMessage());
            return null;
        }
    }

    public Image buildImageFromUrl(String imageUrl, String prompt) {
        validateUrl(imageUrl);
        validatePrompt(prompt);
        try {
            // Download image from URL
            byte[] imageBytes = downloadImageFromUrl(imageUrl);
            String base64Image = Base64.getEncoder().encodeToString(imageBytes);
            // Determine content type from URL
            String contentType = getContentTypeFromUrl(imageUrl);
            // Create image object for LangChain4j
            Image image = Image.builder()
                    .base64Data(base64Image)
                    .mimeType(contentType)
                    .build();
            return image;
        }
        catch (Exception e) {
            System.out.println("Error: " + e.getMessage());
            return null;
        }
    }
}
