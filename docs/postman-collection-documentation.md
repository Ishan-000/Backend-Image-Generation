# Image Processing System API Postman Collection Documentation

This document provides instructions on how to use the Postman collection for interacting with the Image Processing System API.

## Table of Contents
1. [Setup](#setup)
2. [Environment Variables](#environment-variables)
3. [Requests](#requests)
   - [Login](#login)
   - [Upload CSV](#upload-csv)
   - [Check Status](#check-status)
4. [Using the Collection](#using-the-collection)
5. [Troubleshooting](#troubleshooting)

## Setup

1. Open Postman and import the "Image Processing System API" collection.
2. Ensure you have the correct environment selected in the top-right corner dropdown.

## Environment Variables

The collection uses the following environment variables:

- `authToken`: Stores the JWT token received after successful login.
- `requestId`: Stores the ID of the most recent upload request.

These variables are automatically set and updated as you use the collection.

## Requests

### Login

- **Method**: POST
- **URL**: `http://localhost:3000/api/login`
- **Body**: Raw JSON
  ```json
  {
    "username": "testuser",
    "password": "yourpassword"
  }
  ```
- **Tests**: Automatically sets the `authToken` environment variable.

### Upload CSV

- **Method**: POST
- **URL**: `http://localhost:3000/api/upload`
- **Headers**: 
  - Authorization: `Bearer {{authToken}}`
- **Body**: form-data
  - Key: `csvFile`
  - Value: [Select CSV File]
- **Tests**: Automatically sets the `requestId` environment variable.

### Check Status

- **Method**: GET
- **URL**: `http://localhost:3000/api/status/{{requestId}}`
- **Headers**:
  - Authorization: `Bearer {{authToken}}`

## Using the Collection

1. **Login**:
   - Update the username and password in the request body.
   - Send the request.
   - The `authToken` will be automatically saved.

2. **Upload CSV**:
   - Ensure you have a valid CSV file to upload.
   - Send the request.
   - The `requestId` will be automatically saved.

3. **Check Status**:
   - Send the request to check the status of your most recent upload.
   - The saved `requestId` will be used automatically.

## Troubleshooting

- If you receive a 401 Unauthorized error, your token may have expired. Re-run the Login request to obtain a new token.
- Ensure your environment is selected before running requests.
- If the CSV upload fails, check that your file is properly formatted and contains valid image URLs.
- For any other issues, check the API's error response for specific details.

Remember to update the base URL (`http://localhost:3000`) if your API is hosted on a different server or port.
