import { _console } from "./console";
import { data, type } from "./type";
import { _symbol, scope } from "./_symbol";

export class environment {

    private symbol_map: Map<string, _symbol>;
    private function_map: Map<string, Function>;

    constructor(private previous: environment | null) {
        this.previous = previous;
        this.symbol_map = new Map<string, _symbol>();
        this.function_map = new Map<string, Function>();
    }

    public save_variable(id: string, data: data) {
        let symbol_type = scope.LOCAL;
        if (this.previous == null) {
            symbol_type = scope.GLOBAL;
        }
        this.symbol_map.set(id, new _symbol(id, data, symbol_type));
    }

    public get_variable(id:string): data {
        let symbol_item = this.symbol_map.get(id)
        if(symbol_item instanceof _symbol) {
            return symbol_item.data
        } else {
            return {value: null, type: type.NULL}
        }
    }

}