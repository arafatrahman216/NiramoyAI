package com.example.niramoy.service;

import com.example.niramoy.dto.HealthProfileDTO;
import com.example.niramoy.dto.UserDTO;
import com.example.niramoy.entity.HealthLog;
import com.example.niramoy.entity.HealthProfile;
import com.example.niramoy.entity.Medicine;
import com.example.niramoy.entity.User;
import com.example.niramoy.enumerate.Role;
import com.example.niramoy.error.DuplicateUserException;
import com.example.niramoy.repository.MedicineRepository;
import com.example.niramoy.repository.UserRepository;
import com.example.niramoy.service.AIServices.AIService;
import com.example.niramoy.utils.JsonParser;
import com.example.niramoy.repository.HealthProfileRepository;

import org.json.JSONObject;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService implements UserDetailsService {
    private final UserRepository userRepository;
    private final HealthProfileRepository healthProfileRepository;
    private final HealthService healthService;
    private final MedicineRepository medicineRepository;
    private final UserKGService userKGService;
    private final AIService aiService;

    // get all users ; if there is an error then db roll back, if ok then after ending the method it will commit the transaction
    // until then the query result will be stored in persistence context
    @Transactional(readOnly = true)
    public List<UserDTO> getAllUsers(){
        List<User> users = userRepository.getAll();
        return users.stream()
                .map(user -> convertToUserDTO(user))
                .toList();
    }

    @Transactional
    public User createUser(Map<String, String> newUser) {
        String username = newUser.get("username");
        String email = newUser.get("email");
        String password = newUser.get("password");
        String name = newUser.get("name");
        String phoneNumber = newUser.get("phoneNumber");
        String gender = newUser.get("gender");
        String foundRole = newUser.get("role");
        // Default to PATIENT role if not specified
        Role role = (foundRole != null && !foundRole.isEmpty())
            ? Role.valueOf(foundRole.toUpperCase())
            : Role.PATIENT;

        String profilePictureUrl = newUser.get("profilePictureUrl");
        String status = "ACTIVE";
        LocalDate dateOfBirth = null;
        if (newUser.get("dateOfBirth") != null && !newUser.get("dateOfBirth").isEmpty()) {
            dateOfBirth = LocalDate.parse(newUser.get("dateOfBirth"));
        }
        User user = userRepository.findUserByUsernameOrEmail(username,email);
        if (user != null) {
            throw new DuplicateUserException("User already exists with username or email: " + username + " or " + email);
        }

        User newUser1 = User.builder().username(username).name(name).email(email).password(password)
                .phoneNumber(phoneNumber).gender(gender).createdAt(LocalDateTime.now())
                .profilePictureUrl(profilePictureUrl)
                .status(status).dateOfBirth(dateOfBirth).role(role)
                .build();
        System.out.println("hi");

        User savedUser = null;
        try{
            savedUser = userRepository.save(newUser1);
        } catch (Exception e) {
            System.out.println("Error saving user: " + e.getMessage());
        }

        try{
            if (savedUser != null) {
                userKGService.createPatientDuringSignup(savedUser.getId(), savedUser.getName());
            } else {
                throw new Exception("Saved user is null, cannot create patient in Knowledge Graph.");
            }
        } catch (Exception e) {
            System.out.println("Error creating patient in Knowledge Graph: " + e.getMessage());
        }
        return newUser1;
    }

    @Transactional(readOnly = true)
//    @Cacheable(value = "users", key = "'username:' + #username")
    public UserDTO findByUsername(String username) {
        System.out.println("hey");
        User user = userRepository.findByUsername(username);
        return convertToUserDTO(user);
    }

    @Transactional(readOnly = true)
//    @Cacheable(value = "users", key = "'email:' + #email")
    public UserDTO findByEmail(String email) {
        User user = userRepository.findByEmail(email);
        return convertToUserDTO(user);
    }

        // load user by username for authentication
    @Override
    @Transactional(readOnly = true)
    public User loadUserByUsername(String username) throws UsernameNotFoundException {
        System.out.println("hello");
        User user = userRepository.findByUsernameOrEmail(username);
        if (user == null) {
            throw new UsernameNotFoundException("User not found: " + username);
        }
        return user;
    }

    @Transactional(readOnly = true)
    public User findByUserId(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with id: " + userId));
    }

    public UserDTO convertToUserDTO(User user) {
        UserDTO userDTO = UserDTO.builder().id(user.getId()).username(user.getUsername()).email(user.getEmail())
                .name(user.getName()).phoneNumber(user.getPhoneNumber()).gender(user.getGender())
                .status(user.getStatus()).profilePictureUrl(user.getProfilePictureUrl())
                .role(user.getRole()).build();
        return userDTO;
    }


    @Transactional
    @CachePut(value = "users", key = "#id")
    public UserDTO updateUserProfile(Long id, Map<String, Object> updates) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        if (updates.containsKey("name")) {
            user.setName((String) updates.get("name"));
        }
        if (updates.containsKey("phoneNumber")) {
            System.out.println("updating phone number");
            System.out.println(updates.get("phoneNumber"));
            user.setPhoneNumber((String) updates.get("phoneNumber"));
        }
        if (updates.containsKey("gender")) {
            user.setGender((String) updates.get("gender"));
        }
        if (updates.containsKey("status")) {
            user.setStatus((String) updates.get("status"));
        }
        if (updates.containsKey("profilePictureUrl")) {
            user.setProfilePictureUrl((String) updates.get("profilePictureUrl"));
        }
        return convertToUserDTO(userRepository.save(user));
    }

    
    @Transactional
    public HealthProfileDTO updateHealthProfile(Long userId, HealthProfileDTO healthProfileDTO) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with id: " + userId));

        HealthProfile healthProfile = healthProfileRepository.findByUserId(userId);
        
        if (healthProfile != null) {
            updateHealthProfileFields(healthProfile, healthProfileDTO);
            healthProfile = healthProfileRepository.save(healthProfile);
        } else {
            // Create new health profile
            healthProfile = new HealthProfile();
            healthProfile.setUserId(userId);
            healthProfile.setUser(user); // Set the User entity reference
            updateHealthProfileFields(healthProfile, healthProfileDTO);

            System.out.println("This is the health profile to be saved: " + healthProfile);
            healthProfile = healthProfileRepository.save(healthProfile);
        }

        healthProfile = userKGService.saveHealthProfile(healthProfile);
        return convertToHealthProfileDTO(healthProfile);
    }






    private void updateHealthProfileFields(HealthProfile healthProfile, HealthProfileDTO dto) {
        healthProfile.setGender(dto.getGender());
        healthProfile.setDateOfBirth(dto.getDateOfBirth());
        healthProfile.setWeight(dto.getWeight());
        healthProfile.setHeight(dto.getHeight());
        healthProfile.setHeartRate(dto.getHeartRate());
        healthProfile.setBloodPressure(dto.getBloodPressure());
        healthProfile.setBloodType(dto.getBloodType());
        healthProfile.setMajorHealthEvents(dto.getMajorHealthEvents());
        healthProfile.setCalculatedAge(dto.getCalculatedAge());
        
        // Convert List<String> to JSON strings
        healthProfile.setLifestyle(dto.getLifestyle() != null ? String.join(",", dto.getLifestyle()) : null);
        healthProfile.setAllergies(dto.getAllergies() != null ? String.join(",", dto.getAllergies()) : null);
        healthProfile.setMajorEvents(dto.getMajorEvents() != null ? String.join(",", dto.getMajorEvents()) : null);
        healthProfile.setChronicDiseases(dto.getChronicDiseases() != null ? String.join(",", dto.getChronicDiseases()) : null);

        boolean success = userKGService.createOrUpdatePatient( healthProfile.getUserId(), healthProfile.getUser().getName(), healthProfile.getGender(), 21, healthProfile.getWeight(),
                healthProfile.getHeight(), healthProfile.getBloodType(), healthProfile.getAllergies(), healthProfile.getChronicDiseases(), healthProfile.getLifestyle(), healthProfile.getMajorEvents());
        if (!success) {
            throw new RuntimeException("Failed to create patient in knowledge graph");
        }
        System.out.println("Health profile updated successfully: " + healthProfile);

    }

    private HealthProfileDTO convertToHealthProfileDTO(HealthProfile healthProfile) {
        HealthProfileDTO dto = new HealthProfileDTO();
        dto.setGender(healthProfile.getGender());
        dto.setDateOfBirth(healthProfile.getDateOfBirth());
        dto.setWeight(healthProfile.getWeight());
        dto.setHeight(healthProfile.getHeight());
        dto.setHeartRate(healthProfile.getHeartRate());
        dto.setBloodPressure(healthProfile.getBloodPressure());
        dto.setBloodType(healthProfile.getBloodType());
        dto.setMajorHealthEvents(healthProfile.getMajorHealthEvents());
        dto.setCalculatedAge(healthProfile.getCalculatedAge());
        
        // Convert comma-separated strings back to List<String>
        dto.setLifestyle(healthProfile.getLifestyle() != null ? 
            List.of(healthProfile.getLifestyle().split(",")) : List.of());
        dto.setAllergies(healthProfile.getAllergies() != null ? 
            List.of(healthProfile.getAllergies().split(",")) : List.of());
        dto.setMajorEvents(healthProfile.getMajorEvents() != null ? 
            List.of(healthProfile.getMajorEvents().split(",")) : List.of());
        dto.setChronicDiseases(healthProfile.getChronicDiseases() != null ? 
            List.of(healthProfile.getChronicDiseases().split(",")) : List.of());
        
        return dto;
    }

    private String safeGetString(Map<String, Object> formData, String key, String defaultValue) {
        String value = (String) formData.get(key);
        return (value == null || value.isEmpty()) ? defaultValue : value;
    }


    public HashMap<String, Object> createUserDashboardMap(User user) {

        HashMap<String,Object> healthDashboard = healthService.getHealthDashboardByUser(user);
        List<Medicine> medications = new ArrayList<>(medicineRepository.findMedicineByVisit_User(user));
        healthDashboard.put("medications", medications);
        return healthDashboard;
    }

    @Cacheable(value = "medicines", key = "#userId")
    public List<Medicine> getMedicinesByUserId(Long userId){
        return medicineRepository.findMedicineByVisit_User(userRepository.findById(userId).orElseThrow());
    }

    @Transactional
    @Modifying
