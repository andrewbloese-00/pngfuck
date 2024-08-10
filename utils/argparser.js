function parseArgs(){
	const args = process.argv.slice(2)
	if(args[0].toLowerCase() === "help" || args[0] === "h" ){
		console.log("== pngfuck: help (1/1) ==\n• --img <path/to/img.png> \n -> specify the image to edit.\n\n• --shuffle <# iterations>\n -> runs the shuffle function (# iterations) times.\n\n• --cellular <#spawn,#survive,#states>\n -> specifies the cellular automaton rules to apply to the image.\n\n• --nTicks <# ticks>\n -> specifies the numebr of times to apply the cellular automaton rules to the image. ")
		process.exit(0)
	}
	let parsed = {}

	let i = 0;
	while( i < args.length ){
		if(args[i].startsWith("--")){
			const flag = args[i].slice(2)
			const value = args[i+1];
			if(!value) throw new Error("ParseError: expected value for keyword argument")
			parsed[flag] = value;
			i+=2;
		} else if (args[i].startsWith("-")){
			const flag = args[i].slice(1)
			parsed[flag] = true
			i++;
		} else { 
			i++
		}
	}
	return parsed; 
}


module.exports = parseArgs
