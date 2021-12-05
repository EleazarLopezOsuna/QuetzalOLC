"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.type_tbl = exports.type = void 0;
var type;
(function (type) {
    type[type["INTEGER"] = 0] = "INTEGER";
    type[type["STRING"] = 1] = "STRING";
    type[type["BOOLEAN"] = 2] = "BOOLEAN";
    type[type["FLOAT"] = 3] = "FLOAT";
    type[type["NULL"] = 4] = "NULL";
})(type = exports.type || (exports.type = {}));
/*
        INTEGER        STRING       BOOLEAN       FLOAT
*/
exports.type_tbl = [
    [
        type.INTEGER, type.STRING, type.INTEGER, type.NULL
    ],
    [
        type.STRING, type.STRING, type.STRING, type.STRING
    ],
    [
        type.INTEGER, type.STRING, type.BOOLEAN, type.NULL
    ],
    [
        type.FLOAT, type.STRING, type.NULL, type.NULL
    ],
    [
        type.NULL, type.STRING, type.NULL, type.NULL
    ]
];
