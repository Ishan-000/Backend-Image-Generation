# Image Processing System

## Table of Contents
1. [Overview](#overview)
2. [Features](#features)
3. [System Architecture](#system-architecture)
4. [Getting Started](#getting-started)
   - [Prerequisites](#prerequisites)
   - [Installation](#installation)
   - [Configuration](#configuration)
5. [API Documentation](#api-documentation)
6. [Using the Postman Collection](#using-the-postman-collection)
7. [Testing](#testing)
8. [Deployment](#deployment)
9. [Contributing](#contributing)
10. [License](#license)

## Overview

The Image Processing System is a robust Node.js application designed to efficiently process image data from CSV files. It provides a secure API for uploading CSV files containing image URLs, processing these images asynchronously, and retrieving the status of processing requests.

## Features

- Secure user authentication using JWT
- CSV file upload and validation
- Asynchronous image processing
- Image compression and storage in AWS S3
- Status checking API
- Webhook notifications for completed processes
- Output CSV generation with processed image URLs
- Rate limiting to prevent API abuse
- Comprehensive error handling and logging

## System Architecture

The system is built using a modular architecture:

- Express.js for the web server and routing
- PostgreSQL for data storage
- AWS S3 for image storage
- Sharp for image processing
- Winston for logging
- JWT for authentication

For a visual representation, see `docs/system-diagram.mermaid`.

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- PostgreSQL
- AWS account with S3 access

### Installation

1. Clone the repository

2. Install dependencies:
   ```
   cd image-processing-system
   npm install
   ```

### Configuration

1. Create a `.env` file in the root directory with the following variables:
   ```
PORT=3000

DB_USER=your_db_user
DB_HOST=localhost
DB_NAME=your_db_name
DB_PASSWORD=your_db_password
DB_PORT=5432

AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
AWS_REGION=your_aws_region
S3_BUCKET=your_s3_bucket_name

JWT_SECRET=your_jwt_secret

WEBHOOK_SECRET=your_webhook_secret

   ```

2. Set up the database schema (can find in teachincal design) (provide instructions or SQL scripts)

## API Documentation

For detailed API documentation, see `docs/api-documentation.md`.

Key endpoints:
- POST `/api/auth/login`: Authenticate and receive a JWT token
- POST `/api/upload`: Upload a CSV file for processing
- GET `/api/status/:requestId`: Check the status of a processing request

All endpoints except `/api/auth/login` require authentication via JWT token.

## Using the Postman Collection

A Postman collection is available for testing the API. To use it:

1. Import the collection into Postman
2. Set up the environment variables:
   - `authToken`: JWT token received after login
   - `requestId`: ID of the most recent upload request
3. Use the collection to interact with the API

For detailed instructions, see `docs/postman-collection-documentation.md`.

## Technical design documentation

See `docs/technical-design.md` for detailed technical design documentation.

## Asynchronous Worker Documentation

See `docs/async-worker-docs.md` for detailed asynchronous worker documentation.

## Testing

Run the test suite with:
```
npm test
```

This will run both unit and integration tests.

## Deployment

1. Ensure all environment variables are properly set
2. Build the project:
   ```
   npm run build
   ```
3. Start the server:
   ```
   npm start
   ```

For production deployment, consider using a process manager like PM2.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Please ensure to update tests as appropriate and adhere to the existing coding style.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.
