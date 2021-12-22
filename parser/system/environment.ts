import { declaration_function } from "../instruction/declaration_function";
import { _array } from "../literal/_array";
import { _console, _3dCode } from "./console";
import { data, type } from "./type";
import { _symbol, scope } from "./_symbol";

export class environment {

    public symbol_map: Map<string, _symbol>;
    private function_map: Map<string, _symbol>;
    public name: string;
    public next: environment | null;
    public stop_flag:boolean;

    constructor(public previous: environment | null) {
        this.previous = previous;
        if (this.previous != null) {
            this.previous.next = this
        }
        this.next = null
        this.symbol_map = new Map<string, _symbol>();
        this.function_map = new Map<string, _symbol>();
        this.name = '';
        this.stop_flag = false;
    }

    public get_html_translation(): string {
        let result = ''
        let count = 1;
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

    public remove_temp_recursive(environment: environment) {
        if (environment.symbol_map.has('temp_array_test')) {
            environment.symbol_map.delete('temp_array_test')
        }
        if (environment.previous != null) {
            this.remove_temp_recursive(environment.previous);
        }
    }
    
    public modifySize_recursive(id: string, environment: environment, newValue: number) {
        if (environment.symbol_map.has(id)) {
            let symbol_item = environment.symbol_map.get(id)
            if(symbol_item instanceof _symbol){
                let val = symbol_item.data as data
                if(val.value instanceof _array){
                    symbol_item.size = newValue
                    val.value.size = newValue
                    val.value.body = []
                    symbol_item.data = {value: val.value, type: val.type}
                    environment.symbol_map.delete(id);
                    environment.symbol_map.set(id, symbol_item)
                }
            }
            console.log(symbol_item)
        }
        if (environment.previous != null) {
            this.modifySize_recursive(id, environment.previous, newValue);
        }
    }

    public setStructType_recursive(id: string, structName: string, environment: environment) {
        if (environment.symbol_map.has(id)) {
            let symbol_item = environment.symbol_map.get(id)
            if(symbol_item instanceof _symbol){
                let val = symbol_item.data as data
                if(val.value instanceof _array){
                    symbol_item.structName = structName
                    symbol_item.data = {value: val.value, type: val.type}
                    environment.symbol_map.delete(id);
                    environment.symbol_map.set(id, symbol_item)
                }
            }
            console.log(symbol_item)
        }
        if (environment.previous != null) {
            this.setStructType_recursive(id, structName, environment.previous);
        }
    }

    public push_recursive(id: string, environment: environment, newValueTemp: number) {
        if (environment.symbol_map.has(id)) {
            let symbol_item = environment.symbol_map.get(id)
            if(symbol_item instanceof _symbol){
                let val = symbol_item.data as data
                if(val.value instanceof _array){
                    _3dCode.actualTemp++;
                    let originalPosition = _3dCode.actualTemp;
                    _3dCode.actualTemp++;
                    let newPosition = _3dCode.actualTemp;
                    _3dCode.actualTemp++;
                    _3dCode.output += 'T' + originalPosition + ' = SP + ' + symbol_item.relative + ';//Get old array start\n';
                    _3dCode.output += 'T' + newPosition + ' = SP + ' + _3dCode.relativePos + ';//Set new array start\n';
                    symbol_item.relative = _3dCode.relativePos;
                    symbol_item.absolute = _3dCode.absolutePos;
                    for(let i = 0; i < symbol_item.size; i++){
                        _3dCode.output += 'T' + _3dCode.actualTemp + ' = STACK[(int)T' + originalPosition + '];//Copy value\n';
                        _3dCode.output += 'STACK[(int)T' + newPosition + '] = T' + _3dCode.actualTemp + ';//Paste value\n';
                        _3dCode.relativePos++;
                        _3dCode.absolutePos++;
                        _3dCode.output += 'T' + originalPosition + ' = T' + originalPosition + ' + 1;\n';
                        _3dCode.output += 'T' + newPosition + ' = T' + newPosition + ' + 1;\n';
                    }
                    _3dCode.output += 'STACK[(int)T' + newPosition + '] = T' + newValueTemp + ';//Paste value\n';
                    _3dCode.relativePos++;
                    _3dCode.absolutePos++;
                    symbol_item.size++;
                    val.value.size++;
                    symbol_item.data = {value: val.value, type: val.type}
                    environment.symbol_map.delete(id);
                    environment.symbol_map.set(id, symbol_item)
                }
            }
            console.log(symbol_item)
        }
        if (environment.previous != null) {
            this.push_recursive(id, environment.previous, newValueTemp);
        }
    }

    public pop_recursive(id: string, environment: environment) {
        if (environment.symbol_map.has(id)) {
            let symbol_item = environment.symbol_map.get(id)
            if(symbol_item instanceof _symbol){
                let val = symbol_item.data as data
                if(val.value instanceof _array){
                    _3dCode.actualTemp++;
                    _3dCode.output += 'T' + _3dCode.actualTemp + ' = SP + ' + symbol_item.relative + ';\n';
                    _3dCode.output += 'T' + _3dCode.actualTemp + ' = T' + _3dCode.actualTemp + ' + ' + (symbol_item.size - 1) + ';\n';
                    _3dCode.output += 'T' + _3dCode.actualTemp + ' = STACK[(int)T' + _3dCode.actualTemp + '];\n';
                    symbol_item.size--;
                    val.value.size--;
                    symbol_item.data = {value: val.value, type: val.type}
                    environment.symbol_map.delete(id);
                    environment.symbol_map.set(id, symbol_item)
                }
            }
            console.log(symbol_item)
        }
        if (environment.previous != null) {
            this.pop_recursive(id, environment.previous);
        }
    }

    private get_maps_html(count: number): string {
        let result = ""
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
            result += this.next.get_maps_html(count)
        }
        return result
    }

