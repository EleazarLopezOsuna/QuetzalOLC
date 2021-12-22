import { instruction } from "../abstract/instruction";
import { environment } from "../system/environment";
import { error, error_arr, error_type } from "../system/error";
import { data, type } from "../system/type";
import { _console, _3dCode } from "../system/console";
import { _array } from "../literal/_array";
import { struct_item } from "../literal/struct_item";
import { variable_id } from "../literal/variable_id";

export enum print_type {
    PRINT,
    PRINTLN,
}

export class print extends instruction {

    public translate(environment: environment): type {
        this.expresions.forEach(element => {
            let expr_data = null;
            if (element instanceof variable_id) {
                expr_data = element.execute(environment);
            }
            if (expr_data != null && expr_data.value instanceof _array) {
                let size = expr_data.value.size;
                let varId = element as variable_id
                let start = environment.get_relative_recursive(varId.id, environment);
                _3dCode.actualTemp++;
                let startTemp = _3dCode.actualTemp;
                _3dCode.output += 'T' + _3dCode.actualTemp + ' = SP + ' + start + ';\n';
                let varType = environment.get_variable_recursive(varId.id, environment).type;
                let tipo;
                switch (varType) {
                    case type.CHAR:
                    case type.STRING:
                        tipo = 0;
                        break;
                    case type.BOOLEAN:
                    case type.INTEGER:
                        tipo = 1;
                        break;
                    case type.FLOAT:
                        tipo = 2;
                        break;

                }
                _3dCode.actualTemp++;
                let savedEnvironment = _3dCode.actualTemp;
                _3dCode.output += 'T' + savedEnvironment + ' = SP;//Save environment\n';
                _3dCode.actualTemp++;
                _3dCode.output += 'SP = 39;\n';
                _3dCode.output += 'T' + _3dCode.actualTemp + ' = SP + 1;\n';
                _3dCode.output += 'STACK[(int)T' + _3dCode.actualTemp + '] = ' + size + ';\n';
                _3dCode.output += 'T' + _3dCode.actualTemp + ' = SP + 2;\n';
                _3dCode.output += 'STACK[(int)T' + _3dCode.actualTemp + '] = T' + startTemp + ';\n';
                _3dCode.output += 'T' + _3dCode.actualTemp + ' = SP + 3;\n';
                _3dCode.output += 'STACK[(int)T' + _3dCode.actualTemp + '] = ' + tipo + ';\n';
                _3dCode.output += 'printArray();\n';
                _3dCode.output += 'SP = T' + savedEnvironment + ';\n';
            } else if (expr_data != null && expr_data.value instanceof struct_item) {

            } else {
                const elementType = element.translate(environment);
                switch (elementType) {
                    case type.BOOLEAN:
                        _3dCode.actualTag++
                        const trueTag = _3dCode.actualTag;
                        _3dCode.actualTag++
                        const falseTag = _3dCode.actualTag;
                        _3dCode.actualTag++
                        const exitTag = _3dCode.actualTag;
                        _3dCode.output += 'if(T' + _3dCode.actualTemp + ' == 0) goto L' + trueTag + ';//Check if False\n';
                        _3dCode.output += 'goto L' + falseTag + ';\n';
                        _3dCode.output += 'L' + trueTag + '://True tag\n';
                        _3dCode.output += 'printf("%c", 70);//Print F\n';
                        _3dCode.output += 'printf("%c", 97);//Print a\n';
                        _3dCode.output += 'printf("%c", 108);//Print l\n';
                        _3dCode.output += 'printf("%c", 115);//Print s\n';
                        _3dCode.output += 'printf("%c", 101);//Print e\n';
                        _3dCode.output += 'goto L' + exitTag + ';\n';
                        _3dCode.output += 'L' + falseTag + '://True tag\n';
                        _3dCode.output += 'printf("%c", 84);//Print T\n';
                        _3dCode.output += 'printf("%c", 114);//Print r\n';
                        _3dCode.output += 'printf("%c", 117);//Print u\n';
                        _3dCode.output += 'printf("%c", 101);//Print e\n';
                        _3dCode.output += 'goto L' + exitTag + ';\n';
                        _3dCode.output += 'L' + exitTag + ':\n';
                        break;
                    case type.CHAR:
                    case type.STRING:
                        const elementTemp = _3dCode.actualTemp;
                        _3dCode.actualTemp++;
                        const savedEnvironment = _3dCode.actualTemp;
                        _3dCode.output += 'T' + savedEnvironment + ' = SP;//Save environment\n';
                        _3dCode.output += 'SP = 3;//Set StringPrint environment\n';
                        _3dCode.actualTemp++;
                        _3dCode.output += 'T' + _3dCode.actualTemp + ' = ' + 'SP + 0;//Set string position\n';
                        _3dCode.output += 'STACK[(int)T' + _3dCode.actualTemp + '] = T' + elementTemp + ';//Save string\n';
                        _3dCode.output += 'StringPrint();//Call function\n';
                        _3dCode.output += 'SP = T' + savedEnvironment + ';//Recover environment\n';
                        break;
                    case type.INTEGER:
                        _3dCode.output += 'printf("%d", (int)T' + _3dCode.actualTemp + ');//Print integer\n';
                        break;
                    case type.FLOAT:
                        _3dCode.output += 'printf("%f", T' + _3dCode.actualTemp + ');//Print float\n';
                        break;
                    default:
                        console.log(elementType)
                        break;
                }
            }
        });
        switch (this.type) {
            case print_type.PRINTLN:
                _3dCode.output += 'printf("%c", 10);//Print new line\n';
                break;
        }
        return type.NULL
    }

    constructor(public expresions: [instruction], public type: print_type, line: number, column: number) {
        super(line, column);
    }

    public execute(environment: environment): data {
        this.expresions.forEach(element => {
            const expr_data = element.execute(environment);
            let print_str = expr_data.value
            // if is an array or a struct convert to string first 
            if (expr_data.value instanceof _array || expr_data.value instanceof struct_item) {
                print_str = expr_data.value.to_string(environment)
            }
            _console.output += print_str + " "
        });
        switch (this.type) {
            case print_type.PRINTLN:
                _console.output += "\n"
                break;
        }
        // Default
        return { value: null, type: type.NULL }
    }

    public plot(count: number): string {
        let result = "node" + count + "[label=\"(" + this.line + "," + this.column + ") Print (" + print_type[this.type] + ")\"];";
        const this_count = count

        const arr_list = [this.expresions]
        for (const instr_arr of arr_list) {
            for (const instr of instr_arr) {
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