import { data } from "./type";

export enum scope {
    GLOBAL,
    LOCAL
}

export class _symbol {
    constructor( public id:any, public data:data, public scope:scope) {

    }
}