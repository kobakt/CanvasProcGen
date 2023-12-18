if (
  numOfIter >= settings.minIterations.minOppositesSquareIter &&
  drawLength >= settings.minSideSize * 3
) {
  actions.push({
    action: (centerX, centerY) => {
      drawOpposites(
        Math.round(drawLength / (settings.minSideSize * 2)),
        curColor,
        nextColor,
        centerX,
        centerY,
        drawLength,
      );
    },
    weight: weights.oppositesSquare,
  });
}
