import org.jsoup.Jsoup;
import org.jsoup.Connection;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import java.io.FileWriter;
import java.io.IOException;
import java.util.*;

public class AllHospital {
    private static final int MAX_PAGES = 13;
    private static final int DELAY_BETWEEN_REQUESTS = 2000;

    public static void main(String[] args) {
        String baseUrl = "https://sasthyaseba.com/search?type=hospital&country_id=22";
        System.out.println("Starting hospital scraping from sasthyaseba.com");
        System.out.println("Base URL: " + baseUrl);
        System.out.println("Incremental saving: Data will be saved after each page");
        System.out.println("======================================================");
        String filename = "all_hospitals_incremental_" + System.currentTimeMillis() + ".json";
        System.out.println("Output file: " + filename);
        System.out.println("======================================================");
        List<Map<String, String>> allHospitals = scrapeAllHospitalsWithIncrementalSaving(baseUrl, filename);
        if (!allHospitals.isEmpty()) {
            System.out.println("\n======================================================");
            System.out.println("SCRAPING COMPLETED SUCCESSFULLY!");
            System.out.println("Total hospitals found: " + allHospitals.size());
            System.out.println("Final file: " + filename);
            System.out.println("======================================================");
            System.out.println("\nSample of collected hospitals:");
            for (int i = 0; i < Math.min(5, allHospitals.size()); i++) {
                Map<String, String> hospital = allHospitals.get(i);
                System.out.println((i + 1) + ". " + hospital.get("name"));
                System.out.println("   Image URL: " + hospital.get("imageUrl"));
                System.out.println("   Years in Service: " + hospital.getOrDefault("yearsInService", "N/A"));
                System.out.println("   Location: " + hospital.get("fullAddress"));
                System.out.println("   Doctor Info: " + hospital.get("doctorInfo"));
                System.out.println("   Patient Opinions: " + hospital.get("patientOpinions"));
                System.out.println("   Fee Range: " + hospital.get("feeRange"));
                System.out.println("   Hotline: " + hospital.get("hotline"));
                System.out.println("   Hotline Info: " + hospital.getOrDefault("hotlineInfo", "N/A"));
                System.out.println("   Email: " + hospital.get("email"));
                System.out.println();
            }
        } else {
            System.out.println("No hospitals found!");
        }
    }

    public static List<Map<String, String>> scrapeAllHospitalsWithIncrementalSaving(String baseUrl, String filename) {
        List<Map<String, String>> allHospitals = new ArrayList<>();
        int currentPage = 1;
        int hospitalIdCounter = 1;
        while (currentPage <= MAX_PAGES) {
            System.out.println("Scraping page " + currentPage + "...");
            String pageUrl = currentPage == 1 ? baseUrl : baseUrl + "&page=" + currentPage;
            List<Map<String, String>> hospitalsOnPage = scrapeHospitalsFromPage(pageUrl, currentPage, hospitalIdCounter);
            hospitalIdCounter += hospitalsOnPage.size();
            allHospitals.addAll(hospitalsOnPage);
            System.out.println("Found " + hospitalsOnPage.size() + " hospitals on page " + currentPage + " (Total so far: " + allHospitals.size() + ")");
            saveToJsonIncremental(allHospitals, filename, currentPage);
            currentPage++;
            try {
                Thread.sleep(DELAY_BETWEEN_REQUESTS);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                break;
            }
        }
        return allHospitals;
    }

