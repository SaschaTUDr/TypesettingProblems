class ParametrisedController {
	constructor(array=[]) {
		this.items = array;
	}
	add(item) {
		this.items.push(item);
	}
	solve() {
		let avg = 0.;
		this.items.forEach(function(item) {
			avg += item.solve();
		});
		avg /= this.items.length;
		return Math.round(avg);
	}
}

class ParametrisedItem {
	/*
	Arguments
	    id          Id of a parametrised element (e.g. 'text-2')
	    property    CSS property to vary (e.g. 'line-height')
	    trueValue   Expected value with units (e.g. '24px')
	    gradeBound  Array(5) of grade boundaries. dv <= [0] -> 5 ...
	                (e.g. [10, 20, 30, 40, 50])
	    minValue    Minimal allowed value without units (e.g. 6)
	    dir         1 = vertical, 2 = horizontal, 3 = both
	*/
	constructor(id, property, trueValue, gradeBoundaries, minValue=0, dir=1) {
		this.item = $('#'+id);
		this.property = property;
		this.trueValue = trueValue;
		this.minValue = minValue;
		this.gradeBoundaries = gradeBoundaries;
		this.dir = dir;
		this.isDragged = false;
		this.x = 0;
		this.y = 0;

		this.item.addClass('hover');
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
		this.item.addClass(this.cursorClass);
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
				let curValue = parseFloat(that.item.css(that.property));
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
					that.item.css(that.property, curValue + dy + suffix);
				if ((that.dir & 2) == 2 && curValue + dx >= that.minValue)
					that.item.css(that.property, curValue + dx + suffix);
				that.x = event.clientX;
				that.y = event.clientY;
			}
		}

		this.item.on('mousedown', mouseDown);
		$(window).on('mouseup', mouseUp);
		$(window).on('mousemove', mouseMove);
	}
	solve() {
		let curValue = parseFloat(this.item.css(this.property));
		let trueValue = parseFloat(this.trueValue);
		var dv = Math.abs(curValue - trueValue);
		var rv = 0;
		for (var idx = 0; idx < this.gradeBoundaries.length; ++idx) {
			if (dv <= this.gradeBoundaries[idx]) {
				rv = 5 - idx;
				break;
			}
		}
		this.item.removeClass('hover');
		this.item.removeClass(this.cursorClass);
		// this.item.addClass(this.property + '-transition');
		// this.item.css(this.property, this.trueValue);
		this.item.off('mousedown');
		return rv;
	}
}