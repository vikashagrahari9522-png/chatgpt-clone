import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentChatId: null,
    chats: [],
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