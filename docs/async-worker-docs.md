# Asynchronous Worker Documentation

The main asynchronous processing is handled in the `imageProcessor.js` file. Here's an overview of the key functions:

## processRequest(requestId)

This is the main entry point for processing a request. It:
1. Retrieves all images associated with the request from the database.
2. Processes each image asynchronously.
3. Updates the request status to 'COMPLETED' when all images are processed.
4. Triggers a webhook (if configured).
5. Generates an output CSV file.

## processImage(image)

This function processes a single image. It:
1. Downloads the image from the input URL.
2. Compresses the image to 50% of its original quality using Sharp.
3. Uploads the compressed image to S3.
4. Updates the image status in the database.

## generateOutputCSV(requestId)

This function generates the output CSV file. It:
1. Retrieves all processed image data for the request from the database.
2. Formats the data according to the specified output format.
3. Writes the data to a CSV file.

Error handling and logging are implemented throughout these functions to ensure robustness and traceability.

