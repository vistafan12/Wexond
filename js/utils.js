function isURL(s) {
    var regexp = /[a-zA-Z-0-9]+\.[a-zA-Z-0-9]{2,3}/;
    return regexp.test(s);
}
function getSelectionText() {
    var text = "";
    if (window.getSelection) {
        text = window.getSelection().toString();
    } else if (document.selection && document.selection.type != "Control") {
        text = document.selection.createRange().text;
    }
    return text;
}
function autocomplete(input, text) {
    var text1 = input.val();
    if (text != null || text != "") {
        if (text.toLowerCase().startsWith(text1.toLowerCase())) {
            input.val(text);
            input[0].setSelectionRange(text1.length, text.length);
        }
    }
}

function isInArray(value, array) {
    return array.indexOf(value) > -1;
}
