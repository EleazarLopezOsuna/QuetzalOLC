import { environment } from "../system/environment";
import { error, error_arr, error_type } from "../system/error";
import { data, type } from "../system/type";
import { _console, _3dCode } from "../system/console";
import { declaration_item } from "./declaration_item";
import { instruction } from "../abstract/instruction";

export class declaration_list extends instruction {

    public translate(environment: environment): type {
        let tData = { value: null, type: type.NULL }
        this.declare_list.forEach(item => {
            let itemType = item.translate(environment);
            let itemTemp = _3dCode.actualTemp;
            tData.type = itemType
            if (itemType == type.NULL) {
                if (environment.get_variable(item.variable_id).type != type.NULL) {
                    
                } else {
                    _3dCode.output += 'STACK[' + _3dCode.absolutePos + '] = 0;//Save variable ' + item.variable_id + '\n';
                    environment.save_variable(item.variable_id, tData, _3dCode.absolutePos, _3dCode.relativePos, 1)
                    _3dCode.absolutePos++;
                    _3dCode.relativePos++;
                }
                return type.NULL
            } else {
                let checked = false
                if (itemType == this.native_type) {
                    checked = true
                }
                if (!checked) {
                    
                } else {
                    if (environment.get_variable(item.variable_id).type != type.NULL) {
                        
                    } else {
                        _3dCode.output += 'STACK[' + _3dCode.absolutePos + '] = T' + itemTemp + ';//Save variable ' + item.variable_id + '\n';
                        environment.save_variable(item.variable_id, tData, _3dCode.absolutePos, _3dCode.relativePos, 1)
                        _3dCode.absolutePos++;
                        _3dCode.relativePos++;
                    }
                }
            }

        });
        // Default
        return type.NULL
    }

    constructor(public native_type: type, public declare_list: [declaration_item], line: number, column: number) {
        super(line, column);
    }

    public add_to_list(item: declaration_item) {
        this.declare_list.push(item)
    }

    public execute(environment: environment): data {
        this.declare_list.forEach(item => {
            let item_data = item.execute(environment);

            // if is undefined save the variable with the type declared
            if (item_data.type == type.NULL) {
                // Save the variable 
                if (environment.get_variable(item.variable_id).type != type.NULL) {
                    error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, 'Variable ya inicializada: ' + item.variable_id));
                } else {
                    environment.save_variable(item.variable_id, item_data, _console.absolutePos, _console.relativePos, 1)
                    _console.absolutePos++;
                    _console.relativePos++;
                }
                return
            }
            // if the save variable has an expression check types
            else {
                // Checking both types
                let checked = false
                if (item_data.type == this.native_type) {
                    checked = true
                }

                // if checked type save the variable
                if (!checked) {
                    error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, 'No se puede iniciar con distinto tipo de dato para: ' + item.variable_id));
                } else {
                    // Save the variable 
                    if (environment.get_variable(item.variable_id).type != type.NULL) {
                        error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, 'Variable ya inicializada: ' + item.variable_id));
                    } else {
                        environment.save_variable(item.variable_id, item_data, _console.absolutePos, _console.relativePos, 1)
                        _console.absolutePos++;
                        _console.relativePos++;
                    }
                }
            }

        });
        // Default
        return { value: null, type: type.NULL }
    }

    public plot(count: number): string {
        throw new Error("Method not implemented.");
    }
}