import { instruction } from "../abstract/instruction";
import { environment } from "../system/environment";
import { error, error_arr, error_type } from "../system/error";
import { data, type } from "../system/type";
import { _console, _3dCode } from "../system/console";
import { _array } from "../literal/_array";
import { struct_item } from "../literal/struct_item";

export enum print_type {
    PRINT,
    PRINTLN,
}

export class print extends instruction {

    public translate(environment: environment): type {
        this.expresions.forEach(element => {
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
                    break;
            }
            switch (this.type) {
                case print_type.PRINTLN:
                    _3dCode.output += 'printf("%c", 10);//Print new line\n';
                    break;
            }
        });
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
            switch (this.type) {
                case print_type.PRINT:
                    _console.output += print_str
                    break;
                case print_type.PRINTLN:
                    _console.output += print_str + "\n"
                    break;
            }
        });

        // Default
        return { value: null, type: type.NULL }
    }

    public plot(count: number): string {
        throw new Error("Method not implemented.");
    }
}