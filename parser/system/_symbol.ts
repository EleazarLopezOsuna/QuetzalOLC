import { data } from "./type";

export enum scope {
    GLOBAL,
    LOCAL
}

export class _symbol {
    constructor( private id:any, private data:data, private scope:scope) {

    }
}