import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { mutation, MutationCtx, query, QueryCtx } from "./_generated/server";

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

export const getAuthUser = async (ctx: QueryCtx | MutationCtx) => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error(
      "Unauthorized: User identity is required to get auth user."
    );
  }

  // Fetch the current user
  const currentUser = await ctx.db
    .query("users")
    .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
    .first();

  if (!currentUser) {
    throw new Error("User not found: Unable to fetch auth user.");
  }

  return currentUser;
};

export const updateProfile = mutation({
  args: {
    fullname: v.string(),
    bio: v.optional(v.string()),
  },
  handler: async (ctx, { fullname, bio }) => {
    const currentUser = await getAuthUser(ctx);

    await ctx.db.patch(currentUser._id, {
      fullname,
      bio,
    });
  },
});

export const getUserByClerkId = query({
  args: { clerkId: v.string() },
  handler: async (ctx, { clerkId }) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkId))
      .unique();

    return user;
  },
});

export const getUserProfile = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    const user = await ctx.db.get(userId);
    if (!user) throw new Error("User not found");

    return user;
  },
});

export const isFollowing = query({
  args: { followingId: v.id("users") },
  handler: async (ctx, { followingId }) => {
    const currentUser = await getAuthUser(ctx);

    const follow = await ctx.db
      .query("follows")
      .withIndex("by_both", (q) =>
        q.eq("followerId", currentUser._id).eq("followingId", followingId)
      )
      .first();

    return !!follow;
  },
});

export const toggleFollow = mutation({
  args: { followingId: v.id("users") },
  handler: async (ctx, { followingId }) => {
    const currentUser = await getAuthUser(ctx);

    const existing = await ctx.db
      .query("follows")
      .withIndex("by_both", (q) =>
        q.eq("followerId", currentUser._id).eq("followingId", followingId)
      )
      .first();

    if (existing) {
      //unfollow
      await ctx.db.delete(existing._id);
      await updateFollowingCount(ctx, currentUser._id, followingId, false);
    } else {
      //follow\
      await ctx.db.insert("follows", {
        followerId: currentUser._id,
        followingId,
      });
      await updateFollowingCount(ctx, currentUser._id, followingId, true);

      // create notification
      await ctx.db.insert("notifications", {
        senderId: currentUser._id,
        type: "follow",
        recieverId: followingId,
      });
    }
  },
});

const updateFollowingCount = async (
  ctx: MutationCtx,
  followerId: Id<"users">,
  followingId: Id<"users">,
  isFollow: boolean
) => {
  const follower = await ctx.db.get(followerId);
  const following = await ctx.db.get(followingId);

  if (follower && following) {
    await ctx.db.patch(followerId, {
      following: follower.following + (isFollow ? 1 : -1),
    });
    await ctx.db.patch(followingId, {
      followers: following?.followers + (isFollow ? 1 : -1),
    });
  }
};
