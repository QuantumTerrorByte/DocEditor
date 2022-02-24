import {DocumentEditor, DocumentEditorContainer, Toolbar} from '@syncfusion/ej2-documenteditor';
import {TitleBar} from './title-bar';
// import * as data from '../data-default.json';
import {fetchFormDecorator} from "./fetchFormDecorator";
import {msgLineSetter} from "./msgLineSetter";


const openLocalInput = document.getElementById('openLocalInput');
// openLocalInput.style.display = "none";

const uploadCurrentInput = document.getElementById('uploadCurrentInput');
const uploadCurrentButton = document.getElementById('uploadCurrentButton');


const downloadOpenInput = document.getElementById('downloadOpenInput');
const downloadOpenButton = document.getElementById('downloadOpenButton');

const hostUrl: string = 'https://ej2services.syncfusion.com/production/web-services/';
const webServiceUrl = 'https://localhost:4000';

const containerDE: DocumentEditorContainer = new DocumentEditorContainer({enableToolbar: true, height: '880px'});
DocumentEditorContainer.Inject(Toolbar);
debugger

containerDE.serviceUrl = hostUrl + 'api/documenteditor/';
containerDE.appendTo('#container');
const docEditor: DocumentEditor = containerDE.documentEditor;
try {
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
} catch (e) {
    console.log(e);
    console.log(containerDE);
}
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
openLocalInput.addEventListener("change", (e) => {
    debugger
    const fileName = (<HTMLInputElement>openLocalInput).value; //todo is really need?
    const file = (<HTMLInputElement>openLocalInput).files[0];

    if (file) {
        fetchFormDecorator(webServiceUrl + "/ConvertFile", 'POST', {
            file: file,
            fileName: fileName,
        }).then((response) => {
            if (response.ok) {
                response.json().then((response) => docEditor.open(response));
            } else {
                response.json().then((error) => msgLineSetter(error)); //then(msgLineSetter)
            }
        })
    }
});
//export server -> editor
downloadOpenButton.addEventListener("change", (e) => {
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
downloadOpenButton.addEventListener("change", (e) => {
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



