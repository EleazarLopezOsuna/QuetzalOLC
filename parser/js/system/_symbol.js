"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._symbol = exports.scope = void 0;
const declaration_function_1 = require("../instruction/declaration_function");
const struct_item_1 = require("../literal/struct_item");
const _array_1 = require("../literal/_array");
const _struct_1 = require("../literal/_struct");
const type_1 = require("./type");
var scope;
(function (scope) {
    scope[scope["GLOBAL"] = 0] = "GLOBAL";
    scope[scope["LOCAL"] = 1] = "LOCAL";
})(scope = exports.scope || (exports.scope = {}));
class _symbol {
    constructor(id, data, scope, absolute, relative, size) {
        this.id = id;
        this.data = data;
        this.scope = scope;
        this.absolute = absolute;
        this.relative = relative;
        this.size = size;
    }
    get_html() {
        let result = "";
        if (this.data instanceof declaration_function_1.declaration_function) {
            result += "<td>Funcion</td>" + "<td>" + this.id + "</td>" + "<td>Funcion</td>" + "<td>" + scope[this.scope] + "</td>";
        }
        else if (this.data.value instanceof _array_1._array) {
            result += "<td>Objeto</td>" + "<td>" + this.id + "</td>" + "<td>Arreglo</td>" + "<td>" + scope[this.scope] + "</td>";
        }
        else if (this.data.value instanceof _struct_1._struct) {
            result += "<td>Definicion</td>" + "<td>" + this.id + "</td>" + "<td>Estructura</td>" + "<td>" + scope[this.scope] + "</td>";
        }
        else if (this.data.value instanceof struct_item_1.struct_item) {
            result += "<td>Objeto</td>" + "<td>" + this.id + "</td>" + "<td>Estructura</td>" + "<td>" + scope[this.scope] + "</td>";
        }
        else
            result += "<td>" + this.data.value + "</td>" + "<td>" + this.id + "</td>" + "<td>" + type_1.type[this.data.type] + "</td>" + "<td>" + scope[this.scope] + "</td>";
        return result;
    }
    get_html_translation(environment) {
        let result = "";
        if (this.data instanceof declaration_function_1.declaration_function) {
            result += "<td>" + this.id + "</td>" + "<td>Funcion</td>" + "<td>" + this.absolute + "</td>" + "<td>" + this.relative + "</td>" + "<td>" + environment.name + "</td>\n";
        }
        else if (this.data.value instanceof _array_1._array) {
            result += "<td>" + this.id + "</td>" + "<td>Arreglo</td>" + "<td>" + this.absolute + "</td>" + "<td>" + this.relative + "</td>" + "<td>" + environment.name + "</td>\n";
        }
        else if (this.data.value instanceof _struct_1._struct) {
            result += "<td>" + this.id + "</td>" + "<td>Estructura</td>" + "<td>" + this.absolute + "</td>" + "<td>" + this.relative + "</td>" + "<td>" + environment.name + "</td>\n";
        }
        else if (this.data.value instanceof struct_item_1.struct_item) {
            result += "<td>" + this.id + "</td>" + "<td>" + type_1.type[this.data.type] + "</td>" + "<td>" + this.absolute + "</td>" + "<td>" + this.relative + "</td>" + "<td>" + environment.name + "</td>\n";
        }
        else {
            result += "<td>" + this.id + "</td>" + "<td>" + type_1.type[this.data.type] + "</td>" + "<td>" + this.absolute + "</td>" + "<td>" + this.relative + "</td>" + "<td>" + environment.name + "</td>\n";
        }
        return result;
    }
}
exports._symbol = _symbol;
//# sourceMappingURL=_symbol.js.map