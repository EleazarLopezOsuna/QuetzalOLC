import { expression } from "../abstract/expression";
import { environment } from "../system/environment";
import { error, error_arr, error_type } from "../system/error";
import { data, type } from "../system/type";
import { _console } from "../system/console";
import { literal } from "../abstract/literal";

export class native_function extends expression {

    public translate(environment: environment): type {
        throw new Error("Method not implemented.");
    }

    constructor(public option: string, public value: expression | literal, line: number, column: number) {
        super(line, column);
    }

    public execute(environment: environment): data {
        let value_data = this.value.execute(environment)
        switch (this.option) {
            case "toInt":
                try {
                    return { value: parseInt(value_data.value), type: type.INTEGER }
                } catch (e) {
                    error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, 'No se puede parsear a int el valor ' + value_data.value));
                }
            case "toDouble":
                try {
                    return { value: parseFloat(value_data.value), type: type.FLOAT }
                } catch (e) {
                    error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, 'No se puede parsear a double el valor ' + value_data.value));
                }
            case "string":
                try {
                    return { value: String(value_data.value), type: type.STRING }
                } catch (e) {
                    error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, 'No se puede parsear a string el valor ' + value_data.value));
                }
            case "typeof":
                return { value: type[value_data.type], type: type.STRING }
        }


        return { value: null, type: type.NULL }
    }

    public plot(count: number): string {
        throw new Error("Method not implemented.");
    }
}