const { PNG } = require("pngjs");
const fs = require("fs");


const DEFAULT_CELLULAR_RULE = {
	spawn: 2, 
	survival: 3,
	states: 150
}
//the cellular effect checks moore neighborhood
const MOORE_NEIGHBORHOOD = [
	[-1,-1], [0,-1], [1,-1],
	[-1,0], [1,0],
	[-1,1], [0,1],[1,1]
]


exports.loadPNG = pathToPng => new Promise((resolve)=>{
	if(!fs.existsSync(pathToPng)) 
		return resolve({error:`File not found: "${pathToPng}"`})

	const stream = fs.createReadStream(pathToPng)
	const png = new PNG({filterType: 4})
	stream
		.pipe(png)
		.on('parsed', function(){
			resolve({png:this})
		})
})



exports.shufflePNG = (png,rate=0.5) => {
	let match = -1
	for(let y = 0; y < png.height; y++){
		for(let x = 0; x < png.width; x++ ){
			
			const idx = (png.width * y + x) << 2;
			if(Math.random() > rate) continue;
			if(match < 0) {
				match = idx;
				continue; 
			}
			//swap pixels - ugly ass swaps 
			//red
			let tmp = png.data[match]
			png.data[match] = png.data[idx]
			png.data[idx] = tmp

			//green
			tmp = png.data[match+1]
			png.data[match+1] = png.data[idx+1]
			png.data[idx+1] = tmp

			//blue
			tmp = png.data[match+2]
			png.data[match+2] = png.data[idx+2]
			png.data[idx+2] = tmp

			//alpha 
			tmp = png.data[match+3]
			png.data[match+3] = png.data[idx+3]
			png.data[idx+3] = tmp;

			//unset match
			match = -1

		}
	}
}







function getRGBA(data,idx){
	const r = data[idx]
	const g = data[idx+1]
	const b = data[idx+2]
	const a = data[idx+3]
	return { r,g,b,a}
}

function setRGB(data,idx, r,g,b){
	data[idx] = r;
	data[idx+1] = g;
	data[idx+2] = b;
}

function decreaseRGB(data,idx,decreaseAmt){
	data[idx] = Math.max(0,data[idx]-decreaseAmt)
	data[idx+1] = Math.max(0,data[idx+1]-decreaseAmt)
	data[idx+2] = Math.max(0,data[idx+2]-decreaseAmt)
}


/**
 * @param {PNG} png
 */
exports.cellular = (png, nTicks=1,rule=DEFAULT_CELLULAR_RULE) => {
	console.time(`Cellular Effect * ${nTicks}`)
	for(let t = 0; t < nTicks; t++){
		//get copy of cell states to perform calculations on the 'tick'
		const stateBuffer = Buffer.from(png.data)
		for(let y = 1; y < png.height-1; y++){
			for(let x = 1; x < png.width-1; x++ ){
				const idx = (png.width * y + x) << 2;
				const currentColor = getRGBA(stateBuffer, idx)
				const currentState = Math.floor((currentColor.r + currentColor.g + currentColor.b) / 3)



				let nAlive = 0 
				//check neighborhood (in state buffer, write changes to png.data)
				for(const [offsetX,offsetY] of MOORE_NEIGHBORHOOD){
					let nX = x + offsetX, nY = y + offsetY
					if(nX < 0 || nX >= png.width || nY < 0 || nY >= png.height){
						continue
					}
					const nIdx = (png.width * nY + nX) << 2
					const nColor = getRGBA(png.data,nIdx)
					const nState = Math.floor((nColor.a + nColor.b + nColor.c )/ 3)
					if (nState > 0) {
						nAlive++
					}
				}

				if(nAlive >= rule.spawn) {
					if(currentState == 0){
						 setRGB(png.data,idx,rule.states,rule.states,rule.states)
						 continue
					}
				}  
				if( nAlive != rule.survival && currentState != 0){
					let amt = Math.random() * 20
					if(Math.random() > 0.5) amt *= -1
					decreaseRGB(png.data,idx,amt)
					continue
				}
			}
		}
	}
	console.timeEnd(`Cellular Effect * ${nTicks}`)


}


/**
 * 
 * @param {PNG} png 
 */
exports.verticals = (png , scalar=2 , chance=0.3) => {
	for(let x = 0; x < png.width; x++){
		if(Math.random() < chance){
			let y = Math.random() * png.height;
			const len = Math.random()*png.height;
			const end = Math.min(png.height, y+len)
			while(y < end && y < png.height){
				const idx = (png.width * y + x) << 2;
				png.data[idx] *= scalar
				png.data[idx+1] *= scalar
				png.data[idx+2] *= scalar
				y++;
			}
		}
	}
}

/**
 * @param {PNG} png 
 */
exports.horizontals = (png , scalar=2 , chance=0.3) => {
	for(let y = 0; y < png.height; y++){
		if(Math.random() < chance){
			let x = Math.random() * png.width;
			const len = Math.random()*png.width;
			const end = Math.min(png.width, x+len)
			while(x < end && x < png.width){
				const idx = (png.width * y + x) << 2;
				png.data[idx] *= scalar
				png.data[idx+1] *= scalar
				png.data[idx+2] *= scalar
				x++;
			}
		}
	}
}


exports.pixelate = (png,cellPx=5) => {
	for(let y = 0; y < png.height; y+=cellPx){
		for(let x = 0; x < png.width; x+=cellPx){
			//sum the rgb values in 'neighborhood' 
			let count = 0, acc = { r: 0, g: 0, b:0 }
			for(let k = 0; k < cellPx; k++){
				for(let j = 0; j < cellPx; j++ ){
					const i = (png.width*(y+k) + (x+j)) << 2
					if(i > png.data.length) break
					const {r,g,b} = getRGBA(png.data,i)
					acc.r += r;
					acc.g += g;
					acc.b += b;
					count++
				}	
			}
			//determine average
			acc.r /= count;
			acc.g /= count;
			acc.b /= count;

			//apply the average values to neighborhood
			for(let k = 0; k < cellPx; k++){
				for(let j = 0; j < cellPx; j++ ){
					const i = (png.width*(y+k) + (x+j)) << 2
					if(i > png.data.length) break
					if(isNaN(acc.r) || isNaN(acc.g) || isNaN(acc.b)) break;
					setRGB(png.data,i,~~acc.r,~~acc.g,~~acc.b)
				}	
			}
		}
	}



}




