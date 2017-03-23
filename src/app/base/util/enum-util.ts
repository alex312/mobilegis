export class EnumUtil {
    static GetEnumString(enumType: any, enumValue) {
        let key: any = enumValue;
        if (typeof (enumValue) === "number")
            key = enumType[enumValue];
        else if (typeof (enumValue) === "string")
            key = enumValue;
        else
            key = undefined;
        return key;
    }
}