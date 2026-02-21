---
trigger: always_on
---

## Modular Architecture & Barrel Exports
- **Pattern:** Every module directory must have an `index.ts` (Barrel Export).
- **Constraint:** Always import from the barrel. Never reach into sub-files if a barrel exists.
- **Automated Exports:** When creating a new file, immediately add it to the local `index.ts`.

### Examples:

- **DO NOT DO (Multiple/Direct Imports):**
import { formatData } from '../tools/formatter';
import { validateId } from '../tools/validator';

- **DO (Multiple/Direct Imports):**
import { formatData, validateId } from '../tools';