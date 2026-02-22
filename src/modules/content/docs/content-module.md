# Content Module

Handles image uploading and post publishing for NexusMedia.

## Core Responsibilities

- **Upload Flow Initialization (`GetUploadUrl`):** Coordinates logic to validate incoming image metadata (MIME type, size limit) and generates a pre-signed S3/MinIO upload URL for the client.
- **Post Persistence (`CreatePost`):** Verifies the actual file was successfully sent to the storage bucket. Creates the `Post` record in the database using a transaction to gracefully handle storage vs DB mismatches.

## Key Design Patterns

- **Path Abstraction:** Utilizes a `StoragePath` domain value object to centralize formatting rules (`temp/` vs `uploads/` locations).
- **Deferred Publication:** A newly created Post initially starts as `PROCESSING`. It transitions to `PUBLISHED` only after the image file is securely moved from the temporary upload path to the permanent path.
- **Value Objects for Security:** Strong typings like `MediaAttachment` dictate allowable MIME types and sizing rules right at the domain layer.
