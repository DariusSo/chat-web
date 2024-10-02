import React, { useEffect, useState, useRef } from "react";
import ChatWindow from "./ChatWindow";

if (typeof global === 'undefined') {
    var global = window;
  }
import SockJS from 'sockjs-client/dist/sockjs.min.js';
import Stomp from 'stompjs';

const ChatroomSelect = ({username}) => {
  // State to handle the new chatroom input and selected chatroom
  const [newChatroomName, setNewChatroomName] = useState("");
  const [selectedChatroom, setSelectedChatroom] = useState("");
  const [created, setCreated] = useState(false);
  const [conected, setConnected] = useState(false);
  const chatWindowRef = useRef();
  const [currentUser, setCurrentUser] = useState("");
  const [users, setUsers] = useState([]); // Simulated user list
  const [messages, setMessages] = useState([]);
  

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
  useEffect(() => {
    const headers = { 'Authorization':  getCookie("loggedIn") };
    fetch("http://localhost:8080/users/byId", { headers })
    .then(response => response.text())
    .then(data => setCurrentUser(data));
  }, []);

  return (
    <>
    {conected ? <ChatWindow sendMessage={sendMessage} 
                            chatWindowRef={chatWindowRef} 
                            username={username} 
                            currentUser={currentUser} 
                            setCurrentUser={setCurrentUser} 
                            selectedChatroom={selectedChatroom}
                            users={users}
                            setUsers={setUsers}
                            leave={leave}
                            messages={messages}
                            setMessages={setMessages}
                            /> 

                            : 

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
              onClick={() => connect(setConnected, chatWindowRef, currentUser, setCurrentUser, selectedChatroom, setUsers)}
              type="button"
              className="mt-4 w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
            >
              Connect
        </button>
      </div>
    </div>
    }
    </>
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

var stompClient = null;
function connect(setConnected, chatWindowRef, currentUser, setCurrentUser, selectedChatroom, setUsers) {
    const headers = { 'Authorization': `Bearer ` + getCookie("loggedIn") };
  var socket = new SockJS('http://localhost:8080/websocket');
    
  stompClient = Stomp.over(socket);
  stompClient.connect({}, function (frame) {
        setConnected(true)
  console.log('Connected: ' + frame);

    
    stompClient.subscribe('/topic/chatroom', function (chatMessage) {
     showMessage(JSON.parse(chatMessage.body), chatWindowRef, currentUser, setCurrentUser, selectedChatroom);
     //sendMessageUsersList();
    });
    stompClient.subscribe('/topic/usersList', function (chatMessage) {
      //showMessage(JSON.parse(chatMessage.body), chatWindowRef, currentUser, setCurrentUser, selectedChatroom);
      setUsers(JSON.parse(chatMessage.body));
      
      
     });
     sendMessage(currentUser + " connected to the chat", currentUser, selectedChatroom, "system");

  });
  sendMessageUsersList();
}
const sendMessage = (newMessage, name, selectedChatroom, type) => {
    stompClient.send("/app/chat", {}, JSON.stringify({'chatroom' : selectedChatroom, 'username': name, 'content': newMessage, 'type' : type}));
    setTimeout(() => sendMessageUsersList(), 350);
}
function sendMessageUsersList(){
  stompClient.send("/app/userList", {}, );
}

const leave = (name, setConnected, selectedChatroom) => {
  stompClient.send("/app/chat", {}, JSON.stringify({'chatroom' : selectedChatroom, 'username': name, 'content': name + " disconnected from the chat", 'type' : "system"}));
  stompClient.send("/app/leave", {}, JSON.stringify({'username': name}));
  
  stompClient.disconnect();
  setConnected(false);
  window.location.reload();
}


function showMessage(message, chatWindowRef, currentUser, setCurrentUser) {
    console.log(message)
    
    var user = message.username;
    var time = message.sentAt;
    var messageText = message.content;

    var div = document.createElement("div");
    
    div.className = "mb-4 mr-auto text-left max-w-xs sm:max-w-sm";

    var nameAndTimeDiv = document.createElement("div");
    nameAndTimeDiv.className = "text-xs text-gray-500 mb-1";
    nameAndTimeDiv.innerText = user + " · ";

    var timeSpan = document.createElement("span");
    timeSpan.className = "font-semibold";
    timeSpan.innerText = time;

    nameAndTimeDiv.appendChild(timeSpan);

    var messageDiv = document.createElement("div");
    messageDiv.className = "p-3 rounded-lg bg-gray-300 text-gray-700";
    if(message.type == "system"){
      messageDiv.className = "";
      nameAndTimeDiv.className = "text-xs text-gray-500 mb-1";
      nameAndTimeDiv.innerText = "";
      div.className = "text-sm text-gray-500 italic text-center mx-auto max-w-xs sm:max-w-sm";
    }else if(currentUser == message.username){
      div.className = "mb-4 ml-auto text-right max-w-xs sm:max-w-sm";
      messageDiv.className = "p-3 rounded-lg bg-blue-500 text-white";
    }

    var messageTextP = document.createElement("p");
    messageTextP.innerText = messageText;

    messageDiv.appendChild(messageTextP);
    div.appendChild(nameAndTimeDiv);
    div.appendChild(messageDiv);
    chatWindowRef.current.appendChild(div);
  
}




export default ChatroomSelect;
