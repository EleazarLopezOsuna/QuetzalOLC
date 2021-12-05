import { environment } from "../system/environment";
import { data } from "../system/type";

export abstract class node {

    constructor(public line: number, public column: number) { }
    public abstract execute(environment: environment): data;
    public abstract plot(count: number): string;
    
}
