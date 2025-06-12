
export function validateFields(obj: any, fields: string[]): string | null {
    for (const field of fields) {
        if (!obj[field]) return field;
    }
    return null;
}