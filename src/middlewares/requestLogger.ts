import { NextFunction, Request, Response } from "express";
import { omit } from "lodash";

import { logger } from "../util/logger";

const getDurationInMilliseconds = (start: [number, number]) => {
  const NS_PER_SEC = 1e9;
  const NS_TO_MS = 1e6;
  const diff = process.hrtime(start);

  return (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS;
};

export default (req: Request, res: Response, next: NextFunction) => {
  const method = req.method;
  const startTime = process.hrtime();

  res.on("finish", () => {
    if ("/" === req.originalUrl) {
      return;
    }

    const duration = getDurationInMilliseconds(startTime);
    logger.info("request.fulfilled", {
      ...(Object.keys(req.body).length && { body: req.body }),
      duration,
      headers: omit(req.headers, [
        "user-agent",
        "authorization",
        "accept",
        "accept-encoding",
        "accept-language",
        "if-none-match",
      ]),
      method,
      ...(Object.keys(req.query).length && { query: req.query }),
      status: res.statusCode,
      url: req.originalUrl,
    });
  });

  return next();
};
