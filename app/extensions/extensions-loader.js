export default class ExtensionsLoader {
    constructor(tab) {
        this.extensions = [];
        this.tab = tab;
    }
    /*
    * deletes extensions
    */
    deleteExtensions() {
        for (var i = 0; i < this.extensions.length; i++) {
            this.extensions[i].dispose();
        }
    }
    /*
    * loads extensions
    * @param1 {Function} callback
    */
    loadExtensions(callback = null) {
        var t = this;
        //get all sub directories in directory
        dir.subdirs(extensionsPath, function(error1, subdirs) {
            if (error1) {
                console.error(error1);
            }

            for (var x = 0; x < subdirs.length; x++) {
                var directory = subdirs[x];
                //get all files in all sub directories in directory
                dir.files(subdirs[x], function(error2, files) {
                    if (error2) {
                        console.error(error2);
                    }

                    for (var y = 0; y < files.length; y++) {
                        if (files[y].replace(/^.*[\\\/]/, '') === 'manifest.json') {
                            listOfExtensions.push(files[y]);
                            //read json from all files
                            requestUrl(files[y], function(data) {
                                //Deserialize JSON string
                                //required JSON keys: name, version, description, icon, popup, settings, extension
                                var jsonObject = JSON.parse(data);

                                var extensionUrl = directory + "\\" + jsonObject.extension;
                                //read extension html
                                requestUrl(extensionUrl, function(data) {
                                    //add webview to execute extension
                                    var webview = document.createElement('webview');
                                    webview.preload = "../webview-preload/extension.js";
                                    webview.src = extensionUrl;
                                    document.body.appendChild(webview);

                                    //create ipc extension api for webview
                                    var api = new ExtensionIPC(t.tab, webview);
                                    t.extensions.push(api);
                                    //execute callback
                                    if (callback != null) {
                                        //clone the jsonObject to modify
                                        var result = jsonObject;
                                        result.directory = directory;
                                        result.api = api;
                                        result.icon = directory.replace(/\\/g,"/") + "/" + jsonObject.icon;
                                        result.popup = 'file://' + directory.replace(/\\/g,"/") + "/" + jsonData.popup;
                                        //save content of extension html file
                                        result.code = data;

                                        callback(result);
                                    }
                                });
                            });
                        }
                    }
                });
            }
        });
    }
    /*
    * adds extension to menu
    * @param1 {Object} extension
    * @param2 {MDMenu} menu
    */
    addExtensionToMenu(extension, menu) {
        var newState = menu.state;
        newState.extensionsToCreate.push(extension);
        menu.setState(newState);
    }
}
