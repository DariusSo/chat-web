import React, { useState, useEffect } from "react";

// Function to simulate message timestamps
const formatDate = () => {
  const now = new Date();
  return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const ChatWindow = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [connected, setConnected] = useState(true); // Represents if the user is connected
  const [users, setUsers] = useState(["Alice", "Bob", "Charlie"]); // Simulated user list

  const currentUser = "You"; // Simulated current user name

  // Simulate the user connecting on load
  useEffect(() => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { type: "notification", text: "You connected to the chat!" },
    ]);
  }, []);

  // Handle sending a message
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim() === "") return; // Don't send empty messages

    const newMessage = {
      type: "user",
      user: currentUser,
      text: message,
      time: formatDate(), // Add timestamp to message
    };

    // Update the messages state with the new message
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setMessage(""); // Clear the input field
  };

  // Handle disconnection
  const handleDisconnect = () => {
    setConnected(false);
    setMessages((prevMessages) => [
      ...prevMessages,
      { type: "notification", text: "You disconnected from the chat." },
    ]);
  };

  // Handle reconnection
  const handleReconnect = () => {
    setConnected(true);
    setMessages((prevMessages) => [
      ...prevMessages,
      { type: "notification", text: "You reconnected to the chat." },
    ]);
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
          <div className="bg-gray-50 border rounded-lg h-96 mb-6 p-4 overflow-y-auto">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-4 ${
                  msg.type === "notification"
                    ? "text-sm text-gray-500 italic text-center mx-auto"
                    : msg.user === currentUser
                    ? "ml-auto text-right"
                    : "mr-auto text-left"
                } max-w-xs sm:max-w-sm`}
              >
                {/* Username and Timestamp */}
                {msg.user && (
                  <div className="text-xs text-gray-500 mb-1">
                    <span className="font-semibold">{msg.user}</span> · {msg.time}
                  </div>
                )}

                {/* Message Content */}
                <div
                  className={`p-3 rounded-lg ${
                    msg.type === "notification"
                      ? ""
                      : msg.user === currentUser
                      ? "bg-blue-500 text-white"
                      : "bg-gray-300 text-gray-700"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Message Input Section */}
          {connected ? (
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
                onClick={handleDisconnect}
              >
                Disconnect
              </button>
            </form>
          ) : (
            <div className="flex justify-between mt-6">
              <p className="text-center text-red-500">You are disconnected.</p>
              <button
                className="bg-green-500 text-white font-semibold py-2 px-6 rounded-lg hover:bg-green-600 transition duration-300"
                onClick={handleReconnect}
              >
                Reconnect
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
