export class SintacticNode{
    public name: string;
    public children: Array<SintacticNode>;
    public value: string;
    public number: bigint;

    constructor(name: string, value: string, number: bigint){
        this.name = name;
        this.value = value;
        this.number = number;
        this.children = new Array<SintacticNode>();
    }

    public addChild(child: SintacticNode){
        this.children.push(child);
    }
}