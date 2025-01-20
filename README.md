# File Parser QA Application

This repository contains a powerful application that allows users to upload files or provide Google Drive links and extract answers strictly based on the content of those files using OpenAI API.

## Features

- **User Authentication**:
  - Users can register and log in using their email.

- **File Upload & Parsing**:
  - Supports major file formats, including:
    - `.pdf`, `.txt`, `.docx`, `.xlsx`, `.csv`, `.json`, `.html`, `.xml`, `.jpg`, `.jpeg`, `.png`.
  - Users can upload multiple files simultaneously.
  - Users can switch between currently uploaded files and previously uploaded files.

- **Efficient Parsing**:
  - Extracts accurate answers from the file content.
  - Provides the context of the answer, specifying where in the file the answer is located.

- **Question History**:
  - Maintains a history of user questions and answers for future reference.

- **Seamless Integration**:
  - Allows users to provide Google Drive links for file access.

## Prerequisites

- **Instructions for running the application locally
  -cd server
  -npm install
  -npm run dev

  -cd ../frontend
  -npm install
  -npm start

## Challenges Faced During Development
-API Rate Limits:

-Using OpenAI API heavily can result in rate limits being exceeded.
-To mitigate this, multiple API keys can be used in a rotation strategy.
-Performance on Free Cloud Servers:

-The deployed application may experience slower performance due to limited resources.
-Upgrading to a paid cloud service with higher CPU capacity can enhance performance.

## Environment Variables

Create a `.env` file in the root directory and include the following variables:
```plaintext
MONGO_URI=your_mongo_database_uri
OPENAI_API_KEY=your_openai_api_key
JWT_SECRET=your_jwt_secret_key


