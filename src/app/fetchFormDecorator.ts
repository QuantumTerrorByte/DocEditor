export function fetchFormDecorator(path: string, method = "get", data: object = null) { // for files pref
    const formData = new FormData();
    if (data) {
        for (const prop in data) {
            const value = data[prop];
            if (value && (typeof value == "string" || value instanceof File)) {
                formData.append(prop, value);
            } else {
                console.log(typeof value + " is wrong agr type")
            }
        }
    }
    return fetch(path, {
        method,
        body: formData,
    });
}