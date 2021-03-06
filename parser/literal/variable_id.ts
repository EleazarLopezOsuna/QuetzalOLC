import { literal } from "../abstract/literal";
import { environment } from "../system/environment";
import { data, type } from "../system/type";
import { _3dCode } from "../system/console";
import { error, error_arr, error_type } from "../system/error";
import { scope } from "../system/_symbol";

export enum variable_id_type {
    NORMAL,
    REFERENCE
}

export class variable_id extends literal {

    public translate(environment: environment): type {
        let return_data = environment.get_variable_recursive(this.id, environment)
        let absolute = environment.get_absolute_recursive(this.id, environment)
        let relative = environment.get_relative_recursive(this.id, environment)
        let symScope = environment.get_scope_recursive(this.id, environment)
        if (return_data.type != type.NULL) {
            if (symScope == scope.GLOBAL) {
                _3dCode.actualTemp++;
                let posVar = _3dCode.actualTemp;
                _3dCode.output += 'T' + _3dCode.actualTemp + ' = mainStart + ' + relative + ';\n';
                _3dCode.actualTemp++;
                _3dCode.output += 'T' + _3dCode.actualTemp + ' = STACK[(int)T' + posVar + '];//Getting value of variable ' + this.id + '\n';
            } else {
                _3dCode.actualTemp++;
                let posVar = _3dCode.actualTemp;
                _3dCode.output += 'T' + _3dCode.actualTemp + ' = SP + ' + relative + ';\n';
                _3dCode.actualTemp++;
                _3dCode.output += 'T' + _3dCode.actualTemp + ' = STACK[(int)T' + posVar + '];//Getting value of variable ' + this.id + '\n';
            }
            return return_data.type
        } else {

        }
        return type.NULL;
    }

    constructor(public id: string, public type: variable_id_type, line: number, column: number) {
        super(line, column);
    }

    public execute(environment: environment): data {
        let return_data = environment.get_variable(this.id)
        if (return_data.type != type.UNDEFINED) {
            return return_data
        } else {
            error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, 'Variable no definida: ' + this.id));
        }
        return { value: null, type: type.NULL }
    }

    public plot(count: number): string {
        let result = "node" + count + "[label=\"(" + this.line + "," + this.column + ") Nativo (" + this.id + "," + variable_id_type[this.type] + ")\"];";

        return result
    }

}