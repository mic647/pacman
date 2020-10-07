'use strict';
const WALL = '🟧';
const FOOD = '.';
const EMPTY = ' ';
const SUPERFOOD = '🍔';
const CHERRY = '🍒';
var gIntervalCherry;
var gIntervalSound;
var gScore = 0;


var gBoard;
var gGame = {
  score: 0,
  isOn: false
};

function init() {
  gScore = 0;
  gGame.score = 0;
  gGame.isOn = false;
  document.querySelector('header h3 span').innerText = gGame.score;
  clearInterval(gIntervalCherry);
  clearInterval(gIntervalGhosts);
  isSuperFood(gSuperFoodFalse);
  gBoard = buildBoard();
  createPacman(gBoard);
  printMat(gBoard, '.board-container');
  playSound('pacman_beginning');
  gIntervalCherry = setInterval(addCherry, 10000);
  createGhosts(gBoard);
  disabledBtn(true)
  setTimeout(() => {
    disabledBtn(false)
    gGame.isOn = true;
  }, 4000);
}

function buildBoard() {
  var SIZEW = 10;
  var SIZEH = 10;
  var board = [];
  for (var i = 0; i < SIZEW; i++) {
    board.push([]);
    for (var j = 0; j < SIZEH; j++) {
      board[i][j] = FOOD;
      if (i === 0 || i === SIZEW - 1 ||
        j === 0 || j === SIZEW - 1 ||
        (j === 3 && i > 4 && i < SIZEH - 2)) {
        board[i][j] = WALL;
      } else if (i === 1 && j === 1 || i === 1 && j === board[0].length - 2 || i === board[0].length - 2 && j === 1 || i === board[0].length - 2 && j === board[0].length - 2) {
        board[i][j] = SUPERFOOD
      }
    }
  }
  return board;
}

function addCherry() {
  var getRandomIdx = findEmptyCells(gBoard);
  gBoard[getRandomIdx.i][getRandomIdx.j] = CHERRY;
  rotateCell(getRandomIdx.i, getRandomIdx.j)
  renderCell(getRandomIdx, CHERRY);
}

function findEmptyCells(board) {
  var emptyCell = [];
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[0].length; j++) {
      if (board[i][j] === EMPTY) {
        emptyCell.push({ i: i, j: j })
      }
    }
  }
  var random = getRandomIntInclusive(0, emptyCell.length - 1);
  return emptyCell[random]
}

function updateScore(value) {
  // Update both the model and the dom for the score
  console.log(gScore);
  gGame.score += value;
  document.querySelector('header h3 span').innerText = gGame.score;
  if (gScore >= 60) gameOver();
}


function gameOver() {
  console.log('Game Over');
  gGame.isOn = false;
  if (gScore >= 60) {
    playSound('pacman_intermission')
  } else {
    playSound('pacman_death')
  }
  clearInterval(gIntervalGhosts);
  clearInterval(gIntervalCherry);
  gIntervalGhosts = null;
  modalMsg()
  // document.querySelector('.btn-play-ag').innerText = 'Play Again'
}

function rotateCell(nextLocationI, nextLocationJ) {
  var elGhost = document.querySelector(`.cell${nextLocationI}-${nextLocationJ}`);
  elGhost.style.transform = 'rotate(0deg)'
}

function modalMsg() {
  var elCell1 = document.querySelector('.cell4-4');
  var elCell2 = document.querySelector('.cell4-5');
  var elCell3 = document.querySelector(`.pacman`);
  elCell1.innerHTML = `<div class="game-over">GAME</div>`
  elCell2.innerHTML = `<div class="game-over">OVER</div>`
  elCell1.style.transform = 'rotate(0deg)'
  elCell2.style.transform = 'rotate(0deg)'
  elCell3.style.display = 'none';
  
}

function disabledBtn(onOf) {
  var elBtn = document.querySelector('.btn-play-ag')
  elBtn.disabled = onOf
  if (!onOf) {
    elBtn.classList.add('btn-play-again')
  } else {
    elBtn.classList.remove('btn-play-again')
  }
}

function playSound(sound) {
  var sound = new Audio('sound/' + sound + '.WAV');
  sound.play();
}

