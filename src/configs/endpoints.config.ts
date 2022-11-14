const host = 'https://m9ibeaaw33.execute-api.us-east-1.amazonaws.com/dev';

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
};

export default endpoints;