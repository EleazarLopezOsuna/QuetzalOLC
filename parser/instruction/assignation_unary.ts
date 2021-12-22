import { relative } from "path/posix";
import { env } from "process";
import { expression } from "../abstract/expression";
import { instruction } from "../abstract/instruction";
import { literal } from "../abstract/literal";
import { _3dCode } from "../system/console";
import { environment } from "../system/environment";
import { error, error_arr, error_type } from "../system/error";
import { data, type } from "../system/type";

export class assignation_unary extends instruction {
    public translate(environment: environment): type {
        const exprType = this.expr.translate(environment);
        let exprTemp = _3dCode.actualTemp;
        // validate that exists
        let saved_variable = environment.get_variable_recursive(this.id, environment)
        let relativePos = environment.get_relative_recursive(this.id, environment);
        if (saved_variable.type != type.UNDEFINED) {
            // validate the type
            if (saved_variable.type == exprType) {
                // assign the value
                _3dCode.actualTemp++;
                _3dCode.output += 'T' + _3dCode.actualTemp + ' = SP + ' + relativePos + ';\n';
                _3dCode.output += 'STACK[(int)T' + _3dCode.actualTemp + '] = T' + exprTemp + ';//Update value for variable ' + this.id + '\n';
            } else {

            }
        } else {

        }
        // Default
        return type.NULL
    }

    constructor(public id: string, public expr: expression | literal, line: number, column: number) {
        super(line, column);
    }

    public execute(environment: environment): data {
        const expr_data = this.expr.execute(environment);
        // validate that exists
        let saved_variable = environment.get_variable(this.id)
        if (saved_variable.type != type.UNDEFINED) {
            // validate the type
            if (saved_variable.type == expr_data.type  || (saved_variable.type == type.FLOAT && expr_data.type == type.INTEGER)) {
                expr_data.type = saved_variable.type
                // assign the value
                let absolutePos = 0
                let relativePos = 0
                let size = 0
                environment.save_variable(this.id, expr_data, absolutePos, relativePos, size)
            } else {
                error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, 'Tipo diferente, no se puede asignar'));
            }
        } else {
            error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, 'Variable no inicializada'));
        }
        // Default
        return { value: null, type: type.NULL }
    }

    public plot(count: number): string {
        let result = "node" + count + "[label=\"(" + this.line + "," + this.column + ") Assignacion Unaria (" + this.id + ")\"];";
        const this_count = count

        const child_list = [this.expr]
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