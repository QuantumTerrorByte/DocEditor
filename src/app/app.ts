import { DocumentEditor } from '@syncfusion/ej2-documenteditor';

// Initialize Document Editor component.
let documenteditor: DocumentEditor = new DocumentEditor({ isReadOnly: false, height: '370px', serviceUrl: 'https://ej2services.syncfusion.com/production/web-services/api/documenteditor/' });

// Enable all built in modules.
documenteditor.enableAllModules();

// Render the Document Editor component.
documenteditor.appendTo('#DocumentEditor');
let sfdt: string = `{
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

documenteditor.open(sfdt);