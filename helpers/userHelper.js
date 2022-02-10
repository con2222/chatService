const users = [];

// Join user to chat
export function setNewUser(id, username) {
  const user = { id, username };

  users.push(user);

  return user;
}

// Get current user
export function getActiveUser(id) {
  return users.find((user) => user.id === id);
}

// User leaves chat
export function exitRoom(id) {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

// Get room users
export function getUsers() {
  return users;
}
