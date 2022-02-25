const msgLine = document.getElementById('msgLine');

export function msgLineSetter(msg: string, timeSeconds: number = 0, returnPreviousValue = true) {
    let temp = returnPreviousValue ? msgLine.innerText : null;
    if (timeSeconds) {
        msgLine.innerText = msg;
        msgLine.style.padding = "15px";

        setTimeout(() => {
            if (!temp) {
                msgLine.style.padding = "0";
            }
            msgLine.innerText = temp;
        }, timeSeconds * 1000);

    } else {
        msgLine.innerText = msg;
        msgLine.style.padding = "15px";
    }
}