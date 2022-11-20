const game = (() => {
    const handleForm = (() => {
        var introForm = document.querySelector('form');
        document.onkeydown = (e) => {
            if(e.key === 'Enter' && document.querySelector('input:checked')) {
                var playersChoice = document.querySelector('input:checked').value;
                console.log(playersChoice);
                document.onkeydown = null;
                document.querySelector('.game-container').style.display = 'grid';
                document.querySelector('.modal-backdrop').style.display = 'none';
            }
        }
    })();
    var winner = false;
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
        let squareIndex = squareElement.dataset.index;
        gameBoard.boardArray[squareIndex] = (gameBoard.xIsNext) ? 'X':'O';
        gameBoard.displayController();
        gameBoard.xIsNext = !(gameBoard.xIsNext);
        squareElement.removeAttribute('onclick');
        var result = checkForWin();
        if (result && !(winner)) {
            document.querySelector('.player-info').textContent = result;
            winner = true;
            let squares = document.querySelectorAll('.square[onclick]');
            for (let i = 0; i < squares.length; i++) {
                squares[i].removeAttribute('onclick');
            }
        }
    }
    return {handleClick};
})();

const gameBoard = (() => {
    //var gameBoard = ['X','O','','O','O','X','X','X',''];//dummy game board
    var xIsNext = true;
    var gameBoardContainer = document.querySelector('.game-container');
    for (let i = 0; i < 9; i++) {
        let square = document.createElement('div');
        square.className = 'square';
        square.dataset.index = i;
        gameBoardContainer.append(square);
        square.setAttribute('onclick','game.handleClick(this)');
    }
    var boardArray = Array(9).fill('');
    const displayController = () => {
        var squareElements = document.getElementsByClassName('square');
        for (let i=0; i<9; i++) {
            squareElements[i].textContent = boardArray[i];
        }
    }
    return {boardArray,xIsNext,displayController};
})();