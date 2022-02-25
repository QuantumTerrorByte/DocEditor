import {DocumentEditor, DocumentEditorContainer, Toolbar, SpellChecker } from '@syncfusion/ej2-documenteditor';
import {TitleBar} from './title-bar';
// import * as data from '../data-default.json';
import {fetchFormDecorator} from "./fetchFormDecorator";
import {msgLineSetter} from "./msgLineSetter";

const openLocalInput = document.getElementById('openLocalInput');

const uploadCurrentInput = document.getElementById('uploadCurrentInput');
const uploadCurrentButton = document.getElementById('uploadCurrentButton');

const downloadByNameInput = document.getElementById('downloadByNameInput');
const downloadByNameButton = document.getElementById('downloadByNameButton');

const hostUrl: string = 'https://ej2services.syncfusion.com/production/web-services/';
const webServiceUrl = 'https://localhost:4000/';

const containerDE: DocumentEditorContainer = new DocumentEditorContainer({
    enableToolbar: true,
    enableSpellCheck: true,
    height: '880px'
});
DocumentEditorContainer.Inject(Toolbar);
containerDE.serviceUrl = webServiceUrl; // hostUrl + 'api/documenteditor/';
containerDE.appendTo('#container');

const docEditor: DocumentEditor = containerDE.documentEditor;
docEditor.documentName = 'Getting Started';

let spellChecker: SpellChecker = docEditor.spellChecker;
//Set language id to map dictionary in server side.;
spellChecker.languageID = 1000;
//Allow suggetion for miss spelled word/
spellChecker.allowSpellCheckAndSuggestion = false;
spellChecker.enableOptimizedSpellCheck = true;




const titleBar: TitleBar = new TitleBar(document.getElementById('documenteditor_titlebar'),
    docEditor, true);
titleBar.updateDocumentTitle();

containerDE.documentChange = (): void => {
    titleBar.updateDocumentTitle();
    docEditor.focusIn();
};

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

document.getElementById("documenteditor_title_contentEditor").before(document.getElementById("importContainer"));

// import local -> server -> editor
openLocalInput.addEventListener("change", (e) => {
    const fileName = (<HTMLInputElement>openLocalInput).value; //todo is really need?
    const file = (<HTMLInputElement>openLocalInput).files[0];

    if (file) {
        fetchFormDecorator(webServiceUrl + "ConvertFile", 'POST', {
            file: file,
            fileName: fileName,
        }).then((response) => {
                if (response.ok) {
                    response.text().then((response) => {
                        docEditor.open(response)
                    });
                } else {
                    response.text().then((error) => {
                        msgLineSetter(error);
                        return error;
                    });
                }
            }
        ).catch((e) => {
            console.log(e);
        });
    }
});

//upload editor -> server   DownloadFile
uploadCurrentButton.addEventListener("click", (e) => {
    const fileName = (<HTMLInputElement>uploadCurrentInput).value; //todo save options

    docEditor.saveAsBlob('Docx').then(blobFile => {
        fetchFormDecorator(webServiceUrl + "SaveFile", 'POST', {
            file: new File([blobFile], fileName),
            fileName: fileName,
        }).then((response) => {
            if (response.ok) {
                response.text().then((response) => {
                    msgLineSetter(response);
                });
            } else {
                response.text().then((error) => {
                    console.log(error);
                    msgLineSetter(error);
                });
            }
        }).catch((e) => console.log(e));
    });
});

//export server -> editor
downloadByNameButton.addEventListener("click", (e) => {
    const fileName = (<HTMLInputElement>downloadByNameInput).value;

    fetchFormDecorator(webServiceUrl + "DownloadFile", 'get', {
        fileName: fileName
    }).then((response) => {
        if (response.ok) {
            response.text().then((response) => {
                console.log(response);
                docEditor.open(response);
            });
        } else {
            response.text().then((error) => {
                console.log(error);
                msgLineSetter(error);
            });
        }
    }).catch(e => console.log(e));
});



