import { createSlice } from "@reduxjs/toolkit";

const starterMessages = [
    {
        id: "welcome",
        role: "assistant",
        content:
            "Hello! I’m your AI companion. What would you like to work through today?",
    },
];

const initialState = {
    currentChatId: 1,

    chats: [
        {
            id: 1,
            title: "Welcome to your workspace",
            preview: "Hello! I’m your AI companion...",
            messages: starterMessages,
        },

        {
            id: 2,
            title: "Ideas for a weekend project",
            preview: "A few directions worth exploring...",
            messages: [
                {
                    id: "2-user",
                    role: "user",
                    content: "Ideas for a weekend project",
                },
                {
                    id: "2-assistant",
                    role: "assistant",
                    content:
                        "A few directions worth exploring...",
                },
            ],
        },

        {
            id: 3,
            title: "Plan a healthier routine",
            preview: "Start with one small habit...",
            messages: [
                {
                    id: "3-user",
                    role: "user",
                    content: "Plan a healthier routine",
                },
                {
                    id: "3-assistant",
                    role: "assistant",
                    content:
                        "Start with one small habit...",
                },
            ],
        },
    ],
};

const chatSlice = createSlice({
    name: "chat",

    initialState,

    reducers: {
        createChat(state, action) {
            const { id, title } = action.payload;

            state.chats.unshift({
                id,
                title,
                preview: "No messages yet",
                messages: [],
            });

            state.currentChatId = id;
        },

        selectChat(state, action) {
            state.currentChatId = action.payload;
        },

        addMessage(state, action) {
            const { chatId, message } = action.payload;

            const chat = state.chats.find(
                ({ id }) => id === chatId
            );

            if (!chat) {
                return;
            }

            chat.messages.push(message);

            if (message.role === "user") {
                if (chat.title === "New conversation") {
                    chat.title = message.content;
                }

                chat.preview = message.content;
            } else {
                chat.preview = message.content;
            }
        },

        setChats(state, action) {
            state.chats = action.payload;
        },
    },
});

export const {
    createChat,
    selectChat,
    addMessage,
    setChats,
} = chatSlice.actions;

export default chatSlice.reducer;