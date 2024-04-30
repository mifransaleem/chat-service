export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      JWT_ACCESS_SECRET: string;
      JWT_ACCESS_EXPIRY: string;
      JWT_REFRESH_SECRET: string;
      JWT_REFRESH_EXPIRY: string;
      DATABASE_HOST: string;
      DATABASE_PORT: string;
      DATABASE_USER_NAME: string;
      DATABASE_PASSWORD: string;
      DATABASE_NAME: string;
    }
  }
}
