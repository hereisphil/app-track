export function assertDefined<T>(val: T): asserts val is NonNullable<T> {
    if (val === null || val === undefined) {
        throw new Error("Value is undefined or null" + val);
    }
}
