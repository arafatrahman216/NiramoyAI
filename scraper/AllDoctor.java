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

public class AllDoctor {
    
    private static final int MAX_PAGES = 100; // Safety limit to prevent infinite loops
    private static final int DELAY_BETWEEN_REQUESTS = 2000; // 2 seconds delay between requests
    
    public static void main(String[] args) {
        String baseUrl = "https://sasthyaseba.com/search?type=doctor&country_id=22";
        
        System.out.println("Starting comprehensive doctor scraping from sasthyaseba.com");
        System.out.println("Base URL: " + baseUrl);
        System.out.println("Incremental saving: Data will be saved after each page");
        System.out.println("======================================================");
        
        // Generate filename once for incremental saving
        String filename = "all_doctors_incremental_" + System.currentTimeMillis() + ".json";
        System.out.println("Output file: " + filename);
        System.out.println("======================================================");
        
        List<Map<String, String>> allDoctors = scrapeAllDoctorsWithIncrementalSaving(baseUrl, filename);
        
        if (!allDoctors.isEmpty()) {
            System.out.println("\n======================================================");
            System.out.println("SCRAPING COMPLETED SUCCESSFULLY!");
            System.out.println("Total doctors found: " + allDoctors.size());
            System.out.println("Final file: " + filename);
            System.out.println("======================================================");
            
            // Display sample of first 5 doctors
            System.out.println("\nSample of collected doctors:");
            for (int i = 0; i < Math.min(5, allDoctors.size()); i++) {
                Map<String, String> doctor = allDoctors.get(i);
                System.out.println((i + 1) + ". " + doctor.get("name"));
                System.out.println("   Specialty: " + doctor.get("specialist"));
                System.out.println("   Hospital: " + doctor.get("hospital"));
                System.out.println("   Experience: " + doctor.get("experience"));
                System.out.println();
            }
            
        } else {
            System.out.println("No doctors found!");
        }
    }
    
    public static List<Map<String, String>> scrapeAllDoctorsWithIncrementalSaving(String baseUrl, String filename) {
        List<Map<String, String>> allDoctors = new ArrayList<>();
        int currentPage = 1;
        boolean hasMorePages = true;
        int doctorIdCounter = 1; // Serial ID counter
        
        while (hasMorePages && currentPage <= MAX_PAGES) {
            System.out.println("Scraping page " + currentPage + "...");
            
            String pageUrl = currentPage == 1 ? baseUrl : baseUrl + "&page=" + currentPage;
            List<Map<String, String>> doctorsOnPage = scrapeDoctorsFromPage(pageUrl, currentPage);
            
            if (doctorsOnPage.isEmpty()) {
                System.out.println("No more doctors found. Stopping at page " + currentPage);
                hasMorePages = false;
            } else {
                // Add serial IDs to doctors from this page
                for (Map<String, String> doctor : doctorsOnPage) {
                    doctor.put("id", String.valueOf(doctorIdCounter));
                    doctorIdCounter++;
                }
                
                allDoctors.addAll(doctorsOnPage);
                System.out.println("Found " + doctorsOnPage.size() + " doctors on page " + currentPage + 
                                 " (Total so far: " + allDoctors.size() + ")");
                
                // Save incrementally after each page
                saveToJsonIncremental(allDoctors, filename, currentPage);
                
                // Check if there's a next page by trying to access it
                hasMorePages = checkForNextPage(baseUrl, currentPage + 1);
                currentPage++;
                
                // Delay between requests to be respectful to the server
                if (hasMorePages) {
                    try {
                        Thread.sleep(DELAY_BETWEEN_REQUESTS);
                    } catch (InterruptedException e) {
                        Thread.currentThread().interrupt();
                        break;
                    }
                }
            }
        }
        
        return allDoctors;
    }
    
