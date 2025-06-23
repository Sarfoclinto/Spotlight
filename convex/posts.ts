import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUser } from "./users";

export const generateUploadurl = mutation(async (ctx) => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error(
      "Unauthorized: User identity is required to generate upload URL."
    );
  }
  return await ctx.storage.generateUploadUrl();
});

export const createPost = mutation({
  args: {
    caption: v.optional(v.string()),
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const currentUser = await getAuthUser(ctx);

    const imageUrl = await ctx.storage.getUrl(args.storageId);
    if (!imageUrl) {
      throw new Error("Image URL not found: Unable to create post.");
    }

    // create the post
    const postId = await ctx.db.insert("posts", {
      userId: currentUser._id,
      imageUrl: imageUrl,
      storageId: args.storageId,
      caption: args.caption || "",
      likes: 0,
      comments: 0,
    });

    // increment the user's post count by 1
    await ctx.db.patch(currentUser._id, { posts: currentUser.posts + 1 });
    return postId;
  },
});

export const getFeedPost = query({
  handler: async (ctx) => {
    const currentUser = await getAuthUser(ctx);

    // get all posts
    const posts = await ctx.db.query("posts").order("desc").collect();
    if (posts.length === 0) return [];

    //enhance post with user data and interaction counts
    const postWithInfo = await Promise.all(
      posts.map(async (post) => {
        const postAuthor = (await ctx.db.get(post.userId))!;

        const like = await ctx.db
          .query("likes")
          .withIndex("by_user_and_post", (q) =>
            q.eq("postId", post._id).eq("userId", currentUser._id)
          )
          .first();

        const bookmarks = await ctx.db
          .query("bookmarks")
          .withIndex("by_user_and_post", (q) =>
            q.eq("userId", currentUser._id).eq("postId", post._id)
          )
          .first();

        return {
          ...post,
          author: {
            _id: postAuthor?._id,
            username: postAuthor?.username,
            image: postAuthor?.image,
            fullname: postAuthor?.fullname,
          },
          isLiked: !!like,
          isBookmarked: !!bookmarks,
        };
      })
    );

    return postWithInfo;
  },
});

export const toggleLike = mutation({
  args: { postId: v.id("posts") },
  handler: async (ctx, { postId }) => {
    const currentUser = await getAuthUser(ctx);

    const existing = await ctx.db
      .query("likes")
      .withIndex("by_user_and_post", (q) =>
        q.eq("postId", postId).eq("userId", currentUser._id)
      )
      .first();

    const post = await ctx.db.get(postId);
    if (!post) {
      throw new Error("Post not found: Unable to toggle like.");
    }

    if (existing) {
      // If the like exists, remove it
      await ctx.db.delete(existing._id);
      // Decrement the likes count on the post
      await ctx.db.patch(postId, { likes: post.likes - 1 });
      return false; // Return false to indicate the like was removed
    } else {
      // If the like does not exist, create it
      await ctx.db.insert("likes", {
        userId: currentUser._id,
        postId,
      });
      // Increment the likes count on the post
      await ctx.db.patch(postId, { likes: post.likes + 1 });

      // if it's not my post, create a notification
      if (post.userId !== currentUser._id) {
        await ctx.db.insert("notifications", {
          recieverId: post.userId,
          senderId: currentUser._id,
          type: "like",
          postId: postId,
        });
      }
      return true; // Return true to indicate the like was added
    }
  },
});

export const deletePost = mutation({
  args: { postId: v.id("posts") },
  handler: async (ctx, { postId }) => {
    const currentUser = await getAuthUser(ctx);

    const post = await ctx.db.get(postId);
    if (!post) {
      throw new Error("Post not found: Unable to delete post.");
    }

    // verify ownership
    if (post.userId !== currentUser._id)
      throw new Error("Not authorised to delete this post");

    // delete all associated likes
    const likes = await ctx.db
      .query("likes")
      .withIndex("by_post", (q) => q.eq("postId", postId))
      .collect();

    for (const like of likes) {
      await ctx.db.delete(like._id);
    }

    // delete all associated comments
    const comments = await ctx.db
      .query("comments")
      .withIndex("by_post", (q) => q.eq("postId", postId))
      .collect();

    for (const comment of comments) {
      await ctx.db.delete(comment._id);
    }

    // delete all associated comments
    const bookmarks = await ctx.db
      .query("bookmarks")
      .withIndex("by_post", (q) => q.eq("postId", postId))
      .collect();

    for (const bookmark of bookmarks) {
      await ctx.db.delete(bookmark._id);
    }

    // delete all associated notifications
    const notifications = await ctx.db
      .query("notifications")
      .withIndex("by_post", (q) => q.eq("postId", postId))
      .collect();

    for (const notification of notifications) {
      await ctx.db.delete(notification._id);
    }

    // delete post image from storage files
    await ctx.storage.delete(post.storageId);

    // delete the actual post
    await ctx.db.delete(postId);

    // decrement the user's post count by 1
    await ctx.db.patch(currentUser._id, {
      posts: Math.max(0, (currentUser.posts || 1) - 1),
    });
  },
});

export const getPostsByUserId = query({
  args: { userId: v.optional(v.id("users")) },
  handler: async (ctx, args) => {
    const user = args.userId
      ? await ctx.db.get(args.userId)
      : await getAuthUser(ctx);

    if (!user) throw new Error("User not found");

    const posts = await ctx.db
      .query("posts")
      .withIndex("by_user", (q) => q.eq("userId", args.userId || user._id))
      .order("desc")
      .collect();

    return posts;
  },
});
