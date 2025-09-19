package com.example.niramoy.utils;

import java.util.HashMap;
import java.util.Map;

public class IdMapper {
    // City ID Map
    private static final Map<String, Integer> CITY_ID_MAP = new HashMap<>();

    // Speciality ID Map
    private static final Map<String, Integer> SPECIALITY_ID_MAP = new HashMap<>();

    static {
        // Initialize City ID Map
        CITY_ID_MAP.put("Bagerhat", 7);
        CITY_ID_MAP.put("Bandarban", 8);
        CITY_ID_MAP.put("Barguna", 6);
        CITY_ID_MAP.put("Barisal", 9);
        CITY_ID_MAP.put("Bhola", 10);
        CITY_ID_MAP.put("Bogra", 11);
        CITY_ID_MAP.put("Brahmanbaria", 2);
        CITY_ID_MAP.put("Chandpur", 13);
        CITY_ID_MAP.put("Chapai Nababganj", 12);
        CITY_ID_MAP.put("Chittagong", 14);
        CITY_ID_MAP.put("Chuadanga", 15);
        CITY_ID_MAP.put("Comilla", 16);
        CITY_ID_MAP.put("Cox's Bazar", 17);
        CITY_ID_MAP.put("Dhaka", 1);
        CITY_ID_MAP.put("Dinajpur", 18);
        CITY_ID_MAP.put("Faridpur", 19);
        CITY_ID_MAP.put("Feni", 20);
        CITY_ID_MAP.put("Gaibandha", 21);
        CITY_ID_MAP.put("Gazipur", 22);
        CITY_ID_MAP.put("Gopalganj", 23);
        CITY_ID_MAP.put("Habiganj", 24);
        CITY_ID_MAP.put("Jamalpur", 25);
        CITY_ID_MAP.put("Jessore", 26);
        CITY_ID_MAP.put("Jhalokati", 27);
        CITY_ID_MAP.put("Jhenaidah", 28);
        CITY_ID_MAP.put("Joypurhat", 29);
        CITY_ID_MAP.put("Khagrachhari", 30);
        CITY_ID_MAP.put("Khulna", 31);
        CITY_ID_MAP.put("Kishoregonj", 3);
        CITY_ID_MAP.put("Kurigram", 32);
        CITY_ID_MAP.put("Kushtia", 33);
        CITY_ID_MAP.put("Lakshmipur", 34);
        CITY_ID_MAP.put("Lalmonirhat", 35);
        CITY_ID_MAP.put("Madaripur", 36);
        CITY_ID_MAP.put("Magura", 37);
        CITY_ID_MAP.put("Manikganj", 38);
        CITY_ID_MAP.put("Maulvibazar", 39);
        CITY_ID_MAP.put("Meherpur", 40);
        CITY_ID_MAP.put("Munshiganj", 41);
        CITY_ID_MAP.put("Mymensingh", 42);
        CITY_ID_MAP.put("Naogaon", 43);
        CITY_ID_MAP.put("Narail", 44);
        CITY_ID_MAP.put("Narayanganj", 5);
        CITY_ID_MAP.put("Narsingdi", 45);
        CITY_ID_MAP.put("Natore", 46);
        CITY_ID_MAP.put("Netrakona", 47);
        CITY_ID_MAP.put("Nilphamari", 48);
        CITY_ID_MAP.put("Noakhali", 49);
        CITY_ID_MAP.put("Pabna", 50);
        CITY_ID_MAP.put("Panchagarh", 51);
        CITY_ID_MAP.put("Patuakhali", 52);
        CITY_ID_MAP.put("Pirojpur", 53);
        CITY_ID_MAP.put("Rajbari", 54);
        CITY_ID_MAP.put("Rajshahi", 55);
        CITY_ID_MAP.put("Rangamati", 56);
        CITY_ID_MAP.put("Rangpur", 57);
        CITY_ID_MAP.put("Satkhira", 58);
        CITY_ID_MAP.put("Shariatpur", 59);
        CITY_ID_MAP.put("Sherpur", 60);
        CITY_ID_MAP.put("Sirajganj", 61);
        CITY_ID_MAP.put("Sunamganj", 62);
        CITY_ID_MAP.put("Sylhet", 63);
        CITY_ID_MAP.put("Tangail", 4);
        CITY_ID_MAP.put("Thakurgaon", 64);

        // Initialize Speciality ID Map
        SPECIALITY_ID_MAP.put("Aesthetic Dermatologist", 4);
        SPECIALITY_ID_MAP.put("Allergy Skin-VD", 74);
        SPECIALITY_ID_MAP.put("Andrologist", 83);
        SPECIALITY_ID_MAP.put("Andrology & Transplant Surgeon", 64);
        SPECIALITY_ID_MAP.put("Anesthesiologist", 5);
        SPECIALITY_ID_MAP.put("Biochemist", 95);
        SPECIALITY_ID_MAP.put("Cardiac Surgeon", 6);
        SPECIALITY_ID_MAP.put("Cardiologist", 7);
        SPECIALITY_ID_MAP.put("Cardiothoracic and Vascular Surgeon", 8);
        SPECIALITY_ID_MAP.put("Cardiothoracic Surgeon", 9);
        SPECIALITY_ID_MAP.put("Chest Specialist", 10);
        SPECIALITY_ID_MAP.put("Clinical Nutritionist", 77);
        SPECIALITY_ID_MAP.put("Colorectal & Laparoscopic Surgeon", 105);
        SPECIALITY_ID_MAP.put("Colorectal & Laparoscopic Surgery", 104);
        SPECIALITY_ID_MAP.put("Colorectal Surgeon", 11);
        SPECIALITY_ID_MAP.put("Cosmetic Dentist", 85);
        SPECIALITY_ID_MAP.put("Cosmetologist", 12);
        SPECIALITY_ID_MAP.put("Critical Care Medicine Specialist", 101);
        SPECIALITY_ID_MAP.put("Critical Care Specialist", 103);
        SPECIALITY_ID_MAP.put("Dentist", 13);
        SPECIALITY_ID_MAP.put("Dermatologist", 14);
        SPECIALITY_ID_MAP.put("Dermatosurgeon", 15);
        SPECIALITY_ID_MAP.put("Diabetes Specialist", 71);
        SPECIALITY_ID_MAP.put("Diabetologist", 70);
        SPECIALITY_ID_MAP.put("Dietician", 97);
        SPECIALITY_ID_MAP.put("Endocrinologist", 16);
        SPECIALITY_ID_MAP.put("Epidemiologist", 82);
        SPECIALITY_ID_MAP.put("Family Medicine Specialist", 17);
        SPECIALITY_ID_MAP.put("Gastroenterologist", 18);
        SPECIALITY_ID_MAP.put("General Physician", 69);
        SPECIALITY_ID_MAP.put("General Surgeon", 84);
        SPECIALITY_ID_MAP.put("Geriatrician", 87);
        SPECIALITY_ID_MAP.put("Gynecologic Oncologist", 94);
        SPECIALITY_ID_MAP.put("Gynecologist & Obstetrician", 73);
        SPECIALITY_ID_MAP.put("Gynecologists", 19);
        SPECIALITY_ID_MAP.put("Hair Transplant Surgeon", 20);
        SPECIALITY_ID_MAP.put("Hematologist", 21);
        SPECIALITY_ID_MAP.put("Hepatobiliary Surgeon", 109);
        SPECIALITY_ID_MAP.put("Hepatologist", 22);
        SPECIALITY_ID_MAP.put("Immunologist", 23);
        SPECIALITY_ID_MAP.put("Infertility Specialist", 24);
        SPECIALITY_ID_MAP.put("Internal Medicine", 25);
        SPECIALITY_ID_MAP.put("Internal Medicine Specialist", 26);
        SPECIALITY_ID_MAP.put("Interventional Cardiologist", 27);
        SPECIALITY_ID_MAP.put("Laparoscopic Surgeon", 66);
        SPECIALITY_ID_MAP.put("Laparoscopist", 28);
        SPECIALITY_ID_MAP.put("Laser Dermatosurgeon", 76);
        SPECIALITY_ID_MAP.put("Maxillofacial and Dental Surgeon", 106);
        SPECIALITY_ID_MAP.put("Maxillofacial Surgeon", 29);
        SPECIALITY_ID_MAP.put("Medicine and Kidny", 111);
        SPECIALITY_ID_MAP.put("Medicine Specialist", 30);
        SPECIALITY_ID_MAP.put("Microbiologist", 31);
        SPECIALITY_ID_MAP.put("Neonatologist", 32);
        SPECIALITY_ID_MAP.put("Nephrologist", 34);
        SPECIALITY_ID_MAP.put("Neuro Physician", 99);
        SPECIALITY_ID_MAP.put("Neurologist", 35);
        SPECIALITY_ID_MAP.put("Neuromedicine Specialist", 72);
        SPECIALITY_ID_MAP.put("Neuropsychologist", 86);
        SPECIALITY_ID_MAP.put("Neurosurgeon", 36);
        SPECIALITY_ID_MAP.put("Nucleologists", 78);
        SPECIALITY_ID_MAP.put("Nutritionist", 37);
        SPECIALITY_ID_MAP.put("Obstetrician", 63);
        SPECIALITY_ID_MAP.put("Oncologist", 38);
        SPECIALITY_ID_MAP.put("Ophthalmologist", 39);
        SPECIALITY_ID_MAP.put("Orthopedic Surgeon", 67);
        SPECIALITY_ID_MAP.put("Orthopedist", 40);
        SPECIALITY_ID_MAP.put("Otolaryngologists (ENT)", 41);
        SPECIALITY_ID_MAP.put("Pain Management Specialist", 102);
        SPECIALITY_ID_MAP.put("Pathologist", 42);
        SPECIALITY_ID_MAP.put("Pediatric Cardiologist", 43);
        SPECIALITY_ID_MAP.put("Pediatric Dermatologist", 44);
        SPECIALITY_ID_MAP.put("Pediatric Endocrinologist", 65);
        SPECIALITY_ID_MAP.put("Pediatric Gastroenterologist", 91);
        SPECIALITY_ID_MAP.put("Pediatric Hematologist", 90);
        SPECIALITY_ID_MAP.put("Pediatric Hematologist & Oncologist", 108);
        SPECIALITY_ID_MAP.put("Pediatric Nephrologist", 68);
        SPECIALITY_ID_MAP.put("Pediatric Neurologist", 80);
        SPECIALITY_ID_MAP.put("Pediatric Neurosurgeon", 96);
        SPECIALITY_ID_MAP.put("Pediatric Pulmonologist", 79);
        SPECIALITY_ID_MAP.put("Pediatric Surgeon", 45);
        SPECIALITY_ID_MAP.put("Pediatrician", 46);
        SPECIALITY_ID_MAP.put("Pediatrician & Neonatologist", 47);
        SPECIALITY_ID_MAP.put("Physical Medicine", 92);
        SPECIALITY_ID_MAP.put("Physiotherapist", 48);
        SPECIALITY_ID_MAP.put("Plastic Surgeon", 49);
        SPECIALITY_ID_MAP.put("Prosthodontist", 88);
        SPECIALITY_ID_MAP.put("Psychiatrist", 50);
        SPECIALITY_ID_MAP.put("Psychologist", 110);
        SPECIALITY_ID_MAP.put("Pulmonary Medicine Specialist", 100);
        SPECIALITY_ID_MAP.put("Pulmonologist", 51);
        SPECIALITY_ID_MAP.put("Radiologist", 52);
        SPECIALITY_ID_MAP.put("Rehabilitation Specialist", 93);
        SPECIALITY_ID_MAP.put("Renal Specialist", 53);
        SPECIALITY_ID_MAP.put("Respiratory Specialist", 54);
        SPECIALITY_ID_MAP.put("Rheumatologist", 55);
        SPECIALITY_ID_MAP.put("Sexual Medicine Specialist", 75);
        SPECIALITY_ID_MAP.put("Sonologist", 56);
        SPECIALITY_ID_MAP.put("Spine Surgeon", 89);
        SPECIALITY_ID_MAP.put("Sports Physician", 98);
        SPECIALITY_ID_MAP.put("Surgeon", 57);
        SPECIALITY_ID_MAP.put("Thoracic Surgeon", 81);
        SPECIALITY_ID_MAP.put("Transfusion Medicine Specialist", 107);
        SPECIALITY_ID_MAP.put("Trauma Surgeon", 58);
        SPECIALITY_ID_MAP.put("Trichologist", 59);
        SPECIALITY_ID_MAP.put("Urologist", 60);
        SPECIALITY_ID_MAP.put("Vascular Surgeon", 61);
        SPECIALITY_ID_MAP.put("Venereologist", 62);
    }

