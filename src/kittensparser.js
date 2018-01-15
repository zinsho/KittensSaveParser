function decodeSave () {
    $('.status').css('display', 'none');
    var data = document.getElementById('saveData').value;
    var result = LZString.decompressFromBase64(data);
    var out = document.getElementById('parseDest');
    try {
        if (result == null) { throw "Error" }
        var saveData = JSON.parse(result)
        try {
            localStorage['saveData'] = result;
        } catch (e) {};
        out.textContent = result;
        displayOutput(saveData);
    } catch (e) {
    };
};

function copy (format) {
    var output = document.getElementById('output');
    var range = document.createRange();
    // Reveal ``` for formatting
    if (format) {
        $('.tics').css('display','block');
    };
    // Collect and copy
    range.selectNodeContents(output);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand('copy');
    window.getSelection().removeAllRanges();
    // Hide ``` for display
    if (format) {
        $('.tics').css('display','none');
    };
};

// Parsing functions
function pad(pad, str, padLeft) {
    // add one extra space to ensure no clipping
    pad = pad+' ';
    if (typeof str === 'undefined') 
        return pad;
    if (padLeft) {
        return (pad + str).slice(-pad.length);
    } else {
        return (str + pad).substring(0, pad.length);
    }
}

function passValue(element, value, newline, nodelete) {
    var el = document.getElementById(element);
    if (!nodelete) {
        while ( el.firstChild ) {
            el.removeChild (el.firstChild);
        };
    };
    el.appendChild (document.createTextNode(value));
    if (newline) {
        el.appendChild(document.createElement("br"));
    };
}

function maxIntLen (data, key) {
    var count = [];
    for (x in data) {
        count.push(data[x][key])
    }
    return Math.max.apply(null, count).toString().length
}

function maxStrLen (data, key) {
    var count = [];
    for (x in data) {
        var string = data[x][key].length
        count.push(string);
    }
    return Math.max.apply(null, count)+1
}

function passAvailable(element, value, unlocked, researched) {
    var el = document.getElementById(element);
    while (el.firstChild) {
        el.removeChild (el.firstChild);
    };
    for (x in value) {
        if (value[x].unlocked == unlocked && value[x].researched == researched) {
            passValue(element,"- " + value[x].name, true, true)
        }
    }    
}

function passBuildings(element, value, unlocked) {
    var el = document.getElementById(element);
    while (el.firstChild) {
        el.removeChild (el.firstChild);
    };
    var totalpad = Array(maxIntLen(value, "val")).join(' ')
    var onpad    = Array(maxIntLen(value, "on")).join(' ')
    var NamePad  = Array(maxStrLen(value, "name")).join(' ')
    for (x in value) {
        if (value[x].unlocked == unlocked) {
            var onText = ""
            if (value[x].on != value[x].val) {
                onText = pad(onpad,value[x].on,true) + " / ";
            } else {
                onText = pad(onpad,'',true) + '   ';
            }
            passValue(element, "- "+pad(NamePad,value[x].name) + " " + onText + pad(totalpad,value[x].val, true) , true, true)
        }
    }
}

function passKittens(element, value, unlocked) {
    var el = document.getElementById(element);
    while (el.firstChild) {
        el.removeChild (el.firstChild);
    };
    var namePad  = Array(maxStrLen(value, "name")).join(' ');
    var totalPad = Array(maxIntLen(value, "value")).join(' ');
    for (x in value) {
        if (value[x].unlocked == unlocked) {
            passValue(element, "- "+pad(namePad,value[x].name) + " " + pad(totalPad,value[x].value, true), true, true);
        }
    }
}

function displayOutput (data) {
    // Lookup resource values for paragon/karma
    var lookup = {}
    for (x in data.resources) {
        lookup[data.resources[x].name] = data.resources[x].value
    }
    // Provide data
    passValue('year', data.calendar.year);
    passValue('kittens', data.village.maxKittens);
    var Karma = lookup['karma']
    passValue('karma', Karma.toFixed(3));
    passValue('paragon', lookup['paragon']);
    passValue('burnedParagon', lookup['burnedParagon']);
    var faith = parseInt(data.religion.faith).toLocaleString();
    var trans = Math.round(Math.log(getTriValueReligion(data.religion.tcratio)));
    if (trans < 0) { trans = 0};
    var apoc = (getTriValueReligion(data.religion.faithRatio)).toFixed(1) + " %";
    passValue('faith',faith);
    passValue('trans',trans);
    passValue('apoc',apoc);
    passAvailable('science',data.science.techs, true, false);
    passAvailable('workshop',data.workshop.upgrades, true, false);
    passKittens('kittensData',data.village.jobs, true)
    passBuildings('building', data.buildings, true);
}
