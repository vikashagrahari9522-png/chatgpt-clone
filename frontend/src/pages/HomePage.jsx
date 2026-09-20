import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { io } from "socket.io-client";

import "../styles/theme.css";

import ChatHeader from "../components/chat/ChatHeader";
import ChatSidebar from "../components/chat/ChatSidebar";
import MessageComposer from "../components/chat/MessageComposer";
import MessageList from "../components/chat/MessageList";

import {
    addMessage,
    createChat,
    selectChat,
    setChats,
} from "../store/chatSlice";

const HomePage = () => {
    const [input, setInput] = useState("");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isThinking, setIsThinking] = useState(false);

    const socketRef = useRef(null);

    const dispatch = useDispatch();

    const { chats, currentChatId } = useSelector(
        (state) => state.chat
    );

    const currentChat = chats.find(
        (chat) => chat.id === currentChatId
    );

    const messages = currentChat?.messages || [];

    useEffect(() => {
        const newSocket = io("https://chatgpt-clone-3akp.onrender.com", {
            withCredentials: true,
        });

        socketRef.current = newSocket;

        axios
            .get("https://chatgpt-clone-3akp.onrender.com/api/chat", {
                withCredentials: true,
            })
            .then((response) => {
                console.log("Chats loaded:", response.data);

                if (response.data?.chats) {
                    const backendChats =
                        response.data.chats
                            .filter((chat) => chat?._id)
                            .map((chat) => ({
                                id: String(chat._id),
                                preview:
                                    chat.messages?.length
                                        ? chat.messages[
                                            chat.messages.length - 1
                                        ].content
                                        : "No messages yet",
                                messages: chat.messages || [],
                            }));

                    console.log(
                        "Formatted chats:",
                        backendChats
                    );

                    dispatch(setChats(backendChats));

                    if (backendChats.length > 0) {
                        dispatch(
                            selectChat(
                                backendChats[0].id
                            )
                        );
                    }
                }
            })
            .catch((error) => {
                console.error(
                    "Error loading chats:",
                    error.response?.data ||
                    error.message
                );
            });

        newSocket.on("connect", () => {
            console.log(
                "Socket connected:",
                newSocket.id
            );
        });

        newSocket.on("connect_error", (error) => {
            console.error(
                "Socket connection error:",
                error.message
            );
        });

        newSocket.on("disconnect", (reason) => {
            console.log(
                "Socket disconnected:",
                reason
            );
        });

        newSocket.on("ai-response", (data) => {
            console.log("AI response:", data);

            if (!data?.chat) {
                console.error(
                    "AI response does not contain chat id"
                );

                setIsThinking(false);
                return;
            }

            dispatch(
                addMessage({
                    chatId: String(data.chat),
                    message: {
                        id: Date.now(),
                        role: "assistant",
                        content: data.content,
                    },
                })
            );

            setIsThinking(false);
        });

        newSocket.on("ai-error", (data) => {
            console.error("AI error:", data);

            setIsThinking(false);
        });

        return () => {
            newSocket.disconnect();
            socketRef.current = null;
        };
    }, [dispatch]);

    const handleNewChat = async () => {
        const title = window.prompt(
            "What would you like to call this conversation?",
            "New conversation"
        );

        if (!title || !title.trim()) {
            return;
        }

        try {
            const response = await axios.post(
                "https://chatgpt-clone-3akp.onrender.com/api/chat",
                {
                    title: title.trim(),
                    messages: [],
                },
                {
                    withCredentials: true,
                }
            );

            console.log(
                "Chat created:",
                response.data
            );

            const createdChat =
                response.data?.chat;

            if (!createdChat?._id) {
                console.error(
                    "Backend did not return chat _id"
                );
                return;
            }

            const chatId =
                String(createdChat._id);

            console.log(
                "NEW MONGODB CHAT ID:",
                chatId
            );

            dispatch(
                createChat({
                    id: chatId,
                })
            );

            setInput("");
            setIsThinking(false);
            setIsSidebarOpen(false);
        } catch (error) {
            console.error(
                "Error creating chat:",
                error.response?.data ||
                error.message
            );
        }
    };

    const handleSelectChat = (chat) => {
        console.log(
            "Selected chat:",
            chat
        );

        if (!chat?.id) {
            console.error(
                "Chat ID is missing"
            );
            return;
        }

        const chatId = String(chat.id);

        console.log(
            "SELECTED MONGODB CHAT ID:",
            chatId
        );

        dispatch(selectChat(chatId));

        setInput("");
        setIsThinking(false);
        setIsSidebarOpen(false);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const trimmedInput = input.trim();

        if (!trimmedInput) {
            return;
        }

        if (isThinking) {
            return;
        }

        const socket = socketRef.current;

        if (!socket) {
            console.error(
                "Socket is not initialized"
            );
            return;
        }

        if (!socket.connected) {
            console.error(
                "Socket is disconnected"
            );
            return;
        }

        if (!currentChatId) {
            console.error(
                "Please create or select a chat first"
            );
            return;
        }

        const chatId = String(currentChatId);

        console.log(
            "=============================="
        );

        console.log(
            "CHAT ID BEING SENT:",
            chatId
        );

        console.log(
            "CHAT ID TYPE:",
            typeof chatId
        );

        console.log(
            "CURRENT CHAT:",
            currentChat
        );

        console.log(
            "=============================="
        );

        const userMessage = {
            id: Date.now(),
            role: "user",
            content: trimmedInput,
        };

        dispatch(
            addMessage({
                chatId: chatId,
                message: userMessage,
            })
        );

        setInput("");
        setIsThinking(true);

        socket.emit("ai-message", {
            chat: chatId,
            content: trimmedInput,
        });

        console.log(
            "Message sent to backend:",
            {
                chat: chatId,
                content: trimmedInput,
            }
        );
    };

    return (
        <main className="chat-page">

            <ChatSidebar
                isOpen={isSidebarOpen}
                previousChats={chats}
                activeChatId={currentChatId}
                onClose={() =>
                    setIsSidebarOpen(false)
                }
                onNewChat={handleNewChat}
                onSelectChat={handleSelectChat}
            />

            {isSidebarOpen && (
                <button
                    className="sidebar-scrim"
                    type="button"
                    aria-label="Close chat history"
                    onClick={() =>
                        setIsSidebarOpen(false)
                    }
                />
            )}

            <section className="chat-main">

                <ChatHeader
                    onOpenSidebar={() =>
                        setIsSidebarOpen(true)
                    }
                />

                <MessageList
                    messages={messages}
                    isThinking={isThinking}
                />

                <MessageComposer
                    input={input}
                    isThinking={isThinking}
                    onChange={setInput}
                    onSubmit={handleSubmit}
                />

            </section>
        </main>
    );
};

export default HomePage;