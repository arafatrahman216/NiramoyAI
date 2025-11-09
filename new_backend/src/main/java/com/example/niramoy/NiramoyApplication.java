package com.example.niramoy;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
@EnableAsync
public class NiramoyApplication  implements CommandLineRunner {

	public static void main(String[] args) {
		SpringApplication.run(NiramoyApplication.class, args);
	}

    @Override
    public void run(String... args) throws Exception {
        System.out.println("Niramoy is running!");
    }

}
