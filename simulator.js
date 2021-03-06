/*
 * Define Instructions
 */
const ldam = 0;
const ldbm = 1;
const stam = 2;

const ldac = 3;
const ldbc = 4;
const ldap = 5;

const ldai = 6;
const ldbi = 7;
const stai = 8;

const br = 9;
const brz = 0xA;
const brn = 0xB;
const brb = 0xC;

const opr = 0xD;
const pfix = 0xE;
const nfix = 0xF;

const opr_add = 0;
const opr_sub = 1;
const opr_in = 2;
const opr_out = 3;

var instIdx = ["ldam","ldbm","stam","ldac","ldbc","ldai", "ldap", "ldbi","stai","br","brz","brn","brb","opr","pfix","nfix"];



/*
 * Define architecture components
 */
 
var memory = new Array(65536);

var iReg = 0;
var oReg = 0;
var pReg = 0;
var aReg = 0;
var bReg = 0;

var iPrt = [0,0];
var oPrt = [0,0];

var dRow = 0;
var fb = 0x7FF0;

/*
 * Take lBytes and uBytes and mash togeather into single words.
 */
function loadMemory(aByte, bByte)
{
	for(var i = 0; i < aByte.length; i++)
	{ 
		memory[i] = (parseInt('0x' + bByte[i], 16) << 8) + parseInt('0x' + aByte[i], 16);
	}
}

/*
 * Clear all the memory (and registers)
 */
function clearMemory()
{
	memory = [];
	iReg = 0;
	oReg = 0;
	pReg = 0;
	aReg = 0;
	bReg = 0;
	inReg = 0;
	outReg = 0;
	
	statusUpdate();
}



/*
 * Doesn't take into account the clock phases - just does everything
 * in one go. Might need to change this.
 */
function cycle()
{
	if(dRow > 15) dRow = 0;
	
	fetch();
	statusUpdate();
	incrementPC();
	execute();
	
	//Callback function to update row
	if(typeof updateRow === "function") updateRow(dRow,dec2bin(memory[fb + dRow]).split(""));
	
	dRow++;
}




/*
 * Simulates the fetch phase. Some cleverness going on here
 * to address the correct byte (upper or lower) in each word.
 *
 */
function fetch()
{
	var inst = memory[pReg];
	
	var address = Math.floor(pReg/2);
	
	if((pReg % 2) == 1) inst = memory[address] >> 8;
	else inst = memory[address] & 0xff;
		
	oReg = oReg | (inst & 0xf);
	iReg = ((inst >> 4) & 0xf);
}

/*
 * Yep, you've guessed it.
 */
function incrementPC()
{
	pReg++;	
}


/*
 * Execute whatever is in iReg using oReg.
 *
 */
function execute()
{
	switch(iReg) 
	{
    	case ldam:
        	aReg = memory[oReg];
        	oReg = 0;
        break;
    	
    	case ldbm:
    		bReg = memory[oReg];
    		oReg = 0;
        break;
        
        case stam:
        	memory[oReg] = aReg;
        	oReg = 0;
        break;
        
        case ldac:
        	aReg = oReg;
        	oReg = 0;
        break;
        
        case ldbc:
        	bReg = oReg;
        	oReg = 0;
        break;
        
        case ldap:
        	aReg = pReg + oReg;
        	oReg = 0;
        break;
        
        case ldai:
        	aReg = memory[aReg + oReg];
        	oReg = 0;
        break;
        
        case ldbi:
        	bReg = memory[bReg + oReg];
        	oReg = 0;
        break;
        
        case stai:
        	memory[bReg + oReg] = aReg;
        	oReg = 0;
        break;
        
        case br:
        	pReg = (pReg + oReg) & 0xFFFF; 
        	oReg = 0;
        break;
        
        case brz:
        	if(aReg == 0) pReg = (pReg + oReg) & 0xFFFF;
        	oReg = 0;
        break;
        
        case brn:
        	if(unsigned16bitToSigned(aReg) < 0) pReg = (pReg + oReg) & 0xFFFF;
        	oReg = 0;
        break;
        
        case brb:
        	pReg = bReg + oReg; //need to check this with values > 16bit
        	oReg = 0;
        break;
        
        case pfix:
        	oReg = oReg << 4;
        break;
        
        case nfix:
        	oReg = (0xFFFFFF00 | (oReg << 4)) & 0xFFFF; //make value unsigned     	
		break;
		
		case opr:
			
			switch(oReg) 
			{
				case opr_add:

					aReg = (aReg + bReg) & 0xFFFF; //keep to 16bits
					oReg = 0;
				break;	
				
				case opr_sub:
					aReg = (aReg - bReg) & 0xFFFF; //keep to 16bits
					oReg = 0;
				break;
				
				case opr_in:
					aReg = iPrt[aReg];
					oReg = 0;
				break;
				
				case opr_out:
					oPrt[bReg] = aReg;
					oReg = 0;
				break;
			}
			
		break;
   	}

}


/*
 * Function to set input ports
 */
function input(port, value)
{
	iPrt[port] = value;
	statusUpdate();
}

/*
 * Helper functions to do some binary manipulation due to Javascript's lack of types
 */

function dec2bin(dec)
{	
    var res = (dec >>> 0).toString(2);
	var ser = "";
	
	for(var i = 0; i < (16 - res.length); i++) ser += '0';	
	
	return ser.concat(res);
}



function unsigned16bitToSigned(x)
{
	if(x >	32768)
	{
		return -1 * ((x ^ 0xFFFF)+1);	
	}
	else return x;
}


/*
 * Initiates callback function updateStatus(data)
 * Where data arg is a representation of the machine state.
 */
function statusUpdate()
{	
	var sim = {
		
		"aReg" : aReg,
		"bReg" : bReg,
		"oReg" : oReg,
		"iReg" : iReg,
		"inst" : instIdx[iReg],
		"pReg" : pReg,
		"iPt1" : iPrt[0],
		"iPt2" : iPrt[1],
		"oPt1" : oPrt[0],
		"oPt2" : oPrt[1]
	};
	
	if(typeof updateStatus === "function") updateStatus(sim);
}