    // City ID methods
    public static Integer getCityId(String cityName) {
        return CITY_ID_MAP.get(cityName);
    }

    public static Map<String, Integer> getCityIdMap() {
        return new HashMap<>(CITY_ID_MAP);
    }

    // Speciality ID methods
    public static Integer getSpecialityId(String specialityName) {
        return SPECIALITY_ID_MAP.get(specialityName);
    }

    public static Map<String, Integer> getSpecialityIdMap() {
        return new HashMap<>(SPECIALITY_ID_MAP);
    }

    public static String getAllSpecialities() {
        return "Aesthetic Dermatologist, Allergy Skin-VD, Andrologist," +
                " Andrology & Transplant Surgeon, Anesthesiologist, Biochemist, " +
                "Cardiac Surgeon, Cardiologist, Cardiothoracic and Vascular Surgeon, " +
                "Cardiothoracic Surgeon, Chest Specialist, Clinical Nutritionist, Colorectal" +
                " & Laparoscopic Surgeon, Colorectal & Laparoscopic Surgery, Colorectal Surgeon," +
                " Cosmetic Dentist, Cosmetologist, Critical Care Medicine Specialist, Critical " +
                "Care Specialist, Dentist, Dermatologist, Dermatosurgeon, Diabetes Specialist," +
                " Diabetologist, Dietician, Endocrinologist, Epidemiologist, Family Medicine Specialist," +
                " Gastroenterologist, General Physician, General Surgeon, Geriatrician, Gynecologic " +
                "Oncologist, Gynecologist & Obstetrician, Gynecologists, Hair Transplant Surgeon, " +
                "Hematologist, Hepatobiliary Surgeon, Hepatologist, Immunologist, Infertility Specialist, " +
                "Internal Medicine, Internal Medicine Specialist, Interventional Cardiologist, Laparoscopic " +
                "Surgeon, Laparoscopist, Laser Dermatosurgeon, Maxillofacial and Dental Surgeon, " +
                "Maxillofacial Surgeon, Medicine and Kidny, Medicine Specialist, Microbiologist, " +
                "Neonatologist, Nephrologist, Neuro Physician, Neurologist, Neuromedicine Specialist," +
                " Neuropsychologist, Neurosurgeon, Nucleologists, Nutritionist, Obstetrician, Oncologist," +
                " Ophthalmologist, Orthopedic Surgeon, Orthopedist, Otolaryngologists (ENT), Pain Management" +
                " Specialist, Pathologist, Pediatric Cardiologist, Pediatric Dermatologist, Pediatric" +
                " Endocrinologist, Pediatric Gastroenterologist, Pediatric Hematologist, Pediatric " +
                "Hematologist & Oncologist, Pediatric Nephrologist, Pediatric Neurologist, Pediatric " +
                "Neurosurgeon, Pediatric Pulmonologist, Pediatric Surgeon, Pediatrician, Pediatrician & " +
                "Neonatologist, Physical Medicine, Physiotherapist, Plastic Surgeon, Prosthodontist, " +
                "Psychiatrist, Psychologist, Pulmonary Medicine Specialist, Pulmonologist, Radiologist, " +
                "Rehabilitation Specialist, Renal Specialist, Respiratory Specialist, Rheumatologist, Sexual " +
                "Medicine Specialist, Sonologist, Spine Surgeon, Sports Physician, Surgeon, Thoracic Surgeon," +
                " Transfusion Medicine Specialist, Trauma Surgeon, Trichologist, Urologist, Vascular Surgeon, Venereologist";
    }
}