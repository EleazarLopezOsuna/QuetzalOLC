import { declaration_function } from "../instruction/declaration_function";
import { _array } from "../literal/_array";
import { data } from "./type";

export enum scope {
    GLOBAL,
    LOCAL
}

export class _symbol {
    constructor(public id: any, public data: data | declaration_function | _array, public scope: scope, public absolute: number, public relative: number, public size: number) {

    }
}