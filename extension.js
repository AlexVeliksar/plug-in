const vscode = require('vscode');
const path = require('path');

let timer;
let timeLeft;
let statusBarTimer;

function activate(context) {
    console.log('Productivity Timer is now active!');

    let startCommand = vscode.commands.registerCommand('extension.startTimer', function () {
        vscode.window.showInputBox({ prompt: 'Enter timer duration in minutes' }).then((value) => {
            let minutes = parseInt(value);
            if (isNaN(minutes)) {
                vscode.window.showErrorMessage('Invalid input. Please enter a number.');
                return;
            }
            startTimer(minutes);
        });
    });

    context.subscriptions.push(startCommand);

    statusBarTimer = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    context.subscriptions.push(statusBarTimer);
}

function startTimer(minutes) {
    if (timer) {
        clearInterval(timer);
    }

    timeLeft = minutes * 60;
    updateStatusBar();
    timer = setInterval(() => {
        timeLeft--;
        updateStatusBar();
        if (timeLeft <= 0) {
            clearInterval(timer);
            vscode.window.showInformationMessage('Time is up!', { modal: true });
            showBreakImage();
        }
    }, 1000);
}

function updateStatusBar() {
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;
    statusBarTimer.text = `$(clock) ${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
    statusBarTimer.show();
}

function showBreakImage() {
    const panel = vscode.window.createWebviewPanel(
        'breakTime',
        'Break Time',
        vscode.ViewColumn.One,
        {}
    );

    panel.webview.html = getWebviewContent(panel);
}

function getWebviewContent(panel) {
    const imagePath = vscode.Uri.file(path.join('C:', 'Work', 'ИТМО', 'ИСРПО', 'lab 3_1', 'plug-in', 'scale_1200.jpeg'));
    const imageSrc = panel.webview.asWebviewUri(imagePath);

    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Break Time</title>
        </head>
        <body>
            <img src="${imageSrc}" width="600" height="500" alt="Take a Break">
        </body>
        </html>
    `;
}

function deactivate() {
    if (timer) {
        clearInterval(timer);
    }
    if (statusBarTimer) {
        statusBarTimer.dispose();
    }
}

module.exports = {
    activate,
    deactivate
}
