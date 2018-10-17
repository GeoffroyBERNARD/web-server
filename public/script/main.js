let socket = io.connect('http://localhost:80');

socket.on('receiving', function (message) {
	$('.chat').append(message);
});

$('body').on('click','.send',function(){
	socket.emit('sending', $('#input').val());
	$('#input').val("");
});

$('body').on('click','.edit',function(){
	$('.edit').html("save changes")
	let nick = $('.nick').html()
	let desc = $('.desc').html()
	$('.nick').html(document.createElement('input'));
	$('.desc').html(document.createElement('input'));
	$('.nick input').val(nick);
	$('.desc input').val(desc);
	$('.edit').removeClass('edit').addClass('save');
	
});

$('body').on('click','.save',function(){
	$('.save').html("edit profile")
	let nick = $('.nick input').val()
	let desc = $('.desc input').val()
	console.log(nick);
	$('.nick').html(nick);
	$('.desc').html(desc);
	socket.emit('nickname', nick);
	socket.emit('description', desc);
	$('.save').removeClass('save').addClass('edit');
	
});