'use strict'
const FLAG = '🚩';
const MINE = '💣';
const WIN = '😎';
const LOSE = '🤯';

var gLevel = {
    size: 4,
    mines: 2
};

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    lives: 3,
    secsPassed: 0
}

var gMines;
var gTimerIntervalId;
var gBoard;

function init() {
    gGame.isOn = true;
    gBoard = buildBoard();
    renderBoard();
    var elFlagsCounter = document.querySelector('.flags span');
    elFlagsCounter.innerText = gLevel.mines;
    var elBestScore = document.querySelector('.leaderboard p span')
    elBestScore.innerText = localStorage.getItem('Time');
}

function onCellClick(elCell, i, j) {
    if (!gGame.isOn) return;
    var currCell = gBoard[i][j];
    if (currCell.isMarked) return;
    if (currCell.isShown) return;
    if (currCell.isMine) {
        var elLivesCounter = document.querySelector('.lives span');
        if (gGame.lives === 1) {
            elCell.style.backgroundColor = 'rgb(248, 73, 73)';
            gGame.lives--;
            elLivesCounter.innerText = gGame.lives;
            exposeMinesAndLose();
        } else {
            renderCell({ i: i, j: j }, MINE);
            gGame.isOn = false;
            setTimeout(function () {
                renderCell({ i: i, j: j }, '');
                gGame.isOn = true;
                gGame.lives--;
                elLivesCounter.innerText = gGame.lives;
            }, 1000)
        }
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
    switch (currCell.minesAroundCount) {
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

    currCell.isShown = true;
    elCell.classList.add('shown');
    elCell.style.color = valueColor;
    var currValue = (currCell.minesAroundCount === 0) ? '' : currCell.minesAroundCount;
    renderCell({ i: i, j: j }, currValue);
    gGame.shownCount++;

    if (gGame.shownCount === 1) timer();
    else if (gGame.shownCount + gGame.markedCount === gLevel.size ** 2) gameOver(true);
}

function markCell(elCell, i, j) {
    // debugger
    if (!gGame.isOn) return;
    var currCell = gBoard[i][j];
    if (currCell.isShown) return;
    if (currCell.isMarked) {
        currCell.isMarked = false;
        gGame.markedCount--;
        renderCell({ i: i, j: j }, '');
        elCell.classList.remove('marked')
    } else {
        if (gLevel.mines - gGame.markedCount === 0) return;
        currCell.isMarked = true;
        gGame.markedCount++;
        renderCell({ i: i, j: j }, FLAG);
        elCell.classList.add('marked')
    }
    var elFlagsCounter = document.querySelector('.flags span');
    elFlagsCounter.innerText = `${gLevel.mines - gGame.markedCount}`;
    if (gGame.shownCount + gGame.markedCount === gLevel.size ** 2) gameOver(true);
}

function gameOver(isVictory) {
    gGame.isOn = false;
    clearInterval(gTimerIntervalId);
    var elEmoji = document.querySelector('.emoji');
    elEmoji.innerText = (isVictory) ? WIN : LOSE;
    setScoreLoacalStorage(isVictory);
}

function resetGame() {
    gGame.shownCount = 0;
    gGame.markedCount = 0;
    clearInterval(gTimerIntervalId);
    var elEmoji = document.querySelector('.emoji');
    elEmoji.innerText = '😀';
    var elTimer = document.querySelector('.timer span');
    elTimer.innerText = '0.00';
    init();
    gGame.lives = 3;
    var elLivesCounter = document.querySelector('.lives span');
    elLivesCounter.innerText = gGame.lives;
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

function setScoreLoacalStorage(isVictory) {
    if (!isVictory) return;
    var elTimer = document.querySelector('.timer span');
    var elBestScore = document.querySelector('.leaderboard p span')
    var time = elTimer.innerText;
    if (!localStorage.getItem('Time')) {
        localStorage.setItem('Time', `${time}`);
    } else if (+time < +localStorage.getItem('Time')) {
        localStorage.setItem('Time', `${time}`);
    }
    elBestScore.innerText = localStorage.getItem('Time');
}