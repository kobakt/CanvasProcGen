import { FormType } from "./settings.js";

/**
 * @param {import("./settings.js").Setting<any>} setting
 * @param {string} name
 * @param {HTMLLabelElement} label
 * @param {any} value
 */
function setLabelText(setting, name, label, value) {
  label.innerText = name + ": " + value + "\n" + setting.desc + "\n";
}

/**
 * @param {import("./settings.js").Setting<any>} setting
 * @param {HTMLInputElement} input
 */
function getInputValue(setting, input) {
  switch (setting.formType) {
    case FormType.CheckBox:
      return input.checked;
    case FormType.Number:
    case FormType.Slider:
    case FormType.Color:
    default:
      return input.value;
  }
}
/**
 * @param {import("./settings.js").Setting<any>} setting
 * @param {HTMLInputElement} input
 * @param {any} value
 * @param {number} [min]
 * @param {number} [max]
 */
function setInputValue(setting, input, value, min, max) {
  switch (setting.formType) {
    case FormType.CheckBox:
      input.checked = value;
      return;
    case FormType.Number:
    case FormType.Slider:
      input.step = "any";
      input.min = min.toString();
      input.max = max.toString();
      input.value = value;
      return;
    case FormType.Color:
    default:
      input.value = value;
      return;
  }
}

/**
 * @param {import("./settings.js").Setting<any>} setting
 * @param {string} name
 * @param {HTMLLabelElement} label
 * @param {HTMLInputElement} input
 */
function changeEventFunction(setting, name, label, input) {
  return () => {
    setLabelText(setting, name, label, getInputValue(setting, input));
    setting.val = getInputValue(setting, input);
  };
}

//TODO tie range with number https://stackoverflow.com/questions/44182411/range-slider-with-direct-number-input
/**
 * @template T
 * @param {import("./settings.js").Setting<T>} setting
 * @param {string} name
 */
function addSetting(setting, name) {
  const div = document.createElement("div");
  const label = document.createElement("label");
  const input = document.createElement("input");
  div.appendChild(label);
  div.appendChild(input);

  input.type = setting.formType;

  setInputValue(
    setting,
    input,
    setting.val,
    setting?.min,
    setting?.max,
  );
  const eventFunc = changeEventFunction(setting, name, label, input);
  eventFunc();
  input.addEventListener("change", eventFunc);
  const sidebar = document.getElementById("sidebar");
  sidebar.appendChild(div);
}

//TODO input type="reset"
// TODO <fieldset> and <legend>
/**
 * @param {object | import("./settings.js").Setting<any>} object
 * @param {string} name
 */
function addElemsRec(object, name) {
  if (object.val !== undefined) {
    addSetting(object, name);
  } else {
    // alert(JSON.stringify(Object.keys(object)));
    Object.keys(object)
      .filter((name) => object[name] !== undefined)
      .forEach((key) => {
        addElemsRec(object[key], name + "." + key);
      });
  }
}

export { addElemsRec };
