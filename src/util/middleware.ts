import { Request, Response, NextFunction } from "express";

declare global {
  namespace Express {
    interface Response {
      success: (success: any) => Response;
      error: ({
        errorCode,
        reason,
        data,
      }: {
        errorCode?: string;
        reason?: string | null;
        data?: any;
      }) => Response;
    }
  }
}

// 성공 응답을 처리 미들웨어
export const successMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  res.success = (success: any): Response => {
    return res.json({ resultType: "SUCCESS", error: null, success });
  };

  res.error = ({
    errorCode = "unknown",
    reason = null,
    data = null,
  }): Response => {
    return res.json({
      resultType: "ERROR",
      error: {
        errorCode,
        reason,
        data,
      },
      success: null,
    });
  };

  next();
};
// 실패 응답을 처리 미들웨어
export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (res.headersSent) {
    return next(err);
  }

  res.status(err.statusCode || 500).error({
    errorCode: err.errorCode || "unknown",
    reason: err.reason || err.message || null,
    data: err.data || null,
  });
};