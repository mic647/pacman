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
  clearInterval(gIntervalCherry)
  clearInterval(gIntervalGhosts)
  gGame.score = 0;
  document.querySelector('header h3 span').innerText = gGame.score;
  isSuperFood(gSuperFoodFalse);
  // modal('0', 'none')
  // modalMsg()
  gBoard = buildBoard();
  printMat(gBoard, '.board-container');
  playSound('pacman_beginning')
  gIntervalCherry = setInterval(addCherry, 10000)
  createPacman(gBoard);
  printMat(gBoard, '.board-container');
  createGhosts(gBoard);
  setTimeout(() => {
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
  if (gScore === 60) gameOver();
}


function gameOver() {
  console.log('Game Over');
  if (gScore === 60) {
    playSound('pacman_intermission')
  } else {
    playSound('pacman_death')
  }
  clearInterval(gIntervalGhosts);
  clearInterval(gIntervalCherry);
  gIntervalGhosts = null;
  gGame.isOn = false;
  // modal('999', 'block')
  modalMsg()
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
  elCell3.style.borderRadius = '50%';
  elCell3.style.backgroundColor = 'yellow';
}

function playSound(sound) {
  var sound = new Audio('sound/' + sound + '.WAV');
  sound.play();
}


// function modal(zIndex, display) {
//   var elModal = document.querySelector('.modal');
//   elModal.style.zIndex = zIndex;
//   elModal.style.display = display;
// }

// function modalMsg() {
//   var elModal = document.querySelector('.modal');
//   elModal.innerHTML = `${gScore !== 60 ? '<span>The game is over friend, you lost to a ghost!</span>' : '<span> Game over! your score is ' + gGame.score}</span><button class="btn-play-ag" onclick="init()">play again</button>`

// }

