package com.cashy;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class CashyApplication {
    public static void main(String[] args) {
        SpringApplication.run(CashyApplication.class, args);
    }

}
