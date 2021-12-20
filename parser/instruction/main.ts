import { environment } from "../system/environment";
import { data, type } from "../system/type";
import { _console, _3dCode } from "../system/console";
import { instruction } from "../abstract/instruction";

export class main extends instruction {

    public translate(current_environment: environment): type {
        _3dCode.output = 'void main(){\n' + 'SP = ' + _3dCode.absolutePos + ';\n' + 'mainStart = ' + _3dCode.absolutePos + ';\n' + _3dCode.output;
        let main_environment = new environment(current_environment);
        this.code.forEach(element => {
            element.translate(main_environment)
        });
        _3dCode.output += 'return;\n';
        _3dCode.output += '}\n';
        return type.NULL;
    }

    constructor(public code: Array<instruction>, line: number, column: number) {
        super(line, column);
    }

    public execute(environment: environment): data {
        this.code.forEach(element => {
            element.execute(environment)
        });
        return { value: null, type: type.NULL }
    }

    public plot(count: number): string {

        let result = "node" + count + "[label=\"(" + this.line + "," + this.column + ") Main\"];";
        const this_count = count

        for (const instr of this.code) {
            try {
                result += "node" + this_count + " -> " + "node" + count + "1;";
                result += instr.plot(Number(count + "1"))
                count++
            } catch (error) {
                console.log(error);
            }
        }

        return result;
    }
}