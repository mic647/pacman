// const GHOST = '&#128123;';
const GHOST = '<div class="ghosts"><div class="arm-right"></div><div class="arm-left"></div><div class="eye-l"></div><div class="eye-r"></div><div class="mouth"></div><div class="tri-1"></div><div class="tri-2"></div><div class="tri-3"></div></div>';

var gIntervalGhosts;
var gGhosts;
var gNumOfGhosts = 3;


function createGhost(board) {
    var ghost = {
        location: {
            i: 4,
            j: 2
        },
        currCellContent: FOOD
    };
    gGhosts.push(ghost);
    board[ghost.location.i][ghost.location.j] = GHOST;
}


function createGhosts(board) {
    gGhosts = [];
    // empty the gGhosts array, create some ghosts
    for (var i = 0; i < gNumOfGhosts; i++) {
        createGhost(board);
        getMoveDiff();
    }
    // and run the interval to move them
    gIntervalGhosts = setInterval(moveGhosts, 3000)
}

function moveGhosts() {
    for (var i = 0; i < gGhosts.length; i++) {
        var ghost = gGhosts[i];

        // Create the moveDiff
        var moveDiff = getMoveDiff();
        var nextLocation =
        {
            i: ghost.location.i + moveDiff.i,
            j: ghost.location.j + moveDiff.j
        }
        // console.log('ghost.location', ghost.location, 'nextLocation', nextLocation, 'moveDiff', moveDiff)
        rotateCell(nextLocation.i, nextLocation.j)
        var nextCel = gBoard[nextLocation.i][nextLocation.j]
        // if WALL - give up
        if (nextCel === WALL) return
        // if GHOST - give up
        if (nextCel === GHOST) {
            return
        }

        // if PACMAN - gameOver

        if (nextCel === PACMAN) {
            if (!gPacman.isSuper) {
                renderCell(ghost.location, GHOST)
                gameOver()
                return
            } else {
                var intervalForSuper = setInterval(moveGhosts, 500)
                setTimeout(() => {
                    clearInterval(intervalForSuper)
                }, 4000);
                return
            }
        }

        // set back what we stepped on: update Model, DOM
        gBoard[ghost.location.i][ghost.location.j] = ghost.currCellContent
        renderCell(ghost.location, ghost.currCellContent)

        // move the ghost
        ghost.location = nextLocation

        // keep the contnet of the cell we are going to
        ghost.currCellContent = gBoard[nextLocation.i][nextLocation.j]

        // move the ghost and update model and dom
        gBoard[ghost.location.i][ghost.location.j] = GHOST
        renderCell(ghost.location, getGhostHTML(ghost))

    }
}
function getMoveDiff() {
    var randNum = getRandomIntInclusive(0, 100)
    if (randNum < 25) {
        return { i: 0, j: 1 }
        return
    } else if (randNum < 50) {
        return { i: -1, j: 0 }
    } else if (randNum < 75) {
        return { i: 0, j: -1 }
    } else {
        return { i: 1, j: 0 }
    }
}


function getGhostHTML(ghost) {
    return `<span class="ghosts" style="background-color:${gPacman.isSuper ? 'red' : getRandomColor()};">${GHOST}</span>`
}

function removeGohst(location) {
    for (var i = 0; i < gGhosts.length; i++) {
        if (gGhosts[i].location.i === location.i && gGhosts[i].location.j === location.j) {
            if (gGhosts[i].currCellContent === FOOD) {
                gScore++;
                updateScore(1);
            }
            gGhosts.splice(i, 1)
        }
    }
}

function createGohstAgain() {
    for (var i = gGhosts.length; i < 3; i++) {
        createGhost(gBoard)
        getMoveDiff();
        gGhosts[i].currCellContent = EMPTY;
    }
}




