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

    constructor(public native_type: type, public id: string, line: number, column: number) {
        super(line, column);
    }

    public execute(environment: environment): data {
        return { value: this.id, type: this.native_type }
    }

    public plot(count: number): string {
        let result = "node" + count + "[label=\"(" + this.line + "," + this.column + ") Parametro (" + this.id + "," + type[this.native_type] + ")\"];";

        return result
    }
}