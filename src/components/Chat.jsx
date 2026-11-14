import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { createSocketConnection } from "../utils/socket";
import { useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const formatMessageTime = (timestamp) => {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) {
    return "Time unavailable";
  }

  return date.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "medium",
  });
};

const Chat = () => {
  const { targetUserId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesContainerRef = useRef(null);
  const user = useSelector((store) => store.user);
  const userId = user?._id;
  const firstName = user?.firstName;

  const fetchChatMessages = useCallback(async () => {
    const chat = await axios.get(BASE_URL + "/chat/" + targetUserId, {
      withCredentials: true,
    });

    console.log(chat.data.messages);

    const chatMessages = chat?.data?.messages.map((msg) => {
      const { senderId, text, createdAt } = msg;
      return {
        _id: msg._id,
        senderId: senderId?._id,
        firstName: senderId?.firstName,
        lastName: senderId?.lastName,
        text,
        createdAt,
        seenAt: msg.seenAt,
      };
    });
    return chatMessages;
  }, [targetUserId]);

  useEffect(() => {
    fetchChatMessages()
      .then(setMessages)
      .catch((error) => console.error("Failed to load chat messages:", error));
  }, [fetchChatMessages]);

  useEffect(() => {
    const messagesContainer = messagesContainerRef.current;
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (!userId) {
      return;
    }
    const socket = createSocketConnection();
    // As soon as the page loaded, the socket connection is made and joinChat event is emitted
    socket.emit("joinChat", {
      firstName,
      userId,
      targetUserId,
    });

    socket.on(
      "messageReceived",
      ({ _id, senderId, firstName, lastName, text, createdAt, seenAt }) => {
        console.log(firstName + " :  " + text);
        setMessages((messages) => [
          ...messages,
          {
            _id,
            senderId,
            firstName,
            lastName,
            text,
            createdAt,
            seenAt,
          },
        ]);
        if (String(senderId) !== String(userId)) {
          fetchChatMessages()
            .then(setMessages)
            .catch((error) =>
              console.error("Failed to mark received message as seen:", error)
            );
        }
      }
    );

    socket.on("messagesSeen", ({ messageIds, seenAt }) => {
      const seenMessageIds = new Set(messageIds);
      setMessages((messages) =>
        messages.map((message) =>
          seenMessageIds.has(message._id) ? { ...message, seenAt } : message
        )
      );
    });

    return () => {
      socket.disconnect();
    };
  }, [fetchChatMessages, firstName, userId, targetUserId]);

  const sendMessage = () => {
    if (!userId) {
      return;
    }

    const socket = createSocketConnection();
    socket.emit("sendMessage", {
      firstName,
      lastName: user.lastName,
      userId,
      targetUserId,
      text: newMessage,
    });
    setNewMessage("");
  };

  return (
    <div className="w-3/4 mx-auto border border-gray-600 m-5 h-[70vh] flex flex-col">
      <h1 className="p-5 border-b border-gray-600">Chat</h1>
      <div ref={messagesContainerRef} className="flex-1 overflow-scroll p-5">
        {messages.map((msg, index) => {
          const isOwnMessage = String(msg.senderId) === String(userId);
          return (
            <div
              key={index}
              className={
                "chat " +
                (isOwnMessage ? "chat-end" : "chat-start")
              }
            >
              <div className="chat-header">
                {`${msg.firstName}  ${msg.lastName}`}
                <time
                  className="text-xs opacity-50"
                  dateTime={msg.createdAt}
                >
                  {formatMessageTime(msg.createdAt)}
                </time>
              </div>
              <div className="chat-bubble">{msg.text}</div>
              {isOwnMessage && msg.seenAt && (
                <div className="chat-footer opacity-50">Seen</div>
              )}
            </div>
          );
        })}
      </div>
      <div className="p-5 border-t border-gray-600 flex items-center gap-2">
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
          className="flex-1 border border-gray-500 text-white rounded p-2"
        ></input>
        <button onClick={sendMessage} className="btn btn-secondary">
          Send
        </button>
      </div>
    </div>
  );
};
export default Chat;