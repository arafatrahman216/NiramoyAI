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

public class HospitalScraper {
    
    public static void main(String[] args) {
        // Environment URL base from .env
        String baseUrl = "https://sasthyaseba.com/search?type=hospital&country_id=22&q=";
        
        // Get hospital name from command line or use default
        String hospitalName = args.length > 0 ? args[0] : "modern";
        String fullUrl = baseUrl + hospitalName.replace(" ", "%20");
        
        System.out.println("Scraping sasthyaseba.com for hospital: " + hospitalName);
        System.out.println("URL: " + fullUrl);
        System.out.println("=====================================");
        
        List<Map<String, String>> hospitals = scrapeHospitals(fullUrl);
        
        if (!hospitals.isEmpty()) {
            System.out.println("Found " + hospitals.size() + " hospitals:");
            System.out.println();
            
            for (int i = 0; i < hospitals.size(); i++) {
                Map<String, String> hospital = hospitals.get(i);
                System.out.println((i + 1) + ". " + hospital.get("name"));
                System.out.println("   Address: " + hospital.get("address"));
                System.out.println("   Doctors: " + hospital.get("doctorCount"));
                System.out.println("   Fee Range: " + hospital.get("feeRange"));
                System.out.println("   Services: " + hospital.get("services"));
                System.out.println("   Profile: " + hospital.get("profileUrl"));
                System.out.println();
            }
            
            // Save to JSON file
            String filename = "hospitals_" + hospitalName.replaceAll("[^a-zA-Z0-9]", "_") + ".json";
            saveToJson(hospitals, filename);
            System.out.println("Results saved to: " + filename);
            
        } else {
            System.out.println("No hospitals found for: " + hospitalName);
        }
    }
    
    public static List<Map<String, String>> scrapeHospitals(String url) {
        List<Map<String, String>> hospitals = new ArrayList<>();
        
        try {
            // Connect to the website
            Connection connection = Jsoup.connect(url)
                .userAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36")
                .header("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8")
                .header("Accept-Language", "en-US,en;q=0.5")
                .timeout(10000);
            
            Document doc = connection.get();
            
            // Find hospital containers using the specific selector for hospital profiles
            Elements hospitalElements = doc.select("div.hospitalProfile");
            
            for (Element hospitalElement : hospitalElements) {
                Map<String, String> hospital = new HashMap<>();
                
                // Extract hospital name
                Element nameElement = hospitalElement.selectFirst("h6[itemprop='name']");
                if (nameElement != null) {
                    hospital.put("name", nameElement.text().trim());
                }
                
                // Extract address
                Element addressElement = hospitalElement.selectFirst("h6[itemprop='address']");
                if (addressElement != null) {
                    hospital.put("address", addressElement.text().trim());
                }
                
                // Extract doctor count and specialties
                Elements doctorInfoElements = hospitalElement.select("h6.text-primaryColor-tint-100");
                for (Element doctorInfo : doctorInfoElements) {
                    String text = doctorInfo.text().trim();
                    if (text.contains("Doctors") && text.contains("specialities")) {
                        hospital.put("doctorCount", text);
                        break;
                    }
                }
                
                // Extract fee range
                Elements feeElements = hospitalElement.select("h6.text-black-tint-100");
                for (Element feeElement : feeElements) {
                    String text = feeElement.text().trim();
                    if (text.contains("Taka")) {
                        hospital.put("feeRange", text);
                        break;
                    }
                }
                
                // Extract services
                Element servicesContainer = hospitalElement.selectFirst("p.text-left");
                if (servicesContainer != null) {
                    Elements serviceLinks = servicesContainer.select("a");
                    if (!serviceLinks.isEmpty()) {
                        StringBuilder services = new StringBuilder();
                        for (Element serviceLink : serviceLinks) {
                            if (services.length() > 0) services.append(", ");
                            services.append(serviceLink.text().trim());
                        }
                        hospital.put("services", services.toString());
                    }
                }
                
                // Extract profile URL
                Element linkElement = hospitalElement.selectFirst("a[itemprop='url']");
                if (linkElement != null) {
                    String href = linkElement.attr("href");
                    if (!href.isEmpty()) {
                        hospital.put("profileUrl", href.startsWith("http") ? href : "https://sasthyaseba.com" + href);
                    }
                }
                
                // Extract image URL
                Element imageElement = hospitalElement.selectFirst("img[itemprop='logo']");
                if (imageElement != null) {
                    String imageSrc = imageElement.attr("src");
                    if (!imageSrc.isEmpty()) {
                        hospital.put("imageUrl", imageSrc.startsWith("http") ? imageSrc : "https://sasthyaseba.com" + imageSrc);
                    }
                }
                
                // Extract patient opinions count
                Elements opinionElements = hospitalElement.select("h6.text-black-tint-400");
                for (Element opinionElement : opinionElements) {
                    String text = opinionElement.text().trim();
                    if (text.contains("patients opinion")) {
                        hospital.put("patientOpinions", text);
                        break;
                    }
                }
                
                // Extract hospital type from schema
                String hospitalType = hospitalElement.attr("itemtype");
                if (hospitalType.contains("Hospital")) {
                    hospital.put("type", "Hospital");
                }
                
                // Only add if we have at least a name
                if (hospital.containsKey("name") && !hospital.get("name").isEmpty()) {
                    hospitals.add(hospital);
                }
            }
            
        } catch (IOException e) {
            System.err.println("Error connecting to website: " + e.getMessage());
        } catch (Exception e) {
            System.err.println("Unexpected error: " + e.getMessage());
            e.printStackTrace();
        }
        
        return hospitals;
    }
    
    public static void saveToJson(List<Map<String, String>> hospitals, String filename) {
        try {
            Gson gson = new GsonBuilder().setPrettyPrinting().create();
            try (FileWriter writer = new FileWriter(filename)) {
                gson.toJson(hospitals, writer);
            }
        } catch (IOException e) {
            System.err.println("Error saving to JSON: " + e.getMessage());
        }
    }
}
