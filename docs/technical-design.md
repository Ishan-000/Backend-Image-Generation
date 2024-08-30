# Technical Design Document

## System Overview

The Image Processing System is designed to handle the asynchronous processing of image data submitted via CSV files. It provides RESTful APIs for file upload and status checking, with a focus on scalability and reliability.

## Architecture

The system follows a modular architecture with the following key components:

1. API Server (Express.js)
2. CSV Validator
3. Request Manager
4. Image Processor
5. Database (PostgreSQL)
6. S3 Storage
7. Webhook Service

### Component Interactions

1. The API Server receives CSV file uploads and status check requests.
2. CSV Validator ensures the uploaded file meets the required format.
3. Request Manager creates and manages processing requests in the database.
4. Image Processor handles the asynchronous processing of images.
5. S3 Storage is used to store processed images.
6. Webhook Service notifies external systems upon completion of processing.

## Data Flow

1. Client uploads a CSV file via the Upload API.
2. CSV is validated and a unique request ID is returned to the client.
3. Request details are stored in the database.
4. Image processing starts asynchronously.
5. Client can check processing status using the Status API.
6. Upon completion, a webhook is triggered (if configured).
7. An output CSV is generated with processed image URLs.

## Database Schema

```sql
CREATE TABLE requests (
    id SERIAL PRIMARY KEY,
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    request_id INTEGER NOT NULL REFERENCES requests(id),
    serial_number INTEGER NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE images (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES products(id),
    input_url TEXT NOT NULL,
    output_url TEXT,
    processing_status VARCHAR(20) NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE webhooks (
    id SERIAL PRIMARY KEY,
    url TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

## Security Considerations

- JWT authentication for API access
- Rate limiting to prevent abuse
- HTTPS for all communications
- Secure storage of sensitive information (e.g., AWS credentials) using environment variables

## Scalability

- Asynchronous processing allows for easy scaling of the image processing component
- Database connection pooling for efficient resource utilization
- Potential for horizontal scaling by adding more processing nodes

## Error Handling and Logging

- Comprehensive error handling throughout the application
- Centralized logging using Winston for easy debugging and monitoring

## Future Improvements

- Implement a job queue system (e.g., Redis) for more robust asynchronous processing
- Add support for different image processing operations
- Implement user management and multi-tenancy
- Add more comprehensive monitoring and alerting
