import { v4 } from 'uuid';
import { uniqueNamesGenerator, adjectives, colors, animals } from 'unique-names-generator';
import { ShortFormUser } from "../@types/user";

const _users: ShortFormUser[] = [];

const generateUsers = () => {
  if (_users.length === 0) {
    for (let i = 0; i < 1000; ++i) {
      _users.push({
        id: v4(),
        username: uniqueNamesGenerator({
          dictionaries: [adjectives, animals, colors],
          length: 2
        }),
        totalSubscribers: Math.floor(Math.random() * 1001),
      });
    }
  }
};

export const getUsers = async (username: string, limit: number = 3, nextKey: string | null): Promise<{ users: ShortFormUser[], nextKey: string | null }> => {
  generateUsers();

  const users = _users.filter((user) => user.username.includes(username));
  const startIndex = nextKey ? users.findIndex(user => user.id === nextKey) : 0;

  const usersToReturn = users.slice(startIndex, startIndex + limit);
  const nextKeyToReturn = startIndex + limit < users.length ? users[startIndex + limit].id : null;

  const simulateFetchingTime = Math.floor(Math.random() * 5); // 0 - 5s
  const delayPromise = (second: number) => new Promise((res) => setTimeout(res, second));
  await delayPromise(5 * 1000);

  return {
    users: usersToReturn,
    nextKey: nextKeyToReturn,
  };
};