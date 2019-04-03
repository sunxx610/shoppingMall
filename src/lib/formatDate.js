function formatDate() {
    var _date = new Date();
    var t = '';
    if (_date.getMonth() + 1 < 10) t += '0';
    t += (_date.getMonth() + 1) + '/';
    if (_date.getDate() < 10) t += '0';
    t += (_date.getDate()) + '/' + (_date.getFullYear()) + ' ';
    if (_date.getHours() < 10) t += '0';
    t += (_date.getHours()) + ':';
    if (_date.getMinutes() < 10) t += '0';
    t += (_date.getMinutes()) + ':';
    if (_date.getSeconds() < 10) t += '0';
    t += (_date.getSeconds());

    return t;
}

exports.formatDate = formatDate;