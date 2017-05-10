function decodeSave () {
    $('.status').css('display', 'none');
    var data = document.getElementById('saveData').value;
    var result = LZString.decompressFromBase64(data);
    var out = document.getElementById('parseDest');
    try {
        if (result == null) { throw "Error" }
        var saveData = JSON.parse(result)
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
        count.push(data[x].key)
    }
    return Math.max.apply(null, count).toString().length
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
    var totalpad = Array(maxIntLen(element, "val")).join(' ')
    var onpad    = Array(maxIntLen(element, "on")).join(' ')
    var NamePad  = Array(15).join(' ')
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

function displayOutput (data) {
    // Padding for initial data
    var longNum = Math.max(data.calendar.year, data.village.maxKittens,data.resources.karma,data.resources.paragon,data.resources.burnedParagon).toString().length
    var longArr = Array(longNum).join(' ')

    // Lookup resource values for paragon/karma
    var lookup = {}
    for (x in data.resources) {
        lookup[data.resources[x].name] = data.resources[x].value
    }

    // Provide data
    passValue('year', pad(longArr, data.calendar.year, true));
    passValue('kittens', pad(longArr, data.village.maxKittens, true));
    passValue('karma', pad(longArr, lookup['karma'], true));
    passValue('paragon', pad(longArr, lookup['paragon'], true));
    passValue('burnedParagon', pad(longArr, lookup['burnedParagon'], true));
    var faith = parseInt(data.religion.faith).toLocaleString();
    passValue('faith',faith);
    passAvailable('science',data.science.techs, true, false);
    passAvailable('workshop',data.workshop.upgrades, true, false);

    passBuildings('building', data.buildings, true);
}