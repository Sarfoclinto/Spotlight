import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUser } from "./users";

export const toggleBookmark = mutation({
  args: { postId: v.id("posts") },
  handler: async (ctx, { postId }) => {
    const currentUser = await getAuthUser(ctx);

    const existing = await ctx.db
      .query("bookmarks")
      .withIndex("by_user_and_post", (q) =>
        q.eq("userId", currentUser._id).eq("postId", postId)
      )
      .first();

    if (existing) {
      await ctx.db.delete(existing._id);
      return false; // Return false to indicate the post was unbookmarked
    } else {
      await ctx.db.insert("bookmarks", {
        userId: currentUser._id,
        postId,
      });
      return true; // Return true to indicate the post was bookmarked
    }
  },
});

export const getBookmarkedPost = query({
  handler: async (ctx) => {
    const currentUser = await getAuthUser(ctx);

    // get all bookmarks for the current user
    const bookmarks = await ctx.db
      .query("bookmarks")
      .withIndex("by_user", (q) => q.eq("userId", currentUser._id))
      .order("desc")
      .collect();

    const bookmarksWithInfo = await Promise.all(
      bookmarks.map(async (bookmarks) => {
        const post = await ctx.db.get(bookmarks.postId);
        return post;
      })
    );

    return bookmarksWithInfo;
  },
});
