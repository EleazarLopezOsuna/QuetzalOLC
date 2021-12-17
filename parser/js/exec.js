"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const parser = require("./grammar/main_grammar");
const environment_1 = require("./system/environment");
const console_1 = require("./system/console");
const error_1 = require("./system/error");
window.exec = function (input) {
    console_1._console.clean();
    try {
        const ast = parser.parse(input);
        const main_environment = new environment_1.environment(null);
        console.log("ast", ast);
        for (const instr of ast) {
            try {
                instr.execute(main_environment);
            }
            catch (error) {
                console.log(error);
            }
        }
        window.symbol_table = main_environment.get_html();
    }
    catch (error) {
        console.log(error);
    }
    if (error_1.error_arr.length > 0) {
        // generate error table
        window.error_table = generate_error_table();
        return "$error$";
    }
    return console_1._console.output;
};
function generate_error_table() {
    //console.log(errores);
    let result = '<table class="table">\n';
    result += '<thead>\n<tr>\n<th scope="col">#</th>\n';
    result += '<th scope="col">Tipo</th>\n';
    result += '<th scope="col">Descripcion</th>\n';
    result += '<th scope="col">Linea</th>\n';
    result += '<th scope="col">Columna</th>\n';
    result += '</tr>\n';
    result += '</thead>\n';
    result += '<tbody>\n';
    let count = 1;
    error_1.error_arr.forEach(element => {
        result += '<tr>\n';
        result += '<th scope="row">' + count + '</th>\n';
        result += element.html();
        result += '</tr>\n';
        count++;
    });
    result += '</tbody>\n';
    return result += '</table>\n';
}
//# sourceMappingURL=exec.js.map