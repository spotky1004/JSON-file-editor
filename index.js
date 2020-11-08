var loadedJSON = '';
var fileLoaded = 0;
var lineNow = 0;
var lineRendered = -1;
var totLines = 0;

function loadFile() {
  var input = document.createElement("input");
  input.type = "file";
  input.accept = ".txt, .json";
  input.onchange = function (event) {
    processFile(event.target.files[0]);
  };
  input.click();
}
function processFile(file) {
  var reader = new FileReader();
  reader.onload = function () {
    try {
      loadedJSON = JSON.stringify(JSON.parse(String(reader.result)), null, '\t').replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;');
    } catch (e) {
      loadedJSON = String(reader.result.replace(/,/g, ',\n')).replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;');
    }
    renderJSON(loadedJSON, lineNow);
    fileLoaded = 1;
    lineNow = 0;
    document.querySelectorAll('#jsonArea > div')[0].focus();
  };
  reader.readAsText(file, /* optional */ "euc-kr");
}

function parseJSON(json) {
  json = json
  .replace(/(.*)\n/g, '☒$1☐')
  .replace(/([0-9|.]+)/g, 'SpAnMaRkUpA$1ClOsEsPaN')
  .replace(/(\"(.|[^"]*)\")/g, 'SpAnMaRkUpB$1ClOsEsPaN')
  .replace(/SpAnMaRkUpA/g, '<span style="color:#e362d2">')
  .replace(/SpAnMaRkUpB/g, '<span style="color:#66e362">')
  .replace(/ClOsEsPaN/g, '</span>');
  //.replace(/((,+[\n☒☐]*){2,})/g, 'SpAnMaRkUpC$1ClOsEsPaN')
  //.replace(/SpAnMaRkUpC/g, '<span style="color:#ed3e3e">')
  repSpans = json.match(/(\<[^>]+>[^>]+\<\/[^>]+>)/g);
  json = json.replace(/(\<[^>]+>[^>]+\<\/[^>]+>)/g, '☑');
  json = json.replace(/(([^☑\n☒☐])+)/g, '<span>$1</span>');
  if (repSpans !== null) {
    for (var i = 0; i < repSpans.length; i++) {
      json = json.replace(/☑/, repSpans[i]);
    }
  }
  json = json
  .replace(/☒/g, '<div>')
  .replace(/☐/g, '</div>');
  return json;
}


function changeJSON(json='', json2='', line=0) {

}
function renderJSON(json='', line=0, forcusRender=0) {
  if (!fileLoaded) return;
  totLines = loadedJSON.split('\n').length;
  var partJson = json;
  regex = new RegExp("((.*)\n){" + Math.floor(line) + "}", "");
  var linesToDisplay = Math.floor(Math.min(100, Math.max(totLines-line, 0)));
  regex2 = new RegExp("((.*)\n){" + linesToDisplay + "}", "");
  if (linesToDisplay != 0) {
    partJson = partJson.replace(regex, '').match(regex2)[0];
  } else {
    partJson = '';
  }
  if (document.querySelectorAll('#jsonArea > div')[0].innerHTML != parseJSON(partJson) || forcusRender || lineRendered != lineNow) {
    document.querySelectorAll('#jsonArea > div')[0].addEventListener('mousedown', preventLoseFocus);
    lineRendered = lineNow;
    document.querySelectorAll('#jsonArea > div')[0].innerHTML = parseJSON(partJson);
    document.querySelectorAll('#lineNumArea > div')[0].innerHTML = '';
    for (var i = Math.floor(line)-1; i < Math.floor(line)+99; i++) {
      document.querySelectorAll('#lineNumArea > div')[0].innerHTML += (i+2) + '<br>';
    }
    var o = line-Math.floor(line);
    document.querySelectorAll('#jsonArea > div')[0].style.transform = `translate(0, -${2*o}vh)`;
    document.querySelectorAll('#lineNumArea > div')[0].style.transform = `translate(0, -${2*o}vh)`;
    document.querySelectorAll('#scrollBar > div')[0].style.transform = `translate(0, ${88*(line/totLines)}vh)`;
    document.querySelectorAll('#jsonArea > div')[0].removeEventListener('mousedown', preventLoseFocus, false);
  }
}

setInterval( function () {
  if (totLines < lineNow) lineNow=totLines;
  renderJSON(loadedJSON, lineNow);
  document.querySelectorAll('#jsonArea > div')[0].focus();
}, 50);

function differeanceAt(string1, string2) {
  var i = 0;
  var j = 0;
  while (j < string2.length) {
    if (string1[i] != string2[j] || i == string1.length)
      return j;
    else
      i++;
      j++;
  }
};

function preventLoseFocus(e) {
  e.preventDefault();
  document.execCommand('bold', false);
}
function wheel(event) {
  lineNow += event.deltaY/33;
  if (lineNow < 0) lineNow=0;
}
window.onwheel = wheel;
(function() {
  function mouseDown(e) {
    var per = Math.max(Math.min((e.clientY/innerHeight-0.09)*(1/0.88), 1), 0);
    lineNow = totLines*per;
  }
  var div = document.getElementById("scrollBar");
  div.addEventListener("mousedown", mouseDown);
}());
function setCaret(line, char) {
  var el = document.querySelectorAll('#jsonArea > div')[0];
  var range = document.createRange();
  var sel = window.getSelection();
  var lineLeng = 0;
  var charPer = [];

  for (var i = 0; i < el.childNodes[line].childNodes.length; i++) {
    lineLeng += el.childNodes[line].childNode[i]
  }
  //range.setStart(el.childNodes[line], 5);
  //range.collapse(true);

  //sel.removeAllRanges();
  //sel.addRange(range);
}

String.prototype.replaceAt = function(index, character) {
  return this.substr(0, index) + character + this.substr(index+character.length);
};
String.prototype.splice = function(start, delCount, newSubStr) {
  return this.slice(0, start) + newSubStr + this.slice(start + Math.abs(delCount));
};
