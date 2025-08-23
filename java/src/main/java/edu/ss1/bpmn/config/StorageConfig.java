package edu.ss1.bpmn.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import edu.ss1.bpmn.config.property.AwsS3Property;

import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;

@Configuration
public class StorageConfig {

    @Bean
    S3Client s3Client(AwsS3Property s3) {
        return S3Client.builder()
                .region(Region.of(s3.region()))
                .credentialsProvider(StaticCredentialsProvider
                        .create(AwsBasicCredentials.create(s3.accessKey(), s3.secretKey())))
                .forcePathStyle(true)
                .build();
    }
}
