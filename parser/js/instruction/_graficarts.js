"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._graficarts = void 0;
const type_1 = require("../system/type");
const console_1 = require("../system/console");
const instruction_1 = require("../abstract/instruction");
class _graficarts extends instruction_1.instruction {
    translate(environment) {
        console_1._3dCode.symbolTables += '<div class="table-wrapper-scroll-y my-custom-scrollbar">\n';
        console_1._3dCode.symbolTables += '<table class="table table-hover">\n';
        console_1._3dCode.symbolTables += '<thead>\n<tr>\n<th scope="col">#</th>\n';
        console_1._3dCode.symbolTables += '<th scope="col">ID</th>\n';
        console_1._3dCode.symbolTables += '<th scope="col">Tipo</th>\n';
        console_1._3dCode.symbolTables += '<th scope="col">Absolute</th>\n';
        console_1._3dCode.symbolTables += '<th scope="col">Relative</th>\n';
        console_1._3dCode.symbolTables += '<th scope="col">Ambito</th>\n';
        console_1._3dCode.symbolTables += '</tr>\n';
        console_1._3dCode.symbolTables += '</thead>\n';
        console_1._3dCode.symbolTables += '<tbody>\n';
        console_1._3dCode.environmentList.forEach(envi => {
            console_1._3dCode.symbolTables += envi.get_html_translation();
        });
        console_1._3dCode.symbolTables += '</tbody>\n';
        console_1._3dCode.symbolTables += '</table>\n';
        console_1._3dCode.symbolTables += '</div>\n';
        return type_1.type.NULL;
    }
    constructor(line, column) {
        super(line, column);
    }
    execute(environment) {
        throw new Error("Method not implemented.");
    }
    plot(count) {
        throw new Error("Method not implemented.");
    }
}
exports._graficarts = _graficarts;
//# sourceMappingURL=_graficarts.js.map