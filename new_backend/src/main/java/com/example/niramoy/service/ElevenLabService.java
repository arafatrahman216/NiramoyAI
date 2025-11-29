package com.example.niramoy.service;
import com.example.niramoy.utils.MultipartInputStreamFileResource;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class ElevenLabService {

    private final ObjectMapper objectMapper;
    @Value("${elevenlabs.api.key}")
private String apiKey;

    @Value("${elevenlabs.apitts.key}")
    private String apiTtsKey;
private static final String TTS_URL = "https://api.elevenlabs.io/v1/text-to-speech/";


private static final String ELEVENLABS_URL = "https://api.elevenlabs.io/v1/speech-to-text";

    public String transcribeAudio(MultipartFile audio) throws Exception {
        RestTemplate restTemplate = new RestTemplate();

        // Headers
        HttpHeaders headers = new HttpHeaders();
        headers.set("xi-api-key", apiKey);
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        // Body
        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("file", new MultipartInputStreamFileResource(audio.getInputStream(), audio.getOriginalFilename()));
        body.add("model_id", "scribe_v1"); // ✅ required field
        body.add("language_code", "en");

        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

        ResponseEntity<Map> response = restTemplate.exchange(
                ELEVENLABS_URL,
                HttpMethod.POST,
                requestEntity,
                Map.class
        );

        if (response.getStatusCode().is2xxSuccessful()) {
            Map<String, Object> result = response.getBody();
            System.out.println(result);
            return result != null ? result.get("text").toString() : null;
        } else {
            throw new RuntimeException("Failed transcription: " + response.getStatusCode());
        }
    }

    public byte[] generateTextToSpeech(String text) {
        try {
            RestTemplate restTemplate = new RestTemplate();
            String voiceId = "21m00Tcm4TlvDq8ikWAM";
            int MAX_LENGTH = 350; // safe chunk size

            // Split into chunks if longer than MAX_LENGTH
            List<String> parts = splitText(text, MAX_LENGTH);

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("text", text);
            requestBody.put("voice_settings", Map.of("stability", 0.5, "similarity_boost", 0.8));
            requestBody.put("voice_id", voiceId);
            requestBody.put("output_format", "mp3");

            String body = objectMapper.writeValueAsString(requestBody);



            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("xi-api-key", apiTtsKey);

            HttpEntity<String> entity = new HttpEntity<>(body, headers);

            ResponseEntity<byte[]> response = restTemplate.exchange(
                    TTS_URL + voiceId,
                    HttpMethod.POST,
                    entity,
                    byte[].class
            );

            if (response.getStatusCode() == HttpStatus.OK) {
                try {
                    outputStream.write(response.getBody()); // append audio
                    log.info(response.getBody().length + " bytes written to output stream");
                } catch (IOException e) {
                    throw new RuntimeException("Error combining audio", e);
                }
            } else {
                log.error("Failed to generate speech: {}", response.getStatusCode());
                throw new RuntimeException("Failed to generate speech: " + response.getStatusCode());
            }
            outputStream.flush();

            return outputStream.toByteArray(); // merged audio
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
}

    private List<String> splitText(String text, int maxLength) {
        List<String> parts = new ArrayList<>();
        String[] sentences = text.split("(?<=[.!?])\\s+"); // split on sentence boundaries
        StringBuilder current = new StringBuilder();

        for (String sentence : sentences) {
            if (current.length() + sentence.length() < maxLength) {
                current.append(sentence).append(" ");
            } else {
                parts.add(current.toString().trim());
                current = new StringBuilder(sentence).append(" ");
            }
        }
        if (!current.isEmpty()) {
            parts.add(current.toString().trim());
        }
        return parts;
    }


}
