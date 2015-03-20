var port = 3800;
var serverUsername = "Server";

var express = require("express");
var app = express();

app.set("views", __dirname + "/tpl");
app.set("view engine", "jade");
app.engine("jade", require("jade").__express);
app.get("/", function (req, res) {
    res.render("page");
});
app.use(express.static(__dirname + "/public"));

var io = require("socket.io").listen(app.listen(port));
console.log("Listening on port " + port);

io.sockets.on("connection", function (socket) {
    console.log("Connected; sid: " + socket.id);

    socket.emit("message", {username: serverUsername, message: "Welcome to SocketChat"});
    socket.broadcast.emit("message", {username: serverUsername, message: "A new user has joined! " + socket.id});

    socket.on("send", function (data, fn) {
        io.sockets.emit("message", data);
        if (fn && typeof (fn) == "function") {
            fn("success");
        }
    });

    socket.on("disconnect", function (socket) {
        console.log("Disconnected; sid: " + this.id);
    });
});