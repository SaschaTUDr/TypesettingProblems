class DragableController {
	/*
	Arguments
	    array       Array of DragableItems
	*/
	constructor(array) {
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

class DragableItem {
	/*
	Arguments
	    id          Id of a parametrised element (e.g. 'img-1-0')
	    truePos     Expected {x:..., y:...} with units (e.g. {x:'24px', y:'112px'})
	    gradeBound  Array(5) of grade boundaries. dv <= [0] -> 5 ...
	                (e.g. [10, 20, 30, 40, 50])
	    limitPos    {xmin:..., xmax:..., ymin:..., ymax:...} with no units
	*/
	constructor(id, truePos, gradeBound, limitPos) {
		this.item = $('#'+id);
		this.x = 0;
		this.y = 0;
		this.gradeBoundaries = gradeBound;
		this.truePos = truePos;
		this.limitPos = limitPos;
		this.isDragged = false;
		this.item.addClass('hover');
		this.item.addClass('cursor-drag');
		var that = this;

		function mouseDown(event) {
			event.preventDefault();
			that.isDragged = true;
			that.item.addClass('drag');
			that.x = event.clientX;
			that.y = event.clientY;
		}
		function mouseUp(event) {
			event.preventDefault();
			that.isDragged = false;
			that.item.removeClass('drag');
		}
		function mouseMove(event) {
			event.preventDefault();
			if (that.isDragged) {
				let dx = event.clientX - that.x;
				let dy = event.clientY - that.y;
				let curPos = {
					x: parseFloat(that.item.css('left')),
					y: parseFloat(that.item.css('top')),
				};
				let suffix = 'px';

				if (curPos.x + dx >= that.limitPos.xmin &&
					curPos.x + dx <= that.limitPos.xmax
				) {
					that.item.css('left', curPos.x + dx + suffix);
				}
				if (curPos.y + dy >= that.limitPos.ymin &&
					curPos.y + dy <= that.limitPos.ymax
				) {
					that.item.css('top', curPos.y + dy + suffix);
				}
				
				that.x = event.clientX;
				that.y = event.clientY;
			}
		}

		this.item.on('mousedown', mouseDown);
		$(window).on('mouseup', mouseUp);
		$(window).on('mousemove', mouseMove);
	}
	solve() {
		this.item.css('left', parseFloat(this.item.css('left')) + 1 + 'px');
		this.item.css('top', parseFloat(this.item.css('top')) + 1 + 'px');
		let curPos = {
			x: parseFloat(this.item.css('left')),
			y: parseFloat(this.item.css('top'))
		};
		let truePos = {
			x: parseFloat(this.truePos.x),
			y: parseFloat(this.truePos.y)
		};
		var dv = Math.sqrt((curPos.x - truePos.x)**2 + (curPos.y - truePos.y)**2);
		var rv = 0;
		for (var idx = 0; idx < this.gradeBoundaries.length; ++idx) {
			if (dv <= this.gradeBoundaries[idx]) {
				rv = 5 - idx;
				break;
			}
		}
		this.item.removeClass('hover');
		this.item.addClass('final');
		this.item.removeClass('cursor-drag');
		// this.item.addClass(this.property + '-transition');
		// this.item.css(this.property, this.trueValue);
		this.item.off('mousedown');
		return rv;
	}
}
