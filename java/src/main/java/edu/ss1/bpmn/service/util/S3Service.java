package edu.ss1.bpmn.service.util;

import static software.amazon.awssdk.core.sync.RequestBody.fromInputStream;

import java.io.IOException;
import java.io.InputStream;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import edu.ss1.bpmn.config.property.AwsS3Property;
import edu.ss1.bpmn.domain.exception.BadRequestException;
import lombok.RequiredArgsConstructor;
import software.amazon.awssdk.services.s3.S3Client;

@Service
@RequiredArgsConstructor
public class S3Service {

    private final S3Client s3Client;
    private final AwsS3Property s3;

    public String store(String filename, InputStream inputStream, String contentType, long contentLength) {
        s3Client.putObject(
                builder -> builder.bucket(s3.bucketName())
                        .key(filename)
                        .contentType(contentType)
                        .contentLength(contentLength),
                fromInputStream(inputStream, contentLength));

        return loadUrl(filename);
    }

    public String store(String filename, MultipartFile file) {
        if (file.isEmpty()) {
            throw new BadRequestException("The file must have any content.");
        }

        filename = filename + "." + file.getContentType().split("/")[1];
        try {
            return store(filename, file.getInputStream(), file.getContentType(), file.getSize());
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public String store(MultipartFile file) {
        String filename = file.getOriginalFilename();
        return store(filename, file);
    }

    public String loadUrl(String filename) {
        return s3Client.utilities()
                .getUrl(builder -> builder.bucket(s3.bucketName()).key(filename))
                .toExternalForm();
    }

    public void delete(String filename) {
        s3Client.deleteObject(builder -> builder.bucket(s3.bucketName()).key(filename));
    }
}