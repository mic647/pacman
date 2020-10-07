var PACMAN = '<div class="pacman"><img  class="pacman" src="img/Pacman-moving.gif" /></div>';

var gPacman;
var gSuperFoodFalse = '🔴'
var gSuperFoodTrue = '🟢'

function createPacman(board) {
  gPacman = {
    location: {
      i: 3,
      j: 8
    },
    isSuper: false
  };
  board[gPacman.location.i][gPacman.location.j] = PACMAN;
}

function movePacman(eventKeyboard) {
  if (!gGame.isOn) return;

  // console.log('eventKeyboard:', eventKeyboard);

  var nextLocation = getNextLocation(eventKeyboard);
  // User pressed none-relevant key in the keyboard
  if (!nextLocation) return;

  var nextCell = gBoard[nextLocation.i][nextLocation.j];

  // Hitting a WALL, not moving anywhere
  if (nextCell === WALL) return;

  // Hitting FOOD? update score
  if (nextCell === FOOD) {
    playSound('pacman_chomp')
    gScore++
    updateScore(1);
  }
  if (nextCell === CHERRY) {
    playSound('pacman_eatfruit')
    updateScore(10)
  }
  if (nextCell === SUPERFOOD) {
    if (gPacman.isSuper) return;
    playSound('pacman_extrapac')
    gScore++
    updateScore(1)
    gPacman.isSuper = true;
    isSuperFood(gSuperFoodTrue)
    var ligthInterval = setInterval(displayLigth, 1000)
    setTimeout(() => {
      gPacman.isSuper = false
      document.querySelector('.super span').style.opacity = '100%';
      isSuperFood(gSuperFoodFalse)
      clearInterval(ligthInterval)
      createGohstAgain()
    }, 5000);
  }

  if (nextCell === GHOST) {
    if (gPacman.isSuper) {
      playSound('pacman_eatghost')
      removeGohst(nextLocation)
    } else {
      // rotateCell(nextCell.i,nextCell.j)
      renderCell(gPacman.location, PACMAN);
      gameOver()
      return;

    }
  }

  // Update the model to reflect movement
  gBoard[gPacman.location.i][gPacman.location.j] = EMPTY;
  // Update the DOM
  renderCell(gPacman.location, EMPTY);

  // Update the pacman MODEL to new location  
  gPacman.location = nextLocation;

  gBoard[gPacman.location.i][gPacman.location.j] = PACMAN;
  // Render updated model to the DOM
  renderCell(gPacman.location, PACMAN);

}

function getNextLocation(keyboardEvent) {
  var nextLocation = {
    i: gPacman.location.i,
    j: gPacman.location.j
  };


  switch (keyboardEvent.code) {
    case 'ArrowUp':
      nextLocation.i--;
      transform('-90', nextLocation)
      break;
    case 'ArrowDown':
      nextLocation.i++;
      transform('90', nextLocation)
      break;
    case 'ArrowLeft':
      nextLocation.j--;
      transform('180', nextLocation)
      break;
    case 'ArrowRight':
      nextLocation.j++;
      transform('0', nextLocation)
      break;
    default: return null;
  }
  return nextLocation;
}

function isSuperFood(element) {
  var elSuper = document.querySelector('.super span')
  elSuper.innerText = element;
  return element
}

function displayLigth() {
  var elSuper = document.querySelector('.super span')
  setTimeout(() => {
    elSuper.style.opacity = '100%'
  }, 500);
  elSuper.style.opacity = '0%';
}

function transform(rotate, nextLocation) {
  if (gBoard[nextLocation.i][nextLocation.j] === SUPERFOOD && gPacman.isSuper === true) return
  if (gBoard[nextLocation.i][nextLocation.j] === WALL) return
  var elPacman = document.querySelector(`.cell${nextLocation.i}-${nextLocation.j}`);
  elPacman.style.transform = 'rotate(' + rotate + 'deg)'
}