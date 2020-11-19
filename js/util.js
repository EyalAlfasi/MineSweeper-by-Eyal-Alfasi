'use strict'

function buildBoard() {
    var board = [];
    for (var i = 0; i < gLevel.size; i++) {
        board.push([]);
        for (var j = 0; j < gLevel.size; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            };
        }
    }
    return board;
}

function renderBoard() {
    var strHTML = '<tbody>';
    for (var i = 0; i < gBoard.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < gBoard[0].length; j++) {
            var className = `cell cell${i}-${j}`;
            strHTML += `<td oncontextmenu="markCell(this, ${i}, ${j})" 
            onclick="onCellClick(this, ${i}, ${j})" class=" ${className}"> </td>`
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody>';
    var elContainer = document.querySelector('.board-container table');
    elContainer.innerHTML = strHTML;
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

function clearNegsCount() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            gBoard[i][j].minesAroundCount = 0;
        }
    }
}


function renderCell(location, value) {
    var elCell = document.querySelector(`.cell${location.i}-${location.j}`);
    elCell.innerHTML = value;
}

function getClassName(location) {
    var cellClass = `cell${location.i}-${location.j}`;
    return cellClass;
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

function getCellsForMines(iExclude, jExclude) {
    var res = [];
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (i === iExclude && j === jExclude) continue
            res.push({ i: i, j: j });
        }
    }
    return res;
}

function timer() {
    var currTime = Date.now();
    var elTimer = document.querySelector('.timer span');
    gTimerIntervalId = setInterval(function () {
        var timePassed = Date.now() - currTime;
        elTimer.innerText = (timePassed / 1000).toFixed(2);
    }, 100)
}