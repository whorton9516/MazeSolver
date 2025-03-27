import { Maze } from './maze';
import { CancellationToken } from './models/CancellationToken';

const canvas = <HTMLCanvasElement>document.getElementById('mazeCanvas');
const ctx = canvas.getContext('2d');
if (!ctx) {
    throw new Error('Failed to get 2D context');
}

const cellSize = 20;
const cols = Math.floor(canvas.width / cellSize);
const rows = Math.floor(canvas.height / cellSize);

const token: CancellationToken = { cancelled:false }
const generateButton = document.getElementById('generateButton');
const solveButton = document.getElementById('solveButton');
const timerLabel = document.getElementById('timerLabel');

let timeElapsed = 0;

// Create and generate the maze.
let maze = new Maze(cols, rows, cellSize);
maze.generateMaze();

// Add a click event listener to the canvas
canvas.addEventListener('click', async (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((event.clientX - rect.left) / cellSize);
    const y = Math.floor((event.clientY - rect.top) / cellSize);
    const cell = maze.getCell(x, y);
    if (cell) {
        cell.highlighted = !cell.highlighted;
        await drawMaze();
    }
});


if (solveButton) {
    solveButton.addEventListener('click', async () => {
        token.cancelled = false;
        const entrance = maze.getEntranceCell();

        const startTime = new Date().getTime();
        if (entrance){
            await maze.findSolution([entrance], drawMaze, token)
        }
        
        timeElapsed = new Date().getTime() - startTime;
        if (timerLabel) {
            timerLabel.textContent = `Time Elapsed: ${timeElapsed/1000}s`;
        }

        await drawMaze();
    });
}

if (generateButton) {
    generateButton.addEventListener('click', async () => {
        maze = new Maze(cols, rows, cellSize);
        maze.generateMaze();
        await drawMaze();
        if (timerLabel) {
            timerLabel.textContent = ``;
        }
    });
}

async function drawMaze(): Promise<void> {
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            const cell = maze.getCell(x, y);
            const xPos = x * cellSize;
            const yPos = y * cellSize;

            if (!cell || !ctx) {
                continue;
            }

            if (cell.isSolution) {
                ctx.fillStyle = 'lightgreen';
            } else if (cell.isSearched) {
                ctx.fillStyle = 'lightgrey';
            } else if (cell.highlighted) {
                ctx.fillStyle = 'darkgrey';
            } else {
                ctx.fillStyle = 'white';
            }

            if (cell.isEntrance){
                ctx.fillStyle = 'green';
            } else if (cell.isExit){
                ctx.fillStyle = 'red';
            }

            ctx.fillRect(xPos, yPos, cellSize, cellSize);

            // Draw walls with appropriate thickness.
            if (cell.walls.top) {
                ctx.beginPath();
                ctx.lineWidth = (y === 0) ? 4 : 2;
                ctx.moveTo(xPos, yPos);
                ctx.lineTo(xPos + cellSize, yPos);
                ctx.stroke();
            }
            if (cell.walls.right) {
                ctx.beginPath();
                ctx.lineWidth = (x === cols - 1) ? 4 : 2;
                ctx.moveTo(xPos + cellSize, yPos);
                ctx.lineTo(xPos + cellSize, yPos + cellSize);
                ctx.stroke();
            }
            if (cell.walls.bottom) {
                ctx.beginPath();
                ctx.lineWidth = (y === rows - 1) ? 4 : 2;
                ctx.moveTo(xPos + cellSize, yPos + cellSize);
                ctx.lineTo(xPos, yPos + cellSize);
                ctx.stroke();
            }
            if (cell.walls.left) {
                ctx.beginPath();
                ctx.lineWidth = (x === 0) ? 4 : 2;
                ctx.moveTo(xPos, yPos + cellSize);
                ctx.lineTo(xPos, yPos);
                ctx.stroke();
            }
        }
    }
    await new Promise(f => setTimeout(f, 50));
}

drawMaze();