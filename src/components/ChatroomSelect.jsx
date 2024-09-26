import React, { useEffect, useState } from "react";

const ChatroomSelect = () => {
  // State to handle the new chatroom input and selected chatroom
  const [newChatroomName, setNewChatroomName] = useState("");
  const [selectedChatroom, setSelectedChatroom] = useState("");
  const [created, setCreated] = useState(false);

  // Example list of chatrooms (fetched from a server in a real app)
  const [chatrooms, setChatrooms] = useState([]);
  
  const handleCreateChatroom = () => {
    setChatrooms([...chatrooms, newChatroomName]);
    setCreated(true);
    setNewChatroomName("");
  }

  const handleNewChatroomChange = (e) => {
    setNewChatroomName(e.target.value);
  };

  const handleSelectChange = (e) => {
    setSelectedChatroom(e.target.value);
  };
  useEffect(() => {
    const headers = { 'Authorization': 'Bearer ' + getCookie("loggedIn") };
    fetch("http://localhost:8080/messages", { headers })
    .then(response => response.json())
    .then(data => setChatrooms(data));
}, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Select or create a chatroom</h2>

        {/* Input field for a new chatroom name */}
        <form onSubmit={handleCreateChatroom}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="newChatroom">
              Create New Chatroom
            </label>
            <input
              type="text"
              id="newChatroom"
              name="newChatroom"
              value={newChatroomName}
              onChange={handleNewChatroomChange}
              placeholder="Enter new chatroom name"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleCreateChatroom}
              type="button"
              className="mt-4 w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
            >
              Create Chatroom
            </button>
          </div>
        </form>
        {created && (
          <p className="text-gray-700 text-center">Chatroom created!</p>
        )}

        {/* Selection for existing chatrooms */}
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="existingChatrooms">
            Choose Existing Chatroom
          </label>
          <select
            id="existingChatrooms"
            name="existingChatrooms"
            value={selectedChatroom}
            onChange={handleSelectChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a chatroom</option>
            {chatrooms.map((chatroom, index) => (
              <option key={index} value={chatroom}>
                {chatroom}
              </option>
            ))}
          </select>
        </div>

        {selectedChatroom && (
          <p className="text-gray-700 text-center">You selected: {selectedChatroom}</p>
        )}
        <button
              onClick={handleCreateChatroom}
              type="button"
              className="mt-4 w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
            >
              Connect
        </button>
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
export default ChatroomSelect;
