package edu.ss1.bpmn.config.property;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties("aws.s3")
public record AwsS3Property(
        String region,
        String bucketName,
        String accessKey,
        String secretKey) {
}