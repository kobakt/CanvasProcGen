if (
  numOfIter >= settings.minIterations.minCrossIter &&
  length >= settings.minSideSize * 4 + specialOffset
) {
  actions.push({
    action: specialShapePlaceable ? cross : indentSpecialFunction(cross),
    weight: weights.cross,
  });
}

function cross(centerX, centerY) {
  const halfLength = drawLength / 2;
  const offset = drawLength / 6;

  ctx.fillStyle = curColor.hex();
  // Top-Left Corner
  ctx.beginPath();
  ctx.moveTo(centerX - halfLength, centerY - halfLength);
  // upper
  ctx.lineTo(centerX - offset, centerY - halfLength);
  ctx.lineTo(centerX, centerY - (halfLength - offset));
  ctx.lineTo(centerX + offset, centerY - halfLength);
  // Top-Right Corner
  ctx.lineTo(centerX + halfLength, centerY - halfLength);
  // right
  ctx.lineTo(centerX + halfLength, centerY - offset);
  ctx.lineTo(centerX + (halfLength - offset), centerY);
  ctx.lineTo(centerX + halfLength, centerY + offset);
  // Bottom-Right Corner
  ctx.lineTo(centerX + halfLength, centerY + halfLength);
  // lower
  ctx.lineTo(centerX + offset, centerY + halfLength);
  ctx.lineTo(centerX, centerY + (halfLength - offset));
  ctx.lineTo(centerX - offset, centerY + halfLength);
  // Bottom-Left Corner
  ctx.lineTo(centerX - halfLength, centerY + halfLength);
  // left
  ctx.lineTo(centerX - halfLength, centerY + offset);
  ctx.lineTo(centerX - (halfLength - offset), centerY);
  ctx.lineTo(centerX - halfLength, centerY - offset);
  ctx.fill();

  // const newLength = drawLength - 2 * offset;
  const newLength = floorEvenOrOdd(
    Math.floor(drawLength - 2 * offset - 2 * settings.minSideSize),
  );
  if (
    newLength >= settings.minSideSize &&
    Math.random() > settings.specialNestingProbability.cross
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
