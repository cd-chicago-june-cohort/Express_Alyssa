$(document). ready(function (){
    var user_name = prompt('Your name:');
    // this triggers the connection event in our server!
    var socket  = io. connect();
    // we'll write all the socket stuff after the above line!
    if (user_name != null){
        socket.emit('new_user_join', {user_name: user_name});
    }

    var scrolled = false;
    function updateScroll(){
        if(!scrolled){
            var element = document.getElementById("chats");
            element.scrollTop = element.scrollHeight;
        }
    }

    $(document).on('scroll', '#chats', function(){
        scrolled=true;
    });
    // initial chat set up
    socket.on('all_chats', function(data){
        var chat_html = "<h3>Conversation Board</h3><div id = 'chats'>";
        console.log(data);
        for (var i=0; i<data.chats.length; i++){
            chat_html += '<p>' + data.chats[i].name + ': ' + data.chats[i].message + '</p>';
        }
        chat_html += "</div><div id='message_form'><form action='' method='post' id='new_message'><input type='text' placeholder='enter your message here' name='message' id='message_input'><input type='submit' value ='Send'></form></div>";
        $('#container').html(chat_html);
        updateScroll();
    });

    // new user joins chat
    socket.on('user_joined', function(data){
        var new_user_html = '<p class="system_message">' + data.new_user.user_name + ' has joined the chat</p.';
        $('#chats').append(new_user_html);
        updateScroll();
    });

    $(document).on('submit', '#message_form', function(event){
        event.preventDefault();
        var message = $('#message_input').val();
        $('#message_input').val('');
        socket.emit('post_message', {name: user_name, message: message});
        updateScroll();
    });

    socket.on('update_messages', function(data){
        var new_message_html = '<p>' + data.new_message.name + ': ' + data.new_message.message + '</p>';
        $('#chats').append(new_message_html);
        updateScroll();
    });

    socket.on('user_left', function(data){
        var user_left_html = '<p class="system_message">' + data.disconnected_user.user_name + ' has left the chat</p.';
        $('#chats').append(user_left_html);
        updateScroll();
    });  
});
