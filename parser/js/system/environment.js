"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.environment = void 0;
const _array_1 = require("../literal/_array");
const console_1 = require("./console");
const type_1 = require("./type");
const _symbol_1 = require("./_symbol");
class environment {
    constructor(previous) {
        this.previous = previous;
        this.previous = previous;
        if (this.previous != null) {
            this.previous.next = this;
        }
        this.next = null;
        this.symbol_map = new Map();
        this.function_map = new Map();
        this.name = '';
        this.stop_flag = false;
    }
    get_html_translation(count) {
        let result = '';
        this.symbol_map.forEach(element => {
            result += '<tr>\n';
            result += '<th scope="row">' + count + '</th>\n';
            result += element.get_html_translation(this);
            result += '</tr>\n';
            count++;
        });
        this.function_map.forEach(element => {
            result += '<tr>\n';
            result += '<th scope="row">' + count + '</th>\n';
            result += element.get_html_translation(this);
            result += '</tr>\n';
            count++;
        });
        return result;
    }
    remove_temp_recursive(environment) {
        if (environment.symbol_map.has('temp_array_test')) {
            environment.symbol_map.delete('temp_array_test');
        }
        if (environment.previous != null) {
            this.remove_temp_recursive(environment.previous);
        }
    }
    modifySize_recursive(id, environment, newValue) {
        if (environment.symbol_map.has(id)) {
            let symbol_item = environment.symbol_map.get(id);
            if (symbol_item instanceof _symbol_1._symbol) {
                let val = symbol_item.data;
                if (val.value instanceof _array_1._array) {
                    symbol_item.size = newValue;
                    val.value.size = newValue;
                    val.value.body = [];
                    symbol_item.data = { value: val.value, type: val.type };
                    environment.symbol_map.delete(id);
                    environment.symbol_map.set(id, symbol_item);
                }
            }
            console.log(symbol_item);
        }
        if (environment.previous != null) {
            this.modifySize_recursive(id, environment.previous, newValue);
        }
    }
    setStructType_recursive(id, structName, environment) {
        if (environment.symbol_map.has(id)) {
            let symbol_item = environment.symbol_map.get(id);
            if (symbol_item instanceof _symbol_1._symbol) {
                let val = symbol_item.data;
                symbol_item.structName = structName;
                environment.symbol_map.delete(id);
                environment.symbol_map.set(id, symbol_item);
            }
        }
        if (environment.previous != null) {
            this.setStructType_recursive(id, structName, environment.previous);
        }
    }
    getStructType_recursive(id, environment) {
        if (environment.symbol_map.has(id)) {
            let symbol_item = environment.symbol_map.get(id);
            if (symbol_item instanceof _symbol_1._symbol) {
                return symbol_item.structName;
            }
        }
        if (environment.previous != null) {
            return this.getStructType_recursive(id, environment.previous);
        }
        return '';
    }
    push_recursive(id, environment, newValueTemp) {
        if (environment.symbol_map.has(id)) {
            let symbol_item = environment.symbol_map.get(id);
            if (symbol_item instanceof _symbol_1._symbol) {
                let val = symbol_item.data;
                if (val.value instanceof _array_1._array) {
                    console_1._3dCode.actualTemp++;
                    let originalPosition = console_1._3dCode.actualTemp;
                    console_1._3dCode.actualTemp++;
                    let newPosition = console_1._3dCode.actualTemp;
                    console_1._3dCode.actualTemp++;
                    console_1._3dCode.output += 'T' + originalPosition + ' = SP + ' + symbol_item.relative + ';//Get old array start\n';
                    console_1._3dCode.output += 'T' + newPosition + ' = SP + ' + console_1._3dCode.relativePos + ';//Set new array start\n';
                    symbol_item.relative = console_1._3dCode.relativePos;
                    symbol_item.absolute = console_1._3dCode.absolutePos;
                    for (let i = 0; i < symbol_item.size; i++) {
                        console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = STACK[(int)T' + originalPosition + '];//Copy value\n';
                        console_1._3dCode.output += 'STACK[(int)T' + newPosition + '] = T' + console_1._3dCode.actualTemp + ';//Paste value\n';
                        console_1._3dCode.relativePos++;
                        console_1._3dCode.absolutePos++;
                        console_1._3dCode.output += 'T' + originalPosition + ' = T' + originalPosition + ' + 1;\n';
                        console_1._3dCode.output += 'T' + newPosition + ' = T' + newPosition + ' + 1;\n';
                    }
                    console_1._3dCode.output += 'STACK[(int)T' + newPosition + '] = T' + newValueTemp + ';//Paste value\n';
                    console_1._3dCode.relativePos++;
                    console_1._3dCode.absolutePos++;
                    symbol_item.size++;
                    val.value.size++;
                    symbol_item.data = { value: val.value, type: val.type };
                    environment.symbol_map.delete(id);
                    environment.symbol_map.set(id, symbol_item);
                }
            }
            console.log(symbol_item);
        }
        if (environment.previous != null) {
            this.push_recursive(id, environment.previous, newValueTemp);
        }
    }
    pop_recursive(id, environment) {
        if (environment.symbol_map.has(id)) {
            let symbol_item = environment.symbol_map.get(id);
            if (symbol_item instanceof _symbol_1._symbol) {
                let val = symbol_item.data;
                if (val.value instanceof _array_1._array) {
                    console_1._3dCode.actualTemp++;
                    console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = SP + ' + symbol_item.relative + ';\n';
                    console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = T' + console_1._3dCode.actualTemp + ' + ' + (symbol_item.size - 1) + ';\n';
                    console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = STACK[(int)T' + console_1._3dCode.actualTemp + '];\n';
                    symbol_item.size--;
                    val.value.size--;
                    symbol_item.data = { value: val.value, type: val.type };
                    environment.symbol_map.delete(id);
                    environment.symbol_map.set(id, symbol_item);
                }
            }
            console.log(symbol_item);
        }
        if (environment.previous != null) {
            this.pop_recursive(id, environment.previous);
        }
    }
    get_maps_html(count) {
        let result = "";
        this.symbol_map.forEach(element => {
            result += '<tr>\n';
            result += '<th scope="row">' + count + '</th>\n';
            result += element.get_html();
            result += '</tr>\n';
            count++;
        });
        this.function_map.forEach(element => {
            result += '<tr>\n';
            result += '<th scope="row">' + count + '</th>\n';
            result += element.get_html();
            result += '</tr>\n';
            count++;
        });
        if (this.next != null) {
            result += this.next.get_maps_html(count);
        }
        return result;
    }
    get_html() {
        let result = '<div class="table-wrapper-scroll-y my-custom-scrollbar">';
        result += '<table class="table table-hover">\n';
        result += '<thead>\n<tr>\n<th scope="col">#</th>\n';
        result += '<th scope="col">Valor</th>\n';
        result += '<th scope="col">ID</th>\n';
        result += '<th scope="col">Tipo</th>\n';
        result += '<th scope="col">Ambito</th>\n';
        result += '</tr>\n';
        result += '</thead>\n';
        result += '<tbody>\n';
        let count = 1;
        result += this.get_maps_html(count);
        result += '</tbody>\n';
        return result += '</table></div>';
    }
    save_function(id, new_function, absolute, relative, size) {
        let symbol_type = _symbol_1.scope.LOCAL;
        if (this.previous == null) {
            symbol_type = _symbol_1.scope.GLOBAL;
        }
        this.function_map.set(id, new _symbol_1._symbol(id, new_function, symbol_type, absolute, relative, size));
    }
    get_function(id) {
        let symbol_item = this.function_map.get(id);
        if (symbol_item instanceof _symbol_1._symbol) {
            let return_function = symbol_item.data;
            return return_function;
        }
        // variable doesnt exist
        if (this.previous != null) {
            return this.previous.get_function(id);
        }
        return null;
    }
    save_variable(id, data, absolute, relative, size) {
        let symbol_type = _symbol_1.scope.LOCAL;
        if (this.previous == null) {
            symbol_type = _symbol_1.scope.GLOBAL;
        }
        this.symbol_map.set(id, new _symbol_1._symbol(id, data, symbol_type, absolute, relative, size));
    }
    exists(id) {
        let symbol_item = this.symbol_map.get(id);
        if (symbol_item instanceof _symbol_1._symbol) {
            return true;
        }
        return false;
    }
    get_variable(id) {
        let symbol_item = this.symbol_map.get(id);
        if (symbol_item instanceof _symbol_1._symbol) {
            let return_data = symbol_item.data;
            return return_data;
        }
        // variable doesnt exist
        if (this.previous != null) {
            return this.previous.get_variable(id);
        }
        return { value: null, type: type_1.type.UNDEFINED };
    }
    get_function_recursive(id, environment) {
        /*let symbol_item = this.symbol_map.get(id)
        if (symbol_item instanceof _symbol) {
            return symbol_item
        }
        return null*/
        if (environment.symbol_map.has(id)) {
            let symbol_item = environment.symbol_map.get(id);
            if (symbol_item instanceof _symbol_1._symbol) {
                return symbol_item;
            }
        }
        if (environment.previous != null) {
            return this.get_function_recursive(id, environment.previous);
        }
        return null;
    }
    get_scope_recursive(id, environment) {
        /*let symbol_item = this.symbol_map.get(id)
        if (symbol_item instanceof _symbol) {
            return symbol_item
        }
        return null*/
        if (environment.symbol_map.has(id)) {
            let symbol_item = environment.symbol_map.get(id);
            if (symbol_item instanceof _symbol_1._symbol) {
                return symbol_item.scope;
            }
        }
        if (environment.previous != null) {
            return this.get_scope_recursive(id, environment.previous);
        }
        return null;
    }
    get_variable_recursive(id, environment) {
        if (environment.symbol_map.has(id)) {
            let symbol_item = environment.symbol_map.get(id);
            if (symbol_item instanceof _symbol_1._symbol) {
                let return_data = symbol_item.data;
                return return_data;
            }
        }
        if (environment.previous != null) {
            return this.get_variable_recursive(id, environment.previous);
        }
        return { value: null, type: type_1.type.UNDEFINED };
    }
    get_absolute_recursive(id, environment) {
        /*let symbol_item = this.symbol_map.get(id)
        if (symbol_item instanceof _symbol) {
            return symbol_item.absolute
        }
        return -1*/
        if (environment.symbol_map.has(id)) {
            let symbol_item = environment.symbol_map.get(id);
            if (symbol_item instanceof _symbol_1._symbol) {
                return symbol_item.absolute;
            }
        }
        if (environment.previous != null) {
            return this.get_absolute_recursive(id, environment.previous);
        }
        return -1;
    }
    get_size_recursive(id, environment) {
        /*let symbol_item = this.symbol_map.get(id)
        if (symbol_item instanceof _symbol) {
            return symbol_item.size
        }
        return -1*/
        if (environment.symbol_map.has(id)) {
            let symbol_item = environment.symbol_map.get(id);
            if (symbol_item instanceof _symbol_1._symbol) {
                return symbol_item.size;
            }
        }
        if (environment.previous != null) {
            return this.get_size_recursive(id, environment.previous);
        }
        return -1;
    }
    get_relative_recursive(id, environment) {
        /*let symbol_item = this.symbol_map.get(id)
        if (symbol_item instanceof _symbol) {
            return symbol_item.relative
        }
        return -1*/
        if (environment.symbol_map.has(id)) {
            let symbol_item = environment.symbol_map.get(id);
            if (symbol_item instanceof _symbol_1._symbol) {
                return symbol_item.relative;
            }
        }
        if (environment.previous != null) {
            return this.get_relative_recursive(id, environment.previous);
        }
        return -1;
    }
}
exports.environment = environment;
//# sourceMappingURL=environment.js.map