/*Configuration of the handlebars helpers*/

var moment = require('moment'); //Library moments to manage the date display

//Format used in this project
var DateFormats = {
    long: "DD MMM YYYY", //to be displayed on a page
    htmlInput: "YYYY-MM-DD" //to be used as an input for an html 'date' form
};

var register = function (Handlebars) {
    var helpers = {
        //Helper to set a selected value on a select form
        selected: function (baseValue, loopValue) {
            if (baseValue === loopValue) {
                return 'selected';
            }
            return '';
        },
        //Helper that displays the date according to one of the formats
        formatDate: function (datetime, format) {
            if (moment) {
                // can use other formats like 'lll' too
                format = DateFormats[format] || format;
                return moment(datetime).format(format);
            } else {
                return datetime(baseValue, loopValue);
            }
        },
        checked: function (baseValue, loopValue) {
            let i;
            console.log(baseValue)
            if(baseValue===null)
                return '';
            if(baseValue===undefined)
                return '';
            if(baseValue[0]===loopValue)
                return 'checked';
            if(baseValue[0]==="member")
                return '';
            for (i = 0; i < baseValue.length; i++) {
                if (baseValue[i]._id.equals(loopValue)) {
                    return 'checked';
                }
            }
            return '';
        }
    };

    if (Handlebars && typeof Handlebars.registerHelper === "function") {
        // register helpers
        for (var prop in helpers) {
            Handlebars.registerHelper(prop, helpers[prop]);
        }
    } else {
        // just return helpers object if we can't register helpers here
        return helpers;
    }
};

module.exports.register = register;
module.exports.helpers = register(null);
