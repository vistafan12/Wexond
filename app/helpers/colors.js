export default class Colors {
    /*
    * calculates foreground color based on background color
    * @param1 {String} color
    */
    static getForegroundColor(color) {
        var brightness = colorBrightness(color);
        if (brightness < 125) {
            return 'white';
        } else {
            return 'black';
        }
    }
}
