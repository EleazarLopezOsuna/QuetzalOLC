import { environment } from "../system/environment";
import { data, type } from "../system/type";
import { _console, _3dCode } from "../system/console";
import { instruction } from "../abstract/instruction";
import { _return } from "./_return";

export class _continue extends instruction {

    public translate(environment: environment): type {
        _3dCode.output += "goto L" + _3dCode.continueTag + ";\n";
        return type.NULL;
    }

    constructor(line: number, column: number) {
        super(line, column);
    }

    public execute(environment: environment): data {
        return { value: null, type: type.NULL }
    }

    public plot(count: number): string {
        let result = "node" + count + "[label=\"(" + this.line + "," + this.column + ") Continue\"];";

        return result
    }
}