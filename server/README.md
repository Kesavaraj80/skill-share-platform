# Skill Share Platform API Documentation

This document provides a comprehensive overview of all available APIs in the Skill Share Platform.

## Base URL

```
http://localhost:8000/api/v1
```

## Authentication

Most endpoints require authentication using a Bearer token. Include the token in the Authorization header:

```
Authorization: Bearer <your_token>
```

## API Endpoints

### Authentication

#### Login

- **POST** `/auth/login`
- **Body:**
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Response:** Returns access token and user data

#### Get Current User

- **GET** `/auth/me`
- **Response:** Returns current user data

### Users

#### Create User

- **POST** `/user`
- **Body:**
  ```json
  {
    "email": "string",
    "password": "string",
    "firstName": "string",
    "lastName": "string",
    "mobileNumber": "string",
    "streetNumber": "string",
    "streetName": "string",
    "city": "string",
    "state": "string",
    "postCode": "string"
  }
  ```

### Providers

#### Create Provider

- **POST** `/providers`
- **Body:**
  ```json
  {
    "email": "string",
    "password": "string",
    "firstName": "string",
    "lastName": "string",
    "mobileNumber": "string",
    "streetNumber": "string",
    "streetName": "string",
    "city": "string",
    "state": "string",
    "postCode": "string",
    "providerType": "string",
    "role": "PROVIDER",
    "companyName": "string",
    "businessTaxNumber": "string"
  }
  ```

### Tasks

#### Create Task

- **POST** `/tasks`
- **Body:**
  ```json
  {
    "name": "string",
    "category": "string",
    "description": "string",
    "expectedStartDate": "string",
    "expectedHours": "string",
    "hourlyRate": "string",
    "currency": "USD" | "AUD" | "SGD" | "INR"
  }
  ```

#### Get All Tasks

- **GET** `/tasks`

#### Get Tasks by User

- **GET** `/tasks/user/:userId`

#### Get Tasks by Provider

- **GET** `/tasks/provider/:providerId`

#### Update Task

- **PUT** `/tasks/:id`
- **Body:** Same as create task

#### Update Task Progress

- **POST** `/tasks/:id/progress`
- **Body:**
  ```json
  {
    "description": "string",
    "hoursSpent": "number"
  }
  ```

#### Mark Task as Completed

- **POST** `/tasks/provider/:taskId/complete`

#### Accept Task Completion

- **POST** `/tasks/:taskId/accept`

#### Reject Task Completion

- **POST** `/tasks/:taskId/reject`

### Skills

#### Create Skill

- **POST** `/skills`
- **Body:**
  ```json
  {
    "name": "string",
    "category": "string",
    "description": "string",
    "level": "string"
  }
  ```

#### Get Skills by Provider

- **GET** `/skills/provider/:providerId`

#### Update Skill

- **PUT** `/skills/:id`
- **Body:** Same as create skill

#### Delete Skill

- **DELETE** `/skills/:id`

### Offers

#### Create Offer

- **POST** `/offers`
- **Body:**
  ```json
  {
    "taskId": "string",
    "hourlyRate": "string",
    "currency": "USD" | "AUD" | "SGD" | "INR"
  }
  ```

#### Get Offer by ID

- **GET** `/offers/:id`

#### Get Offers by Task

- **GET** `/offers/task/:taskId`

#### Get Offers by Provider

- **GET** `/offers/provider/:providerId`

#### Accept Offer

- **POST** `/offers/:id/accept`

#### Reject Offer

- **POST** `/offers/:id/reject`

## Response Format

All API responses follow a standard format:

```json
{
  "success": true,
  "data": {
    // Response data
  }
}
```

## Error Handling

Errors are returned with appropriate HTTP status codes and a message:

```json
{
  "success": false,
  "message": "Error message"
}
```

## Rate Limiting

API requests are subject to rate limiting. Please contact the administrator for specific limits.

## Support

For any API-related issues or questions, please contact the platform administrator.
