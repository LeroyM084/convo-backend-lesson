# Bruno Testing Guide - Notes Backend API

## Overview

This Bruno collection provides complete API testing for the Notes Backend with automatic token management for protected routes.

## Setup

### 1. Prerequisites
- Start the backend server on `http://localhost:4000`
- Have [Bruno CLI](https://www.usebruno.com/) installed or use the Bruno GUI

### 2. Environment Configuration
The environment file is located at: `bruno_files/environments/local.bru`

Variables defined:
- `base_url`: http://localhost:4000
- `access_token`: Automatically populated after login
- `refresh_token`: Automatically populated after login

## Testing Workflow

### Step 1: Health Check (Optional)
**Request:** Health/1_Health_Check.bru
```
GET /
```
Verify the backend is running.

### Step 2: Authentication Flow

#### Register a New User
**Request:** Auth/1_Register.bru
```
POST /auth/register
```
**Body:**
```json
{
  "email": "testuser@example.com",
  "password": "TestPassword123!",
  "username": "testuser"
}
```
**Response:** Returns `true` on success

**Note:** You need a strong password (uppercase, lowercase, numbers, special characters)

#### Login to Get Token
**Request:** Auth/2_Login.bru
```
POST /auth/login
```
**Body:**
```json
{
  "email": "testuser@example.com",
  "password": "TestPassword123!"
}
```
**Response:** Returns tokens
```json
{
  "acces_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Important:** The post-response script automatically saves the `acces_token` to the environment, so it's available for all protected routes.

### Step 3: Test Protected Conversation Endpoints

#### Create a Conversation
**Request:** Conversation/1_Create_Conversation.bru
```
POST /conversation
Authorization: Bearer {{access_token}}
```
**Body:**
```json
{
  "title": "My First Conversation"
}
```

#### Get All Conversations
**Request:** Conversation/2_Get_All_Conversations.bru
```
GET /conversation
Authorization: Bearer {{access_token}}
```

#### Get Conversation by ID
**Request:** Conversation/3_Get_Conversation_By_ID.bru
```
GET /conversation/:id
Authorization: Bearer {{access_token}}
```

#### Update Conversation
**Request:** Conversation/4_Update_Conversation.bru
```
PUT /conversation
Authorization: Bearer {{access_token}}
```
**Body:**
```json
{
  "id": "1",
  "title": "Updated Title"
}
```

### Step 4: Test Protected Message Endpoints

#### Send Message
**Request:** Message/1_Send_Message.bru
```
POST /message/send
Authorization: Bearer {{access_token}}
```
**Body:**
```json
{
  "content": "Hello, this is my first message!",
  "conversationId": "1"
}
```

#### Get Conversation Messages
**Request:** Message/2_Get_Conversation_Messages.bru
```
GET /message/conversation/:conversationId
Authorization: Bearer {{access_token}}
```

### Step 5: Test Profile Endpoints

#### Get Profile
**Request:** Profile/1_Get_Profile.bru
```
GET /profile/:id
```

#### Update My Profile (Protected)
**Request:** Profile/2_Update_My_Profile.bru
```
PUT /profile/me
Authorization: Bearer {{access_token}}
```
**Body:**
```json
{
  "username": "updatedusername"
}
```

### Step 6: Test Resource Endpoints

#### Get Groupe Messages
**Request:** Resource/1_Get_Groupe_Messages.bru
```
GET /groupe/:id
```

## Token Management

### How It Works

1. When you run the **Login** request (Auth/2_Login.bru), the response contains `acces_token` and `refresh_token`
2. The post-response script automatically captures the `acces_token`:
   ```javascript
   bru.setEnvVar("access_token", body.acces_token);
   ```
3. All protected routes use `Authorization: Bearer {{access_token}}` header
4. The `{{access_token}}` is automatically replaced with the saved token value

### Manual Token Management

If you need to manually set the token:
1. Copy the `acces_token` from the login response
2. Open `environments/local.bru`
3. Set: `access_token: <your_token>`

### Token Expiration

If requests start returning 401 Unauthorized:
- The token has likely expired
- Run the **Login** request again to get a new token
- The environment variable will be automatically updated

## API Endpoint Summary

| Method | Endpoint | Auth | Status |
|--------|----------|------|--------|
| GET | / | No | Health Check |
| POST | /auth/register | No | Register |
| POST | /auth/login | No | Login |
| POST | /conversation | Yes | Create |
| GET | /conversation | Yes | Get All |
| GET | /conversation/:id | Yes | Get One |
| PUT | /conversation | Yes | Update |
| POST | /message/send | Yes | Send |
| GET | /message/conversation/:id | Yes | Get Messages |
| GET | /profile/:id | No | View |
| PUT | /profile/me | Yes | Update |
| GET | /groupe/:id | No | View |

## Testing Best Practices

1. **Start with Registration**: Register a new test user
2. **Then Login**: Log in to get tokens
3. **Create Resources First**: Create conversations before sending messages
4. **Use Valid IDs**: Update parameters with actual IDs from previous responses
5. **Check Tests**: Each request includes test assertions - check the test results

## Troubleshooting

### 401 Unauthorized on Protected Routes
- **Issue**: Token not being set
- **Solution**: Make sure you ran the Login request and checked the environment variables

### 400 Bad Request
- **Issue**: Invalid request body
- **Solution**: Check the JSON body format matches the DTOs
- **Common**: Ensure passwords meet strength requirements (uppercase, lowercase, numbers, special chars)

### 404 Not Found
- **Issue**: Resource doesn't exist
- **Solution**: Use valid IDs from previous responses

### Email Already in Use
- **Issue**: User with that email already exists
- **Solution**: Use a different email or delete the user from the database

## Collection Structure

```
bruno_files/
├── environments/
│   └── local.bru              # Environment variables with token storage
├── Health/
│   └── 1_Health_Check.bru     # API health check
├── Auth/
│   ├── 1_Register.bru         # User registration
│   └── 2_Login.bru            # User login (sets token)
├── Conversation/
│   ├── 1_Create_Conversation.bru
│   ├── 2_Get_All_Conversations.bru
│   ├── 3_Get_Conversation_By_ID.bru
│   └── 4_Update_Conversation.bru
├── Message/
│   ├── 1_Send_Message.bru
│   └── 2_Get_Conversation_Messages.bru
├── Profile/
│   ├── 1_Get_Profile.bru
│   └── 2_Update_My_Profile.bru
└── Resource/
    └── 1_Get_Groupe_Messages.bru
```

## Running Tests via CLI

### Run all tests in the collection
```bash
bruno run bruno_files/ --env environments/local.bru
```

### Run specific folder tests
```bash
bruno run bruno_files/Auth/ --env environments/local.bru
```

### Run specific test
```bash
bruno run bruno_files/Auth/2_Login.bru --env environments/local.bru
```

## Example Testing Session

```bash
# 1. Start your backend
npm run start:dev

# 2. Run registration
bruno run bruno_files/Auth/1_Register.bru --env environments/local.bru

# 3. Run login (this sets the token)
bruno run bruno_files/Auth/2_Login.bru --env environments/local.bru

# 4. Run protected conversation endpoints
bruno run bruno_files/Conversation/ --env environments/local.bru

# 5. Run message endpoints
bruno run bruno_files/Message/ --env environments/local.bru
```

## Notes

- All timestamps are in UTC timezone (Z)
- Email validation is enabled (must be valid email format)
- Password must be strong (uppercase, lowercase, numbers, symbols)
- Bearer token format: `Authorization: Bearer <token>`

