const handleForm = (() => {
    var introForm = document.querySelector('form');
    document.onkeydown = (e) => {
        if(e.key === 'Enter' && document.querySelector('input:checked')) {
            var playersChoice = document.querySelector('input:checked').value;
            if (playersChoice === 'pvc') {
                document.querySelector('.player-info').textContent = 'Your turn';
            }
            document.onkeydown = null;
            document.querySelector('.container').style.display = 'grid';
            document.querySelector('.modal-backdrop').style.display = 'none';
            handleForm.playersChoice = playersChoice;
        }
    }
    return {playersChoice:''};
})();
const game = (() => {
    const restart = () => {
        window.location.reload();
    }
    const checkForWin = () => {
        var winConditions =[
            [0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]
        ];
        var markers = gameBoard.boardArray;
        for (let i = 0; i < winConditions.length; i++) {
            let [a, b, c] = winConditions[i];
            if (markers[a] && markers[a] === markers[b] && markers[a] === markers[c]) {
              return markers[a];
            }
        }
        return null;
    }
    const handleClick = (squareElement) => {
        var playerInfoSpan = document.querySelector('.player-info span');
        if (handleForm.playersChoice === 'pvp') {
            playerInfoSpan.textContent = (gameBoard.xIsNext) ? '2 (O)':'1 (X)';
        }
        let squareIndex = squareElement.dataset.index;
        gameBoard.boardArray[squareIndex] = (gameBoard.xIsNext) ? 'X':'O';
        gameBoard.displayController();
        gameBoard.xIsNext = !(gameBoard.xIsNext);
        squareElement.removeAttribute('onclick');
        var playerInfo = document.querySelector('.player-info');
        var result = checkForWin();
        if (result) {
            playerInfo.textContent = 'Winner: ';
            if (result === 'X') {
                if (handleForm.playersChoice === 'pvp') {
                    playerInfo.textContent += 'Player 1 (X)';
                } else {
                    playerInfo.textContent += 'You (X)';
                }
            } else {
                if (handleForm.playersChoice === 'pvp') {
                    playerInfo.textContent += 'Player 2 (O)';
                } else {
                    playerInfo.textContent += 'Compter (O)';
                }
            }
            let squares = document.querySelectorAll('.square[onclick]');
            for (let i = 0; i < squares.length; i++) {
                squares[i].removeAttribute('onclick');
            }
        } else if (!(document.querySelector('.square[onclick]'))) {
            playerInfo.textContent = 'It\'s a TIE';
        }
        if (!(gameBoard.xIsNext) && handleForm.playersChoice === 'pvc' && !(result)) {
            setTimeout(() => computerRandomMove(), 200);
        }
    }
    const computerRandomMove = () => {
        var randomLegalMove = () => {
            var randomSquareIndex = Math.floor(Math.random()*9);
            if (gameBoard.boardArray[randomSquareIndex]) {
                return randomLegalMove();
            } else {
                return randomSquareIndex;
            }
        }
        var randomSquareIndex = randomLegalMove();
        var randomSquareSelector = '.square[data-index="'+randomSquareIndex+'"]';
        var randomSquare = document.querySelector(randomSquareSelector);
        handleClick(randomSquare);
    }
    return {restart,handleClick};
})();

const gameBoard = (() => {
    //var gameBoard = ['X','O','','O','O','X','X','X',''];//dummy game board
    var xIsNext = true;
    var gameBoardContainer = document.querySelector('.game-board');
    for (let i = 0; i < 9; i++) {
        let square = document.createElement('div');
        square.className = 'square';
        square.dataset.index = i;
        gameBoardContainer.append(square);
        square.setAttribute('onclick','game.handleClick(this)');
    }
    var boardArray = Array(9).fill(null);
    const displayController = () => {
        var squareElements = document.getElementsByClassName('square');
        for (let i=0; i<9; i++) {
            squareElements[i].textContent = boardArray[i];
        }
    }
    return {boardArray,xIsNext,displayController};
})();