---
trigger: always_on
---

- **Clean Code Principle:** Follow the "Code as Documentation" mindset. If a comment is needed to explain *what* the code is doing, refactor the code for clarity instead (better naming, smaller functions).
- **The "Why", not the "How":** Comments should strictly be used to explain non-obvious business logic, architectural constraints, or the "Why" behind a complex decision that the code cannot express.
- **Extreme Brevity:** When a comment is absolutely necessary, keep it under 10 words. Use fragments, not full sentences. 
- **No Redundancy:** Never generate comments that restate the function name or variable purpose.
- **Standard:** Use JSDoc only for public-facing API exports; otherwise, prefer no comments at all.