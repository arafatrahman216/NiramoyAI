# NiramoyAI API Documentation

This document provides comprehensive information about the NiramoyAI backend API endpoints, including authentication, user management, and admin functionality.

## Base URL
```
http://localhost:8080/api
```

## Authentication Endpoints

### 1. User Registration

**Endpoint:** `POST /auth/register`

**Description:** Register a new user account.

**Request Body:**
```json
{
    "username": "testuser",
    "email": "test@example.com", 
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe",
    "phoneNumber": "1234567890" // optional
}
```

**Success Response (200):**
```json
{
    "success": true,
    "message": "User registered successfully",
    "user": {
        "id": 1,
        "username": "testuser",
        "email": "test@example.com",
        "firstName": "John",
        "lastName": "Doe",
        "phoneNumber": "1234567890",
        "status": "ACTIVE",
        "roles": ["ROLE_USER"],
        "createdAt": "2025-07-30T00:48:01.614897",
        "lastLogin": null
    }
}
```

**Error Response (400):**
```json
{
    "success": false,
    "message": "Username already exists"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

### 2. User Login

**Endpoint:** `POST /auth/login`

**Description:** Authenticate user and login.

**Request Body:**
```json
{
    "username": "testuser", // can be username or email
    "password": "password123"
}
```

**Success Response (200):**
```json
{
    "success": true,
    "message": "Login successful",
    "user": {
        "id": 1,
        "username": "testuser",
        "email": "test@example.com",
        "firstName": "John",
        "lastName": "Doe",
        "phoneNumber": "1234567890",
        "status": "ACTIVE",
        "roles": ["ROLE_USER"],
        "createdAt": "2025-07-30T00:48:01.614897",
        "lastLogin": "2025-07-30T00:48:30.123456"
    }
}
```

**Error Response (400):**
```json
{
    "success": false,
    "message": "Invalid username/email or password"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "password123"
  }'
```

### 3. Admin Registration

**Endpoint:** `POST /auth/admin/register`

**Description:** Register a new admin account (requires admin key).

**Request Body:**
```json
{
    "username": "admin",
    "email": "admin@example.com",
    "password": "admin123",
    "firstName": "Admin",
    "lastName": "User",
    "phoneNumber": "9876543210", // optional
    "adminKey": "admin123"
}
```

**Success Response (200):**
```json
{
    "success": true,
    "message": "Admin registered successfully",
    "user": {
        "id": 2,
        "username": "admin",
        "email": "admin@example.com",
        "firstName": "Admin",
        "lastName": "User",
        "phoneNumber": "9876543210",
        "status": "ACTIVE",
        "roles": ["ROLE_ADMIN"],
        "createdAt": "2025-07-30T00:48:10.281113",
        "lastLogin": null
    }
}
```

**Error Response (400):**
```json
{
    "success": false,
    "message": "Invalid admin key"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:8080/api/auth/admin/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "admin@example.com",
    "password": "admin123",
    "firstName": "Admin",
    "lastName": "User",
    "adminKey": "admin123"
  }'
```

## Admin Management Endpoints

### 4. Get All Users

**Endpoint:** `GET /admin/users`

**Description:** Retrieve all registered users (Admin only).

**Success Response (200):**
```json
{
    "success": true,
    "total": 2,
    "users": [
        {
            "id": 1,
            "username": "testuser",
            "email": "test@example.com",
            "firstName": "John",
            "lastName": "Doe",
            "phoneNumber": "1234567890",
            "status": "ACTIVE",
            "roles": ["ROLE_USER"],
            "createdAt": "2025-07-30T00:48:01.614897",
            "lastLogin": "2025-07-30T00:48:30.123456"
        },
        {
            "id": 2,
            "username": "admin",
            "email": "admin@example.com",
            "firstName": "Admin",
            "lastName": "User",
            "phoneNumber": null,
            "status": "ACTIVE",
            "roles": ["ROLE_ADMIN"],
            "createdAt": "2025-07-30T00:48:10.281113",
            "lastLogin": null
        }
    ]
}
```

**cURL Example:**
```bash
curl -X GET http://localhost:8080/api/admin/users
```

### 5. Get User by ID

**Endpoint:** `GET /admin/users/{id}`

**Description:** Retrieve a specific user by ID.

**Path Parameters:**
- `id` (integer): User ID

**Success Response (200):**
```json
{
    "success": true,
    "user": {
        "id": 1,
        "username": "testuser",
        "email": "test@example.com",
        "firstName": "John",
        "lastName": "Doe",
        "phoneNumber": "1234567890",
        "status": "ACTIVE",
        "roles": ["ROLE_USER"],
        "createdAt": "2025-07-30T00:48:01.614897",
        "lastLogin": "2025-07-30T00:48:30.123456"
    }
}
```

**Error Response (404):**
```json
{
    "success": false,
    "message": "User not found"
}
```

**cURL Example:**
```bash
curl -X GET http://localhost:8080/api/admin/users/1
```

### 6. Delete User

**Endpoint:** `DELETE /admin/users/{id}`

**Description:** Delete a user account.

**Path Parameters:**
- `id` (integer): User ID

**Success Response (200):**
```json
{
    "success": true,
    "message": "User deleted successfully"
}
```

**Error Response (404):**
```json
{
    "success": false,
    "message": "User not found"
}
```

**cURL Example:**
```bash
curl -X DELETE http://localhost:8080/api/admin/users/1
```

### 7. Update User Status

**Endpoint:** `PUT /admin/users/{id}/status`

**Description:** Update a user's status.

**Path Parameters:**
- `id` (integer): User ID

**Request Body:**
```json
{
    "status": "SUSPENDED"
}
```

**Valid Status Values:**
- `ACTIVE`
- `INACTIVE` 
- `SUSPENDED`
- `PENDING_VERIFICATION`

**Success Response (200):**
```json
{
    "success": true,
    "message": "User status updated successfully",
    "username": "testuser",
    "newStatus": "SUSPENDED"
}
```

**Error Response (400):**
```json
{
    "success": false,
    "message": "Invalid status. Valid values: ACTIVE, INACTIVE, SUSPENDED, PENDING_VERIFICATION"
}
```

**cURL Example:**
```bash
curl -X PUT http://localhost:8080/api/admin/users/1/status \
  -H "Content-Type: application/json" \
  -d '{
    "status": "SUSPENDED"
  }'
