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

    public save_function(id: string, new_function: declaration_function) {
        let symbol_type = scope.LOCAL;
        if (this.previous == null) {
            symbol_type = scope.GLOBAL;
        }
        this.function_map.set(id, new _symbol(id, new_function, symbol_type));
    }

    public get_function(id: string): declaration_function | null {
        let symbol_item = this.function_map.get(id)
        if (symbol_item instanceof _symbol) {
            let return_function = symbol_item.data;
            return return_function as declaration_function
        }
        return null
    }

    public save_variable(id: string, data: data) {
        let symbol_type = scope.LOCAL;
        if (this.previous == null) {
            symbol_type = scope.GLOBAL;
        }
        this.symbol_map.set(id, new _symbol(id, data, symbol_type));
    }

    public get_variable(id: string): data {
        let symbol_item = this.symbol_map.get(id)
        if (symbol_item instanceof _symbol) {
            let return_data = symbol_item.data;
            return return_data as data
        }
        return { value: null, type: type.UNDEFINED }
    }

}