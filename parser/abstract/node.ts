import { environment } from "../system/environment.js";
import { data } from "../system/type.js";

export abstract class node {

    constructor(public line: number, public column: number) { }
    public abstract execute(environment: environment): data;
    public abstract plot(count: number): string;
    
}
