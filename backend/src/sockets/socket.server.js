const { Server } = require("socket.io");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");

const userModel = require("../models/user.model");
const aiService = require("../service/ai.service");
const messageModel = require("../models/message.model");

const {
  createMemory,
  queryMemory,
} = require("../service/vector.service");

function initSocketServer(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  // SOCKET AUTHENTICATION

  io.use(async (socket, next) => {
    const cookies = cookie.parse(
      socket.handshake.headers?.cookie || ""
    );

    if (!cookies.token) {
      return next(
        new Error("Authentication error: No token provided")
      );
    }

    try {
      const decoded = jwt.verify(
        cookies.token,
        process.env.JWT_SECRET
      );

      const user = await userModel.findById(decoded.id);

      if (!user) {
        return next(
          new Error("Authentication error: User not found")
        );
      }

      socket.user = user;

      next();
    } catch (error) {
      console.error(
        "Socket authentication error:",
        error
      );

      next(
        new Error("Authentication error: Invalid token")
      );
    }
  });

  // CONNECTION

  io.on("connection", (socket) => {
    console.log(
      "User connected:",
      socket.user._id
    );

    // AI MESSAGE
    socket.on("ai-message", async (messagePayload) => {
      console.log(
        "Message received:",
        messagePayload
      );

      try {
        const userId = socket.user._id;

        // VALIDATION
        if (!messagePayload?.chat) {
          return socket.emit("ai-error", {
            message: "Chat ID is required",
          });
        }

        if (!messagePayload?.content) {
          return socket.emit("ai-error", {
            message: "Message content is required",
          });
        }

        // SAVE USER MESSAGE
        // + GENERATE USER VECTOR
        const [userMessage, vectors] =
          await Promise.all([
            messageModel.create({
              chat: messagePayload.chat,
              user: userId,
              content: messagePayload.content,
              role: "user",
            }),

            aiService.generateVectors(
              messagePayload.content
            ),
          ]);

        console.log(
          "User message saved:",
          userMessage._id
        );

        console.log(
          "Generated vector length:",
          vectors?.length
        );

        if (
          !vectors ||
          vectors.length === 0
        ) {
          throw new Error(
            "Failed to generate embedding vector"
          );
        }

        // SAVE USER MESSAGE
        // IN PINECONE
        await createMemory({
          vectors: vectors,

          messageId:
            userMessage._id.toString(),

          metadata: {
            chat: messagePayload.chat.toString(),
            user: userId.toString(),
            text: messagePayload.content,
          },
        });

        console.log(
          "User memory saved in Pinecone"
        );

        // GET LONG-TERM MEMORY
        // + CURRENT CHAT HISTORY
        const [memory, chatHistory] =
          await Promise.all([
            // LONG-TERM MEMORY
            // ALL CHATS OF SAME USER
            queryMemory({
              queryVectors: vectors,

              limit: 5,

              metadata: {
                user: userId.toString(),
              },
            }),

            // CURRENT CHAT HISTORY
            messageModel
              .find({
                chat: messagePayload.chat,
              })
              .sort({
                createdAt: -1,
              })
              .limit(20)
              .lean(),
          ]);

        // OLD -> NEW ORDER
        chatHistory.reverse();

        console.log(
          "Long-term memory results:",
          memory
        );

        console.log(
          "Chat history length:",
          chatHistory.length
        );

        // FORMAT CHAT HISTORY
        const history =
          chatHistory.map((item) => ({
            role: item.role,
            content: String(item.content),
          }));

        // GET RELEVANT MEMORIES
        const stm = memory
          .map(
            (item) =>
              item.metadata?.text
          )
          .filter(Boolean);

        console.log(
          "Relevant long-term memories:",
          stm
        );

        // ADD LONG-TERM MEMORY
        if (stm.length > 0) {
          history.unshift({
            role: "user",

            content:
              "Relevant previous memories from the user's other conversations:\n" +
              stm.join("\n"),
          });
        }

        console.log(
          "Final history sent to Gemini:",
          history
        );

        // GENERATE AI RESPONSE
        const aiResponse =
          await aiService.generateResponse(
            history
          );

        console.log(
          "AI response:",
          aiResponse
        );

        // SEND AI RESPONSE TO USER FIRST
        socket.emit("ai-response", {
          content: aiResponse,
          chat: messagePayload.chat,
        });

        console.log(
          "AI response sent to user"
        );

        // SAVE AI RESPONSE AFTER SENDING
        try {
          // SAVE AI RESPONSE IN MONGODB
          const responseMessage =
            await messageModel.create({
              chat: messagePayload.chat,
              user: userId,
              content: aiResponse,
              role: "model",
            });

          console.log(
            "AI message saved:",
            responseMessage._id
          );

          // GENERATE AI VECTOR
          const responseVectors =
            await aiService.generateVectors(
              aiResponse
            );

          console.log(
            "AI response vector length:",
            responseVectors?.length
          );

          if (
            !responseVectors ||
            responseVectors.length === 0
          ) {
            throw new Error(
              "Failed to generate AI response embedding"
            );
          }

          // SAVE AI MESSAGE
          // IN PINECONE
          await createMemory({
            vectors: responseVectors,

            messageId:
              responseMessage._id.toString(),

            metadata: {
              chat:
                messagePayload.chat.toString(),

              user:
                userId.toString(),

              text: aiResponse,
            },
          });

          console.log(
            "AI response memory saved in Pinecone"
          );
        } catch (error) {
          // AI response has already been
          // sent to the user.
          console.error(
            "Error saving AI response memory:",
            error
          );
        }
      } catch (err) {
        console.error(
          "Error handling ai-message:",
          err
        );

        socket.emit("ai-error", {
          message:
            err.message ||
            "Internal server error",
        });
      }
    });

    // DISCONNECT
    socket.on("disconnect", () => {
      console.log(
        "User disconnected:",
        socket.user?._id
      );
    });
  });

  return io;
}

module.exports = initSocketServer;