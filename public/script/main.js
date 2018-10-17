let socket = io.connect();
console.log(socket);

let nick = prompt('Quel est votre pseudo ?');
socket.emit('nickname', nick);


socket.on('receiving', function (message) {
	$('.chat').append(message);
});

$('body').on('click','.send',function(){
	socket.emit('sending', $('#input').val());
	$('#input').val("");
});
