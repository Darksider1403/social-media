export const isLikedByReqUser = (reqUserId, post) => {
  // Safety check if post.liked is undefined or not an array
  if (!post.liked || !Array.isArray(post.liked)) {
    return false;
  }

  for (let user of post.liked) {
    if (reqUserId === user.id) {
      return true;
    }
  }

  return false;
};
