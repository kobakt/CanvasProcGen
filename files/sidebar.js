import { FormType } from "./settings.js";
/**
 * @template T
 * @typedef {import("./settings.js").Setting<T>} Setting} Setting
 */

/**
 * Sets the text for a given label.
 * @param {Setting<any>} setting
 * @param {string} name
 * @param {HTMLLabelElement} label
 * @param {any} value
 */
function setLabelText(setting, name, label, value) {
  label.innerText = name + ": " + value + "\n" + setting.desc + "\n";
}

/**
 * Gets the value in an input given the formType.
 * @param {Setting<any>} setting
 * @param {HTMLInputElement} input
 */
function getInputValue(setting, input) {
  switch (setting.formType) {
    case FormType.CheckBox:
      return input.checked;
    case FormType.Number:
    case FormType.Slider:
      return Number.parseFloat(input.value);
    case FormType.Color:
    default:
      return input.value;
  }
}
/**
 * Sets the input value and other parameters based on a formType.
 * @param {Setting<any>} setting
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
 * Creates a changeEventFunction based on the formType.
 * @param {Setting<any>} setting
 * @param {string} name
 * @param {HTMLLabelElement} label
 * @param {HTMLInputElement} input
 */
function changeEventFunction(setting, name, label, input) {
  return () => {
    setting.val = getInputValue(setting, input);
    setLabelText(setting, name, label, setting.val);
  };
}

/**
 * Adds a given setting to the HTML sidebar.
 * @template T
 * @param {Setting<T>} setting
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
  const sidebar = document.getElementById("settings");
  sidebar.appendChild(div);
}

/**
 * Recursively adds Settings to the sidebar.
 * @param {object | Setting<any>} object
 * @param {string} name
 */
function addElemsRec(object, name) {
  if (object.val !== undefined) {
    addSetting(object, name);
  } else {
    Object.keys(object)
      .filter((name) => object[name] !== undefined)
      .forEach((key) => {
        addElemsRec(object[key], name + "." + key);
      });
  }
}

export { addElemsRec };
