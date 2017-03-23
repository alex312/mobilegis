interface Buffer {
}

declare namespace Long {
}

declare namespace ByteBuffer {
    function calculateUTF8Bytes(str:string):number;

    function calculateUTF8Chars(str:string):number;
}
