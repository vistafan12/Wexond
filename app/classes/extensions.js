export default class Extensions {
    constructor() {
        this.loadedExtensions = []
        this.apis = []
    }
    /*
    * deletes extensions
    */
    deleteExtensions() {
        for (var i = 0; i < this.apis.length; i++) {
            this.apis[i].dispose()
            this.apis[i] = null
        }
        this.apis = []
        this.loadedExts = []
    }
}
