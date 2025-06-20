import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const createUser = mutation({
  args: {
    username: v.string(),
    fullname: v.string(),
    image: v.string(),
    bio: v.optional(v.string()),
    email: v.string(),
    clerkId: v.string(),
  },
  handler: async (ctx, args) => {
    // check if user already exist
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (existingUser) return;

    // create user in db
    await ctx.db.insert("users", {
      username: args.username,
      clerkId: args.clerkId,
      email: args.email,
      bio: args.bio,
      fullname: args.fullname,
      image: args.image,
      followers: 0,
      following: 0,
      posts: 0,
    });
  },
});
