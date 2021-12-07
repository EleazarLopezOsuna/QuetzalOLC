import {Type} from "./Symbol"

export class Expression{
    public type: Type;
    public value: any;

    constructor(type: Type, value:any){
        this.type = type;
        this.value = value;
    }
}