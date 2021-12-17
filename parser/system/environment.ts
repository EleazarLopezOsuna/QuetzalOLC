import { declaration_function } from "../instruction/declaration_function";
import { _array } from "../literal/_array";
import { _console } from "./console";
import { data, type } from "./type";
import { _symbol, scope } from "./_symbol";

export class environment {

    private symbol_map: Map<string, _symbol>;
    private function_map: Map<string, _symbol>;

    constructor(private previous: environment | null) {
        this.previous = previous;
        this.symbol_map = new Map<string, _symbol>();
        this.function_map = new Map<string, _symbol>();
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
        return null
    }

    public save_variable(id: string, data: data, absolute: number, relative: number, size: number) {
        let symbol_type = scope.LOCAL;
        if (this.previous == null) {
            symbol_type = scope.GLOBAL;
        }
        this.symbol_map.set(id, new _symbol(id, data, symbol_type, absolute, relative, size));
    }

    public get_variable(id: string): data {
        let symbol_item = this.symbol_map.get(id)
        if (symbol_item instanceof _symbol) {
            let return_data = symbol_item.data;
            return return_data as data
        }
        return { value: null, type: type.UNDEFINED }
    }

    public get_absolute(id: string): number {
        let symbol_item = this.symbol_map.get(id)
        if (symbol_item instanceof _symbol) {
            return symbol_item.absolute
        }
        return -1
    }


    public get_size(id: string): number {
        let symbol_item = this.symbol_map.get(id)
        if (symbol_item instanceof _symbol) {
            return symbol_item.size
        }
        return -1
    }

    public get_relative(id: string): number {
        let symbol_item = this.symbol_map.get(id)
        if (symbol_item instanceof _symbol) {
            return symbol_item.relative
        }
        return -1
    }
}