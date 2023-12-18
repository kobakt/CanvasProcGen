if (
  numOfIter >= settings.minIterations.minDiamondIter &&
  length >= settings.minSideSize * 3 + specialOffset
) {
  actions.push({
    action: specialShapePlaceable ? diamond : indentSpecialFunction(diamond),
    weight: weights.diamond,
  });
}

function diamond(centerX, centerY) {
  ctx.beginPath();
  ctx.fillStyle = nextColor.hex();
  const offset = drawLength / 2;
  ctx.moveTo(centerX - offset, centerY);
  ctx.lineTo(centerX, centerY - offset);
  ctx.lineTo(centerX + offset, centerY);
  ctx.lineTo(centerX, centerY + offset);
  ctx.fill();
  const newLength = floorEvenOrOdd(
    Math.floor(drawLength / 2 - Math.SQRT2 * settings.minSideSize),
    drawLength,
  );
  // const newLength = floorEvenOrOdd(Math.floor(drawLength / 2), drawLength);
  if (
    newLength >= settings.minSideSize &&
    Math.random() > settings.specialNestingProbability.diamond
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
