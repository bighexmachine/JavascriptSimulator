var memoryA;
var memoryB;
var clock = null;
var hex = ['0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f'];

var oport1;
var oport2;

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
			for(var z = 0; z < 16; z++){ cycle() } }, 1);
	});
	
	$('#reset').on('click', function(e) {
		clearInterval(clock);
		clearMemory();
		loadMemory(memoryA, memoryB);
		$(".row > .col").removeClass('pixelon');
	});
	
	
	/*
 	 * Event handlers for buttons
 	 */
 
 	$('.buttons.left .ibutton.top').mousedown(function(){oport1 = oport1 | 1; input(0, oport1)});
 	$('.buttons.left .ibutton.top').mouseup(function(){oport1 = oport1 ^ 1; input(0, oport1)});
  	$('.buttons.left .ibutton.right').mousedown(function(){oport1 = oport1 | 2; input(0, oport1)});
 	$('.buttons.left .ibutton.right').mouseup(function(){oport1 = oport1 ^ 2; input(0, oport1)});
   	$('.buttons.left .ibutton.bottom').mousedown(function(){oport1 = oport1 | 4; input(0, oport1)}); 	
 	$('.buttons.left .ibutton.bottom').mouseup(function(){oport1 = oport1 ^ 4;input(0, oport1)});
   	$('.buttons.left .ibutton.left').mousedown(function(){oport1 = oport1 | 8;input(0, oport1)});
 	$('.buttons.left .ibutton.left').mouseup(function(){oport1 = oport1 ^ 8;input(0, oport1)});
 	
  	$('.buttons.right .ibutton.top').mousedown(function(){oport2 = oport2 | 1; input(1, oport2)});
 	$('.buttons.right .ibutton.top').mouseup(function(){oport2 = oport2 ^ 1; input(1, oport2)});
  	$('.buttons.right .ibutton.right').mousedown(function(){oport2 = oport2 | 2; input(1, oport2)});
 	$('.buttons.right .ibutton.right').mouseup(function(){oport2 = oport2 ^ 2; input(1, oport2)});
   	$('.buttons.right .ibutton.bottom').mousedown(function(){oport2 = oport2 | 4; input(1, oport2)}); 	
 	$('.buttons.right .ibutton.bottom').mouseup(function(){oport2 = oport2 ^ 4;input(1, oport2)});
   	$('.buttons.right .ibutton.left').mousedown(function(){oport2 = oport2 | 8;input(1, oport2)});
 	$('.buttons.right .ibutton.left').mouseup(function(){oport2 = oport2 ^ 8;input(1, oport2)});
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
	
	//Update input buttons
	if(data.oPt1 & 1) $('.buttons.left .ibutton.top').addClass('on');
	else $('.buttons.left .ibutton.top').removeClass('on');
	
	if(data.oPt1 & 2) $('.buttons.left .ibutton.right').addClass('on');
	else $('.buttons.left .ibutton.right').removeClass('on');
	
	if(data.oPt1 & 4) $('.buttons.left .ibutton.bottom').addClass('on');
	else $('.buttons.left .ibutton.bottom').removeClass('on');
	
	if(data.oPt1 & 8) $('.buttons.left .ibutton.left').addClass('on');
	else $('.buttons.left .ibutton.left').removeClass('on');

	if(data.oPt2 & 1) $('.buttons.right .ibutton.top').addClass('on');
	else $('.buttons.right .ibutton.top').removeClass('on');
	
	if(data.oPt2 & 2) $('.buttons.right .ibutton.right').addClass('on');
	else $('.buttons.right .ibutton.right').removeClass('on');
	
	if(data.oPt2 & 4) $('.buttons.right .ibutton.bottom').addClass('on');
	else $('.buttons.right .ibutton.bottom').removeClass('on');
	
	if(data.oPt2 & 8) $('.buttons.right .ibutton.left').addClass('on');
	else $('.buttons.right .ibutton.left').removeClass('on');	
}



/*
 * A callback function which updates a display line from the line buffer.
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




