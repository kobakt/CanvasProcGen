/**
@typedef {import("./colors.js").Color} Color
@typedef {import("./settings.js").Settings} Settings
*/

/**
//TODO is this best?
// if prop missing, then assumed not set
// else just use bool
@typedef SplitContext
@prop {boolean} lastSplitByLength
@prop {boolean} lastSplitByHeight
*/

/**
Used and not modified for all calls
@typedef GlobalContext 
@prop {Settings} settings
@prop {function} callback //TODO define function
@prop {Object} ctx
*/

/*
LocalContext will be cloned
Option 1: structureClone
allows nested objects via deep-copy
Doesn't allow functions
Option 2: assign or ...
Only shallow copy so no nested objects
Option 3: Custom
could be function that takes in full local + partial to replace
*/

/**
Used for a sepcific drawing call
@typedef LocalContext 
@prop {number} length
@prop {number} height
@prop {number} centerX
@prop {number} centerY
@prop {Color} color
@prop {number} numOfIter
@prop {SplitContext} split
@prop {boolean} specialShapePlaceable
*/

/**
@typedef {function} ContextFunction
@param {GlobalContext} global
@param {LocalContext} local
*/
