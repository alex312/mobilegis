declare namespace fecha {
    function format(date:Date, fmt:string):string;

    function parse(value:string, fmt:string):Date;

    const masks:{[key:string]:string};
}

declare module "fecha" {
    export = fecha;
}