    public get_html(): string {
        let result = '<div class="table-wrapper-scroll-y my-custom-scrollbar">';
        result += '<table class="table table-hover">\n';

        result += '<thead>\n<tr>\n<th scope="col">#</th>\n'
        result += '<th scope="col">Valor</th>\n';
        result += '<th scope="col">ID</th>\n';
        result += '<th scope="col">Tipo</th>\n';
        result += '<th scope="col">Ambito</th>\n';
        result += '</tr>\n';
        result += '</thead>\n';
        result += '<tbody>\n';

        let count = 1;
        result += this.get_maps_html(count)
        result += '</tbody>\n';
        return result += '</table></div>';
    }

    public save_function(id: string, new_function: declaration_function, absolute: number, relative: number, size: number) {
        let symbol_type = scope.LOCAL;
        if (this.previous == null) {
            symbol_type = scope.GLOBAL;
        }
        this.function_map.set(id, new _symbol(id, new_function, symbol_type, absolute, relative, size));
    }

    public get_function(id: string): declaration_function | null {
        let symbol_item = this.function_map.get(id)
        if (symbol_item instanceof _symbol) {
            let return_function = symbol_item.data;
            return return_function as declaration_function
        }
        // variable doesnt exist
        if (this.previous != null) {
            return this.previous.get_function(id)
        }
        return null
    }

    public save_variable(id: string, data: data, absolute: number, relative: number, size: number) {
        let symbol_type = scope.LOCAL;
        if (this.previous == null) {
            symbol_type = scope.GLOBAL;
        }
        this.symbol_map.set(id, new _symbol(id, data, symbol_type, absolute, relative, size));
    }

    public exists(id: string): boolean {
        let symbol_item = this.symbol_map.get(id)
        if (symbol_item instanceof _symbol) {
            return true
        }
        return false
    }

    public get_variable(id: string): data {
        let symbol_item = this.symbol_map.get(id)
        if (symbol_item instanceof _symbol) {
            let return_data = symbol_item.data;
            return return_data as data
        }
        // variable doesnt exist
        if (this.previous != null) {
            return this.previous.get_variable(id)
        }
        return { value: null, type: type.UNDEFINED }
    }

    public get_function_recursive(id: string, environment: environment): _symbol | null {
        /*let symbol_item = this.symbol_map.get(id)
        if (symbol_item instanceof _symbol) {
            return symbol_item
        }
        return null*/
        if (environment.symbol_map.has(id)) {
            let symbol_item = environment.symbol_map.get(id)
            if (symbol_item instanceof _symbol) {
                return symbol_item;
            }
        }
        if (environment.previous != null) {
            return this.get_function_recursive(id, environment.previous);
        }
        return null
    }

    public get_scope_recursive(id: string, environment: environment): scope | null {
        /*let symbol_item = this.symbol_map.get(id)
        if (symbol_item instanceof _symbol) {
            return symbol_item
        }
        return null*/
        if (environment.symbol_map.has(id)) {
            let symbol_item = environment.symbol_map.get(id)
            if (symbol_item instanceof _symbol) {
                return symbol_item.scope;
            }
        }
        if (environment.previous != null) {
            return this.get_scope_recursive(id, environment.previous);
        }
        return null
    }

    public get_variable_recursive(id: string, environment: environment): data {
        if (environment.symbol_map.has(id)) {
            let symbol_item = environment.symbol_map.get(id)
            if (symbol_item instanceof _symbol) {
                let return_data = symbol_item.data
                return return_data as data
            }
        }
        if (environment.previous != null) {
            return this.get_variable_recursive(id, environment.previous);
        }
        return { value: null, type: type.UNDEFINED }
    }

    public get_absolute_recursive(id: string, environment: environment): number {
        /*let symbol_item = this.symbol_map.get(id)
        if (symbol_item instanceof _symbol) {
            return symbol_item.absolute
        }
        return -1*/
        if (environment.symbol_map.has(id)) {
            let symbol_item = environment.symbol_map.get(id)
            if (symbol_item instanceof _symbol) {
                return symbol_item.absolute;
            }
        }
        if (environment.previous != null) {
            return this.get_absolute_recursive(id, environment.previous);
        }
        return -1
    }


    public get_size_recursive(id: string, environment: environment): number {
        /*let symbol_item = this.symbol_map.get(id)
        if (symbol_item instanceof _symbol) {
            return symbol_item.size
        }
        return -1*/
        if (environment.symbol_map.has(id)) {
            let symbol_item = environment.symbol_map.get(id)
            if (symbol_item instanceof _symbol) {
                return symbol_item.size;
            }
        }
        if (environment.previous != null) {
            return this.get_size_recursive(id, environment.previous);
        }
        return -1
    }

    public get_relative_recursive(id: string, environment: environment): number {
        /*let symbol_item = this.symbol_map.get(id)
        if (symbol_item instanceof _symbol) {
            return symbol_item.relative
        }
        return -1*/
        if (environment.symbol_map.has(id)) {
            let symbol_item = environment.symbol_map.get(id)
            if (symbol_item instanceof _symbol) {
                return symbol_item.relative;
            }
        }
        if (environment.previous != null) {
            return this.get_relative_recursive(id, environment.previous);
        }
        return -1
    }
}