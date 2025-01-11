namespace NodeJS {
    interface ProcessEnv extends NodeJS.ProcessEnv {
      PORT: string;
      DATABASE_URL: string;
    }
  }