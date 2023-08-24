import { Response } from "express";

import { logger } from "./logger";

class HandleResponse {
  public static sendSuccessResponse({
    res,
    status = 200,
    message = "Operation Successful",
    data = null,
    custom = false,
  }: {
    res: Response;
    status?: number;
    message?: string;
    data?: any;
    custom?: boolean;
  }): Response<any> {
    const response =
      custom && data ? { ...data } : { data, message, success: true };

    return res.status(status).send(response);
  }

  public static sendErrorResponse({
    res,
    status = 400,
    error = "Operation failed",
    custom = false,
  }: {
    res: Response;
    status?: number;
    error?: string;
    custom?: boolean;
  }): Response<any> {
    const response = custom
      ? { code: status, message: error }
      : { error, success: false };

    logger.debug("Sending error response", { error, status });

    return res.status(status).send(response);
  }
}

export default HandleResponse;
