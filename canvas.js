/*************************
 * Canvas dragging stuff *
 *************************/

var MovableItem = function(image, x, y) {
	this.image = image;
	this.width = image.width;
	this.height = image.height;
	this.x = x;
	this.y = y;
	this.isDragged = false;

	this.render = function(ctx) {
		ctx.save();
		ctx.drawImage(this.image, this.x, this.y);
		ctx.restore();
	}

	this.moveTo = function(x, y) {
		this.x = x;
		this.y = y;
		tracker.resetCanvas(ctx);
		this.render(ctx);
	}

	this.isHit = function(coords) {
		return (coords.x >= this.x && coords.x <= this.x + this.width &&
			coords.y >= this.y && coords.y <= this.y + this.height);
	}

	this.render(ctx);
}

function Tracker(canvas, imageURLs) {
	this.startX = 0;
	this.startY = 0;
	this.images = [];
	var that = this;
	var numImages = imageURLs.length;

	for (let i = 0; i < imageURLs.length; ++i) {
		this.images[i] = new Image;
		this.images[i].src = imageURLs[i];
		this.images[i].onload = function() {
			if (--numImages == 0) {
				canvas.width = that.images[0].width;
				canvas.height = that.images[0].height;
				ctx.drawImage(that.images[0], 0, 0);
				that.textBlock = new MovableItem(that.images[1], 250, 250);
			}
		};
	}

	this.resetCanvas = function(ctx) {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.drawImage(that.images[0], 0, 0);
	}

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
		if (that.textBlock.isHit(coords))
			that.textBlock.isDragged = true;
		that.startX = coords.x;
		that.startY = coords.y;
	}

	function onUp(event) {
		event.preventDefault();
		that.textBlock.isDragged = false;
	}

	function onMove(event) {
		event.preventDefault();
		if (that.textBlock.isDragged) {
			var coords = getCoords(event);
			that.textBlock.x += coords.x - that.startX;
			that.textBlock.y += coords.y - that.startY;
			that.startX = coords.x;
			that.startY = coords.y;
			that.resetCanvas(ctx);
			that.textBlock.render(ctx);
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
	status.innerText = 'По правилу якорных объектов абзац текста надо поместить в левый нижний угол страницы. Текст и ссылки должны быть достаточно близко друг к другу, чтобы образовать прямоугольный модуль.';
	status.style.display = 'block';
	
	let correctImage = (
		tracker.textBlock.x > 61 && tracker.textBlock.x < 69 &&
		tracker.textBlock.y > 370 && tracker.textBlock.y < 386
	) ? tracker.images[2] : tracker.images[3];
	tracker.correctBlock = new MovableItem(
		correctImage, 66, 384);
	tracker.stop();
	checkButton.style.display = 'none';
	nextButton.style.display = 'inline';
	nextButton.addEventListener('click', function() {
		history.go(0);
	});

	// Google API: https://drive.google.com/uc?export=view&id=
	// Backdrop:   1CMR_i0BgD5_G1pls9F3hynba1Vv9NE7c
	// White text: 1CCQVkbqp02YQVZjhouKhbs7REn1YkhRN
	// Green text: 1T4Jz8yuZ5aI31b72SpV3qUjLYapyW58F
	// Red text:   15P7H8v_0SnebcBwxfbM_IUf51Ll992jY
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

var tracker = new Tracker(canvas, [
	'img/backdrop.png',
	'img/text.png',
	'img/text-green.png',
	'img/text-red.png'
]);

var checkButton = document.getElementById('check');
var nextButton = document.getElementById('next');
checkButton.onclick = onCheck;