exports.castVote = async (postId, userId) => {
  // 1. Check if the post exists
  const post = await postsRepo.findById(postId);

  if (!post) {
    throw new AppError('Post not found', 404);
  }

  // 2. Check if the user has already voted
  const existingVote = await votesRepo.findByPostAndUser(postId, userId);

  if (existingVote) {
    throw new AppError('You have already voted on this post', 409);
  }

  // 3. Both checks passed, so insert the vote
  return votesRepo.insert(postId, userId);
};
