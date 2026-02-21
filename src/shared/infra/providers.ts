import {
  BCryptHashProvider,
  JWTokenProvider,
} from "@/modules/identity/infra/providers";

// Singletons
export const hashProvider = new BCryptHashProvider();
export const tokenProvider = new JWTokenProvider();
