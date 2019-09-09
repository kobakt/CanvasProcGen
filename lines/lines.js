// function createLine(n) {
//   const line = [];
//   for (let i = 0; i < n; i += 1) {
//     line.push(Math.random() > 0.5);
//   }
//   return line;
// }

function createEmptyLine(n) {
  const line = [];
  for (let i = 0; i < n; i += 1) {
    line.push(false);
  }
  return line;
}

function drawLine(line) {
  line.forEach((a) => {
    process.stdout.write(a ? '#' : ' ');
    // process.stdout.write(a.toString());
  });
  process.stdout.write('\n');
}

// function nextOppositeLine(line) {
//   return line.map(a => !a);
// }

// function nextPascalLine(line) {
//   const newLine = [];
//   newLine.push(line[0]);
//   for (let i = 1; i < line.length + 1; i += 1) {
//     newLine.push(line[i - 1] !== line[i]);
//   }
//   return newLine;
// }

function nextPascalLoopedLine(line) {
  const newLine = [];
  newLine.push(line[0] !== line[line.length - 1]);
  for (let i = 1; i < line.length; i += 1) {
    newLine.push(line[i - 1] !== line[i]);
  }
  return newLine;
}

const nextLine = nextPascalLoopedLine;
const lineNumber = 64;
// let line = createLine(10);
let line = createEmptyLine(31); line[0] = true;
// let line = [true];
drawLine(line);

for (let i = 0; i < lineNumber - 1; i += 1) {
  line = nextLine(line);
  drawLine(line);
}
