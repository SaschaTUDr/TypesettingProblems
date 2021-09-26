class ParametrisedController {
	constructor(array=[]) {
		this.items = array;
	}
	add(item) {
		this.items.push(item);
	}
	solve() {
		this.items.forEach(function(item) {
			item.solve();
		});
	}
}

class ParametrisedItem {
	/*
	Arguments
	    id          Id of a parametrised element (e.g. 'text-2')
	    property    CSS property to vary (e.g. 'line-height')
	    trueValue   Expected value with units (e.g. '24px')
	    minValue    Minimal allowed value without units (e.g. 6)
	    dir         1 = vertical, 2 = horizontal, 3 = both
	*/
	constructor(id, property, trueValue, minValue=0, dir=1) {
		this.item = document.getElementById(id);
		this.property = property;
		this.trueValue = trueValue;
		this.minValue = minValue;
		this.dir = dir;
		this.isDragged = false;
		this.x = 0;
		this.y = 0;

		this.item.classList.add('hover');
		this.cursorClass = '';
		switch (dir) {
		case 1:
			this.cursorClass = 'cursor-row';
			break;
		case 2:
			this.cursorClass = 'cursor-col';
			break;
		case 3:
			this.cursorClass = 'cursor-move';
			break;
		default:
			this.cursorClass = 'cursor-default';
		}
		this.item.classList.add(this.cursorClass);
		var that = this;

		function mouseDown(event) {
			event.preventDefault();
			that.isDragged = true;
			that.x = event.clientX;
			that.y = event.clientY;
		}

		function mouseUp(event) {
			event.preventDefault();
			that.isDragged = false;
		}

		function mouseMove(event) {
			event.preventDefault();
			if (that.isDragged) {
				let dx = event.clientX - that.x;
				let dy = event.clientY - that.y;
				let curValue = parseFloat(that.item.style[that.property]);
				let suffix = '';
				switch (that.property) {
				case 'line-height':
					dy /= 100.;
					break;
				case 'height':
					suffix = 'px';
					break;
				default:
				}
				if ((that.dir & 1) == 1 && curValue + dy >= that.minValue)
					that.item.style[that.property] = curValue + dy + suffix;
				if ((that.dir & 2) == 2 && curValue + dx >= that.minValue)
					that.item.style[that.property] = curValue + dx + suffix;
				that.x = event.clientX;
				that.y = event.clientY;
			}
		}

		this.item.onmousedown = mouseDown;
		window.addEventListener('mouseup', mouseUp);
		window.addEventListener('mousemove', mouseMove);
	}
	solve() {
		this.item.classList.remove('hover');
		this.item.classList.remove(this.cursorClass);
		this.item.classList.add(this.property + '-transition');
		this.item.style[this.property] = this.trueValue;
		this.item.onmousedown = null;
	}
}