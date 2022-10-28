const host = 'https://lpygpz41bf.execute-api.us-east-1.amazonaws.com/dev';

const endpoints = {
  base: host,
  register: () => `${host}/users`,
  getMyProfile: () => `${host}/users/me`,
  getUsers: () => `${host}/users?`,
  subscribe: (userId: string) => `${host}/users/${userId}/subscribe`,
  unsubscribe: (userId: string) => `${host}/users/${userId}/unsubscribe`,
  getUser: (userId: string) => `${host}/users/${userId}`,
};

export default endpoints;