const express = require('express')
const cookieParser = require('cookie-parser')
const authRoutes = require("./routes/auth.routes")
const chatRoutes = require("./routes/chat.routes")
const cors = require('cors')

const app = express();

app.use(express.json())
app.use(cookieParser())

app.use(cors({
    origin: "https://chatgpt-clone-3akp.onrender.com",
    credentials: true
}))

app.use('/api/auth', authRoutes)
app.use('/api/chat', chatRoutes)

app.get('/', (req, res) => {
    res.send('ChatGPT Clone Backend is running');
});

module.exports = app