if (
  numOfIter >= settings.minIterations.minDistanceSquareIter &&
  drawLength >= settings.minSideSize * 3
) {
  actions.push({
    action: (centerX, centerY) => {
      drawDistance(
        Math.round(drawLength / (settings.minSideSize * 2)),
        curColor,
        settings.minColorDist,
        settings.maxColorDist,
        centerX,
        centerY,
        drawLength,
      );
    },
    weight: weights.distanceSquare,
  });
}
