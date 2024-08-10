function parseArgs(){
	const args = process.argv.slice(2)
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
