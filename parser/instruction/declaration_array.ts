import { environment } from "../system/environment";
import { error, error_arr, error_type } from "../system/error";
import { data, type } from "../system/type";
import { _console } from "../system/console";
import { instruction } from "../abstract/instruction";
import { _array } from "../literal/_array";

export class declaration_array extends instruction {

    public translate(environment: environment): type {
        // if is undefined save the variable with the type declared
        if (this.value == null) {
            // Save the variable 
            if (environment.get_variable(this.variable_id).type != type.UNDEFINED) {
                error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, 'Variable ya inicializada: ' + this.variable_id));
            } else {
                environment.save_variable(this.variable_id, { value: this.value, type: this.type }, 0, 0, 0)
            }
        }
        // if the save variable has an expression check types
        else {
            // Checking both types
            let checked = this.value.checkType(this.type, environment)

            // if checked type save the variable
            if (!checked) {
                error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, 'No se puede iniciar con distinto tipo de dato para: ' + this.variable_id));
            } else {
                // Save the variable 
                if (environment.get_variable(this.variable_id).type != type.UNDEFINED) {
                    error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, 'Variable ya inicializada: ' + this.variable_id));
                } else {
                    environment.save_variable(this.variable_id, { value: this.value, type: this.type }, 0, 0, 0)
                }
            }
        }
        // Default
        return type.NULL
    }

    constructor(public type: type, public variable_id: string, public value: _array | null, line: number, column: number) {
        super(line, column);
    }

    public execute(environment: environment): data {

        // if is undefined save the variable with the type declared
        if (this.value == null) {
            // Save the variable 
            if (environment.get_variable(this.variable_id).type != type.UNDEFINED) {
                error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, 'Variable ya inicializada: ' + this.variable_id));
            } else {
                environment.save_variable(this.variable_id, { value: this.value, type: this.type }, 0, 0, 0)
            }
        }
        // if the save variable has an expression check types
        else {
            // Checking both types
            let checked = this.value.checkType(this.type, environment)

            // if checked type save the variable
            if (!checked) {
                error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, 'No se puede iniciar con distinto tipo de dato para: ' + this.variable_id));
            } else {
                // Save the variable 
                if (environment.get_variable(this.variable_id).type != type.UNDEFINED) {
                    error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, 'Variable ya inicializada: ' + this.variable_id));
                } else {
                    environment.save_variable(this.variable_id, { value: this.value, type: this.type }, 0, 0, 0)
                }
            }
        }
        // Default
        return { value: null, type: type.NULL }
    }

    public plot(count: number): string {
        throw new Error("Method not implemented.");
    }
}