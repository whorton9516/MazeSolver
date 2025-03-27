"use strict";
// Maze and Cell classes for generating the maze
Object.defineProperty(exports, "__esModule", { value: true });
exports.Maze = exports.Cell = void 0;
class Cell {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.walls = { top: true, right: true, bottom: true, left: true };
        this.visited = false;
        this.isSearched = false; // Flag to be set by a future pathfinding algorithm.
        this.isSolution = false; // Flag to be set if part of the solution path.
    }
}
exports.Cell = Cell;
class Maze {
    constructor(cols, rows, cellSize) {
        this.cols = cols;
        this.rows = rows;
        this.cellSize = cellSize;
        this.grid = [];
        // Initialize grid of cells.
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                this.grid.push(new Cell(x, y));
            }
        }
        // Define entrance (top-left) and exit (bottom-right).
        this.entrance = this.getCell(0, 0);
        this.exit = this.getCell(cols - 1, rows - 1);
    }
    getCell(x, y) {
        if (x < 0 || y < 0 || x >= this.cols || y >= this.rows) {
            return null;
        }
        return this.grid[x + y * this.cols];
    }
    // Returns unvisited neighbors for the given cell.
    getUnvisitedNeighbors(cell) {
        const neighbors = [];
        const { x, y } = cell;
        const top = this.getCell(x, y - 1);
        const right = this.getCell(x + 1, y);
        const bottom = this.getCell(x, y + 1);
        const left = this.getCell(x - 1, y);
        if (top && !top.visited)
            neighbors.push(top);
        if (right && !right.visited)
            neighbors.push(right);
        if (bottom && !bottom.visited)
            neighbors.push(bottom);
        if (left && !left.visited)
            neighbors.push(left);
        return neighbors;
    }
    // Removes the walls between two adjacent cells.
    removeWalls(current, next) {
        const xDiff = current.x - next.x;
        const yDiff = current.y - next.y;
        if (xDiff === 1) {
            current.walls.left = false;
            next.walls.right = false;
        }
        else if (xDiff === -1) {
            current.walls.right = false;
            next.walls.left = false;
        }
        if (yDiff === 1) {
            current.walls.top = false;
            next.walls.bottom = false;
        }
        else if (yDiff === -1) {
            current.walls.bottom = false;
            next.walls.top = false;
        }
    }
    // Generates the maze using recursive backtracking.
    generateMaze() {
        const stack = [];
        const start = this.entrance;
        start.visited = true;
        stack.push(start);
        while (stack.length > 0) {
            const current = stack[stack.length - 1];
            const neighbors = this.getUnvisitedNeighbors(current);
            if (neighbors.length > 0) {
                const next = neighbors[Math.floor(Math.random() * neighbors.length)];
                next.visited = true;
                this.removeWalls(current, next);
                stack.push(next);
            }
            else {
                stack.pop();
            }
        }
        // Reset visited status so that it can be reused by a pathfinding algorithm.
        this.grid.forEach(cell => cell.visited = false);
    }
}
exports.Maze = Maze;
//# sourceMappingURL=maze.js.map