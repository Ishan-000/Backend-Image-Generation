# Image Processing System API Documentation

## Authentication

### Login
- **URL**: `/api/auth/login`
- **Method**: `POST`
- **Description**: Authenticate a user and receive a JWT token.
- **Request Body**:
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```
- **Success Response**:
  - **Code**: 200
  - **Content**: 
    ```json
    {
      "token": "string"
    }
    ```
- **Error Response**:
  - **Code**: 401 UNAUTHORIZED
  - **Content**: 
    ```json
    {
      "error": "Invalid username or password"
    }
    ```

## Image Processing

### Upload CSV
- **URL**: `/api/upload`
- **Method**: `POST`
- **Description**: Upload a CSV file containing image URLs for processing.
- **Authentication**: Required (Bearer Token)
- **Request**:
  - **Content-Type**: `multipart/form-data`
  - **Body**:
    - `csvFile`: CSV file
- **Success Response**:
  - **Code**: 200
  - **Content**: 
    ```json
    {
      "requestId": "string"
    }
    ```
- **Error Response**:
  - **Code**: 400 BAD REQUEST
  - **Content**: 
    ```json
    {
      "error": "string"
    }
    ```
  - **Code**: 401 UNAUTHORIZED
  - **Content**: 
    ```json
    {
      "error": "No token provided"
    }
    ```

### Check Status
- **URL**: `/api/status/:requestId`
- **Method**: `GET`
- **Description**: Check the status of a processing request.
- **Authentication**: Required (Bearer Token)
- **URL Parameters**:
  - `requestId`: ID of the processing request
- **Success Response**:
  - **Code**: 200
  - **Content**: 
    ```json
    {
      "request_status": "string",
      "processed_images": "number",
      "total_images": "number"
    }
    ```
- **Error Response**:
  - **Code**: 404 NOT FOUND
  - **Content**: 
    ```json
    {
      "error": "Request not found"
    }
    ```
  - **Code**: 401 UNAUTHORIZED
  - **Content**: 
    ```json
    {
      "error": "No token provided"
    }
    ```

## General Notes

1. All API endpoints (except `/api/auth/login`) require authentication using a JWT token.
2. The JWT token should be included in the `Authorization` header as a Bearer token:
   ```
   Authorization: Bearer <your_token_here>
   ```
3. Tokens are valid for 1 hour after issuance.
4. The system uses webhook notifications to inform about completed processing requests. The webhook URL should be provided during the initial setup.
5. After processing is complete, an output CSV file is generated with the processed image URLs.

## Error Handling

- All endpoints may return a 500 INTERNAL SERVER ERROR if an unexpected error occurs during processing.
- Invalid tokens will result in a 401 UNAUTHORIZED response.

## Rate Limiting

The API implements rate limiting to prevent abuse. Clients are limited to 100 requests per 15-minute window.

## Security

- All endpoints use HTTPS to encrypt data in transit.
- Passwords are hashed using bcrypt before storage.
- JWT tokens are signed with a secret key to prevent tampering.

For any additional information or support, please contact the system administrators.
