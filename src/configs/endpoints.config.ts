const host = 'https://7u1b40ckqb.execute-api.ap-southeast-1.amazonaws.com/dev';

const endpoints = {
  base: host,
  register: () => `${host}/users`,
  getMyProfile: () => `${host}/users/me`,
  getUsers: () => `${host}/users?`,
  subscribe: (userId: string) => `${host}/users/${userId}/subscribe`,
  unsubscribe: (userId: string) => `${host}/users/${userId}/unsubscribe`,
  getUser: (userId: string) => `${host}/users/${userId}`,
  updateUsername: () => `${host}/users/me`,
  updateAvatar: () => `${host}/users/me/avatar`,
  getSubscribedChannels: (userId: string) => `${host}/users/${userId}/subscribed-channels`,
  getVideo: (videoId: string, uesrId?: string) => `${host}/videos/${videoId}?${uesrId ? `userId=${uesrId}` : ''}`,
  createVideo: () => `${host}/videos`,
  uploadThumbnail: (videoId: string) => `${host}/videos/${videoId}/thumbnail`,
  uploadVideo: (videoId: string) => `${host}/videos/${videoId}/video`,
  updateVideo: (videoId: string) => `${host}/videos/${videoId}`,
  getVideos: () => `${host}/videos?`,
  likeVideo: (videoId: string) => `${host}/videos/${videoId}/like`,
  dislikeVideo: (videoId: string) => `${host}/videos/${videoId}/dislike`,
  unlikeVideo: (videoId: string) => `${host}/videos/${videoId}/unlike`,
  undislikeVideo: (videoId: string) => `${host}/videos/${videoId}/undislike`,
  createComment: () => `${host}/comments`,
  getComments: (videoId: string) => `${host}/comments?videoId=${videoId}`,
  deleteVideo: (videoId: string) => `${host}/videos/${videoId}`,
};

export default endpoints;