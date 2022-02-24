import {
    DocumentEditorContainer,
    Toolbar,
    DocumentEditor,
    FormatType,
    WordExport,
    SfdtExport
} from '@syncfusion/ej2-documenteditor';
import {TitleBar} from './title-bar';
import {fetchFormDecorator} from "./fetchFormDecorator";
import {msgLineSetter} from "./msgLineSetter";

const openLocalInput = document.getElementById('openLocalInput');
const openLocalButton = document.getElementById('openLocalButton');
openLocalButton.addEventListener('click', (e) => {
    openLocalInput.click()
}); //todo double request?

const uploadCurrentInput = document.getElementById('uploadCurrentInput');
const uploadCurrentButton = document.getElementById('uploadCurrentButton');
uploadCurrentButton.addEventListener('click', (e) => {
    uploadCurrentInput.click()
});

const downloadOpenInput = document.getElementById('downloadOpenInput');
const downloadOpenButton = document.getElementById('downloadOpenButton');
downloadOpenButton.addEventListener('click', (e) => {
    downloadOpenInput.click()
});

const hostUrl: string = 'https://ej2services.syncfusion.com/production/web-services/';
const webServiceUrl = 'https://localhost:4000';

const containerDE: DocumentEditorContainer = new DocumentEditorContainer({enableToolbar: true, height: '880px'});
const docEditor: DocumentEditor = containerDE.documentEditor;
DocumentEditorContainer.Inject(Toolbar);


containerDE.serviceUrl = hostUrl + 'api/documenteditor/';
containerDE.appendTo('#container');
docEditor.open(`{
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
docEditor.documentName = 'Getting Started';
// DocumentEditor.Inject(WordExport, SfdtExport);

const titleBar: TitleBar = new TitleBar(document.getElementById('documenteditor_titlebar'),
    docEditor, true);
titleBar.updateDocumentTitle();

containerDE.documentChange = (): void => {
    titleBar.updateDocumentTitle();
    docEditor.focusIn();
};
//import local -> server -> editor
// DownloadFile
// UploadFile
openLocalInput.addEventListener('click', (e) => {
    const fileName = (<HTMLInputElement>e.target).value; //todo is really need?
    const file = (<HTMLInputElement>e.target).files[0];

    if (file) {
        docEditor.saveAsBlob('Docx').then(blobFile => {
            fetchFormDecorator(webServiceUrl + "/ConvertFile", 'get', {
                file: file,
                fileName: fileName,
            }).then((response) => {
                if (response.ok) {
                    response.json().then((response) => docEditor.open(response));
                } else {
                    response.json().then((error) => msgLineSetter(error)); //then(msgLineSetter)
                }
            })
        });
    }
});
//export server -> editor
uploadCurrentInput.addEventListener('click', (e) => {
    const fileName = (<HTMLInputElement>e.target).value; //todo is really need?
    const file = (<HTMLInputElement>e.target).files[0];

    if (file) {
        docEditor.saveAsBlob('Docx').then(blobFile => {
            fetchFormDecorator(webServiceUrl + "/ConvertFile", 'get', {
                file: file,
                fileName: fileName,
            }).then((response) => {
                if (response.ok) {
                    response.json().then((response) => docEditor.open(response));
                } else {
                    response.json().then((error) => msgLineSetter(error)); //then(msgLineSetter)
                }
            })
        });
    }
});
//upload editor -> server
downloadOpenInput.addEventListener('click', (e) => {
    let fileName = (<HTMLInputElement>document.getElementById("fileName")).value;
    docEditor.saveAsBlob('Docx').then(blobFile => {
        let ajax: XMLHttpRequest = new XMLHttpRequest();
        ajax.open('POST', 'https://localhost:4000/SaveFile', true);
        ajax.onreadystatechange = () => {
            if (ajax.readyState === 4) {
                if (ajax.status === 200 || ajax.status === 304) {
                    docEditor.open(ajax.responseText);
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



