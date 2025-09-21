package com.example.niramoy.service;

import java.io.ByteArrayOutputStream;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;

import org.springframework.stereotype.Service;

import java.util.Base64;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.MultiFormatWriter;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;

import io.jsonwebtoken.io.IOException;
import lombok.RequiredArgsConstructor;

@Service
public class QRService {

    private static final String enKey = "AES";
    private static final String URL = "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=";
    private static SecretKey secretKey = null;

    public QRService() {
        try{
            KeyGenerator keyGen = KeyGenerator.getInstance(enKey);
            keyGen.init(256); // for example, 256 bits
            secretKey = keyGen.generateKey();
        }
        catch (Exception e)
        {
            throw new RuntimeException("Failed to generate secret key: " + e.getMessage(), e);
        }
    }

    public String encrypt(String data) {
        try{
            Cipher cipher = Cipher.getInstance(enKey);
            cipher.init(Cipher.ENCRYPT_MODE, secretKey);
            byte[] encryptedBytes = cipher.doFinal(data.getBytes(StandardCharsets.UTF_8));
            return Base64.getUrlEncoder().encodeToString(encryptedBytes); // URL-safe
        }
        catch (Exception e)
        {
            throw new RuntimeException("Failed to encrypt data: " + e.getMessage(), e);
        }
    }

    public String decrypt(String encryptedData) {
        try
        {   
            Cipher cipher = Cipher.getInstance(enKey);
            cipher.init(Cipher.DECRYPT_MODE, secretKey);
            byte[] decodedBytes = Base64.getUrlDecoder().decode(encryptedData);
            byte[] decryptedBytes = cipher.doFinal(decodedBytes);
            return new String(decryptedBytes, StandardCharsets.UTF_8);
        }
        catch (Exception e)
        {
            throw new RuntimeException("Failed to decrypt data: " + e.getMessage(), e);
        }
    }


    public String generateQrCode(String text) {

        String qrLink = URL + text;
        return qrLink;
    }

}
