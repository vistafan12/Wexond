export default class Extensions {
    constructor() {
        this.loadedExts = []
        this.apis = []
    }
    /*
    * deletes extensions
    */
    deleteExtensions() {
        for (var i = 0; i < this.loadedExts.length; i++) {
            $(this.loadedExts[i]).remove()
        }
        for (var i = 0; i < this.apis.length; i++) {
            this.apis[i].dispose()
            this.apis[i] = null
        }
        this.apis = []
        this.loadedExts = []
    }
    /*
    * loads extensions
    * id - int
    * callback - function (default: null)
    */
    loadExtensions(id, callback = null) {
        var t = this
        //get all .JSON files in folder to an array
        var listOfExtensions = [];
        var listOfExtensionsDirs = [];
        dir.subdirs(extensionsPath, function(err, subdirs) {
            if (err)
                throw err;
            for (var i = 0; i < subdirs.length; i++) {
                dir.files(subdirs[i], function(err, files) {
                    if (err)
                        throw err;
                    for (var i2 = 0; i2 < files.length; i2++) {
                        if (endsWith(files[i2], ".json")) {
                            listOfExtensions.push(files[i2]);
                            //read json from all files
                            $.ajax({
                                type: "GET",
                                url: files[i2],
                                success: function(data) {
                                    var jsonObject = JSON.parse(data);
                                    //Deserialize JSON string
                                    var jsonData = {
                                        name: jsonObject.name,
                                        folder: jsonObject.folder,
                                        version: jsonObject.version,
                                        desc: jsonObject.description,
                                        icon: jsonObject.icon,
                                        popupPage: jsonObject.popuppage,
                                        settingsPage: jsonObject.settingspage,
                                        scripts: jsonObject.scripts
                                    }

                                    for (var i3 = 0; i3 < jsonData.scripts.length; i3++) {
                                        var fileUrl = extensionsPath + "/" + jsonData.folder + "/" + jsonData.scripts[i3]["url"]
                                        $.ajax({
                                            type: "GET",
                                            url: fileUrl,
                                            success: function(data) {
                                                if (typeof(callback) === 'function') {
                                                    jsonData.code = data
                                                    callback(jsonData)
                                                }
                                                $('#extensions-iframe').ready(function() {
                                                    $('#extensions-iframe')[0].contentWindow.parent = window
                                                    var script = document.createElement('script');
                                                    script.text = `function a${id}(index) {
                                                            var api = new API(parent.tabs[index], parent)
                                                            parent.tabs[index].page.getExtensions().apis.push(api)
                                                            parent = null
                                                            ${data}
                                                        } a${id}(${id});`
                                                    $('#extensions-iframe').contents().find('head')[0].appendChild(script)
                                                    t.loadedExts.push(script)
                                                })

                                            }
                                        })

                                    }
                                }
                            })

                        }
                    }
                })
            }
        })

    }
}
