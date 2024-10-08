# pngfuck
Various effects to fuck up a png. Shuffle pixels for a dissolving effect, apply glitched vertical or horizontal bars, or pixelate the image from the command line. 


Skip to [Usage](#usage)

## Demo
<div style="display: grid; grid-template-columns: repeat(1,1fr); gap: 5px; font-weight: bold; text-align: center; " >
    <span>Original Image</span>
    <img src ="https://firebasestorage.googleapis.com/v0/b/storeshit.appspot.com/o/fuckpng%2Fgti.png?alt=media&token=dd8869d0-769b-42b6-829d-088e0e54ab11">
    <span>Shuffled Only</span>
    <img src ="https://firebasestorage.googleapis.com/v0/b/storeshit.appspot.com/o/fuckpng%2Fexample_shuffle.png?alt=media&token=9c836053-3d5b-4d09-a396-6374a0bd2a8e">
    <span>Cellular Only</span>
    <img src ="https://firebasestorage.googleapis.com/v0/b/storeshit.appspot.com/o/fuckpng%2Fexample_cellular.png?alt=media&token=9a93f958-47e7-4536-9795-9f88e3d3f923">
    <span>Shuffled + Cellular </span>
    <img src ="https://firebasestorage.googleapis.com/v0/b/storeshit.appspot.com/o/fuckpng%2Fexample_both.png?alt=media&token=fae893f0-43c6-4350-bfd7-5ddb8c04770d">
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
* `--order <first,...,nth>` - specify order of multiple transformations
* `--horiz <rgb multiplier>` - create horizontal bands of multiplied rgb values semi-randomly in the img. 
* `--verts <rgb multiplier>` - create vertical bands of multiplied rgb values semi-randomly in img. 
* `--pixelate <px>` - pixelate the image providing a 'block' size in pixels. Averages the rgb values in square blocks to give a pixelated effect.

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

5. ** Vertical Lines **
Applies a random height and position vertical stripe (multiplies the rgb value by specified scalar). The below example doubles the rgb value of the pixels in the stripe. 
```bash
    pngfuck \
        --img path/to/img.png \
        --verts 2

```

6. ** Horizontal Lines **
Applies a random width and position horizontal stripe (multiplies the rgb value by specified scalar). The below example doubles the rgb value of the pixels in the stripe. 
```bash
    pngfuck \
        --img path/to/img.png \
        --horiz 2

```

7. Pixelate 
Uses provided size parameter to group square blocks of original pixels and average their color value in order to create a pixelated effect on the image. The following example uses 10x10 pixel square cells.  
```bash
    pngfuck \
        --img path/to/img.png \
        --pixelate 10
```
