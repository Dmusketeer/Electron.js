const electron = require('electron')
const path = require('path')
const url =require('url')

const {app,BrowserWindow,Menu,ipcMain} = electron;
let mainWindow;
let addWindow;

// listen for app to be ready
app.on('ready',()=>{
    // load html into window
    mainWindow = new BrowserWindow({});
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, "index.html"),
        protocol: "file:",
        slashes: true
    }));//file://dirname/index.html
    // Quit app when closed main window
    mainWindow.on('closed',()=>{
        app.quit();
    })
    // build menu from template 
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    // insert menu
    Menu.setApplicationMenu(mainMenu);
});

// handle create add window

function createAddWindow(){

    // create new window
    addWindow = new BrowserWindow({
        width: 400,
        height: 300,
        title: 'Add Shopping list Items'
    });
    // load html into window
    addWindow.loadURL(url.format({
        pathname: path.join(__dirname, "addWindow.html"),
        protocol: "file:",
        slashes: true
    }));//file://dirname/addWindow.html
    // garbage collections handle
    addWindow.on('close',()=>{
        addWindow=null;
    })
}

// catch item:add
ipcMain.on('item:add',(e,item)=>{
    // console.log(item);
    mainWindow.webContents.send('item:add',item);
    addWindow.close();
});


// create menu template
const mainMenuTemplate = [
    {
        label:'File',
        submenu:[{
            label:"Add Item",
            click(){
                createAddWindow();
            }
        },{
        label : "Clear Item"},
        {
            label:'Quit',
            accelerator:process.platform=='darwin'?'Command+Q':'Ctrl+Q',
            click(){
                app.quit();
            }
        }
    ]
    }
];

// if mac ,add empty object to new
if(process.platform=='darwin'){
    mainMenuTemplate.unshift({});
}

//  Add developer tools items if not in production.

if(process.env.NODE_ENV='production'){
    mainMenuTemplate.push({
        label: 'Developer Tools',
    submenu:[{
        label:'Toggle DevTools',
        accelerator:process.platform=='darwin'?'Command+I':'Ctrl+I',
        click(item,focusWindow){

            focusWindow.toggleDevTools();
        }
    },{
        role:"reload"
    }]
    });

}