package com.example.niramoy.service;
import com.example.niramoy.utils.MultipartInputStreamFileResource;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@Service
public class ElevenLabService {

@Value("${elevenlabs.api.key}")
private String apiKey;

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

}
