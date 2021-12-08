import { expression } from "../abstract/expression";
import { environment } from "../system/environment";
import { error, error_arr, error_type } from "../system/error";
import { data, type } from "../system/type";

export enum string_ternary_type {
    SUBSTRING,
}

export class string_ternary extends expression {
    public translate(environment: environment): type {
        throw new Error("Method not implemented.");
    }

    constructor(public first: expression, public second: expression, public third: expression, public type: string_ternary_type, line: number, column: number) {
        super(line, column);
    }

    public execute(environment: environment): data {
        const first_data = this.first.execute(environment);
        const second_data = this.second.execute(environment);
        const third_data = this.third.execute(environment);

        switch (this.type) {
            case string_ternary_type.SUBSTRING:
                if (first_data.type == type.STRING && second_data.type == type.INTEGER && third_data.type == type.INTEGER) {
                    let string_return:String = first_data.value.toString()
                    return { value: string_return.substr(second_data.value,third_data.value), type: type.STRING };
                } else {
                    error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, 'No se puede operar substring ' + first_data.value + ' & ' + second_data.value + ' & ' + third_data.value));
                }
                break;
        }
        // Default
        return { value: null, type: type.NULL }
    }

    public plot(count: number): string {
        throw new Error("Method not implemented.");
    }
}