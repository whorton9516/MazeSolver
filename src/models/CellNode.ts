
export class CellNode<Cell>{
    public root: { data: Cell };
    public parent: CellNode<Cell> | null;

    constructor(data: Cell, parent: CellNode<Cell> | null = null ){
        this.root = { data };
        this.parent = parent;
    }
}