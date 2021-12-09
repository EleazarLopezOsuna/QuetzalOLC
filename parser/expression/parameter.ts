import { expression } from "../abstract/expression";
import { environment } from "../system/environment";
import { error, error_arr, error_type } from "../system/error";
import { data, type } from "../system/type";
import { _3dCode, _console } from "../system/console";
import { exit } from "process";

export class parameter extends expression {

    public translate(environment: environment): type {
        throw new Error("Method not implemented.");
    }

    constructor(public native_type: string, public id: string, line: number, column: number) {
        super(line, column);
    }

    public execute(environment: environment): data {
        let return_type: type = type.NULL;
        switch (this.native_type) {
            case "int":
                return_type = type.INTEGER
                break;
            case "String":
                return_type = type.STRING
                break;
            case "double":
                return_type = type.FLOAT
                break;
            case "boolean":
                return_type = type.BOOLEAN
                break;
            case "char":
                return_type = type.CHAR
                break;
            default:
                // TODO buscar en los structs
                error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, 'Tipo no valido'));
                break;

        }
        return { value: this.id, type: return_type }

    }

    public plot(count: number): string {
        throw new Error("Method not implemented.");
    }
}