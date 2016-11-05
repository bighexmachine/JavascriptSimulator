var memoryA;
var memoryB;
var clock = null;
var hex = ['0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f'];

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
		clock = setInterval(function(){
			for(var z = 0; z < 10; z++){ cycle() } }, 1);
	});
	
	$('#reset').on('click', function(e) {
		clearInterval(clock);
		clearMemory();
		loadMemory(memoryA, memoryB);
		$(".row > .col").removeClass('pixelon');
	});
	
});

/*
 * A callback function which provides the status of the Simulator
 * This is called on each cycle of the Simulator
 */
function updateStatus(data)
{
	$('#areg').html(data.aReg);
	$('#breg').html(data.bReg);
	$('#preg').html(data.pReg);
	$('#ireg').html(data.inst);
	$('#oreg').html(data.oReg);
	$('#iport1').html(data.iPt1);
	$('#iport2').html(data.iPt2);
	$('#oport1').html(data.oPt1);
	$('#oport2').html(data.oPt2);	
}



/*
 * A callback function which updates a line from the frame buffer.
 */
function updateRow(row, lineBuffer)
{
	var r = '.row-' + hex[15-row] + ' > .col-';
	
	for(var k = 0; k < 16; k++)
	{
		var id = $(r + hex[k]);
		
		if(lineBuffer[k] == 1) id.addClass('pixelon');
		else id.removeClass('pixelon');
	}
}

