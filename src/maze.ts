import { Cell } from "./models/Cell";
import { CellNode } from "./models/CellNode";
import { CancellationToken } from "./models/CancellationToken";

export class Maze {
    grid: Cell[];
    cols: number;
    rows: number;
    cellSize: number;
    entrance: Cell;
    exit: Cell;
    isSolved: boolean;

    constructor(cols: number, rows: number, cellSize: number) {
        this.cols = cols;
        this.rows = rows;
        this.cellSize = cellSize;
        this.grid = [];
        this.isSolved = false;
    
        // Initialize grid of cells.
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                this.grid.push(new Cell(x, y));
            }
        }
        
        // Define entrance (top-left) and exit (bottom-right).
        this.entrance = this.getCell(0, 0)!;
        this.exit = this.getCell(cols - 1, rows - 1)!;
        
        // Uncomment the following code to randomize entrance and exit
        // // Collect all outer wall cells.
        // const outerCells: Cell[] = [];
    
        // // Top and bottom rows.
        // for (let x = 0; x < cols; x++) {
        //     outerCells.push(this.getCell(x, 0)!); // Top row
        //     outerCells.push(this.getCell(x, rows - 1)!); // Bottom row
        // }
    
        // // Left and right columns (excluding corners already added).
        // for (let y = 1; y < rows - 1; y++) {
        //     outerCells.push(this.getCell(0, y)!); // Left column
        //     outerCells.push(this.getCell(cols - 1, y)!); // Right column
        // }
    
        // // Randomly select two distinct cells for entrance and exit.
        // const entranceIndex = Math.floor(Math.random() * outerCells.length);
        // this.entrance = outerCells[entranceIndex];
    
        // // Ensure exit is different from entrance.
        // let exitIndex;
        // do {
        //     exitIndex = Math.floor(Math.random() * outerCells.length);
        // } while (exitIndex === entranceIndex);
        // this.exit = outerCells[exitIndex];
    }

    getCell(x: number, y: number): Cell | null {
        if (x < 0 || y < 0 || x >= this.cols || y >= this.rows) {
            return null;
        }
        return this.grid[x + y * this.cols];
    }

    // Returns unvisited neighbors for the given cell.
    getUnvisitedNeighbors(cell: Cell): Cell[] {
        const neighbors: Cell[] = [];
        const { x, y } = cell;
        const top = this.getCell(x, y - 1);
        const right = this.getCell(x + 1, y);
        const bottom = this.getCell(x, y + 1);
        const left = this.getCell(x - 1, y);

        if (top && !top.visited) neighbors.push(top);
        if (right && !right.visited) neighbors.push(right);
        if (bottom && !bottom.visited) neighbors.push(bottom);
        if (left && !left.visited) neighbors.push(left);

        return neighbors;
    }

    // Removes the walls between two adjacent cells.
    removeWalls(current: Cell, next: Cell): void {
        const xDiff = current.x - next.x;
        const yDiff = current.y - next.y;
        if (xDiff === 1) {
            current.walls.left = false;
            next.walls.right = false;
        } else if (xDiff === -1) {
            current.walls.right = false;
            next.walls.left = false;
        }
        if (yDiff === 1) {
            current.walls.top = false;
            next.walls.bottom = false;
        } else if (yDiff === -1) {
            current.walls.bottom = false;
            next.walls.top = false;
        }
    }

    // Generates the maze using recursive backtracking.
    generateMaze(): void {
        const stack: Cell[] = [];
        const start = this.entrance;
        start.visited = true;
        stack.push(start);

        const entranceCell = this.getEntranceCell()?.root.data;
        if (entranceCell) {
            entranceCell.isEntrance = true;
        }

        const exitCell = this.getExitCell()?.root.data;
        if (exitCell) {
            exitCell.isExit = true;
        }
    
        while (stack.length > 0) {
            const current = stack[stack.length - 1];
            const neighbors = this.getUnvisitedNeighbors(current);
    
            if (neighbors.length > 0) {
                const next = neighbors[Math.floor(Math.random() * neighbors.length)];
                next.visited = true;
                this.removeWalls(current, next);
                stack.push(next);
            } else {
                stack.pop();
            }
        }
    
        // Reset visited status so that it can be reused by a pathfinding algorithm.
        this.grid.forEach(cell => cell.visited = false);
    }

    getEntranceCell(): CellNode<Cell> | null {
        const entranceCell = new CellNode(this.entrance);
        return entranceCell;
    }

    getExitCell(): CellNode<Cell> | null {
        const exitCell = new CellNode(this.exit);
        return exitCell;
    }

    isEntrance(cell: Cell): boolean {
        let entrance = this.getEntranceCell()?.root.data;
        if (cell.x == entrance?.x && cell.y == entrance.y) {
            return true;
        }
        else {
            return false;
        }
    }

    isExit(cell: Cell): boolean {
        let exit = this.getExitCell()?.root.data;
        if (cell.x == exit?.x && cell.y == exit.y) {
            return true;
        }
        else {
            return false;
        }
    }

    // Recursively searches for the solution
    async findSolution(
        frontier: CellNode<Cell>[],
        drawMaze: () => Promise<void>,
        token: CancellationToken
      ): Promise<boolean> {
        if (token.cancelled) return false;
        if (frontier.length === 0) return false;
      
        const nextFrontier: CellNode<Cell>[] = [];
      
        for (const node of frontier) {
          const cell = node.root.data;
          if (cell.isSearched) continue;
          cell.isSearched = true;
          cell.highlighted = true;
      
          // if exit is found, backtrack using parent pointers.
          if (this.isExit(cell)) {
            token.cancelled = true;
            let cur: CellNode<Cell> | null = node;
            while (cur) {
              cur.root.data.isSolution = true;
              cur = cur.parent;
            }
            await drawMaze();
            return true;
          }
      
          // for all neighbors, if valid and not visited, add to next frame.
          const directions = [
            { dx: 1, dy: 0, wall: 'right' },
            { dx: 0, dy: 1, wall: 'bottom' },
            { dx: -1, dy: 0, wall: 'left' },
            { dx: 0, dy: -1, wall: 'top' },
          ];
          for (const { dx, dy, wall } of directions) {
            if (!cell.walls[wall as keyof typeof cell.walls]) {
              const neighbor = this.getCell(cell.x + dx, cell.y + dy);
              if (neighbor && !neighbor.isSearched) {
                const childNode = new CellNode(neighbor);
                // parent pointer so we can reconstruct the path later.
                childNode.parent = node;
                nextFrontier.push(childNode);
              }
            }
          }
        }

        await drawMaze();
        return await this.findSolution(nextFrontier, drawMaze, token);
      }
}
