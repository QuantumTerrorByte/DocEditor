const msgLine = document.getElementById('msgLine');

export function msgLineSetter(msg: string, timeSeconds: number = -1, returnPreviousValue = true) {
    let temp = returnPreviousValue ? msgLine.innerText : "";
    if (timeSeconds) {
        msgLine.innerText = msg;
        setTimeout(() => {
            msgLine.innerText = temp;
        }, timeSeconds * 1000);
    }
}