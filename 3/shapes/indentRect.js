if (
  numOfIter >= settings.minIterations.minIndentIter &&
  drawLength >= settings.minSideSize * 3 &&
  drawHeight >= settings.minSideSize * 3
) {
  actions.push({
    action: indentRect,
    weight: weights.indentRect,
  });
}
