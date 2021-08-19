/************************
 * Button-related stuff *
 ************************/

function onCheck(event) {
	let status = document.getElementById('status');
	if (parseFloat(textBlock.style.left) > 50 &&
		  parseFloat(textBlock.style.left) < 80 &&
		  parseFloat(textBlock.style.top) > 350 &&
		  parseFloat(textBlock.style.top) < 400)
		status.classList.add('status-pass');
	else
		status.classList.add('status-fail');
	status.innerText = 'По правилу якорных объектов абзац текста надо поместить в левый нижний угол страницы. Текст и ссылки должны быть достаточно близко друг к другу, чтобы образовать прямоугольный модуль.';
	status.style.display = 'block';

	textBlock.classList.add('solution');
	textBlock.onmousedown = null;
	textBlock.onmouseup = null;
	textBlock.onmousemove = null;

	checkButton.style.display = 'none';
	nextButton.style.display = 'inline';
	nextButton.onclick = function() {
		history.go(0);
	}
}

// Google API: https://drive.google.com/uc?export=view&id=
// Backdrop:   1CMR_i0BgD5_G1pls9F3hynba1Vv9NE7c
// White text: 1CCQVkbqp02YQVZjhouKhbs7REn1YkhRN
// Green text: 1T4Jz8yuZ5aI31b72SpV3qUjLYapyW58F
// Red text:   15P7H8v_0SnebcBwxfbM_IUf51Ll992jY

/**********************
 * DOM elements stuff *
 **********************/

var canvas = document.getElementById('canvas');
var backdrop = document.getElementById('backdrop');
var textBlock = document.getElementById('text-block');

var startX = 0;
var startY = 0;

function noDrag(event) {
	event.preventDefault();
	return false;
}

backdrop.onload = function() {
	canvas.style.width = this.width + 'px';
	canvas.style.height = this.height + 'px';
}
backdrop.ondragstart = noDrag;
textBlock.ondragstart = noDrag;

textBlock.onmousedown = function(event) {
	event.preventDefault();
	this.style.opacity = 0.3;
	this.isDragged = true;
	startX = event.clientX;
	startY = event.clientY;
}
textBlock.onmouseup = function(event) {
	event.preventDefault();
	this.style.opacity = 1;
	this.isDragged = false;
}
textBlock.onmousemove = function(event) {
	event.preventDefault();
	if (this.isDragged) {
		this.style.left = parseFloat(this.style.left) + event.clientX - startX + 'px';
		this.style.top = parseFloat(this.style.top) + event.clientY - startY + 'px';
		startX = event.clientX;
		startY = event.clientY;
	}
}

var checkButton = document.getElementById('check');
var nextButton = document.getElementById('next');
checkButton.onclick = onCheck;