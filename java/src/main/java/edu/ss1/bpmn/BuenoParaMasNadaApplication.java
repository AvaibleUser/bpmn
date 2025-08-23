package edu.ss1.bpmn;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;
import org.springframework.context.annotation.PropertySource;

@SpringBootApplication
@ConfigurationPropertiesScan
@PropertySource("file:${user.dir}/.env")
public class BuenoParaMasNadaApplication {

    public static void main(String[] args) {
        SpringApplication.run(BuenoParaMasNadaApplication.class, args);
    }

}
