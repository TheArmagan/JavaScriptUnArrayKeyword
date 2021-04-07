const findArrayRegex = /(?:var|let|const) (?<name>_[1234567890abcdefx]+) ?= ?(?<array>\[[^\]]+\]);?/ui;
const varReferenceRegex = /(_[1234567890abcdefx]+)\[(\d+)\]/gmi;
const clearObjectPath = /\["([^"\W]*?)"\]/gui;
const nonNormalPathName = /[^A-Za-z0-9_$]/;

const form = document.querySelector("form");

const input = document.querySelector("#input");

const output = document.querySelector("#output");

function getVariableNameAndArray(text = "") {
  let h = findArrayRegex.exec(text);
  return [h.groups.name, eval(`let d = ${h.groups.array}; d`)]
}

function unArray(text="") {
  const [varName, varData] = getVariableNameAndArray(text);

  text = text.replace(findArrayRegex, "");

  text = text.replace(varReferenceRegex, (fullMatch, name, index) => {
    if (name == varName) {
      let t = varData[parseInt(index)];
      return JSON.stringify(t);
    } else {
      return fullMatch;
    }
  });

  text = text.replace(clearObjectPath, (fullMatch, key) => {
    console.log(fullMatch, key);
    return `.${key}`;
  });

  return text;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  try {
    output.value = unArray(input.value)
  } catch (e) {
    output.value = e;
  }
})