```

### 8. Add Role to User

**Endpoint:** `POST /admin/users/{id}/roles`

**Description:** Add a role to an existing user.

**Path Parameters:**
- `id` (integer): User ID

**Request Body:**
```json
{
    "roleName": "ROLE_ADMIN"
}
```

**Valid Role Values:**
- `ROLE_USER`
- `ROLE_ADMIN`
- `ROLE_SUPER_ADMIN`

**Success Response (200):**
```json
{
    "success": true,
    "message": "Role added to user successfully",
    "username": "testuser",
    "roleName": "ROLE_ADMIN"
}
```

**Error Response (400):**
```json
{
    "success": false,
    "message": "User already has this role"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:8080/api/admin/users/1/roles \
  -H "Content-Type: application/json" \
  -d '{
    "roleName": "ROLE_ADMIN"
  }'
```

### 9. Get System Statistics

**Endpoint:** `GET /admin/stats`

**Description:** Get system-wide user statistics.

**Success Response (200):**
```json
{
    "success": true,
    "totalUsers": 2,
    "userCount": 1,
    "adminCount": 1,
    "superAdminCount": 0
}
```

**cURL Example:**
```bash
curl -X GET http://localhost:8080/api/admin/stats
```

## Task Management Endpoints

### 10. Get All Tasks

**Endpoint:** `GET /tasks`

**Description:** Retrieve all tasks.

**Success Response (200):**
```json
[
    {
        "id": 1,
        "title": "Sample Task",
        "completed": false
    }
]
```

**cURL Example:**
```bash
curl -X GET http://localhost:8080/api/tasks
```

### 11. Create Task

**Endpoint:** `POST /tasks`

**Description:** Create a new task.

**Request Body:**
```json
{
    "title": "New Task",
    "completed": false
}
```

**Success Response (200):**
```json
{
    "id": 1,
    "title": "New Task",
    "completed": false
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:8080/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "New Task",
    "completed": false
  }'
```

### 12. Update Task

**Endpoint:** `PUT /tasks/{id}`

**Description:** Update an existing task.

**Path Parameters:**
- `id` (integer): Task ID

**Request Body:**
```json
{
    "title": "Updated Task",
    "completed": true
}
```

**Success Response (200):**
```json
{
    "id": 1,
    "title": "Updated Task",
    "completed": true
}
```

**cURL Example:**
```bash
curl -X PUT http://localhost:8080/api/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Task",
    "completed": true
  }'
```

### 13. Delete Task

**Endpoint:** `DELETE /tasks/{id}`

**Description:** Delete a task.

**Path Parameters:**
- `id` (integer): Task ID

**Success Response (200):** Empty response

**cURL Example:**
```bash
curl -X DELETE http://localhost:8080/api/tasks/1
```

## Error Handling

The API uses standard HTTP status codes and returns error responses in JSON format:

**Common Error Response Structure:**
```json
{
    "success": false,
    "message": "Error description"
}
```

**HTTP Status Codes:**
- `200 OK`: Request successful
- `400 Bad Request`: Invalid request data
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

## Data Models

### User Model
```json
{
    "id": "integer",
    "username": "string (unique, max 50 chars)",
    "email": "string (unique, max 100 chars)",
    "firstName": "string (max 50 chars)",
    "lastName": "string (max 50 chars)",
    "phoneNumber": "string (optional, max 15 chars)",
    "status": "enum (ACTIVE, INACTIVE, SUSPENDED, PENDING_VERIFICATION)",
    "roles": ["array of role names"],
    "createdAt": "datetime",
    "lastLogin": "datetime (nullable)"
}
```

### Task Model
```json
{
    "id": "integer",
    "title": "string",
    "completed": "boolean"
}
```

## Security Notes

1. **Admin Key**: Currently set to `admin123` for testing. Change this in production.
2. **Password Storage**: Passwords are stored in plain text. Implement bcrypt hashing for production.
3. **Authentication**: No JWT or session management implemented yet. Add proper authentication for production.
4. **Rate Limiting**: No rate limiting implemented. Consider adding rate limiting for production.
5. **Input Validation**: Basic validation is implemented. Add more comprehensive validation as needed.

## Database

The application uses PostgreSQL (Supabase) database. The database schema includes:
- `users` table with user information
- `roles` table with role definitions  
- `user_roles` junction table for many-to-many user-role relationships
- `task` table for task management

**Database Configuration:**
- Host: `db.caybpletpctedkylptmh.supabase.co`
- Port: `5432`
- Database: `postgres`
- Schema: Matches the provided `db.sql` structure

## Running the Application

1. Build the application:
```bash
mvn clean package -DskipTests
```

2. Run the application:
```bash
java -jar target/NiramoyAI-0.0.1-SNAPSHOT.jar
```

The application will start on `http://localhost:8080`

## Testing the APIs

You can test the APIs using the provided cURL examples or tools like Postman. The application automatically creates default roles (ROLE_USER, ROLE_ADMIN, ROLE_SUPER_ADMIN) on startup.
