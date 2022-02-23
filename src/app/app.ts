import {
    DocumentEditorContainer,
    Toolbar,
    DocumentEditor,
    FormatType,
    WordExport,
    SfdtExport
} from '@syncfusion/ej2-documenteditor';
import {TitleBar} from './title-bar';

const hostUrl: string = 'https://ej2services.syncfusion.com/production/web-services/';


let containerDE: DocumentEditorContainer = new DocumentEditorContainer({enableToolbar: true, height: '880px'});
// DocumentEditorContainer.Inject(Toolbar);
DocumentEditorContainer.Inject(WordExport, SfdtExport);
containerDE.serviceUrl = hostUrl + 'api/documenteditor/';
containerDE.appendTo('#container');

debugger

let titleBar: TitleBar = new TitleBar(document.getElementById('documenteditor_titlebar'),
    containerDE.documentEditor, true);

debugger

containerDE.documentEditor.open(`{
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
}`);
containerDE.documentEditor.documentName = 'Getting Started';
titleBar.updateDocumentTitle();

containerDE.documentChange = (): void => {
    titleBar.updateDocumentTitle();
    containerDE.documentEditor.focusIn();
};
//save file
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
        let file = e.target.files[0];
        if (file.name.substr(file.name.lastIndexOf('.')) !== '.sfdt') {
            loadFile(file);
        }
    }
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
    ajax.send(formData);
}

document.getElementById("export").addEventListener('click', (e: any) => {
    let fileName = (<HTMLInputElement>document.getElementById('exportInput')).value; //todo length check
    fileRequest(fileName);
});

function fileRequest(fileName: string): void {
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





