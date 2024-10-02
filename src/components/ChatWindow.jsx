import React, { useState, useEffect, useRef, useReducer } from "react";

// Function to simulate message timestamps
const formatDate = () => {
  const now = new Date();
  return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const ChatWindow = ({sendMessage, chatWindowRef, currentUser, setCurrentUser, selectedChatroom, users, setUsers, leave, messages, setMessages}) => {
  const [message, setMessage] = useState("");
  const [connected, setConnected] = useState(true); // Represents if the user is connected
  const [, forceUpdate] = useReducer(x => x + 1, 0);

  useEffect(() => {
    const headers = { 'Authorization': 'Bearer ' + getCookie("loggedIn") };
    fetch("http://localhost:8080/messages/chatroom?chatroom=" + selectedChatroom, { headers })
    .then(response => response.json())
    .then(data => setMessages(data));
  }, []);
  
  // Handle sending a message
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim() === "") return; // Don't send empty messages
    sendMessage(message, currentUser, selectedChatroom, "user");
    setMessage("");
    
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {/* Container for User List and Chat */}
      <div className="flex w-full max-w-7xl bg-white shadow-lg rounded-lg overflow-hidden">
        {/* User List Section */}
        <div className="w-1/4 bg-gray-800 p-6">
          <h3 className="text-lg font-bold text-white mb-4">Active Users</h3>
          <ul className="space-y-3">
            {users.map((user, index) => (
              <li
                key={index}
                className="text-gray-300 font-medium text-sm px-3 py-2 bg-gray-700 rounded-lg"
              >
                {user}
              </li>
            ))}
          </ul>
        </div>

        {/* Chat Window Section */}
        <div className="w-3/4 p-6">
          {/* Chat Header */}
          <h2 className="text-2xl font-bold text-gray-700 mb-6">Chatroom</h2>

          {/* Messages Window */}
          <div ref={chatWindowRef} className="bg-gray-50 border rounded-lg h-96 mb-6 p-4 overflow-y-auto">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-4 ${
                  msg.type == "system"
                    ? "text-sm text-gray-500 italic text-center mx-auto"
                    : msg.username == currentUser
                    ? "ml-auto text-right"
                    : "mr-auto text-left"
                } max-w-xs sm:max-w-sm`}
              >
                {/* Username and Timestamp */}
                {}
                {msg.type == "system" ? ("") : (
                  <div className="text-xs text-gray-500 mb-1">
                    {msg.username} · <span className="font-semibold">{msg.sentAt}</span>
                  </div>
                )}

                {/* Message Content */}
                <div
                  className={`p-3 rounded-lg ${
                    msg.type == "system"
                      ? ""
                      : msg.username == currentUser
                      ? "bg-blue-500 text-white"
                      : "bg-gray-300 text-gray-700"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
          </div>

          {/* Message Input Section */}
          
            <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-grow p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="bg-blue-500 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-600 transition duration-300"
              >
                Send
              </button>
              <button
                className="bg-red-500 text-white font-semibold py-2 px-6 rounded-lg hover:bg-red-600 transition duration-300"
                onClick={() => {leave(currentUser, setConnected, selectedChatroom); forceUpdate();}}
              >
                Disconnect
              </button>
            </form>
        </div>
      </div>
    </div>
  );
};
function getCookie(name) {
  let nameEQ = name + "=";
  let ca = document.cookie.split(';');
  for(let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

export default ChatWindow;
