export enum type {
    INTEGER = 0,
    STRING = 1,
    BOOLEAN = 2,
    FLOAT = 3,
    NULL = 4,
}

export type data = {
    value: any,
    type: type
}

/*
        INTEGER        STRING       BOOLEAN       FLOAT
*/
export const type_tbl = [
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