exports.albumMapper = params => ({
  userId: params.user.id,
  albumId: params.id,
  albumTitle: params.title
});
