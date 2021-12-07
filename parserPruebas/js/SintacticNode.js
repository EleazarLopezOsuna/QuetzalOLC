export class SintacticNode {
    constructor(name, value, number) {
        this.name = name;
        this.value = value;
        this.number = number;
        this.children = new Array();
    }
    addChild(child) {
        this.children.push(child);
    }
}
