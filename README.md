Most of renderer.ts was written by ChatGPT, as was maze.generateMaze(). I wrote the maze solving algorithm to play around with TypeScript. 

- Clone it and run the basic start command (*npm run start*) in a console to  try it out.
- Change the cell size in renderer.ts to change the number of cells in the maze.
- Change the canvas width and height in index.html to change the size of the grid
(Just make sure to adjust the window size in main.ts)
- And change the value of *await new Promise(f => setTimeout(f, 0));* in renderer.ts to slow down the frames.
