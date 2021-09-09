class DragableItem {
	constructor(id, trueX, trueY) {
		this.item = document.getElementById(id);
		this.x = 0;
		this.y = 0;
		this.trueX = trueX;
		this.trueY = trueY;
		this.isDragged = false;
		let that = this;

		function mouseDown(event) {
			event.preventDefault();
			that.isDragged = true;
			that.item.classList.add('drag');
			that.x = event.clientX;
			that.y = event.clientY;
		}
		function mouseUp(event) {
			event.preventDefault();
			that.isDragged = false;
			that.item.classList.remove('drag');
		}
		function mouseMove(event) {
			event.preventDefault();
			if (that.isDragged) {
				that.item.style.left = that.item.offsetLeft +
					event.clientX - that.x + 'px';
				that.item.style.top = that.item.offsetTop +
					event.clientY - that.y + 'px';
				that.x = event.clientX;
				that.y = event.clientY;
			}
		}

		this.item.onmousedown = mouseDown;
		window.addEventListener('mouseup', mouseUp);
		window.addEventListener('mousemove', mouseMove);
	}
	solve() {
		this.item.classList.add('drag-transition');
		this.item.style.left = this.trueX + 'px';
		this.item.style.top = this.trueY + 'px';

		this.item.onmousedown = null;
	}
}
