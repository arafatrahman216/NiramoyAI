package com.example.niramoy.utils;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class DoctorScrapper {

    @Cacheable(value = "scrappedDoctors", key = "{#cityName, #specialty}")
    public String scrapeDoctors(String cityName, String specialty) throws Exception {
        System.out.println("inside scrapeDoctors");
        String cityId = "1";
        String specialtyId = "1";
        String url = "https://sasthyaseba.com/search?type=doctor&country_id=22" ;
        if (cityName != null) {
            cityId = String.valueOf(IdMapper.getCityId(cityName));
            if (cityId!=null)
                url+= "&city_id="+ cityId;
        }
        if (specialty != null) {
            specialtyId = String.valueOf(IdMapper.getSpecialityId(specialty));
            if (specialtyId!=null)
                url+= "&speciality_id="+ specialtyId;
        }

        Document doc = Jsoup.connect(url)
                .userAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                        + "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
                .referrer("http://www.google.com") // optional, looks more like a browser
                .timeout(10000)                     // increase timeout
                .ignoreHttpErrors(true)             // don’t fail on 403/404
                .get();

        // Select each doctor card
        Elements doctorCards = doc.select("div[itemscope][itemtype='https://schema.org/Physician']");

        List<Map<String, String>> doctors = new ArrayList<>();

        for (Element card : doctorCards) {
            if (doctors.size() >= 10) break; // Only first 10

            Map<String, String> doctor = new LinkedHashMap<>();

            // ✅ Doctor name: specifically q:key="Zw_0"
            Element nameEl = card.selectFirst("h6[itemprop=name][q:key=Zw_0]");
            if (nameEl != null) {
                doctor.put("name", nameEl.text().trim());
            }

            Element imageEl = card.selectFirst("img[itemprop=image]");
            if (imageEl != null) {
                doctor.put("image", imageEl.absUrl("src"));
            }

            // ✅ Degree: inside small-body-searchable or itemprop=degree
            Element degreeEl = card.selectFirst(".small-body-searchable");
            if (degreeEl != null) {
                doctor.put("degree", degreeEl.text().trim());
            }

            Element specialtyEl = card.selectFirst("[itemprop=medicalSpecialty]");
            if (specialtyEl != null) {
                doctor.put("specialty", specialtyEl.text().trim());
            }

            // ✅ Profile link
            Element linkEl = card.selectFirst("a[q:link]");
            if (linkEl != null) {
                doctor.put("profileLink", linkEl.absUrl("href"));
            }

            // ✅ Hospital name
            Element hospitalEl = card.selectFirst("[itemprop=hospitalAffiliation] [itemprop=name]");
            if (hospitalEl != null) {
                doctor.put("hospital", hospitalEl.text().trim());
            }

            // ✅ Experience
            Element expEl = card.selectFirst("h6:matchesOwn(Years of Experience)");
            if (expEl != null) {
                doctor.put("experience", expEl.text().trim());
            }

            doctors.add(doctor);
        }

        // Convert to JSON string

        return JsonParser.objectMapper.writerWithDefaultPrettyPrinter().writeValueAsString(doctors);
    }

}
