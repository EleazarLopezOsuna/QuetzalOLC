export class environment {

    private variable_map: Map<string, Symbol>;
    private function_map: Map<string, Function>;

    constructor(private previous: environment | null) {
        this.previous = previous;
        this.variable_map = new Map<string, Symbol>();
        this.function_map = new Map<string, Function>();
    }

}