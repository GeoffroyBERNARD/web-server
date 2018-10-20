let socket = io.connect();

let isScrolledToBottom = true;


socket.on('chat', function (chat) {
	let out = document.getElementById("chat");
	isScrolledToBottom = out.scrollHeight - out.clientHeight <= out.scrollTop + 1;
	chat_display.values = chat;
});

$('body').on('click','.send',function(){
	socket.emit('message', $('#input').val());
	$('#input').val("");
});


$('body').on('click','.edit',function(){
	$('.edit').html("save changes")
	let nick = $('.nick').html()
	let desc = $('.desc').html()
	let input_nick = document.createElement('input');
	let textarea_desc = document.createElement('textarea');
	input_nick.className = "form-control"
	textarea_desc.className = "form-control"
	$('.nick').html(input_nick);
	$('.desc').html(textarea_desc);
	$('.nick input').val(nick);
	$('.desc textarea').val(desc);
	$('.edit').removeClass('edit').addClass('save');
});

$('body').on('click','.save',function(){
	$('.save').html("edit profile")
	let nick = $('.nick input').val()
	let desc = $('.desc textarea').val()
	$('.nick').html(nick);
	$('.desc').html(desc);
	socket.emit('nickname', nick);
	socket.emit('description', desc);
	setCookie("nick", nick, 30);
	setCookie("desc", desc, 30);
	$('.save').removeClass('save').addClass('edit');
	
});

$('body').on('click','.edit-pic',function(){
	$('#profile-pic').click();
});


let siofu = new SocketIOFileUpload(socket);
siofu.listenOnInput(document.getElementById("profile-pic"));


siofu.addEventListener("progress", function(event){
    let percent = event.bytesLoaded / event.file.size * 100;
    console.log("File is", percent.toFixed(2), "percent loaded");
});

siofu.addEventListener("complete", function(event){

    if(event.success){
    	$('.edit-pic').attr('src', './upload/' + event.file.name);
    	setCookie("pic", event.file.name, 30)
    }
   
});


function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

let cookie_nick = getCookie("nick");
let cookie_desc = getCookie("desc");
let cookie_pic = getCookie("pic");

	if(cookie_nick !== ""){
		socket.emit('nickname', cookie_nick);
		$('.nick').html(cookie_nick);
	}
	if(cookie_desc !== ""){
		socket.emit('description', cookie_desc);
		$('.desc').html(cookie_desc);
	}
	if(cookie_pic !== ""){
		socket.emit('picture', cookie_pic);
		$('.edit-pic').attr('src', './upload/' + cookie_pic);
	}



/* Clicker */

$('body').on('click','.target',function(){
	socket.emit('click');
});

socket.on('score', function (score) {
	score_display.value = score;
});

let score_display = new Vue({
  el: '#score',
  data: {
    value: 0
  }
})

let chat_display = new Vue({
  el: '#chat',
  data: {
    values: ""
  }
})


Vue.nextTick(function(){
	console.log(isScrolledToBottom)
	
});

$("body").on('DOMSubtreeModified', "#chat", function() {
    if(isScrolledToBottom)
    	$("#chat").scrollTop($("#chat")[0].scrollHeight);
});