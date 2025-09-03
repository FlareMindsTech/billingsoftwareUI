// const { app, BrowserWindow } = require('electron');

// function createWindow() {
//   const win = new BrowserWindow({
//     width: 1280,
//     height: 800,
//     webPreferences: {
//       contextIsolation: true,
//     },
//   });

//   // Load your Render live frontend
//   win.loadURL('https://billingsoftwareui.onrender.com/');
// }

// app.whenReady().then(createWindow);

// app.on('window-all-closed', () => {
//   if (process.platform !== 'darwin') app.quit();
// });
const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    },
  });

  // ✅ Try to load your Render live frontend
  const onlineURL = 'https://billingsoftware-ui.onrender.com/';

  win.loadURL(onlineURL).catch(() => {
    // ❌ If internet/Render is down, load local React build
    win.loadFile(path.join(__dirname, 'build', 'index.html'));
  });

  // Optional: Uncomment to open DevTools for debugging
  // win.webContents.openDevTools();
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
