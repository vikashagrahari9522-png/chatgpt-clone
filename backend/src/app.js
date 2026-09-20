const express = require('express')
const cookieParser = require('cookie-parser')
const authRoutes = require("./routes/auth.routes")
const chatRoutes = require("./routes/chat.routes")
const cors = require('cors')
const path = require('path')

const app = express();
app.use(express.json())
app.use(cookieParser())
app.use(express.static(path.join(__dirname, '../public')))
app.use(cors({
    origin: "https://chatgpt-clone-3akp.onrender.com",
    credentials: true
}))

app.use('/api/auth', authRoutes)
app.use('/api/chat', chatRoutes)

app.get("*name", (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'))
})


module.exports = app