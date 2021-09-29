function checkSolution(e) {
	clearInterval(window.timerID);
	var obj = e.data.obj;
	var page = e.data.page;
	let mark = obj.solve();
	console.log(`Mark: ${mark}`);
	let asideMark = $('#aside-mark');
	let asideOutOf = $('#aside-out-of');
	asideMark.html(mark);
	asideMark.removeClass('hidden');
	asideOutOf.removeClass('hidden');
	$('#next').html('Дальше <div class="material-icons">&#xf1df</div>');
	$('#next').click(function() {
		window.location.assign(`${1+page}.html`);
	});
	drawTimer.isRunning = false;
	--drawTimer.timeElapsed;
	drawTimer();
}

function drawTimer() {
	drawTimer.timeTotal = 60;
	if (typeof drawTimer.timeElapsed == 'undefined') {
		drawTimer.timeElapsed = 0;
	}
	if (typeof drawTimer.isRunning == 'undefined') {
		drawTimer.isRunning = true;
	}
	var timer = $('#timer');
	var ctx = timer[0].getContext('2d');
	ctx.clearRect(0, 0, timer[0].width, timer[0].height);

	var r = 125;
	var angle = -Math.PI/2. + 2*Math.PI*drawTimer.timeElapsed/drawTimer.timeTotal + 0.001;
	ctx.fillStyle = drawTimer.isRunning ? '#e20016' : '#000';
	ctx.beginPath();
		ctx.moveTo(r, r);
		ctx.arc(r, r, r, angle, -Math.PI/2.);
		ctx.lineTo(r, r);
	ctx.closePath();
	ctx.fill();
	if (drawTimer.isRunning && ++drawTimer.timeElapsed > drawTimer.timeTotal) {
		$('#next')[0].click();
	}
}

$(document).ready(function() {
	drawTimer();
	window.timerID = setInterval(drawTimer, 1000);
});

