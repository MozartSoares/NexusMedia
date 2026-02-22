# Identity Module

The Identity module handles user authentication, registration, and session management.

## Core Responsibilities

- **Authentication (`LoginUser`):** Validates credentials using `bcrypt` and generates a stateless JSON Web Token (JWT) representing the user session.
- **Registration (`RegisterUser`):** Securely creates new `User` records.

## Key Design Patterns

- **Stateless Authorization:** The MVP leverages a fully stateless JWT approach for authentication. Server middleware intercepts and verifies standard `Bearer <token>` request headers before any sensitive GraphQL execution.
- **Domain Value Validation:** Strong typing (`Username`, `Email`) enforces security constraints directly at the factory initialization level to guarantee only compliant primitives reach the database layer.
