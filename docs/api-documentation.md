# API Documentation

## Upload API

**Endpoint:** `POST /upload`

**Description:** Accepts a CSV file, validates its format, and initiates the image processing.

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Body:
  - csvFile: The CSV file to be processed (file upload)

**Response:**
- Status: 200 OK
- Body: 
  ```json
  {
    "requestId": "string"
  }
  ```

**Error Responses:**
- 400 Bad Request: If the CSV file is invalid or missing
- 401 Unauthorized: If the authentication token is missing or invalid

## Status API

**Endpoint:** `GET /status/:requestId`

**Description:** Retrieves the current status of a processing request.

**Request:**
- Method: GET
- Parameters:
  - requestId: The unique identifier returned by the Upload API

**Response:**
- Status: 200 OK
- Body:
  ```json
  {
    "request_status": "string",
    "processed_images": "number",
    "total_images": "number"
  }
  ```

**Error Responses:**
- 404 Not Found: If the requestId is not found
- 401 Unauthorized: If the authentication token is missing or invalid

