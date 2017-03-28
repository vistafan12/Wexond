//TODO: add removeHistory and getHistoryIndex methods
export default class Storage {
  /*
    * adds history item
    * @param1 {String} title
    * @param2 {String} url
    * @param3 {function} callback
    */
  static addHistoryItem(title, url, callback = null) {
    var fs = require('fs');
    if (title != null && url != null) {
      var array;
      //get today's date
      var today = new Date();
      var dd = today.getDate();
      var mm = today.getMonth() + 1;
      var yyyy = today.getFullYear();

      if (dd < 10) {
        dd = '0' + dd;
      }

      if (mm < 10) {
        mm = '0' + mm;
      }

      today = mm + '-' + dd + '-' + yyyy;

      //read history.json file and append new history items
      fs.readFile(historyPath, function (error1, data) {
        if (error1) {
          console.error(error1);
        }
        //replace weird characters in utf-8
        data = data.replace('\ufeff', '');
        var jsonObject = JSON.parse(data);
        if (!url.startsWith("wexond://") && !url.startsWith("about:blank")) {
          //get current time
          var date = new Date();
          var current_hour = date.getHours();
          var current_minute = date.getMinutes();
          var time = `${current_hour}:${current_minute}`;

          //configure newItem's data
          var newItem = {
            "link": url,
            "title": title,
            "date": today,
            "time": time
          };

          //get newItem's new id
          if (jsonObject['history'][jsonObject['history'].length - 1] == null) {
            newItem.id = 0;
          } else {
            newItem.id = jsonObject['history'][jsonObject['history'].length - 1].id + 1;
          }

          //push new history item
          jsonObject['history'].push(newItem);

          //save the changes
          Storage.saveHistory(JSON.stringify(jsonObject), callback);
        }
      });
    }
  }
  /*
    * saves history
    * @param1 {String} json
    * @param2 {function} callback
    */
  static saveHistory(json, callback = null) {
    var fs = require('fs');

    fs.writeFile(historyPath, json, function (error) {
      if (error) {
        Storage.resetHistory();
        console.error(error);
      } else {
        if (callback != null) {
          //execute callback
          callback();
        }
      }
    });
  }
  /*
    * resets history
    * @param1 {function} callback
    */
  static resetHistory(callback = null) {
    Storage.saveHistory('"history": []', callback);
  }
  /*
    * saves bookmarks data
    * @param1 {String} content
    * @param2 {function} callback
    */
  static saveBookmarks(json, callback = null) {
    var fs = require('fs');

    fs.writeFile(bookmarksPath, json, function (error) {
      if (error) {
        Storage.resetBookmarks();
        console.error(error);
      } else {
        if (callback != null) {
          //execute callback
          callback();
        }
      }
    });
  }
  /*
    * gets JSON object bookmarks data
    * @param1 {function(json)} callback
    */
  static getBookmarks(callback = null) {
    var fs = require('fs');
    fs.readFile(bookmarksPath, function (error, data) {
      if (error || data.length < 16) {
        Storage.resetBookmarks();
        console.error(error);
      } else {
        //replace weird characters in utf-8
        data = data.replace('\ufeff', '');
        if (callback != null) {
          //execute callback
          callback(JSON.parse(data));
        }
      }
    });
  }
  /*
    * resets bookmarks
    * @param1 {function} callback
    */
  static resetBookmarks(callback = null) {
    Storage.saveBookmarks('"bookmarks": []', callback);
  }
  /*
    * adds bookmark item
    * @param1 {Object} data
    * @param2 {function} callback
    */
  static addBookmark(data, callback = null) {
    Storage.getBookmarks(function (json) {
      //TODO: cache the favicon
      json.bookmarks.push({name: data.name, url: data.url, backgroundColor: data.color, favicon: data.favicon});
      Storage.saveBookmarks(JSON.stringify(json), callback);
    });
  }
  /*
    * removes bookmark
    * @param1 {Number} id
    * @param2 {Function} callback
    */
  static removeBookmark(id, callback) {
    try {
      Storage.getBookmarks(function (json) {
        json.bookmarks.splice(id, 1);
        Storage.saveBookmarks(JSON.stringify(json), callback);
      });
    } catch (error) {
      Storage.resetBookmarks();
      console.error(error);
    }
  }
  /*
    * returns index of bookmark item
    * @param1 {String} url
    * @param2 {Function} callback
    */
  static getBookmarkIndex(url, callback) {
    Storage.getBookmarksData(function (_json) {
      var id = -1;
      for (var i = 0; i < _json.bookmarks.length; i++) {
        if (_json.bookmarks[i].url == url) {
          id = i;
          callback(id);
          break;
        }
      }
    });
  }
}
