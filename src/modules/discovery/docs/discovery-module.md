# Discovery Module

The Discovery module is responsible for fetching and presenting public content to users.

## Core Responsibilities

- **The Public Feed (`GetFeed`):** Provides a continuous stream of images filtered by tags or optionally by the author. Built specifically for high-performance reading and infinite scroll in UI clients.

## Key Design Patterns

- **Read-Optimized Models:** Bypasses full `Post` domain entity hydration used in Content and directly maps Prisma query rows into a lightweight `FeedItem` shape for speed.
- **Keyset Cursor Pagination:** Employs an encoded `(createdAt, id)` composite cursor to ensure fast, stable offset-free pagination. Relying on an optimal database compound index `(created_at DESC, id DESC)`, it guarantees sub-200ms latency queries even deeply into the dataset.
- **Opaque Cursors:** Base64URL encodes cursor data (`FeedCursor`) to allow future structure modifications without breaking client-side logic.
