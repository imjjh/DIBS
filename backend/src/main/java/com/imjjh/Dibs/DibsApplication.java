package com.imjjh.Dibs;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@EnableJpaAuditing
@SpringBootApplication
public class DibsApplication {

	public static void main(String[] args) {
		SpringApplication.run(DibsApplication.class, args);
	}

}

