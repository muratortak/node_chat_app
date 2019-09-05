//initiaing the request. Request from client to the server. io() comes with the js library from the url above. It comes with with socket.io
var socket = io();

function scrollToBottom() {
    // Selectors 
    var messages = $('#messages');
    var newMessage = messages.children('li:last-child');
    // Heights
    //prop will work across all browsers
    var clientHeight = messages.prop('clientHeight');
    var scrollTop = messages.prop('scrollTop');
    var scrollHeight = messages.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight(); 
    if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight  >= scrollHeight){
        messages.scrollTop(scrollHeight);
    }

}

socket.on('connect', function(){
    console.log('Connected to server');
    var params = $.deparam(window.location.search);
    socket.emit('join', params, function(err) {
        if(err){
            alert(err);
            window.location.href = '/';
        }else{
            console.log('No error');
        }
    });
    // socket.emit('createEmail', {
        // to: 'jen@example.com',
        // text: 'This is andrew'
    // });

    // socket.emit('createMessage', {
    //     from: 'Server',
    //     text: 'this message is from server',
    //     createdAt: Date().toString()
    // });
});

socket.on('disconnect', function(){
    console.log('Disconnected from server');
});

socket.on('updateUserList', function(users) {
    console.log('User list', users);
    var ol = $('<ol></ol>');

    users.forEach(function(user){
        ol.append($('<li></li>').text(user));
    });

    $('#users').html(ol);
});

//the data from server.js provided in the socket.emit is being passed by the first argument to the callback here
socket.on('newEmail', function(email){
    console.log('New email', email);
});

socket.on('newMessage', function(message){

    var formattedTime = moment(message.createdAt).format('h:mm a');
    var template = $('#message-template').html();
    var html = Mustache.render(template, {
        text: message.text,
        from: message.from,
        createdAt: formattedTime
    });

    $('#messages').append(html);
    scrollToBottom();

    // var li = $('<li></li>');
    // li.text(`${message.from} ${formattedTime}: ${message.text}`);

    // $('#messages').append(li);
});

// socket.emit('createMessage', {
//     from: 'Frank',
//     text: 'hi'
// }, function(data){
//     console.log('Got it', data);
// })

socket.on('newLocationMessage', function(message) {
    var formattedTime = moment(message.createdAt).format('h:mm a');
    var template = $('#location-message-template').html();
    var html = Mustache.render(template, {
        url: message.url,
        from: message.from,
        createdAt: formattedTime
    });

    $('#messages').append(html);
    scrollToBottom();

    // var li = $('<li></li>');
    // var a = $('<a target="_blank">My Current Location</a>');
    // li.text(`${message.from} ${formattedTime}: `);
    // a.attr('href', message.url);
    // li.append(a);
    // $('#messages').append(li);

})

$('#message-form').on('submit', function(e){
    e.preventDefault();
    var messageTextbox = $('[name=message]');

    socket.emit('createMessage', {
        text: messageTextbox.val()
    }, function() {
        messageTextbox.val('');
    });

});


var locationButton = $('#send-location');

locationButton.on('click', function() {
    console.log('geolocatin');
    if(!navigator.geolocation){
        return alert('Geolocation no supported by your browser.');
    } 

    locationButton.attr('disabled', 'disabled').text('Sending location...');
    navigator.geolocation.getCurrentPosition(function(position){
        // console.log(position);
        locationButton.removeAttr('disabled').text('Send Location');
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        })
    }, function(){
        alert('Unable to fetch location.');
        locationButton.removeAttr('disabled').text('Send Location');
    });

});




