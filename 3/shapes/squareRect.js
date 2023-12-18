if (
  drawLength >= settings.drawRatios.minLengthRatio * settings.length &&
  drawLength <= settings.drawRatios.maxLengthRatio * settings.length &&
  drawHeight >= settings.drawRatios.minHeightRatio * settings.height &&
  drawHeight <= settings.drawRatios.maxHeightRatio * settings.height
) {
  actions.push({
    action: drawRect,
    weight: weights.drawRect,
  });
}
