'use strict'

function setMinesRandomly(iExclude, jExclude) {
    gMines = [];
    var cells = getCellsForMines(iExclude, jExclude);
    for (var i = 0; i < gLevel.mines; i++) {
        var currCellIdx = getRandomInt(0, cells.length);
        var currCell = cells[currCellIdx];
        gBoard[currCell.i][currCell.j].isMine = true;
        gMines.push(currCell);
        cells.splice(currCellIdx, 1);
    }
}

function setMinesNegCount() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            updateNegsCount({ i: i, j: j });
        }
    }
}

function updateNegsCount(pos) {
    for (var i = pos.i - 1; i <= pos.i + 1; i++) {
        if (i < 0 || i > gBoard.length - 1) continue
        for (var j = pos.j - 1; j <= pos.j + 1; j++) {
            if (j < 0 || j > gBoard[0].length - 1) continue
            if (i === pos.i && j === pos.j) continue
            if (gBoard[i][j].isMine) gBoard[pos.i][pos.j].minesAroundCount++;
        }
    }
}


function exposeMinesAndLose() {
    for (var i = 0; i < gMines.length; i++) {
        var iMine = gMines[i].i;
        var jMine = gMines[i].j;
        renderCell({ i: iMine, j: jMine }, MINE);
    }
    gMines = [];
    gameOver(false);
}


function checkForNegs(pos) {
    for (var i = pos.i - 1; i <= pos.i + 1; i++) {
        if (i < 0 || i > gBoard.length - 1) continue
        for (var j = pos.j - 1; j <= pos.j + 1; j++) {
            if (j < 0 || j > gBoard[0].length - 1) continue
            if (i === pos.i && j === pos.j) continue
            if (gBoard[i][j].isMine) return true;
        }
    }
    return false;
}


function expandNegs(pos) {
    // debugger
    for (var i = pos.i - 1; i <= pos.i + 1; i++) {
        if (i < 0 || i > gBoard.length - 1) continue
        for (var j = pos.j - 1; j <= pos.j + 1; j++) {
            if (j < 0 || j > gBoard[0].length - 1) continue
            var currNeg = gBoard[i][j];
            if (currNeg.isShown) continue;
            var currNegClass = getClassName({ i: i, j: j });
            var elNeg = document.querySelector(`.${currNegClass}`);
            switch (currNeg.minesAroundCount) {
                case 1:
                    var valueColor = '#0b4cad';
                    break;
                case 2:
                    var valueColor = '#3ead0b';
                    break;
                case 3:
                    var valueColor = '#d11c1c';
                    break;
            }
            elNeg.classList.add('shown');
            elNeg.style.color = valueColor;
            var value = (currNeg.minesAroundCount === 0) ? '' : currNeg.minesAroundCount;
            currNeg.isShown = true;
            renderCell({ i: i, j: j }, value);
            gGame.shownCount++;
            if (gGame.shownCount === 1) timer();
        }
    }
}