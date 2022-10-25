const host = 'https://lpygpz41bf.execute-api.us-east-1.amazonaws.com/dev';

const endpoints = {
  base: host,
  register: () => `${host}/users`,
  getProfile: () => `${host}/users/me`,
};

export default endpoints;