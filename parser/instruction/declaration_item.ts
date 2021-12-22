import { expression } from "../abstract/expression";
import { environment } from "../system/environment";
import { error, error_arr, error_type } from "../system/error";
import { data, type } from "../system/type";
import { _console } from "../system/console";
import { literal } from "../abstract/literal";
import { instruction } from "../abstract/instruction";
import { _array } from "../literal/_array";

export class declaration_item extends instruction {

    public translate(environment: environment): type {
        if (this.value != null) {
            let valueType = this.value.translate(environment);
            return valueType
        } else {

        }
        return type.NULL
    }

    constructor(public variable_id: string, public value: expression | literal | null, line: number, column: number) {
        super(line, column);
    }

    public execute(environment: environment): data {
        return (this.value == null) ? { value: null, type: type.NULL } : this.value.execute(environment)
    }

    public plot(count: number): string {
        let result = "node" + count + "[label=\"(" + this.line + "," + this.column + ") Declaracion de Item (" + this.variable_id + ")\"];";
        const this_count = count

        const child_list = [this.value]
        for (const instr of child_list) {
            if (instr != null) {
                try {
                    result += "node" + this_count + " -> " + "node" + count + "1;";
                    result += instr.plot(Number(count + "1"))
                    count++
                } catch (error) {
                    console.log(error);
                }
            }
        }
        return result
    }
}