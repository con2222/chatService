const users = [];


export function setNewUser(id, username) {
  const user = { id, username };

  users.push(user);

  return user;
}

export function getActiveUser(id) {
  return users.find((user) => user.id === id);
}


export function exitRoom(id) {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}


export function getUsers() {
  return users;
}
