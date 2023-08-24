import { NextFunction, Response } from "express";

import { ResponseType } from "../helpers/users";
import { ExpressRequest } from "../util/express";
import HandleResponse from "../util/response-handler";
import { DBclient } from "../util/sequelize";
import { throwIfUndefined } from "../middlewares/validateToken";

export async function createComment(
  req: ExpressRequest,
  res: Response,
  next: NextFunction,
): Promise<ResponseType> {
  const postId = req.params.id;
  const { content } = req.body;

  const user = throwIfUndefined(req.user, "req.user");

  try {
    //check if post id is valid

    console.log(postId);
    const query = "SELECT * FROM posts WHERE id = $1";
    const { rows } = await DBclient.query(query, [postId]);

    if (rows.length === 0) {
      return HandleResponse.sendErrorResponse({
        error: "Post not found",
        res,
      });
    }

    const insertCommentQuery =
      "INSERT INTO comments (postid, userId, content) VALUES ($1, $2, $3) RETURNING *";
    const newComment = await DBclient.query(insertCommentQuery, [
      postId,
      user.id,
      content,
    ]);

    return HandleResponse.sendSuccessResponse({
      message: "comment created successfully",
      data: newComment.rows[0],
      res,
    });
  } catch (error) {
    return next(error);
  }
}
