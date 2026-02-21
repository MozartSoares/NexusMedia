import { BCryptHashProvider, JWTokenProvider } from "./providers/index";

// Singletons
export const hashProvider = new BCryptHashProvider();
export const tokenProvider = new JWTokenProvider();
