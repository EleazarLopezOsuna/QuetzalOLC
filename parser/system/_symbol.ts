import { declaration_function } from "../instruction/declaration_function";
import { data } from "./type";

export enum scope {
    GLOBAL,
    LOCAL
}

export class _symbol {
    constructor( public id:any, public data:data| declaration_function, public scope:scope) {

    }
}