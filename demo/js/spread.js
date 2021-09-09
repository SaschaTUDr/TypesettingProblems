class SpreadableItem {
	constructor(idHead, idSep, idText, trueSH, trueMH, trueST) {
		this.head = document.getElementById(idHead);
		this.text = document.getElementById(idText);
		this.sep = document.getElementById(idSep);
		this.current = null;
		this.isDragged = false;
		this.y = 0;
		this.trueSH = trueSH;
		this.trueMH = trueMH;
		this.trueST = trueST;
		var that = this;

		function mouseDown(event) {
			event.preventDefault();
			that.isDragged = true;
			that.current = this;
			that.y = event.clientY;
		}
		function mouseUp(event) {
			event.preventDefault();
			that.isDragged = false;
			that.current = null;
		}
		function mouseMove(event) {
			event.preventDefault();
			if (that.isDragged) {
				let dy = event.clientY - that.y;
				if (that.current === that.head || that.current === that.text) {
					let lh = parseFloat(that.current.style.lineHeight);
					that.current.style.lineHeight = lh + dy/100.;
				} else if (that.current === that.sep) {
					let h = parseFloat(that.current.style.height);
					if (h + dy >= 6)
						that.current.style.height = h + dy + 'px';
				}
				that.y = event.clientY;
			}
		}

		this.head.onmousedown = mouseDown;
		this.sep.onmousedown = mouseDown;
		this.text.onmousedown = mouseDown;
		window.addEventListener('mouseup', mouseUp);
		window.addEventListener('mousemove', mouseMove);
	}
	solve() {
		this.head.classList.add('spacing-transition');
		this.sep.classList.add('height-transition');
		this.text.classList.add('spacing-transition');
		this.head.style.lineHeight = this.trueSH;
		this.sep.style.height = this.trueMH + 'px';
		this.text.style.lineHeight = this.trueST;

		this.head.onmousedown = null;
		this.sep.onmousedown = null;
		this.text.onmousedown = null;
	}
}
