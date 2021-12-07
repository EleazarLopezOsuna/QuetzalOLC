class console {
    public output = "";
    public symbols = new Map();
    public stack: any[];
    public heap: any[];
    public printOption: number;

    constructor() {
        this.stack = new Array;
        this.heap = new Array;
        this.printOption = 0;
    }
    saveInHeap(index: number, id: any) {
        this.heap[index] = id;
    }
    saveInStack(index: number, id: any) {
        this.stack[index] = id;
    }


}
export const _console = new console();