// src/main.ts
import { app, BrowserWindow } from 'electron';
import * as path from 'path';

function createWindow(): void {
    const mainWindow = new BrowserWindow({
        width: 1250,
        height: 1600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    });

    // Now index.html is in the same folder as the compiled main.js.
    mainWindow.loadFile(path.join(__dirname, 'index.html'));
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
