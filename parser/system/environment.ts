import { _console } from "./console";
import { data } from "./type";
import { _symbol, scope } from "./_symbol";

export class environment {

    private variable_map: Map<string, _symbol>;
    private function_map: Map<string, Function>;

    constructor(private previous: environment | null) {
        this.previous = previous;
        this.variable_map = new Map<string, _symbol>();
        this.function_map = new Map<string, Function>();
    }

    public save_variable(id: string, data: data) {
        let symbol_type = scope.LOCAL;
        if (this.previous == null) {
            symbol_type = scope.GLOBAL;
        }
        this.variable_map.set(id, new _symbol(id, data, symbol_type));
    }

}