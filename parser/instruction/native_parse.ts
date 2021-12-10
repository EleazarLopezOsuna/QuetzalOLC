import { expression } from "../abstract/expression";
import { environment } from "../system/environment";
import { error, error_arr, error_type } from "../system/error";
import { data, type } from "../system/type";
import { _console } from "../system/console";
import { literal } from "../abstract/literal";
import { instruction } from "../abstract/instruction";

export class native_parse extends instruction {

    public translate(environment: environment): type {
        throw new Error("Method not implemented.");
    }

    constructor(public native_type: type, public value: expression | literal, line: number, column: number) {
        super(line, column);
    }

    public execute(environment: environment): data {
        let value_data = this.value.execute(environment)
        switch (this.native_type) {
            case type.INTEGER:
                try {
                    return { value: parseInt(value_data.value), type: type.INTEGER }
                } catch (e) {
                    error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, 'No se puede parsear a int el valor ' + value_data.value));
                }
            case type.FLOAT:
                try {
                    return { value: parseFloat(value_data.value), type: type.FLOAT }
                } catch (e) {
                    error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, 'No se puede parsear a double el valor ' + value_data.value));
                }
            case type.BOOLEAN:
                try {
                    return { value: Boolean(value_data.value), type: type.BOOLEAN }
                } catch (e) {
                    error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, 'No se puede parsear a boolean el valor ' + value_data.value));
                }
        }


        return { value: null, type: type.NULL }
    }

    public plot(count: number): string {
        throw new Error("Method not implemented.");
    }
}