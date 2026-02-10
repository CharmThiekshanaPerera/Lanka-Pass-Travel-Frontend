export {};

declare global {
  interface Window {
    __APP_CONFIG__?: {
      API_URL?: string;
      LOCAL_API_URL?: string;
      PROD_API_URL?: string;
    };
    __APP_CONFIG_READY__?: Promise<void>;
  }
}
