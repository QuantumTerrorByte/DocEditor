export function fileRequest(fileName: string): void {
    let ajax: XMLHttpRequest = new XMLHttpRequest();
    ajax.open('POST', 'https://localhost:4000/GetFile', true);
    ajax.onreadystatechange = () => {
        if (ajax.readyState === 4) {
            if (ajax.status === 200 || ajax.status === 304) {
                containerDE.documentEditor.open(ajax.responseText);
            }
        }
    }
    let formData: FormData = new FormData();
    formData.append('fileName', fileName);
    //Send the selected file to web api for converting it into sfdt.
    ajax.send(formData);
}