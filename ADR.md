# Architecture Decision Records (ADR)

## ADR-001: Adopt Service Layer Pattern for Business Logic

**Status**: Accepted  
**Context**: The original backend code had business logic mixed with HTTP handling in controllers, making it difficult to test, reuse, and maintain.  
**Decision**: Implement a service layer that contains all business logic, keeping controllers focused on HTTP concerns only.  
**Consequences**: 
- Improved testability (services can be unit tested without HTTP mocks)
- Better separation of concerns
- Reduced code duplication
- Slight increase in indirection and initial complexity
**Status**: Implemented in medicineService.js, requestService.js, authService.js

## ADR-002: Standardize API Response Format

**Status**: Accepted  
**Context**: Different endpoints were returning inconsistent response formats, making frontend handling complex.  
**Decision**: Create a uniform response structure with success flag, message, and data/error objects.  
**Consequences**:
- Predictable API consumption on frontend
- Centralized error handling
- Consistent success/error messaging
**Status**: Implemented in response.js utility and used across all controllers

## ADR-003: Centralize Error Handling with Async Wrapper

**Status**: Accepted  
**Context**: Repetitive try/catch blocks in controller methods led to boilerplate code and inconsistent error handling.  
**Decision**: Implement an asyncHandler utility to wrap route handlers and centralized errorHandler middleware.  
**Consequences**:
- Eliminated try/catch boilerplate
- Consistent error logging and formatting
- Guaranteed error handling for all async routes
**Status**: Implemented in asyncHandler.js and errorHandler.js

## ADR-004: Extract Validation Logic to Reusable Utilities

**Status**: Accepted  
**Context**: Validation logic was duplicated across controllers with inconsistent implementation.  
**Decision**: Create validation.js with reusable functions for required field checking, ObjectID validation, and nested property validation.  
**Consequences**:
- Consistent validation across all endpoints
- Reduced code duplication
- Easier validation rule updates
**Status**: Implemented in validation.js

## ADR-005: Adopt Custom Hooks Pattern in Frontend

**Status**: Accepted  
**Context**: Frontend components had duplicated data fetching logic, form handling, and map initialization code.  
**Decision**: Create custom hooks (useApi, useForm, useGoogleMaps) to encapsulate cross-cutting concerns.  
**Consequences**:
- Reduced boilerplate in page components
- Easier testing of logic in isolation
- Consistent state management patterns
- Improved reusability of complex logic
**Status**: Implemented in src/hooks/

## ADR-006: Implement Centralized API Service with Interceptors

**Status**: Accepted  
**Context**: Axios instances were created ad-hoc in components, leading to inconsistent configuration and duplicated auth token handling.  
**Decision**: Create a singleton api.js service with Axios instance configured with base URL, request/response interceptors for automatic token injection and error transformation.  
**Consequences**:
- Consistent API configuration across application
- Automatic JWT handling
- Centralized error transformation
- Easy to mock in testing
**Status**: Implemented in src/services/api.js

## ADR-007: Enforce Resource Ownership Validation in Service Layer

**Status**: Accepted  
**Context**: Ownership checks were scattered across controllers and services, leading to potential security gaps.  
**Decision**: Implement ownership validation as part of service methods where data access/modification occurs.  
**Consequences**:
- Centralized security checks
- Reduced risk of authorization bypass
- Clear audit trail for access control decisions
**Status**: Implemented in medicineService.js and requestService.js methods

## ADR-008: Use Environment Variables for Configuration

**Status**: Accepted  
**Context**: Configuration values like database URLs and API keys were hardcoded or scattered across files.  
**Decision**: Implement environment variable configuration using dotenv for both frontend and backend.  
**Consequences**:
- Environment-specific configuration without code changes
- Secure handling of secrets
- Standardized configuration approach
**Status**: Implemented with .env files and process.env/react-app env variables

## ADR-009: Apply Consistent Naming Conventions and File Organization

**Status**: Accepted  
**Context**: Inconsistent naming and file organization made navigation difficult for new developers.  
**Decision**: Establish and enforce clear naming conventions (camelCase for variables, PascalCase for classes) and organize files by feature/domain rather than type where beneficial.  
**Consequences**:
- Improved code discoverability
- Reduced cognitive load for developers
- Easier onboarding for new team members
**Status**: Applied consistently throughout refactored codebase

## ADR-010: Prioritize Backwards Compatibility During Refactor

**Status**: Accepted  
**Context**: Refactoring risked breaking existing frontend integrations with the API.  
**Decision**: Maintain exact API contracts (endpoints, request/response formats) during backend refactor to ensure zero frontend changes required.  
**Consequences**:
- Zero frontend migration effort
- Ability to deploy backend changes independently
- Reduced risk during refactor
**Status**: Maintained throughout refactor process - frontend continued to work unchanged