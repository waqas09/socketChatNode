
$(document).ready( function() {
    
    var url = "https://socketchatnode.herokuapp.com/"
    var port = 3800;
    var socket = io.connect(url + ":" + port);

    socket.on("connect", function() {
        $("#conversation").append("<div class=\"message\">CONNECTED!</div>");
    });

    socket.on("disconnect", function() {
        $("#conversation").html("<div class=\"message\">CONNECTION FAILED</div>");
    });

    var messages = [];
    socket.on("message", function(data) {
        if (data.message) {
            messages.push(data);
            $("#conversation").append( "<div class=\"message\"><strong>" + data.username + ": </strong>" + data.message + "</div>" );
            $("#conversation").scrollTop( $("#conversation").height() );
        }
    });

    var sendMessage = function(message, username) {
        var username = $("#nameField").val();
        var message = $("#messageField").val();

        if (username == "") {
            window.alert("Please enter your name!");
            $("#nameField").focus();
            return;
        }

        if (message == "") return;

        socket.emit("send", { message: message, username: username, socketID: socket.sessionid }, function(data) {
            if (data == "success") {
                $("#flasher").fadeIn("fast").fadeOut("slow");
            }
        });

        $("#messageField").val("").focus();
    }

    $("#sendButton").click( function(e) {
        sendMessage();
    });

    $("#messageField").keyup(function(e) {
        if(e.keyCode == 13 && $("#messageField").is(":focus") ) {
            sendMessage();
        }
    });

    $("#nameField").focus();
    $("#flasher").fadeOut('slow');

});
