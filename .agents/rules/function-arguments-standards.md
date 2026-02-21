---
trigger: always_on
---

### Function Argument Standards
1. **Named Arguments Requirement:** Functions with **more than 2 parameters** MUST use a single object as an argument (Named Parameters) instead of positional arguments.
2. **Type Safety:** Destructure the object directly in the function signature for better readability and explicit typing.
3. **Intent:** This ensures that when the function is called, the context of each value is clear at the call site.

### Examples:
- **DO NOT DO (Positional arguments for 3+ params):**
function createPost(title: string, content: string, userId: string) { ... }

// Call site is confusing:
createPost("My Title", "Some content", "123");

- **DO(Named arguments using an object)::**

interface CreatePostDTO {
  title: string;
  content: string;
  userId: string;
}

function createPost({ title, content, userId }: CreatePostDTO) { ... }

function createPost({ title, content, userId }: {
  title: string;
  content: string;
  userId: string;
}) { ... }


// Call site is clear:
createPost({ title: "My Title", content: "Some content", userId: "123" });