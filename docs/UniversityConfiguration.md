# University Configuration System

This document describes the university configuration system with multi-step verification for high-risk operations.

## Overview

The university configuration system provides a secure interface for managing university settings with different levels of verification based on the risk of the operation.

## Features

### 1. Overview Dashboard

- **Basic Information**: Display university name, slug, and description
- **Statistics**: Show colleges count, total users, and total forms
- **Social Media**: Display configured social media links

### 2. Edit Configuration (Two-Step Verification)

- **Step 1**: Form submission with university data
- **Step 2**: Verification code validation
- **Access**: Available to both ADMIN and SUPERADMIN users

### 3. Delete University (Three-Step Verification)

- **Step 1**: Initiate deletion process and show statistics
- **Step 2**: Verification code validation
- **Step 3**: Final confirmation with exact text match
- **Access**: Only available to SUPERADMIN users

## Security Features

### Authentication

- All routes require Clerk authentication
- User permissions checked against database
- Role-based access control (ADMIN vs SUPERADMIN)

### Verification System

#### Edit Operations (Two-Step)

1. **Request Verification**: User submits form data
2. **Code Generation**: System generates 6-digit verification code
3. **Code Validation**: User enters code to confirm changes
4. **Execution**: Changes applied after successful verification

#### Delete Operations (Three-Step)

1. **Initiation**: User initiates deletion process
2. **Statistics Display**: System shows data that will be deleted
3. **Code Verification**: User enters verification code
4. **Final Confirmation**: User types exact confirmation text
5. **Execution**: Deletion performed in database transaction

### Audit Logging

- All edit and delete operations are logged
- Includes user ID, action type, and metadata
- Stored in `AuditLog` table for compliance

## API Endpoints

### GET `/api/uni`

- **Purpose**: Fetch university data
- **Authentication**: Required
- **Response**: University object with colleges

### POST `/api/uni/edit`

- **Purpose**: Update university configuration
- **Authentication**: Required (ADMIN or SUPERADMIN)
- **Verification**: Two-step process
- **Parameters**:
  - `verificationStep`: "request" | "verify"
  - `verificationCode`: 6-digit code (for verify step)
  - University data fields

### POST `/api/uni/delete`

- **Purpose**: Delete university and all related data
- **Authentication**: Required (SUPERADMIN only)
- **Verification**: Three-step process
- **Parameters**:
  - `verificationStep`: "initiate" | "verify" | "confirm"
  - `verificationCode`: 6-digit code (for verify step)
  - `finalConfirmation`: Exact text match (for confirm step)

## Database Operations

### Edit Operations

- Updates university record
- Validates required fields
- Logs changes in audit log

### Delete Operations

- Performs cascading deletion in transaction:
  1. Delete form submissions
  2. Delete form fields
  3. Delete form sections
  4. Delete sections
  5. Delete college users
  6. Delete colleges
  7. Delete university
- Ensures data consistency
- Logs deletion in audit log

## User Interface

### Navigation

- Located in System section of admin sidebar
- Accessible to ADMIN and SUPERADMIN users
- Icon: Building2

### Tabs

1. **Overview**: Display current configuration and statistics
2. **Edit Configuration**: Form for updating university settings
3. **Danger Zone**: Delete operations (SUPERADMIN only)

### Responsive Design

- Works on desktop and mobile devices
- Proper loading states and error handling
- Toast notifications for user feedback

## Production Considerations

### Verification Code Delivery

- Current implementation shows codes in UI for testing
- In production, codes should be sent via:
  - Email to registered admin email
  - SMS to verified phone number
  - Authenticator app (TOTP)

### Code Storage

- Current implementation generates codes on-demand
- In production, use:
  - Redis for temporary code storage
  - Secure code expiration (5-10 minutes)
  - Rate limiting for code requests

### Security Enhancements

- Implement rate limiting on API endpoints
- Add IP-based restrictions for delete operations
- Require additional authentication factors for high-risk operations
- Implement session timeout for admin sessions

## Error Handling

### Client-Side

- Form validation for required fields
- Loading states during operations
- Error messages for failed operations
- Success notifications for completed operations

### Server-Side

- Input validation and sanitization
- Database transaction rollback on errors
- Proper HTTP status codes
- Detailed error logging

## Testing

### Manual Testing

1. Test edit flow with two-step verification
2. Test delete flow with three-step verification
3. Verify role-based access control
4. Test error scenarios and edge cases

### Automated Testing

- Unit tests for API endpoints
- Integration tests for verification flows
- E2E tests for complete user journeys
- Security tests for authentication and authorization

## Monitoring

### Metrics to Track

- Number of edit operations
- Number of delete operations
- Verification code success/failure rates
- User access patterns
- Error rates and types

### Alerts

- Failed verification attempts
- Unusual access patterns
- Database errors
- High-risk operation attempts

## Future Enhancements

### Planned Features

- Email/SMS verification code delivery
- Two-factor authentication integration
- Advanced audit trail with change tracking
- Backup and restore functionality
- Configuration templates and presets

### Security Improvements

- Hardware security key support
- Advanced threat detection
- Automated security scanning
- Compliance reporting tools
