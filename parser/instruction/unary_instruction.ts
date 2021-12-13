import { expression } from "../abstract/expression";
import { environment } from "../system/environment";
import { error, error_arr, error_type } from "../system/error";
import { data, type } from "../system/type";
import { _3dCode } from "../system/console";
import { literal } from "../abstract/literal";
import { variable_id } from "../literal/variable_id";

export enum unary_instruction_type {
    INCREMENT,
    DECREMENT,
}

export class unary_instruction extends expression {
    public translate(environment: environment): type {
        const variable_data = environment.get_variable(this.variable_id)
        if (variable_data.type == type.NULL) {
            return type.NULL
        }
        let absolutePos = environment.get_absolute(this.variable_id);
        switch (this.type) {
            case unary_instruction_type.INCREMENT:
                switch (variable_data.type) {
                    case type.INTEGER:
                        _3dCode.actualTemp++;
                        _3dCode.output += 'T' + _3dCode.actualTemp + ' = STACK[' + absolutePos + '];//Get value of variable ' + this.variable_id + '\n';
                        _3dCode.output += 'T' + _3dCode.actualTemp + ' = T' + _3dCode.actualTemp + ' + 1;\n';
                        _3dCode.output += 'STACK[' + absolutePos + '] = T' + _3dCode.actualTemp + ';//Update value of variable ' + this.variable_id + '\n'; 
                        break;
                    default:
                        error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, 'No se puede operar ++ para: ' + variable_data.value));
                }
                break;
            case unary_instruction_type.DECREMENT:
                switch (variable_data.type) {
                    case type.INTEGER:
                        _3dCode.actualTemp++;
                        _3dCode.output += 'T' + _3dCode.actualTemp + ' = STACK[' + absolutePos + '];//Get value of variable ' + this.variable_id + '\n';
                        _3dCode.output += 'T' + _3dCode.actualTemp + ' = T' + _3dCode.actualTemp + ' - 1;\n';
                        _3dCode.output += 'STACK[' + absolutePos + '] = T' + _3dCode.actualTemp + ';//Update value of variable ' + this.variable_id + '\n'; 
                        break;
                    default:
                        error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, 'No se puede operar -- para: ' + variable_data.value));
                }
                break;


        }
        // Default
        return type.NULL
    }

    constructor(public variable_id: string, public type: unary_instruction_type, line: number, column: number) {
        super(line, column);
    }

    public execute(environment: environment): data {
        const variable_data = environment.get_variable(this.variable_id)
        if (variable_data.type == type.NULL) {
            error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, 'Variable no existente'));
            return { value: null, type: type.NULL }
        }
        switch (this.type) {
            case unary_instruction_type.INCREMENT:
                switch (variable_data.type) {
                    case type.INTEGER:
                        variable_data.value++
                        break;
                    default:
                        error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, 'No se puede operar ++ para: ' + variable_data.value));
                }
                break;
            case unary_instruction_type.DECREMENT:
                switch (variable_data.type) {
                    case type.INTEGER:
                        variable_data.value--
                        break;
                    default:
                        error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, 'No se puede operar -- para: ' + variable_data.value));
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