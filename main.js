const gameControllerBtn = document.querySelector('#gameController');
const levels = document.querySelector('#levels');
const root = document.querySelector(':root');
let size = 8;
let bom = 8;

gameControllerBtn.innerHTML = '&#128528';
gameControllerBtn.onclick = function () {
  start(size, size, bom);
  gameControllerBtn.innerHTML = '&#128528';
};
levels.innerHTML = '<button/>'.repeat(3);
const allLevels = [...levels.children];
allLevels[0].innerHTML = '&#128519';
allLevels[1].innerHTML = '&#128578';
allLevels[2].innerHTML = '&#128520';
const choseLevel = function (e) {
  e.preventDefault();
  if (e.target.tagName !== 'BUTTON') {
    return;
  }
  const levelToChose = allLevels.indexOf(e.target);
  const setLevel = (size) => {
    root.style.setProperty('--game-blocks', size);
  };
  if (levelToChose === 0) {
    size = 6;
    bom = 5;
    setLevel(size);
    start(size, size, bom);
  } else if (levelToChose === 1) {
    size = 8;
    bom = 8;
    setLevel(size);
    start(size, size, bom);
  } else if (levelToChose === 2) {
    size = 10;
    bom = 12;
    setLevel(size);
    start(size, size, bom);
  }
};
levels.addEventListener('click', choseLevel);

function start(width, heigth, totalBombs) {
  const field = document.querySelector('#field');
  field.style.pointerEvents = 'auto';
  const flagsCount = document.querySelector('.flagsCount');
  const totalCell = width * heigth;
  flagsCount.innerHTML = '&#127873 ' + totalBombs;
  field.innerHTML = '<button/>'.repeat(totalCell);
  const cells = [...field.children];
  let cellsLength = cells.length;
  let arrOfFlag = [];
  let openedCells = [];
  const bombs = [...Array(totalCell).keys()]
    .sort(() => {
      return Math.random() - 0.5;
    })
    .slice(0, totalBombs);
  let flags = bombs.length;
  const clickListener = function (e) {
    e.preventDefault();
    if (e.target.tagName !== 'BUTTON') {
      return;
    }

    const tapIndex = cells.indexOf(e.target);
    const column = tapIndex % width;
    const row = Math.floor(tapIndex / heigth);
    open(column, row);
  };

  const contextmenuListener = function (e) {
    e.preventDefault();
    if (e.target.tagName !== 'BUTTON') {
      return;
    }
    const tapIndex = cells.indexOf(e.target);
    const column = tapIndex % width;
    const row = Math.floor(tapIndex / heigth);
    changeFlag(column, row);
  };
  field.addEventListener('click', clickListener);
  field.addEventListener('contextmenu', contextmenuListener);

  function changeFlag(column, row) {
    const index = row * width + column;
    const cell = cells[index];

    if (arrOfFlag.includes(index)) {
      cell.innerHTML = '';
      arrOfFlag.splice(arrOfFlag.indexOf(index), 1);
      ++flags;
      flagsCount.innerHTML = '&#127873 ' + flags;
    } else if (!openedCells.includes(index) && flags > 0) {
      arrOfFlag.push(index);
      cell.innerHTML = '&#127873';
      --flags;
      flagsCount.innerHTML = '&#127873 ' + flags;
    }
  }
  function open(column, row) {
    if (!isValidCells(column, row)) return;
    const index = row * width + column;
    const cell = cells[index];
    if (cell.disabled === true) return;
    if (arrOfFlag.includes(index)) return;
    cell.disabled = true;
    openedCells.push(index);
    if (isBomb(column, row)) {
      gameOver();
    } else {
      cell.innerHTML = countNearbyMine(column, row) === 0 ? '' : countNearbyMine(column, row);
    }
    const totalNearby = countNearbyMine(column, row);
    if (totalNearby === 0) {
      for (let x = -1; x < 2; x++) {
        for (let y = -1; y < 2; y++) {
          open(column + x, row + y);
        }
      }
    }
    cellsLength--;

    if (cellsLength === bombs.length) {
      win();
    }
  }
  function win() {
    field.style.pointerEvents = 'none';
    gameControllerBtn.innerHTML = '&#128143';
    field.removeEventListener('click', clickListener);
    field.removeEventListener('contextmenu', contextmenuListener);
  }
  function isValidCells(column, row) {
    return row >= 0 && row < heigth && column >= 0 && column < width;
  }
  function countNearbyMine(column, row) {
    let count = 0;
    for (let x = -1; x < 2; x++) {
      for (let y = -1; y < 2; y++) {
        if (isBomb(column + x, row + y)) {
          count++;
        }
      }
    }
    return count;
  }
  function isBomb(column, row) {
    if (!isValidCells(column, row)) return;

    const index = column + row * width;

    return bombs.includes(index);
  }
  function gameOver() {
    bombs.map((b) => {
      cells[b].innerHTML = '&#128148';
    });
    cells.map((e) => {
      const tapIndex = cells.indexOf(e);
      const column = tapIndex % width;
      const row = Math.floor(tapIndex / heigth);
      open(column, row);
    });

    field.style.pointerEvents = 'none';
    gameControllerBtn.innerHTML = '&#128557';

    field.removeEventListener('click', clickListener);
    field.removeEventListener('contextmenu', contextmenuListener);
  }
}
start(size, size, bom);
