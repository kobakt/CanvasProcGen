if (
  (!lastSplits.splitLength || heightFactors.length === 0) &&
  lengthFactors.length > 0
) {
  actions.push({
    action: splitFunction(lengthFactors, true),
    weight: weights.split,
  });
}
if (
  (!lastSplits.splitHeight || lengthFactors.length === 0) &&
  heightFactors.length > 0
) {
  actions.push({
    action: splitFunction(heightFactors, false),
    weight: weights.split,
  });
}
