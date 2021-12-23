import { declaration_function } from "../instruction/declaration_function";
import { struct_item } from "../literal/struct_item";
import { _array } from "../literal/_array";
import { _struct } from "../literal/_struct";
import { environment } from "./environment";
import { data, type } from "./type";

export enum scope {
    GLOBAL,
    LOCAL
}

export class _symbol {
    public structName: string;

    constructor(public id: any, public data: data | declaration_function, public scope: scope, public absolute: number, public relative: number, public size: number) {
        this.structName = ''
    }

    public get_html(): string {
        let result = "";
        if (this.data instanceof declaration_function) {
            result += "<td>Funcion</td>" + "<td>" + this.id + "</td>" + "<td>Funcion</td>" + "<td>" + scope[this.scope] + "</td>";
        }
        else if (this.data.value instanceof _array) {
            result += "<td>Objeto</td>" + "<td>" + this.id + "</td>" + "<td>Arreglo</td>" + "<td>" + scope[this.scope] + "</td>";
        }
        else if (this.data.value instanceof _struct) {
            result += "<td>Definicion</td>" + "<td>" + this.id + "</td>" + "<td>Estructura</td>" + "<td>" + scope[this.scope] + "</td>";
        }
        else if (this.data.value instanceof struct_item) {
            result += "<td>Objeto</td>" + "<td>" + this.id + "</td>" + "<td>Estructura</td>" + "<td>" + scope[this.scope] + "</td>";
        }
        else result += "<td>" + this.data.value + "</td>" + "<td>" + this.id + "</td>" + "<td>" + type[this.data.type] + "</td>" + "<td>" + scope[this.scope] + "</td>";

        return result;
    }

    public get_html_translation(environment: environment): string {
        let result = "";
        if (this.data instanceof declaration_function) {
            result += "<td>" + this.id + "</td>" + "<td>Funcion</td>" + "<td>" + this.absolute + "</td>" + "<td>" + this.relative + "</td>" + "<td>" + environment.name + "</td>\n";
        }
        else if (this.data.value instanceof _array) {
            result += "<td>" + this.id + "</td>" + "<td>Arreglo</td>" + "<td>" + this.absolute + "</td>" + "<td>" + this.relative + "</td>" + "<td>" + environment.name + "</td>\n";
        }
        else if (this.data.value instanceof _struct) {
            result += "<td>" + this.id + "</td>" + "<td>Estructura</td>" + "<td>" + this.absolute + "</td>" + "<td>" + this.relative + "</td>" + "<td>" + environment.name + "</td>\n";
        }
        else if (this.data.value instanceof struct_item) {
            result += "<td>" + this.id + "</td>" + "<td>" + type[this.data.type] + "</td>" + "<td>" + this.absolute + "</td>" + "<td>" + this.relative + "</td>" + "<td>" + environment.name + "</td>\n";
        }
        else {
            if (this.structName == '') {
                result += "<td>" + this.id + "</td>" + "<td>" + type[this.data.type] + "</td>" + "<td>" + this.absolute + "</td>" + "<td>" + this.relative + "</td>" + "<td>" + environment.name + "</td>\n";
            } else {
                result += "<td>" + this.id + "</td>" + "<td>" + this.structName + "</td>" + "<td>" + this.absolute + "</td>" + "<td>" + this.relative + "</td>" + "<td>" + environment.name + "</td>\n";
            }
        }
        return result;
    }
}