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

public class DoctorScraper {
    
    public static void main(String[] args) {
        // Environment URL base
        String baseUrl = "https://sasthyaseba.com/search?q=";
        
        // Get doctor name from command line or use default
        String doctorName = args.length > 0 ? args[0] : "mostofa";
        String fullUrl = baseUrl + doctorName.replace(" ", "+");
        
        System.out.println("Scraping sasthyaseba.com for doctor: " + doctorName);
        System.out.println("URL: " + fullUrl);
        System.out.println("=====================================");
        
        List<Map<String, String>> doctors = scrapeDoctors(fullUrl);
        
        if (!doctors.isEmpty()) {
            System.out.println("Found " + doctors.size() + " doctors:");
            System.out.println();
            
            for (int i = 0; i < doctors.size(); i++) {
                Map<String, String> doctor = doctors.get(i);
                System.out.println((i + 1) + ". " + doctor.get("name"));
                System.out.println("   Specialization: " + doctor.get("specialization"));
                System.out.println("   Hospital: " + doctor.get("hospital"));
                System.out.println("   Qualification: " + doctor.get("qualification"));
                System.out.println("   Profile: " + doctor.get("profileUrl"));
                System.out.println();
            }
            
            // Save to JSON file
            String filename = "doctors_" + doctorName.replaceAll("[^a-zA-Z0-9]", "_") + ".json";
            saveToJson(doctors, filename);
            System.out.println("Results saved to: " + filename);
            
        } else {
            System.out.println("No doctors found for: " + doctorName);
        }
    }
    
    public static List<Map<String, String>> scrapeDoctors(String url) {
        List<Map<String, String>> doctors = new ArrayList<>();
        
        try {
            // Connect to the website
            Connection connection = Jsoup.connect(url)
                .userAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36")
                .header("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8")
                .header("Accept-Language", "en-US,en;q=0.5")
                .timeout(10000);

            Document doc = connection.get();
            
            // Find doctor containers using sasthyaseba.com specific selector
            Elements doctorElements = doc.select(".searchAll");
            
            for (Element doctorElement : doctorElements) {
                Map<String, String> doctor = new HashMap<>();
                
                // Extract doctor name
                Element nameElement = doctorElement.selectFirst("h6[itemprop='name']");
                if (nameElement != null) {
                    doctor.put("name", nameElement.text().trim());
                }
                
                // Extract specialization
                Element specElement = doctorElement.selectFirst("span[itemprop='medicalSpecialty']");
                if (specElement != null) {
                    doctor.put("specialization", specElement.text().trim());
                }
                
                // Extract hospital
                Element hospitalElement = doctorElement.selectFirst("[itemprop='hospitalAffiliation'] h6[itemprop='name']");
                if (hospitalElement != null) {
                    doctor.put("hospital", hospitalElement.text().trim());
                }
                
                // Extract qualifications
                Elements qualElements = doctorElement.select(".small-body-searchable:nth-of-type(1) a");
                if (!qualElements.isEmpty()) {
                    StringBuilder qualifications = new StringBuilder();
                    for (Element qual : qualElements) {
                        if (qualifications.length() > 0) qualifications.append(", ");
                        qualifications.append(qual.text().trim());
                    }
                    doctor.put("qualification", qualifications.toString());
                }
                
                // Extract profile URL
                Element linkElement = doctorElement.selectFirst("a");
                if (linkElement != null) {
                    String href = linkElement.attr("href");
                    if (!href.isEmpty()) {
                        doctor.put("profileUrl", href.startsWith("http") ? href : "https://sasthyaseba.com" + href);
                    }
                }
                
                // Extract image URL if available
                Element imageElement = doctorElement.selectFirst("img[itemprop='image']");
                if (imageElement != null) {
                    String imageSrc = imageElement.attr("src");
                    if (!imageSrc.isEmpty()) {
                        doctor.put("imageUrl", imageSrc.startsWith("http") ? imageSrc : "https://sasthyaseba.com" + imageSrc);
                    }
                }
                
                // Extract location/chamber info if available
                Elements locationElements = doctorElement.select(".small-body-searchable:nth-of-type(3) a");
                if (!locationElements.isEmpty()) {
                    StringBuilder locations = new StringBuilder();
                    for (Element loc : locationElements) {
                        if (locations.length() > 0) locations.append(", ");
                        locations.append(loc.text().trim());
                    }
                    doctor.put("chamberLocations", locations.toString());
                }
                
                // Only add if we have at least a name
                if (doctor.containsKey("name") && !doctor.get("name").isEmpty()) {
                    doctors.add(doctor);
                }
            }
            
        } catch (IOException e) {
            System.err.println("Error connecting to website: " + e.getMessage());
        } catch (Exception e) {
            System.err.println("Unexpected error: " + e.getMessage());
            e.printStackTrace();
        }
        
        return doctors;
    }
    
    public static void saveToJson(List<Map<String, String>> doctors, String filename) {
        try {
            Gson gson = new GsonBuilder().setPrettyPrinting().create();
            try (FileWriter writer = new FileWriter(filename)) {
                gson.toJson(doctors, writer);
            }
        } catch (IOException e) {
            System.err.println("Error saving to JSON: " + e.getMessage());
        }
    }
}
