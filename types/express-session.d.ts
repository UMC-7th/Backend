import "express-session";

declare module "express-session" {
  interface SessionData {
    userId?: number,   
    birth?: Date,
    name?: string,
    phoneNum?: string,
    email?: string;  
  }
}