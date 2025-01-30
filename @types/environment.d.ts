namespace NodeJS {
    interface ProcessEnv extends NodeJS.ProcessEnv {
        PORT: string;
        DATABASE_URL: string;
    }
}

declare namespace Express {
    interface Request {
        user?: {
            id: number;
            email: string;
        };
    }
}
