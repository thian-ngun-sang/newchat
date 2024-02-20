require("dotenv").config();
const http = require("http");
const express = require("express");
const socketIO = require('socket.io');
const {instrument} = require("@socket.io/admin-ui");

const cors = require("cors");
const jwt = require("jsonwebtoken");

const authRoute = require("./routes/auth.js");
const dashboardRoute = require("./routes/dashboard.js");
const chatBoxRoute = require("./routes/chatBox.js");
const userRoute = require("./routes/user.js");

const { notFound } = require("./errors/notFound.js");
const { internalError } = require("./errors/internalError.js");
const { authenticate } = require("./middlewares/authenticate.js");
const { authorize } = require("./middlewares/authorize.js");

const { connectDB }	= require("./db/connect.js");

const User = require("./models/User.js");
const ChatItem = require("./models/ChatItem.js");
const Chatbox = require("./models/Chatbox.js");

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static("media"));

const server = http.createServer(app);

app.use(internalError);
const io = socketIO(server, {
	// cors: {
	// 	origin: "http://localhost:3000/",
		// credentials: true
	// }
	cors: true
});


// make a namespace called "user"
const userIo = io.of("/user");
const chatIo = io.of("/chat");

function getUsernameFromToken(token){
	return token;
}

// set up a middleware for userIo
// socket => info about the socket itself
// next => next middleware
userIo.use((socket, next) => {
	if(socket.handshake.auth.token){
		socket.username = getUsernameFromToken(socket.handshake.auth.token);
		next();
	}else{
		next(new Error("Token not provided"));
	}
});

let chatRoom;
chatIo.on("connection", socket => {
	console.log(socket.user);

	socket.on("join-room", chatboxId => {
		console.log(chatboxId);
		// console.log(socket.token);
		chatRoom = chatboxId;
		socket.join(chatRoom);

		// console.log("Chat room joined", chatRoom);
	});

	socket.on("send-message", async (chatItem, flags) => {
		console.log(chatItem);
		const { _id: currentUserId } = socket.user;
		const { message } = chatItem;
		const { chatboxId, userId } = flags;

		if(message !== "" && chatboxId !== undefined){
			let chatItemQuery = {
				chatboxId: chatboxId,
				user: currentUserId.toString(),
				message: message
			};
			const newChatItem = await ChatItem.create(chatItemQuery);

			const { email, user_name, ...user } = socket.user._doc;
	
			if(chatRoom !== undefined){
				console.log(chatRoom);
				chatIo.to(chatRoom).emit("receive-message", { ...newChatItem._doc, user});
			}

			const chatbox = await Chatbox.findOne({_id: chatboxId}).populate("users", "_id");
			if(chatbox !== null){
				const { users: chatboxUsers } = chatbox;
				
				for(let i = 0; i < chatboxUsers.length; i++){
					let currentChatboxUser = chatboxUsers[i]._id.toString();
					if(currentChatboxUser !== currentUserId.toString){
						chatIo.to(currentChatboxUser).emit("received-latest-message", newChatItem);
					}
				}
			}

		}else if(userId !== undefined){
			chatIo.to(userId.toString()).emit("receive-message", null);
		}
	})

	socket.on("consume-latest-item", () => {
		console.log("Comsumed latest item");
	});

	socket.on("leave-room", (room) => {
		console.log("leave-room", room);
		socket.leave(room);
		// console.log("Chat socket has been removed", room);
	});
});

chatIo.use(async(socket, next) => {
	if(socket.handshake.auth.token){
		const token = socket.handshake.auth.token;
		const decodedToken = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
            const { user_id } = decodedToken;
            let user = await User.findById(user_id, "first_name last_name user_name profile_image email gender")
                // let { password, created_at, updated_at, ...user } = response._doc;)
                .then(user => user)
                .catch(error => console.log(error))
		if(user === null || user === undefined){
			return next(new Error("Invalid token"));
		}
		socket.user = user;
		next();
	}else{
		next(new Error("Token not provided"));
	}
});


instrument(io, {auth: false});

app.use('/', authenticate);
app.use('/api/auth', authRoute);
app.use('/api/v1', authorize);
app.use('/api/v1', dashboardRoute);
app.use('/api/v1', chatBoxRoute);
app.use('/api/v1/user', userRoute);

app.get('/', async (req, res) => {

	return res.status(200).json({msg: "Hello from new chat"})
});

app.use(notFound);

const PORT = 4000;
const start = async () => {
	await connectDB(process.env.MONGO_URI);

	// app.listen(PORT, () => {
	// 	console.log("Server listen on http://127.0.0.1:" + PORT);
	// })
	server.listen(PORT, () => {
		console.log("Server listen on http://127.0.0.1:" + PORT);
	})
}

start();
