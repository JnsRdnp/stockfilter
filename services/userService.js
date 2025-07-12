let users = [];

export const getAll = () => users;

export const create = (user) => {
  users.push(user);
  return user;
};