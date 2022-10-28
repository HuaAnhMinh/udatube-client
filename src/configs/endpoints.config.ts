const host = 'https://lpygpz41bf.execute-api.us-east-1.amazonaws.com/dev';

const endpoints = {
  base: host,
  register: () => `${host}/users`,
  getProfile: () => `${host}/users/me`,
  getUsers: () => `${host}/users?`,
  subscribe: (userId: string) => `${host}/users/${userId}/subscribe`,
  unsubscribe: (userId: string) => `${host}/users/${userId}/unsubscribe`,
};

export default endpoints;