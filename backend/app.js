require("dotenv").config();
const http = require("http");
const express = require("express");

var web_server = require("ws").Server;
var s = new web_server({ port: 5000 });

const cors = require("cors");
const jwt = require("jsonwebtoken");

const authRoute = require("./routes/auth.js");
const dashboardRoute = require("./routes/dashboard.js");
const chatBoxRoute = require("./routes/chatBox.js");
const userRoute = require("./routes/user.js");
const loveRelRoute = require("./routes/loveRel.js");

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


s.on('connection', function(ws){
	// ws -> a particular client
	// console.log(s.clients.values());
	// console.log(s.clients.entries());

	ws.on('message', async function(message){
		parsedMessage = JSON.parse(message);

		switch(parsedMessage.type){
			case "authenticate":
				const { token } = parsedMessage.data;
				try{
						const decodedToken = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
						const { user_id } = decodedToken;
						if(user_id !== undefined && user_id !== null){
							user = await User.findOne({ _id: user_id}, "_id first_name last_name").maxTimeMS(30000);
							ws.userId = user._id.toString();
							ws.user = user;
						}
				}catch(error){
						console.log(error);
				}
				break;
			case "message":
				if(ws.userId){
					let { message, chatboxId, destinationUserId } = parsedMessage.data;
					let newChatboxCreated = false;

					// if there is no chat box between the users
					// 	make a new chatboxId
					if(!chatboxId){
						let chatBox = await Chatbox.findOne({
								$and: [
										{
												"users": {
														$in: [ws.userId]
												}
										},
										{
												"users": {
														$in: [destinationUserId]
												}
										}
								]
						});
						if(chatBox !== null && chatBox.length !== 0){
								chatboxId = chatBox._id.toString();
						}else{
								newChatboxCreated = true;
								const newChatbox = await Chatbox.create({users: [ws.userId, destinationUserId]});
								chatboxId = newChatbox._id.toString();
						}
					}

					let chatItemQuery = {
						chatboxId: chatboxId,
						user: ws.userId,
						message: message,
						viewers: [ws.userId]
					};

					const newChatItem = await ChatItem.create(chatItemQuery);
					newChatItem.user = ws.user;

					const chatbox = await Chatbox.findOne({_id: chatboxId}).populate("users", "_id");
					if(chatbox !== null){
						const { users: chatboxUsers } = chatbox;
						// console.log(s.clients.entries());

						s.clients.forEach(webSocketClient => {
							chatboxUsers.forEach(chatboxUser => {

								// console.log(chatboxUser._id.toString());
								if(webSocketClient.userId === chatboxUser._id.toString()){
									webSocketClient.send(JSON.stringify({
										data: newChatItem,
										flags: {
											newChatboxCreated
										}
									}));
								}

							});
						});

					}
				}
				break;

		}
	})

	ws.on('close', function(){
		console.log("I lost a client");
	})
});


app.use('/', authenticate);
app.use('/api/auth', authRoute);
app.use('/api/v1', authorize);
app.use('/api/v1', dashboardRoute);
app.use('/api/v1', chatBoxRoute);
app.use('/api/v1/user', userRoute);
app.use('/api/v1/love-rel', loveRelRoute);

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
