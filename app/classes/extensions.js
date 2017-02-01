export default class Extensions {
    constructor() {
        this.loadedExts = [];
        this.apis = [];
    }
    /*
    * deletes extensions
    */
    deleteExtensions() {
        for (var i = 0; i < this.loadedExts.length; i++) {

            this.loadedExts[i].parentNode.removeChild(this.loadedExts[i]);
        }
        for (var i = 0; i < this.apis.length; i++) {
            this.apis[i].dispose();
            this.apis[i] = null;
        }
        this.apis = [];
        this.loadedExts = [];
    }
    /*
    * loads extensions
    * id - int
    * callback - function (default: null)
    */
    loadExtensions(id, callback = null) {
        var t = this;
        //get all .JSON files in folder to an array
        var listOfExtensions = [];
        var listOfExtensionsDirs = [];

        dir.subdirs(extensionsPath, function(err, subdirs) {

            if (err)
                throw err;

            for (var i = 0; i < subdirs.length; i++) {
                var directory = subdirs[i];
                dir.files(subdirs[i], function(err, files) {
                    if (err)
                        throw err;
                    for (var i2 = 0; i2 < files.length; i2++) {
                        if (files[i2].replace(/^.*[\\\/]/, '') == "manifest.json") {
                            listOfExtensions.push(files[i2]);
                            //read json from all files
                            requestUrl(files[i2], function(data) {
                                var jsonObject = JSON.parse(data);
                                //Deserialize JSON string
                                var jsonData = {
                                    name: jsonObject.name,
                                    version: jsonObject.version,
                                    description: jsonObject.description,
                                    icon: jsonObject.icon,
                                    popupPage: jsonObject.popuppage,
                                    settingsPage: jsonObject.settingspage,
                                    scripts: jsonObject.scripts
                                };

                                for (var i3 = 0; i3 < jsonData.scripts.length; i3++) {
                                    var fileUrl = directory + "\\" + jsonData.scripts[i3]["url"];
                                    requestUrl(fileUrl, function(data) {
                                        if (typeof(callback) === 'function') {
                                            jsonData.code = data;
                                            callback(jsonData);
                                        }
                                        var iframe = document.getElementById('extensions-iframe'),
                                            script = document.createElement('script'),
                                            innerDoc = (iframe.contentDocument) ? iframe.contentDocument : iframe.contentWindow.document;

                                        iframe.contentWindow.parent = window;

                                        script.text = `function a${id}(index) {
                                                var api = new API(parent.tabs[index], parent)
                                                parent.tabs[index].getPage().getExtensions().apis.push(api)
                                                parent = null
                                                ${data}
                                            } a${id}(${id});`;
                                        innerDoc.getElementsByTagName('head')[0].appendChild(script);
                                        t.loadedExts.push(script);

                                    });
                                }
                            });
                        }
                    }
                });
            }
        });

    }
}
