export enum type {
    INTEGER = 0,
    STRING = 1,
    BOOLEAN = 2,
    FLOAT = 3,
    CHAR = 4,
    NULL = 5,
}

export type data = {
    value: any,
    type: type
}

/*
        INTEGER        STRING       BOOLEAN       FLOAT     CHAR
*/
export const type_tbl = [
    [
        type.INTEGER, type.STRING, type.NULL, type.FLOAT, type.INTEGER
    ],
    [
        type.STRING, type.STRING, type.STRING, type.STRING, type.STRING
    ],
    [
        type.NULL, type.STRING, type.NULL, type.NULL, type.NULL
    ],
    [
        type.FLOAT, type.STRING, type.NULL, type.FLOAT, type.FLOAT
    ],
    [
        type.INTEGER, type.STRING, type.NULL, type.FLOAT, type.INTEGER
    ]
];