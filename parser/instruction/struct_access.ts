import { expression } from "../abstract/expression";
import { environment } from "../system/environment";
import { error, error_arr, error_type } from "../system/error";
import { data, type } from "../system/type";
import { _console, _3dCode } from "../system/console";
import { literal } from "../abstract/literal";
import { instruction } from "../abstract/instruction";
import { _array } from "../literal/_array";
import { array_range } from "../expression/array_range";
import { variable_id } from "../literal/variable_id";
import { _struct } from "../literal/_struct";
import { struct_item } from "../literal/struct_item";

export class struct_access extends instruction {

    public translate(environment: environment): type {
        if (this.id instanceof variable_id) {
            const tipoStruct = environment.getStructType_recursive(this.id.id, environment);
            const relativePos = environment.get_relative_recursive(this.id.id, environment);
            let contador = 1;
            let returnData = {value: null, type: type.NULL};
            _3dCode.environmentList.forEach(envi => {
                if (envi.name === tipoStruct) {
                    envi.symbol_map.forEach(element => {
                        if (element.id == this.property) {
                            _3dCode.actualTemp++;
                            _3dCode.output += 'T' + _3dCode.actualTemp + ' = SP + ' + relativePos + ';\n';
                            _3dCode.output += 'T' + _3dCode.actualTemp + ' = T' + _3dCode.actualTemp + ' + ' + contador + ';\n';
                            _3dCode.output += 'T' + _3dCode.actualTemp + ' = STACK[(int)T' + _3dCode.actualTemp + '];\n';
                            returnData = element.data as data
                            console.log(returnData)
                            return;
                        }
                        contador++;
                    })
                    return
                }
            })
            return returnData.type;
        } else {
            error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, 'La variable no es un struct'));
            return type.NULL
        }
    }

    constructor(public id: variable_id | struct_access, public property: string, line: number, column: number) {
        super(line, column);
    }

    public execute(environment: environment): data {

        const struct_data = this.id.execute(environment)
        if (struct_data.value instanceof struct_item) {
            let returned_object = struct_data.value.get_value(this.property, environment)
            if (returned_object != null) {
                return returned_object.execute(environment)
            } else {
                error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, 'Propiedad no existente en el struct'));
                return { value: null, type: type.NULL }
            }
        } else {
            error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, 'La variable no es un struct'));
            return { value: null, type: type.NULL }
        }

    }

    public plot(count: number): string {
        let result = "node" + count + "[label=\"(" + this.line + "," + this.column + ") Struct Property (" + this.property + ")\"];";
        const this_count = count

        const child_list = [this.id]
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