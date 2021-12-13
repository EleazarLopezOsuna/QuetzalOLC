import { expression } from "../abstract/expression";
import { environment } from "../system/environment";
import { error, error_arr, error_type } from "../system/error";
import { data, type } from "../system/type";
import { _3dCode, _console } from "../system/console";


export class array_range extends expression {

    public translate(environment: environment): type {
        throw new Error("Method not implemented.");
    }

    constructor(public left: expression | string, public right: expression | string, line: number, column: number) {
        super(line, column);
    }

    public execute(environment: environment): data {
        const left_data = (this.left instanceof expression) ? this.left.execute(environment) : {type: type.STRING, value: this.left};
        const right_data = (this.right instanceof expression) ? this.right.execute(environment) : {type: type.STRING, value: this.right};

        // Default
        return { value: [left_data.value,right_data.value], type: type.NULL }
    }

    public plot(count: number): string {
        throw new Error("Method not implemented.");
    }
}