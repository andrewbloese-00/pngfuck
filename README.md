# pngfuck
Fucks up pngs. Shuffle or apply cellular automata transformations to the pixels in a PNG



<div style="display: grid; grid-template-columns: repeat(4,1fr)" >
    <span>Original Image</span>
    <span>Shuffled Only</span>
    <span>Cellular Only</span>
    <span>Shuffled + Cellular </span>
    <img src ="./examples/gti.png">
    <img src ="./examples/example_shuffle.png">
    <img src ="./examples/example_cellular.png">
    <img src ="./examples/example_both.png">


</div>



## Install 
1. Ensure node is installed
2. Clone this repository
3. `cd` into the cloned project. 
4. `npm install` and `npm link`
5. Run in command line as `pngfuck [...args]`

## Usage
* `--img <path/to/img.png>` - use the specified png as source image
* `--shuffle <n>` - perform a shuffle operation `n` times on the source image
* `--cellular <rule>` - sets the cellular automata spawn, survival and state rules. 
* `--nTicks <n>` - the number of times to run the cellular transformation
* `--order <first,second>` - specify order of multiple transformations

### Examples
1. **Shuffle**
Transform an image located at `path/to/img.png` by shuffling the pixels 200 times 
```bash
pngfuck --img path/to/img.png --shuffle 200 
```

2. **Cellular**
Transform an image using a cellular automaton rules such that Spawn condition is 3 neighbors, survival is strictly 4 neighbors and the number of cell states is 255. It should run the automaton on the png cells 20 times
```bash
pngfuck --img path/to/img.png --cellular 3,4,255 --nTicks 20 
```


3. **Shuffle then Cellular** 
Examples (1) + (2);  shuffling first , then applying the cellular transformation (default ordering is shuffle,cellular)
```bash
    pngfuck \
        --img path/to/img.png \
        --shuffle 200 \
        --cellular 3,4,255 \
        --nTicks 20 
```

4. **Cellular then Shuffle**
Examples (2) + (1) ; cellular transformation first, then shuffle
```bash
    pngfuck \
        --img path/to/img.png \
        --shuffle 200 \
        --cellular 3,4,255 \
        --nTicks 20 \
        --order cellular,shuffle
```






