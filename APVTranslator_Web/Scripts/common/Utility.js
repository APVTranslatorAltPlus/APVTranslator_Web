var Utility = {};
Utility.getBaseUrl = function () {
    return location.origin + "/"
}

Utility.clone = function (obj) {
    if (null == obj || "object" != typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
}

Utility.getStringDate = function (stringDate, format) {
    var dateFormat = "mm:hh DD/MM/YYYY";
    if (stringDate) {
        var date = new Date(stringDate);
        return (date.getHours() + ":" + date.getMinutes() + " " + date.getDate() + '/' + date.getMonth() + '/' + date.getFullYear());
    }
    return "null";
}

Utility.showMessage = function (scope, $mdDialog, mes, title) {
    var _title = "APV Translator";
    var _mes="Check network connect!"
    if (title != null) {
        _title = title;
    }
    if (mes) {
        _mes = mes;
    }
    $mdDialog.show(
      $mdDialog.alert()
        .parent(angular.element(document.body))
        .clickOutsideToClose(true)
        .title(_title)
        .textContent(_mes)
        .ariaLabel('Alert Dialog')
        .ok('OK')
    );
}
Utility.showConfirm = function (scope, $mdDialog, mes, callback, title) {
    var _title = "APV Translator";
    if (title != null) {
        _title = title;
    }
    var confirm = $mdDialog.confirm()
          .title(_title)
          .textContent(mes)
          .ariaLabel('Alert confirm dialog')
          .ok('OK')
          .cancel('Cancel');

    $mdDialog.show(confirm).then(callback, function () {
       //cancel
    });
}