const specialOffset = specialShapePlaceable ? 0 : 2 * settings.minSideSize;
if (
  numOfIter >= settings.minIterations.minCircleIter &&
  length >= settings.minSideSize * 3 + specialOffset
) {
  actions.push({
    action: specialShapePlaceable ? circle : indentSpecialFunction(circle),
    weight: weights.circle,
  });
}

function circle(centerX, centerY) {
  ctx.beginPath();
  ctx.fillStyle = nextColor.hex();
  const radius = drawLength / 2;
  ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
  ctx.fill();
  const newLength = floorEvenOrOdd(
    Math.floor((radius - settings.minSideSize) * Math.SQRT2),
    drawLength,
  );
  if (
    newLength >= settings.minSideSize &&
    Math.random() > settings.specialNestingProbability.circle
  ) {
    drawAcc(
      numOfIter + 1,
      nextDistanceColor(
        nextColor,
        settings.minColorDist,
        settings.maxColorDist,
      ),
      centerX,
      centerY,
      newLength,
      newLength,
      lastSplits,
      true,
      settings,
    );
  }
}
