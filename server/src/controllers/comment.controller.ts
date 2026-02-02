import { getAuth } from "@clerk/express";
import * as queries from "../db/queries";
import { Request, Response } from "express";

export const createComment = async (req:Request, res:Response) => {
    try {
        const { userId } = getAuth(req);
        if (!userId) return res.status(403).json({error: "Unauthorized user"});

        const { productId } = req.params;
        const {content} = req.body;

        if (!content) {
            return res.status(400).json({error: "Comment content is required"});
        }

        if (Array.isArray(productId))
        return res.status(400).json({ error: "Invalid product id" });

        const product = await queries.getProductById(productId);
        if (!product) return res.status(404).json({error: "Product not found"});
        
        const comment = await queries.createComment({
            content, userId, productId
        });

        return res.status(201).json(comment);

    } catch(err) {
        console.log("Error commenting ", err);
        return res.status(500).json({error: "Failed to comment"});
    }
}

export const deleteComment = async (req: Request, res: Response) => {
    try {
        const { userId } = getAuth(req);
        if (!userId) return res.status(403).json({error: "Unauthorized user"});

        const {commentId} = req.params;

        if (Array.isArray(commentId))
        return res.status(400).json({ error: "Invalid Comment id" });
        
        const existingComment = await queries.getCommentById(commentId);
        if (!existingComment) return res.status(404).json({error: "Comment not found"});

        if (existingComment.userId != userId) return res.status(403).json({error: "You can only delete your own comment"});
        
        const comment = await queries.deleteComment(commentId);
        return res.status(200).json(comment);

    } catch(err) {
        console.log("Error deleting comment ", err);
        return res.status(500).json({error: "Failed to delete comment"});
    }
}