    public static List<Map<String, String>> scrapeHospitalsFromPage(String url, int pageNumber, int startId) {
        List<Map<String, String>> hospitals = new ArrayList<>();
        try {
            Connection connection = Jsoup.connect(url)
                .userAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36")
                .timeout(15000);
            Document doc = connection.get();
            Elements hospitalElements = doc.select("div.hospitalProfile");
            int idCounter = startId;
            for (Element hospitalElement : hospitalElements) {
                Map<String, String> hospital = new HashMap<>();
                try {
                    // Name
                    Element nameElement = hospitalElement.selectFirst("h6[itemprop='name']");
                    hospital.put("name", nameElement != null ? cleanText(nameElement.text()) : "");
                    
                    // Image URL
                    Element imageElement = hospitalElement.selectFirst("img[itemprop='logo']");
                    hospital.put("imageUrl", imageElement != null ? imageElement.attr("src") : "");
                    
                    // Doctor and Specialties Count
                    Element doctorCountElement = hospitalElement.selectFirst(".text-primaryColor-tint-100");
                    String doctorInfo = doctorCountElement != null ? doctorCountElement.text() : "";
                    hospital.put("doctorInfo", doctorInfo);
                    
                    // Patient Opinions
                    Element opinionElement = hospitalElement.selectFirst(".text-black-tint-400");
                    hospital.put("patientOpinions", opinionElement != null ? cleanText(opinionElement.text()) : "");
                    
                    // Location
                    Element locationElement = hospitalElement.selectFirst("[itemprop='address']");
                    hospital.put("location", locationElement != null ? cleanText(locationElement.text()) : "");
                    
                    // Fee Range
                    Element feeElement = hospitalElement.selectFirst(".text-black-tint-100.pt-1");
                    hospital.put("feeRange", feeElement != null ? cleanText(feeElement.text()) : "");
                    // Profile URL
                    Element linkElement = hospitalElement.selectFirst("a");
                    String profileUrl = linkElement != null ? linkElement.attr("href") : "";
                    if (!profileUrl.isEmpty()) {
                        profileUrl = profileUrl.startsWith("http") ? profileUrl : "https://sasthyaseba.com" + profileUrl;
                        hospital.put("profileurl", profileUrl);
                        // Scrape hotline and email from profile page
                        Map<String, String> contactInfo = scrapeHospitalContact(profileUrl);
                        hospital.put("hotline", contactInfo.getOrDefault("hotline", ""));
                        hospital.put("email", contactInfo.getOrDefault("email", ""));
                    } else {
                        hospital.put("hotline", "");
                        hospital.put("email", "");
                    }
                    hospital.put("id", String.valueOf(idCounter));
                    hospital.put("pageNumber", String.valueOf(pageNumber));
                    hospitals.add(hospital);
                    idCounter++;
                } catch (Exception e) {
                    System.err.println("Error extracting hospital data: " + e.getMessage());
                }
            }
        } catch (IOException e) {
            System.err.println("Error connecting to page " + pageNumber + ": " + e.getMessage());
        } catch (Exception e) {
            System.err.println("Unexpected error on page " + pageNumber + ": " + e.getMessage());
        }
        return hospitals;
    }

    public static Map<String, String> scrapeHospitalContact(String profileUrl) {
        Map<String, String> contact = new HashMap<>();
        try {
            Connection connection = Jsoup.connect(profileUrl)
                .userAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36")
                .timeout(15000);
            Document doc = connection.get();
            
            // Service Years
            Element serviceYearsElement = doc.selectFirst(".text-black-tint-400");
            if (serviceYearsElement != null && serviceYearsElement.text().contains("Years in service")) {
                contact.put("yearsInService", cleanText(serviceYearsElement.text()));
            }
            
            // Hotline - looking for the element with itemprop="telephone" and specific text pattern
            Element hotlineElement = doc.selectFirst("h6[itemprop='telephone']");
            if (hotlineElement != null) {
                // Get the actual hotline number
                contact.put("hotline", cleanText(hotlineElement.text()));
                // Also get the hotline availability if present
                Element hotlineAvailability = doc.selectFirst("h6.text-black-tint-300.font-bold");
                if (hotlineAvailability != null) {
                    contact.put("hotlineInfo", cleanText(hotlineAvailability.text()));
                }
            }
            
            // Email
            Element emailElement = doc.selectFirst("h6[itemprop='email']");
            contact.put("email", emailElement != null ? cleanText(emailElement.text()) : "");
            
            // Location with more precise details
            Element locationElement = doc.selectFirst("h6[itemprop='address']");
            if (locationElement != null) {
                contact.put("fullAddress", cleanText(locationElement.text()));
            }
            
        } catch (Exception e) {
            System.err.println("Error scraping contact info from " + profileUrl + ": " + e.getMessage());
        }
        return contact;
    }

    public static String cleanText(String text) {
        if (text == null) return "";
        return text.trim().replaceAll("\\s+", " ");
    }

    public static void saveToJsonIncremental(List<Map<String, String>> hospitals, String filename, int currentPage) {
        try {
            Gson gson = new GsonBuilder().setPrettyPrinting().create();
            try (FileWriter writer = new FileWriter(filename)) {
                gson.toJson(hospitals, writer);
                System.out.println("✓ Incremental save: " + hospitals.size() + " hospitals saved to " + filename + " (after page " + currentPage + ")");
            }
        } catch (IOException e) {
            System.err.println("Error in incremental save: " + e.getMessage());
        }
    }
}
