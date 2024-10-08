#!/usr/bin/env node
const fs = require("fs")
const parseArgs = require("./utils/argparser.js")
const parseRule = require("./utils/cellularRuleParser.js")
const {loadPNG, shufflePNG, cellular, verticals, horizontals, pixelate} = require("./utils/png_fuck.js")

const panic = (...args) => {
	console.error(...args);
	process.exit(1)
}

let args;
try { args = parseArgs(); } 
catch (error){ panic(error); }





(async function main(){
	if(!args.img) panic("Required --img not set...");
	let pipeline = [] 
	//verify shuffle is a number
	if(args.shuffle){ 
		pipeline.push("shuffle")
		const n =  Number(args.shuffle)
		if(isNaN(n)) panic(`Invalid shuffle count. Expected a number but got ${args.shuffle}`)
		args.shuffle = n;
	}
	//verify cellular rule is valid
	if(args.cellular){
		pipeline.push("cellular")
		try {
			args.cellular= parseRule(args.cellular)
			const n = args.nTicks ? Number(args.nTicks) : 10
			if(isNaN(n)) throw new Error("Invalid 'nTicks'. Expected an integer")
			args.nTicks = n;
		} catch (error) {
			panic(error)
		}
	}


	if(args.verts) {
		pipeline.push("verts");
		try {
			const n = Number(args.verts);
			if(isNaN(n)) throw new Error("Invalid 'verts'. Expected a float 'rate'")
			args.verts = n; 
		} catch (error) {
			panic(error)
		}
	}
	if(args.horiz) {
		pipeline.push("horiz");
		try {
			const n = Number(args.horiz);
			if(isNaN(n)) throw new Error("Invalid 'horiz'. Expected a float 'rate'")
			args.horiz = n; 
		} catch (error) {
			panic(error)
		}
	}

	if(args.pixelate) { 
		pipeline.push("pixelate");
		try {
			const n = parseInt(args.pixelate,10);
			if(isNaN(n)) throw new Error("Invalid 'pixelate'. Expected an integer")
			args.pixelate = n
		} catch (error) {
			panic(error)
		}
	}



	

	//load the image
	const loaded = await loadPNG(args.img)
	if(loaded.error) panic(loaded.error)

	if(args.order){
		const newPipe = args.order.split(",").filter(x=>pipeline.includes(x))
		pipeline = newPipe
	}

	console.log("execution plan: ", pipeline)

	for(const action of pipeline){
		if(action === "shuffle"){
			console.log("Starting 'shuffle'")
			console.time(`Shuffle Image * ${args.shuffle}`)
			for(let i = 0; i < args.shuffle; i++){
				shufflePNG(loaded.png)
			}
			console.timeEnd(`Shuffle Image * ${args.shuffle}`)
			continue;
		} 
		if(action === "cellular"){
			console.log("Starting Cellular Transformation using rule = " , args.cellular)
			console.time(`Cellular Transformation * ${args.nTicks}`)
			cellular(loaded.png,args.nTicks, args.cellular)
			console.timeEnd(`Cellular Transformation * ${args.nTicks}`)
		}

		if(action === "verts"){
			const label = "'Verts' transformation: \n rate = " +  args.verts 
			console.time(label)
			verticals(loaded.png,4)
			console.timeEnd(label)
		}
		if(action === "horiz"){
			const label = "'Horiz' transformation: \n rate = " + args.horiz
			console.time(label)
			horizontals(loaded.png, args.horiz)
			console.timeEnd(label)
		}
		if(action === "pixelate"){
			const label = "'pixelate' transformation: \n cellPx = " + args.pixelate
			console.time(label)
			pixelate(loaded.png,args.pixelate)
			console.timeEnd(label)
		}

	}

	const suffix = pipeline.map(action=>{
		if(action === "cellular") return `${action}-${args.nTicks}`
		else return `${action}-${args[action]}`
	})


	const ofile = args.img.replace(".png",`:${suffix.join("_")}.png`)
	const oStream = fs.createWriteStream(ofile)

	loaded.png.pack().pipe(oStream)


	
	



})()








