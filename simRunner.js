var memoryA;
var memoryB;
var clock = null;

$(document).ready(function(){


	$('#fileInputA').on('change', function(e) {
			
			var reader = new FileReader();

			reader.onload = function(e) {
				
				$('#fileDisplayAreaA').html(reader.result);
				
				memoryA = reader.result.split(" ");
			}

			reader.readAsText($(this)[0].files[0]);	
	});

	$('#fileInputB').on('change', function(e) {
			
			var reader = new FileReader();

			reader.onload = function(e) {
				$('#fileDisplayAreaB').html(reader.result);
				
				memoryB = reader.result.split(" ");
			}

			reader.readAsText($(this)[0].files[0]);	
	});
	
	$('#start').on('click', function(e) {
		clearInterval(clock);
		loadMemory(memoryA, memoryB);
		clock = setInterval(function(){cycle()}, 1000);
	});
	
	$('#stop').on('click', function(e) {
		clearInterval(clock);
	});
	
	$('#clockslow').on('click', function(e) {
		clearInterval(clock);
		clock = setInterval(function(){cycle()}, 1000);
	});
	
	$('#clockfast').on('click', function(e) {
		clearInterval(clock);
		clock = setInterval(function(){cycle()}, 1);
	});
	
	$('#reset').on('click', function(e) {
		clearInterval(clock);
		clearMemory();
		updateDisplay();
		loadMemory(memoryA, memoryB);
	});
	
});

/*
 * A callback function which provides the status of the Simulator
 */
function updateStatus(data)
{
	$('#areg').html(data.aReg);
	$('#breg').html(data.bReg);
	$('#preg').html(data.pReg);
	$('#ireg').html(data.inst);
	$('#oreg').html(data.oReg);
}