//    @CachePut(value = "dashboards", key = "#user.id")
    @CacheEvict(value = "medicines", key = "#userId")
    public boolean deleteMedicineByIdAndUserId(Long medicineId, Long userId) {
        Medicine medicine = medicineRepository.findById(medicineId).orElseThrow(() -> new RuntimeException("Medicine not found with id: " + medicineId));
        if (medicine.getVisit().getUser().getId().equals(userId)) {
            medicine.setTaking(false);
            medicineRepository.save(medicine);
            System.out.println("Medicine deleted"+" "+medicine.isTaking());
            return true;
        }
        return false;
    }

    public JSONObject generateMedicalSummary(Long id) {
        String kgInferedInfo = userKGService.getMedicalSummary(id);
        String llmGeneratedSummary = aiService.generateContent("""
                You are a helpful medical assistant. Based on the following patient information extracted from their medical records, generate a concise and comprehensive medical summary suitable for review by healthcare professionals
                having the following details. Donot write anything extra other than the json format mentioned below. donot add any explanations, delimeters or additional text outside the json brackets. The summary should include the following sections:
                - History of Present Illness (also analyze the issues for visits)
                - Past Medical History
                - Allergies (array , donot write any medicine name here)
                - Medications (array of medications)
                - Social History (if there's none simply mention none)
                - Surgical History (")
                - Family History (")

                extract the relevant details and format them into a well-structured medical summary in json :
                {
                  "history_of_illness": "...",
                  "past_medical_history": "...",
                  "allergies": [ "...", "..." ],
                  "medications": [ "...", "..."],
                  "social_history": "...",
                  "surgical_history": "...",
                  "family_history": "..."
                }""", """
                The given patient information : 
                """+ kgInferedInfo);

        if (llmGeneratedSummary == null || llmGeneratedSummary.isEmpty()) {
            return null;
        }
        // log.info("LLM Generated Medical Summary for user ID {}: \n{}", id, llmGeneratedSummary);

        JSONObject json = JsonParser.parseJsonToObject(llmGeneratedSummary);
        // System.out.println(json.toString(4));
        return json;


    }
        
}
