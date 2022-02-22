import {DocumentEditorContainer, Toolbar} from '@syncfusion/ej2-documenteditor';
import {TitleBar} from './title-bar';
import {ej} from "@syncfusion/ej2/dist/ej2";
import {fileRequest} from "./fileRequest";

/**
 * Default document editor sample
 */
let testSaveBtn = document.getElementById("testSave");
let data: string = `{
    "sections": [
        {
            "blocks": [
                {
                    "inlines": [
                        {
                            "characterFormat": {
                                "bold": true,
                                "italic": true
                            },
                            "text": "Hello World"
                        }
                    ]
                }
            ],
            "headersFooters": {
            }
        }
    ]
}`;
let hostUrl: string = 'https://ej2services.syncfusion.com/production/web-services/';


let containerDE: DocumentEditorContainer = new DocumentEditorContainer({enableToolbar: true, height: '590px'});
DocumentEditorContainer.Inject(Toolbar);
containerDE.serviceUrl = hostUrl + 'api/documenteditor/';
containerDE.appendTo('#container');

debugger

let titleBar: TitleBar = new TitleBar(document.getElementById('documenteditor_titlebar'),
    containerDE.documentEditor, true);

debugger

containerDE.documentEditor.open(data);
containerDE.documentEditor.documentName = 'Getting Started';
titleBar.updateDocumentTitle();

containerDE.documentChange = (): void => {
    titleBar.updateDocumentTitle();
    containerDE.documentEditor.focusIn();
};
testSaveBtn.addEventListener('click', (e) => {
    let fileName = (<HTMLInputElement>document.getElementById("fileName")).value;
    containerDE.documentEditor.saveAsBlob('Docx').then(blobFile => {
        let ajax: XMLHttpRequest = new XMLHttpRequest();
        ajax.open('POST', 'https://localhost:4000/SaveFile', true);
        ajax.onreadystatechange = () => {
            if (ajax.readyState === 4) {
                if (ajax.status === 200 || ajax.status === 304) {
                    containerDE.documentEditor.open(ajax.responseText);
                }
            }
        }
        let formData: FormData = new FormData();
        formData.append('files', blobFile);
        formData.append('name', fileName);
        //Send the selected file to web api for converting it into sfdt.
        ajax.send(formData);
    });
});

//====================================================================================

document.getElementById("import").addEventListener("click", (): void => {
    document.getElementById('file_upload').click();
});
document.getElementById('file_upload').addEventListener("change", (e: any): void => {
    if (e.target.files[0]) {
        //Get the selected file.
        let file = e.target.files[0];
        if (file.name.substr(file.name.lastIndexOf('.')) !== '.sfdt') {
            loadFile(file);
        }
    }
});

document.getElementById("export").addEventListener('click', (e: any) => {
    let fileName = (<HTMLInputElement>document.getElementById('exportInput')).value; //todo length check
    fileRequest(fileName);
});

function loadFile(file: File): void {
    let ajax: XMLHttpRequest = new XMLHttpRequest();
    ajax.open('POST', 'https://localhost:4000/Import', true);
    ajax.onreadystatechange = () => {
        if (ajax.readyState === 4) {
            if (ajax.status === 200 || ajax.status === 304) {
                containerDE.documentEditor.open(ajax.responseText);
            }
        }
    }
    let formData: FormData = new FormData();
    formData.append('files', file);
    //Send the selected file to web api for converting it into sfdt.
    ajax.send(formData);
}