    public static List<Map<String, String>> scrapeAllDoctors(String baseUrl) {
        List<Map<String, String>> allDoctors = new ArrayList<>();
        int currentPage = 1;
        boolean hasMorePages = true;
        int doctorIdCounter = 1; // Serial ID counter
        
        while (hasMorePages && currentPage <= MAX_PAGES) {
            System.out.println("Scraping page " + currentPage + "...");
            
            String pageUrl = currentPage == 1 ? baseUrl : baseUrl + "&page=" + currentPage;
            List<Map<String, String>> doctorsOnPage = scrapeDoctorsFromPage(pageUrl, currentPage);
            
            if (doctorsOnPage.isEmpty()) {
                System.out.println("No more doctors found. Stopping at page " + currentPage);
                hasMorePages = false;
            } else {
                // Add serial IDs to doctors from this page
                for (Map<String, String> doctor : doctorsOnPage) {
                    doctor.put("id", String.valueOf(doctorIdCounter));
                    doctorIdCounter++;
                }
                
                allDoctors.addAll(doctorsOnPage);
                System.out.println("Found " + doctorsOnPage.size() + " doctors on page " + currentPage + 
                                 " (Total so far: " + allDoctors.size() + ")");
                
                // Check if there's a next page by trying to access it
                hasMorePages = checkForNextPage(baseUrl, currentPage + 1);
                currentPage++;
                
                // Delay between requests to be respectful to the server
                if (hasMorePages) {
                    try {
                        Thread.sleep(DELAY_BETWEEN_REQUESTS);
                    } catch (InterruptedException e) {
                        Thread.currentThread().interrupt();
                        break;
                    }
                }
            }
        }
        
        return allDoctors;
    }
    
    public static List<Map<String, String>> scrapeDoctorsFromPage(String url, int pageNumber) {
        List<Map<String, String>> doctors = new ArrayList<>();
        
        try {
            // Connect to the website
            Connection connection = Jsoup.connect(url)
                .userAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36")
                .header("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8")
                .header("Accept-Language", "en-US,en;q=0.5")
                .header("Cache-Control", "no-cache")
                .timeout(15000);
            
            Document doc = connection.get();
            
            // Find doctor containers - try multiple selectors
            Elements doctorElements = doc.select(".searchAll");
            
            // If no results with primary selector, try alternatives
            if (doctorElements.isEmpty()) {
                doctorElements = doc.select("[itemtype*='Person']");
            }
            if (doctorElements.isEmpty()) {
                doctorElements = doc.select(".doctor-card, .doctor-item, .profile-card");
            }
            
            for (Element doctorElement : doctorElements) {
                Map<String, String> doctor = new HashMap<>();
                
                try {
                    // Extract doctor name
                    Element nameElement = doctorElement.selectFirst("h6[itemprop='name']");
                    if (nameElement == null) {
                        nameElement = doctorElement.selectFirst(".name, h3, h4, .title");
                    }
                    if (nameElement != null) {
                        doctor.put("name", cleanText(nameElement.text()));
                    }
                    
                    // Extract degree/qualification
                    Elements qualElements = doctorElement.select(".small-body-searchable:nth-of-type(1) a");
                    if (!qualElements.isEmpty()) {
                        StringBuilder qualifications = new StringBuilder();
                        for (Element qual : qualElements) {
                            if (qualifications.length() > 0) qualifications.append(", ");
                            qualifications.append(cleanText(qual.text()));
                        }
                        doctor.put("degree", qualifications.toString());
                    } else {
                        // Try alternative selector
                        Element degreeElement = doctorElement.selectFirst(".qualification, .degree, .education");
                        if (degreeElement != null) {
                            doctor.put("degree", cleanText(degreeElement.text()));
                        }
                    }
                    
                    // Extract specialization
                    Element specElement = doctorElement.selectFirst("span[itemprop='medicalSpecialty']");
                    if (specElement == null) {
                        specElement = doctorElement.selectFirst(".specialization, .specialty, .department");
                    }
                    if (specElement != null) {
                        doctor.put("specialist", cleanText(specElement.text()));
                    }
                    
                    // Extract experience
                    Elements expElements = doctorElement.select("h6:contains(Years of Experience)");
                    if (!expElements.isEmpty()) {
                        doctor.put("experience", cleanText(expElements.first().text()));
                    } else {
                        // Try alternative selectors
                        Element expElement = doctorElement.selectFirst(".experience, .years, .exp");
                        if (expElement != null) {
                            doctor.put("experience", cleanText(expElement.text()));
                        } else {
                            doctor.put("experience", "Not specified");
                        }
                    }
                    
                    // Extract hospital
                    Element hospitalElement = doctorElement.selectFirst("[itemprop='hospitalAffiliation'] h6[itemprop='name']");
                    if (hospitalElement == null) {
                        hospitalElement = doctorElement.selectFirst(".hospital, .clinic, .institution");
                    }
                    if (hospitalElement != null) {
                        doctor.put("hospital", cleanText(hospitalElement.text()));
                    }
                    
                    // Extract image URL
                    Element imageElement = doctorElement.selectFirst("img[itemprop='image']");
                    if (imageElement == null) {
                        imageElement = doctorElement.selectFirst("img");
                    }
                    if (imageElement != null) {
                        String imageSrc = imageElement.attr("src");
                        if (!imageSrc.isEmpty()) {
                            doctor.put("imageurl", imageSrc.startsWith("http") ? imageSrc : "https://sasthyaseba.com" + imageSrc);
                        }
                    }
                    
                    // Extract profile URL
                    Element linkElement = doctorElement.selectFirst("a");
                    if (linkElement != null) {
                        String href = linkElement.attr("href");
                        if (!href.isEmpty()) {
                            doctor.put("profileurl", href.startsWith("http") ? href : "https://sasthyaseba.com" + href);
                        }
                    }
                    
                    // Only add doctor if we have at least a name
                    if (doctor.containsKey("name") && !doctor.get("name").isEmpty()) {
                        // Add page number for tracking
                        doctor.put("pageNumber", String.valueOf(pageNumber));
                        doctors.add(doctor);
                    }
                    
                } catch (Exception e) {
                    System.err.println("Error extracting doctor data: " + e.getMessage());
                }
            }
            
        } catch (IOException e) {
            System.err.println("Error connecting to page " + pageNumber + ": " + e.getMessage());
        } catch (Exception e) {
            System.err.println("Unexpected error on page " + pageNumber + ": " + e.getMessage());
        }
        
        return doctors;
    }
    
