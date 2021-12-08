import { instruction } from "../abstract/instruction";
import { environment } from "../system/environment";
import { error, error_arr, error_type } from "../system/error";
import { data, type } from "../system/type";
import { _console, _3dCode } from "../system/console";

export enum print_type {
    PRINT,
    PRINTLN,
}

export class print extends instruction {

    public translate(environment: environment): type {
        this.expresions.forEach(element => {
            
        });
        return type.NULL
    }

    constructor(public expresions: [instruction], public type: print_type, line: number, column: number) {
        super(line, column);
    }

    public execute(environment: environment): data {
        this.expresions.forEach(element => {
            const expr_data = element.execute(environment);

            switch (this.type) {
                case print_type.PRINT:
                    _console.output += expr_data.value
                    break;
                case print_type.PRINTLN:
                    _console.output += expr_data.value + "\n"
                    break;
            }
        });

        // Default
        return { value: null, type: type.NULL }
    }

    public plot(count: number): string {
        throw new Error("Method not implemented.");
    }
}