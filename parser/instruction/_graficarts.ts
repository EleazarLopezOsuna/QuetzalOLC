import { environment } from "../system/environment";
import { data, type } from "../system/type";
import { _console, _3dCode } from "../system/console";
import { instruction } from "../abstract/instruction";
import { _return } from "./_return";

export class _graficarts extends instruction {

    public translate(environment: environment): type {
        _3dCode.symbolTables += '<div class="table-wrapper-scroll-y my-custom-scrollbar">\n';
        _3dCode.symbolTables += '<table class="table table-hover">\n';
        _3dCode.symbolTables += '<thead>\n<tr>\n<th scope="col">#</th>\n'
        _3dCode.symbolTables += '<th scope="col">ID</th>\n';
        _3dCode.symbolTables += '<th scope="col">Tipo</th>\n';
        _3dCode.symbolTables += '<th scope="col">Absolute</th>\n';
        _3dCode.symbolTables += '<th scope="col">Relative</th>\n';
        _3dCode.symbolTables += '<th scope="col">Ambito</th>\n';
        _3dCode.symbolTables += '</tr>\n';
        _3dCode.symbolTables += '</thead>\n';
        _3dCode.symbolTables += '<tbody>\n';
        _3dCode.environmentList.forEach(envi => {
            _3dCode.symbolTables += envi.get_html_translation();
        });
        _3dCode.symbolTables += '</tbody>\n';
        _3dCode.symbolTables += '</table>\n';
        _3dCode.symbolTables += '</div>\n';
        return type.NULL;
    }

    constructor(line: number, column: number) {
        super(line, column);
    }

    public execute(environment: environment): data {
        throw new Error("Method not implemented.");
    }
    public plot(count: number): string {
        throw new Error("Method not implemented.");
    }
}