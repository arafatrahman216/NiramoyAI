package com.example.niramoy.service;

import java.nio.charset.StandardCharsets;
import java.util.Base64;

import jakarta.annotation.PostConstruct;
import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class QRService {

    private static final String URL = "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=";

    // AES default = AES/ECB/PKCS5Padding (works but not the most secure)
    private static final String CIPHER = "AES";

    @Value("${app.aes.key}")
    private String keyBase64;

    private SecretKey secretKey;


    // -------------------------------------------------------------------------
    // Initialize Secret Key after Spring injects `@Value`
    // -------------------------------------------------------------------------
    @PostConstruct
    public void initKey() {
        try {
            byte[] decoded = Base64.getDecoder().decode(keyBase64);
            secretKey = new SecretKeySpec(decoded, "AES");

            System.out.println("AES key loaded. Key length = " + decoded.length);
        } catch (Exception e) {
            throw new RuntimeException("Failed to load AES key", e);
        }
    }


    // -------------------------------------------------------------------------
    // Encrypt text
    // -------------------------------------------------------------------------
    public String encrypt(String data) {
        try {
            Cipher cipher = Cipher.getInstance(CIPHER);
            cipher.init(Cipher.ENCRYPT_MODE, secretKey);

            byte[] encrypted = cipher.doFinal(data.getBytes(StandardCharsets.UTF_8));
            return Base64.getUrlEncoder().encodeToString(encrypted);

        } catch (Exception e) {
            throw new RuntimeException("Encryption failed", e);
        }
    }


    // -------------------------------------------------------------------------
    // Decrypt text
    // -------------------------------------------------------------------------
    public String decrypt(String encrypted) {
        try {
            Cipher cipher = Cipher.getInstance(CIPHER);
            cipher.init(Cipher.DECRYPT_MODE, secretKey);

            byte[] decoded = Base64.getUrlDecoder().decode(encrypted);
            byte[] decrypted = cipher.doFinal(decoded);

            return new String(decrypted, StandardCharsets.UTF_8);

        } catch (Exception e) {
            throw new RuntimeException("Decryption failed", e);
        }
    }


    // -------------------------------------------------------------------------
    // Generate QR Code URL
    // -------------------------------------------------------------------------
    public String generateQrCode(String encryptedText) {
        return URL + encryptedText;
    }
}
