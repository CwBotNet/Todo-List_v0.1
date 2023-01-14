// creating date module
// exports use to export the object data 
exports.getDate = function () {
    const option = {
        weekday: 'long',
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    }

    const today = new Date();

    const day = today.toLocaleDateString("en-us", option);

    return day;
}

exports.getDay = function () {
    const option = {
        weekday: 'long',
    }

    const today = new Date();

    const day = today.toLocaleDateString("en-us", option);

    return day;
}