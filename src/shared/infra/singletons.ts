import {
  BCryptHashProvider,
  JWTokenProvider,
  S3ConnectionProvider,
} from "./providers/index";

// Singletons
export const hashProvider = new BCryptHashProvider();
export const tokenProvider = new JWTokenProvider();
export const s3ConnectionProvider = new S3ConnectionProvider();
