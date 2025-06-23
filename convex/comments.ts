import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUser } from "./users";

export const addComment = mutation({
  args: { postId: v.id("posts"), content: v.string() },
  handler: async (ctx, { content, postId }) => {
    const currentUser = await getAuthUser(ctx);

    if (!currentUser) {
      throw new Error("User not authenticated");
    }

    const post = await ctx.db.get(postId);
    if (!post) {
      throw new ConvexError("Post not found");
    }

    const commentId = await ctx.db.insert("comments", {
      userId: currentUser._id,
      postId,
      content,
    });

    // Increment the comment count on the post
    await ctx.db.patch(postId, {
      comments: post.comments + 1,
    });

    // create notification if not my post
    if (post.userId !== currentUser._id) {
      await ctx.db.insert("notifications", {
        recieverId: post.userId,
        senderId: currentUser._id,
        type: "comment",
        postId,
        commentId,
      });
    }
    return commentId;
  },
});

export const getComments = query({
  args: { postId: v.id("posts") },
  handler: async (ctx, { postId }) => {
    const comments = await ctx.db
      .query("comments")
      .withIndex("by_post", (q) => q.eq("postId", postId))
      .collect();

    if (!comments) return [];

    const commentsWithAuthor = await Promise.all(
      comments.map(async (comment) => {
        const author = await ctx.db.get(comment.userId);
        if (!author) {
          throw new ConvexError("Author not found for comment");
        }
        return {
          ...comment,
          user: {
            fullname: author.fullname,
            image: author.image,
          },
        };
      })
    );

    return commentsWithAuthor;
  },
});
