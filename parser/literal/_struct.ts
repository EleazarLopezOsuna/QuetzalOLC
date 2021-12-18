import { expression } from "../abstract/expression";
import { environment } from "../system/environment";
import { data, type } from "../system/type";
import { _3dCode } from "../system/console";
import { literal } from "../abstract/literal";
import { parameter } from "../expression/parameter";

export class _struct extends literal {
    public translate(environment: environment): type {
        // Default
        return type.NULL
    }

    public check_length(parameters: Array<expression | literal>): boolean {
        return (parameters.length == this.body.length)
    }

    public check_types(parameters: Array<expression | literal>, environment: environment): boolean {
        for (let index = 0; index < this.body.length; index++) {
            const declared_parameter_data = this.body[index].execute(environment);
            const obtained_parameter_data = parameters[index].execute(environment)
            if (declared_parameter_data.type != obtained_parameter_data.type) {
                return false
            }
        }
        return true
    }

    constructor(public body: Array<parameter>, line: number, column: number) {
        super(line, column);
    }

    public execute(environment: environment): data {
        // Default
        return { value: this, type: type.UNDEFINED }
    }

    public plot(count: number): string {
        let result = "node" + count + "[label=\"(" + this.line + "," + this.column + ") Struct\"];";
        const this_count = count

        for (const instr of this.body) {
            try {
                result += "node" + this_count + " -> " + "node" + count + "1;";
                result += instr.plot(Number(count + "1"))
                count++
            } catch (error) {
                console.log(error);
            }
        }
        return result
    }
}