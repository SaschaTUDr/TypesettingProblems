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
		var coords = getCoords(event);
		if (textBlock.isDragged) {
			textBlock.x += coords.x - this.startX;
			textBlock.y += coords.y - this.startY;
		}
		this.startX = coords.x;
		this.startY = coords.y;
		resetCanvas();
		textBlock.render(ctx);
	}

	canvas.onmousedown = canvas.ontouchstart = onDown;
	canvas.onmousemove = canvas.ontouchmove = onMove;
	canvas.onmouseup = canvas.ontouchend = onUp;
}

/************************
 * Button-related stuff *
 ************************/

function onCheck(event) {
	var status = document.getElementById('status');
	var dx = Math.abs(textBlock.x - 50);
	var dy = Math.abs(textBlock.y - 100);
	status.innerText = 'Текст и ссылки объединены в модуль. Расстояние от текста до ссылок больше, чем интерлиньяж текста';
	
	textBlock.moveTo(78, 463);
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
	textBlock = new MovableItem('img/text.png', 90, 350);
}

var tracker = new Tracker(canvas);

var checkButton = document.getElementById('check');
checkButton.onclick = onCheck;