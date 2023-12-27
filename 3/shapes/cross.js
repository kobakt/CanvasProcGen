import { hex, nextColor } from "../colors.js";
import {
  drawSpecial,
  floorEvenOrOdd,
  isAvailableSpecial,
  makeShapeObject,
} from "./shapeObject.js";

// if (
//   numOfIter >= settings.minIterations.minCrossIter &&
//   length >= settings.minSideSize * 4 + specialOffset
// ) {
//   actions.push({
//     action: specialShapePlaceable
//       ? cross
//       : indentSpecialFunction(cross),
//     weight: weights.cross,
//   });
// }
/**
 * @param {GlobalContext} global
 * @param {LocalContext} local
 */
function isAvailable(global, local) {
  return isAvailableSpecial(
    global.settings.minIterations.minCrossIter,
    4,
  )(global, local);
}

// function cross(centerX, centerY) {
//   const halfLength = drawLength / 2;
//   const offset = drawLength / 6;

//   gloablctx.fillStyle = curColor.hex();
//   // Top-Left Corner
//   gloablctx.beginPath();
//   gloablctx.moveTo(centerX - halfLength, centerY - halfLength);
//   // upper
//   gloablctx.lineTo(centerX - offset, centerY - halfLength);
//   gloablctx.lineTo(centerX, centerY - (halfLength - offset));
//   gloablctx.lineTo(centerX + offset, centerY - halfLength);
//   // Top-Right Corner
//   gloablctx.lineTo(centerX + halfLength, centerY - halfLength);
//   // right
//   gloablctx.lineTo(centerX + halfLength, centerY - offset);
//   gloablctx.lineTo(centerX + (halfLength - offset), centerY);
//   gloablctx.lineTo(centerX + halfLength, centerY + offset);
//   // Bottom-Right Corner
//   gloablctx.lineTo(centerX + halfLength, centerY + halfLength);
//   // lower
//   gloablctx.lineTo(centerX + offset, centerY + halfLength);
//   gloablctx.lineTo(centerX, centerY + (halfLength - offset));
//   gloablctx.lineTo(centerX - offset, centerY + halfLength);
//   // Bottom-Left Corner
//   gloablctx.lineTo(centerX - halfLength, centerY + halfLength);
//   // left
//   gloablctx.lineTo(centerX - halfLength, centerY + offset);
//   gloablctx.lineTo(centerX - (halfLength - offset), centerY);
//   gloablctx.lineTo(centerX - halfLength, centerY - offset);
//   gloablctx.fill();

//   // const newLength = drawLength - 2 * offset;
//   const newLength = floorEvenOrOdd(
//     Math.floor(drawLength - 2 * offset - 2 * settings.minSideSize),
//   );
//   if (
//     newLength >= settings.minSideSize &&
//     Math.random() > settings.specialNestingProbability.cross
//   ) {
//     drawAcc(
//       numOfIter + 1,
//       nextDistanceColor(
//         nextColor,
//         settings.minColorDist,
//         settings.maxColorDist,
//       ),
//       centerX,
//       centerY,
//       newLength,
//       newLength,
//       lastSplits,
//       true,
//       settings,
//     );
//   }
// }

/**
 * @param {GlobalContext} global
 * @param {LocalContext} local
 */
function drawCrossHelp(global, local) {
  const halfLength = local.length / 2;
  const offset = local.length / 6;
  const left = local.centerX - halfLength;
  const right = local.centerX + halfLength;
  const top = local.centerY - halfLength;
  const bot = local.centerY + halfLength;

  global.ctx.fillStyle = hex(local.color);
  global.ctx.beginPath();
  global.ctx.moveTo(left, top);
  global.ctx.lineTo(local.centerX - offset, top);
  global.ctx.lineTo(local.centerX, top + offset);
  global.ctx.lineTo(local.centerX + offset, top);
  // Top-Right Corner
  global.ctx.lineTo(right, top);
  // right
  global.ctx.lineTo(right, local.centerY - offset);
  global.ctx.lineTo(right - offset, local.centerY);
  global.ctx.lineTo(right, local.centerY + offset);
  // Bottom-Right Corner
  global.ctx.lineTo(right, bot);
  // lower
  global.ctx.lineTo(local.centerX + offset, bot);
  global.ctx.lineTo(local.centerX, bot - offset);
  global.ctx.lineTo(local.centerX - offset, bot);
  // Bottom-Left Corner
  global.ctx.lineTo(left, bot);
  // left
  global.ctx.lineTo(left, local.centerY + offset);
  global.ctx.lineTo(left + offset, local.centerY);
  global.ctx.lineTo(left, local.centerY - offset);
  global.ctx.fill();

  const newLength = floorEvenOrOdd(
    Math.floor(
      local.length - 2 * offset - 2 * global.settings.minSideSize,
    ),
    local.length,
  );
  if (
    newLength >= global.settings.minSideSize &&
    Math.random() < global.settings.specialNestingProbability.cross
  ) {
    const newLocal = structuredClone(local);
    newLocal.numOfIter++;
    newLocal.color = nextColor(global, local);
    newLocal.length = newLength;
    newLocal.height = newLength;
    newLocal.specialShapePlaceable = true;
    global.callback(global, newLocal);
  }
}

function crossObject() {
  return makeShapeObject(
    isAvailable,
    (global) => global.settings.squareWeights.cross,
    drawSpecial(drawCrossHelp),
  );
}

export { crossObject };
