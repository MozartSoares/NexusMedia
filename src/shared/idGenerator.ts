import { createId } from "@paralleldrive/cuid2";
import { v4 as uuidv4 } from "uuid";

export const createEntityId = () => createId();

export const createRandomId = () => uuidv4();
