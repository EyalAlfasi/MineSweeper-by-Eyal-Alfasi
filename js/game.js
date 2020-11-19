'use strict'
const FLAG = '🚩';
const MINE = '💣';

var gLevel = {
    size: 4,
    mines: 2
};

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}

var gMines;
var gTimerIntervalId;
var gBoard;

function init() {
    gGame.isOn = true;
    gBoard = buildBoard();
    renderBoard();
}

function onCellClick(elCell, i, j) {
    if (!gGame.isOn) return;
    var currCell = gBoard[i][j];
    if (currCell.isMarked) return;
    if (currCell.isShown) return;
    if (currCell.isMine) {
        elCell.style.backgroundColor = 'rgb(248, 73, 73)';
        exposeMinesAndLose();
        return;
    }
    if (gGame.shownCount === 0) {
        setMinesRandomly(i, j);
        setMinesNegCount();
    }
    if (currCell.minesAroundCount === 0) {
        if (!checkForNegs({ i: i, j: j })) {
            expandNegs({ i: i, j: j });
            return;
        }
    }

    currCell.isShown = true;
    elCell.classList.add('shown');
    var currValue = (currCell.minesAroundCount === 0) ? '' : currCell.minesAroundCount;
    renderCell({ i: i, j: j }, currValue);
    gGame.shownCount++;

    console.log(gGame.shownCount);
    if (gGame.shownCount === 1) timer();
    else if (gGame.shownCount + gGame.markedCount === gLevel.size ** 2) gameOver(true);
}

function markCell(elCell, i, j) {
    if (!gGame.isOn) return;
    var currCell = gBoard[i][j];
    if (currCell.isShown) return;
    if (currCell.isMarked) {
        currCell.isMarked = false;
        gGame.markedCount--;
        renderCell({ i: i, j: j }, '');
    } else {
        currCell.isMarked = true;
        gGame.markedCount++;
        renderCell({ i: i, j: j }, FLAG);
    }
    elCell.classList.toggle('marked')
    if (gGame.shownCount + gGame.markedCount === gLevel.size ** 2) gameOver(true);
}

function gameOver(isVictory) {
    gGame.isOn = false;
    clearInterval(gTimerIntervalId);
    var elEmoji = document.querySelector('.emoji');
    elEmoji.innerText = (isVictory) ? '🥳' : '🥴';
}

function resetGame() {
    gGame.shownCount = 0;
    gGame.markedCount = 0;
    clearInterval(gTimerIntervalId);
    var elEmoji = document.querySelector('.emoji');
    elEmoji.innerText = '😀';
    var elTimer = document.querySelector('.timer span');
    elTimer.innerText = 0;
    init();
}

function changeLevel() {
    var elInputs = document.querySelectorAll('input');
    for (var i = 0; i < elInputs.length; i++) {
        if (elInputs[i].checked) {
            var currSize = elInputs[i].value;
            var currMines = elInputs[i].id;
        }
    }
    gLevel.size = +currSize;
    gLevel.mines = +currMines;
    resetGame();
}