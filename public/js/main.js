const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");

// Get username from URL
const username = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

console.log(username);
const socket = io();

// Join chatroom
socket.emit("joinRoom", username);

// Get users
socket.on("roomUsers", ({ users }) => {
  // console.log(users);
  outputUsers(users);
});

// Message from server
socket.on("message", (message) => {
  console.log(message);
  outputMessage(message);

  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // Get message text
  let msg = e.target.elements.msg.value;

  msg = msg.trim();

  if (!msg) {
    return false;
  }

  // Emit message to server
  socket.emit("chatMessage", msg);

  // Clear input
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

// Output message to DOM
function outputMessage(message) {
  const div = document.createElement("div");
  div.classList.add("message");
  const p = document.createElement("p");
  p.classList.add("meta");
  p.innerText = message.username;
  p.innerHTML += `<span>${message.time}</span>`;
  div.appendChild(p);
  // const para = document.createElement("p");
  // para.classList.add("text");
  // para.innerText = message.text;
  // console.log(typeof message.text);
  div.appendChild(breakLineMessage(message.text));
  document.querySelector(".chat-messages").appendChild(div);
}

function breakLineMessage(message) {
  const charCount = 90;
  const para = document.createElement("p");
  para.classList.add("text");
  if (message.length <= charCount) {
    para.innerText = message;
    return para;
  } else
    while (message.length > charCount) {
      para.innerHTML += `${message.slice(0, charCount)}<br>`;
      // para.innerHTML += `${message.slice(0, charCount)}<br>`;
      message = message.slice(charCount, message.length);
      console.log(message);
    }
  para.innerHTML += `${message.slice(0, charCount)}<br>`;
  return para;
}

// Add users to DOM
function outputUsers(users) {
  console.log({ users });
  userList.innerHTML = "";
  users.forEach((user) => {
    const li = document.createElement("li");
    li.innerText = user.username;
    userList.appendChild(li);
  });
}