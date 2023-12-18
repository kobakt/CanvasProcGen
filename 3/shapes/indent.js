
    if (numOfIter >= settings.minIterations.minIndentIter
      && drawLength >= settings.minSideSize * 3 && drawHeight >= settings.minSideSize * 3) {
      actions.push({
        action: indentRect,
        weight: weights.indentRect,
      });
    
function indentRect(centerX, centerY) {
  ctx.fillStyle = curColor.hex();
  ctx.fillRect(centerX - drawLength / 2, centerY - drawHeight / 2, drawLength, drawHeight);
  drawAcc(numOfIter + 1, nextColor, centerX, centerY,
    drawLength - 2 * settings.minSideSize, drawHeight - 2 * settings.minSideSize,
    lastSplits, true, settings);
}