    public static boolean checkForNextPage(String baseUrl, int nextPageNumber) {
        try {
            String nextPageUrl = baseUrl + "&page=" + nextPageNumber;
            Connection connection = Jsoup.connect(nextPageUrl)
                .userAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36")
                .timeout(10000);
            
            Document doc = connection.get();
            Elements doctorElements = doc.select(".searchAll");
            
            // If we find doctors or pagination elements, there might be more pages
            return !doctorElements.isEmpty();
            
        } catch (Exception e) {
            System.err.println("Error checking for next page " + nextPageNumber + ": " + e.getMessage());
            return false;
        }
    }
    
    public static String cleanText(String text) {
        if (text == null) return "";
        return text.trim().replaceAll("\\s+", " ");
    }
    
    public static void saveToJsonIncremental(List<Map<String, String>> doctors, String filename, int currentPage) {
        try {
            Gson gson = new GsonBuilder().setPrettyPrinting().create();
            try (FileWriter writer = new FileWriter(filename)) {
                gson.toJson(doctors, writer);
                System.out.println("✓ Incremental save: " + doctors.size() + " doctors saved to " + filename + " (after page " + currentPage + ")");
            }
        } catch (IOException e) {
            System.err.println("Error in incremental save: " + e.getMessage());
        }
    }
    
    public static void saveToJson(List<Map<String, String>> doctors, String filename) {
        try {
            Gson gson = new GsonBuilder().setPrettyPrinting().create();
            try (FileWriter writer = new FileWriter(filename)) {
                gson.toJson(doctors, writer);
                System.out.println("Successfully saved " + doctors.size() + " doctors to " + filename);
            }
        } catch (IOException e) {
            System.err.println("Error saving to JSON: " + e.getMessage());
        }
    }
}
