export class Cell {
    x: number;
    y: number;
    walls: { top: boolean; right: boolean; bottom: boolean; left: boolean; };
    visited: boolean;
    isSearched: boolean;
    isSolution: boolean;
    isEntrance: boolean;
    isExit: boolean;
    highlighted: boolean;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.walls = { top: true, right: true, bottom: true, left: true };
        this.visited = false;
        this.isSearched = false;
        this.isSolution = false;
        this.isEntrance = false;
        this.isExit = false;
        this.highlighted = false;
    }
}