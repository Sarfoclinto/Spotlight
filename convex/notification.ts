import { query } from "./_generated/server";
import { getAuthUser } from "./users";

export const getNotifications = query({
  handler: async (ctx) => {
    const currentUser = await getAuthUser(ctx);

    const notifications = await ctx.db
      .query("notifications")
      .withIndex("by_receiver", (q) => q.eq("recieverId", currentUser._id))
      .order("desc")
      .collect();

    if (!notifications) return [];

    const notificationsWIthInfo = Promise.all(
      notifications.map(async (notification) => {
        const sender = await ctx.db
          .query("users")
          .withIndex("by_id", (q) => q.eq("_id", currentUser._id))
          .first();

        if (!sender) throw new Error("Error finding notification sender");

        let post = null;
        let comment = null;

        if (notification.postId) {
          post = await ctx.db.get(notification.postId);
        }
        if (notification.type === "comment" && notification.commentId) {
          comment = await ctx.db.get(notification.commentId);
        }
        return {
          ...notification,
          sender: {
            _id: sender._id,
            username: sender.username,
            image: sender.image,
          },
          post,
          comment: comment?.content,
        };
      })
    );

    return notificationsWIthInfo;
  },
});
