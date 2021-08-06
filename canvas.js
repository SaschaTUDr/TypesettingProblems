/*************************
 * Canvas dragging stuff *
 *************************/

var MovableItem = function(url, x, y) {
	this.image = new Image;
	this.image.src = url;
	var that = this;
	this.image.onload = function() {
		that.width = this.width;
		that.height = this.height;
		that.x = x;
		that.y = y;
		that.isDragged = false;
		that.render(ctx);
	}

	this.render = function(ctx) {
		ctx.save();
		ctx.drawImage(this.image, this.x, this.y);
		ctx.restore();
	}

	this.moveTo = function(x, y) {
		this.x = x;
		this.y = y;
		resetCanvas();
		this.render(ctx);
	}
}

function resetCanvas() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.drawImage(backdrop, 0, 0);
}

function isHit(obj, coords) {
	return (coords.x >= obj.x && coords.x <= obj.x + obj.width &&
		coords.y >= obj.y && coords.y <= obj.y + obj.height);
}

function Tracker(canvas) {
	this.startX = 0;
	this.startY = 0;
	function getCoords(event) {
		var rect = canvas.getBoundingClientRect();
		if (event.touches) {
			return {
				x: event.touches[0].clientX - rect.left,
				y: event.touches[0].clientY - rect.top
			};
		} else {
			return {
				x: event.clientX - rect.left,
				y: event.clientY - rect.top
			};
		}
	}

	function onDown(event) {
		event.preventDefault();
		var coords = getCoords(event);
		if (isHit(textBlock, coords))
			textBlock.isDragged = true;
		this.startX = coords.x;
		this.startY = coords.y;
	}

	function onUp(event) {
		event.preventDefault();
		textBlock.isDragged = false;
	}

	function onMove(event) {
		event.preventDefault();
		if (textBlock.isDragged) {
			var coords = getCoords(event);
			textBlock.x += coords.x - this.startX;
			textBlock.y += coords.y - this.startY;
			this.startX = coords.x;
			this.startY = coords.y;
			resetCanvas();
			textBlock.render(ctx);
		}
	}

	this.start = function() {
		canvas.addEventListener('mousedown', onDown);
		canvas.addEventListener('mousemove', onMove);
		canvas.addEventListener('mouseup', onUp);
		canvas.addEventListener('touchstart', onDown);
		canvas.addEventListener('touchmove', onMove);
		canvas.addEventListener('touchstop', onUp);
	}

	this.stop = function() {
		canvas.removeEventListener('mousedown', onDown);
		canvas.removeEventListener('mousemove', onMove);
		canvas.removeEventListener('mouseup', onUp);
		canvas.removeEventListener('touchstart', onDown);
		canvas.removeEventListener('touchmove', onMove);
		canvas.removeEventListener('touchstop', onUp);
	}

	this.start();
}

/************************
 * Button-related stuff *
 ************************/

function onCheck(event) {
	var status = document.getElementById('status');
	var dx = Math.abs(textBlock.x - 50);
	var dy = Math.abs(textBlock.y - 100);
	status.innerText = 'По правилу якорных объектов абзац текста надо поместить в левый нижний угол страницы. Текст и ссылки должны быть достаточно близко друг к другу, чтобы образовать прямоугольный модуль.';
	status.style.display = 'block';
	
	let correctImageURL = (
		textBlock.x > 61 && textBlock.x < 69 &&
		textBlock.y > 370 && textBlock.y < 386
	) ? 'img/text-green.png' : 'img/text-red.png';
	var correctBlock = new MovableItem(
		correctImageURL, textBlock.x, textBlock.y);
	console.log({x: textBlock.x, y: textBlock.y});
	textBlock.moveTo(66, 384);
	tracker.stop();
	checkButton.style.display = 'none';
	nextButton.style.display = 'inline';
	nextButton.addEventListener('click', function() {
		history.go(0);
	});

	// Google API: https://drive.google.com/uc?export=view&id=
	// White text: 1CCQVkbqp02YQVZjhouKhbs7REn1YkhRN
	// Green text: 1T4Jz8yuZ5aI31b72SpV3qUjLYapyW58F
	// Red text:   15P7H8v_0SnebcBwxfbM_IUf51Ll992jY
	// Backdrop:   1CMR_i0BgD5_G1pls9F3hynba1Vv9NE7c
}

/**********************
 * DOM elements stuff *
 **********************/

var canvas = document.getElementById('plotArea');
var ctx = canvas.getContext('2d');

// Placeholder before images are loaded
ctx.textBaseline = 'middle';
ctx.textAlign = 'center';
ctx.fillText('Пожалуйста, подождите…', 320, 240);

var backdrop = new Image;
backdrop.src = 'img/backdrop.png';
var textBlock;
backdrop.onload = function() {
	canvas.width = backdrop.width;
	canvas.height = backdrop.height;
	ctx.drawImage(backdrop, 0, 0);
	textBlock = new MovableItem('img/text.png', 250, 250);
}

var tracker = new Tracker(canvas);

var checkButton = document.getElementById('check');
var nextButton = document.getElementById('next');
checkButton.onclick = onCheck;