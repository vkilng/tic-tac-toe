const gameBoard = (() => {
    //var gameBoard = ['X','O','','O','O','X','X','X',''];//dummy game board
    var xIsNext = true;
    for (let i=0; i<9; i++) {
        var square = document.createElement('div');
        square.className = 'square';
        square.dataset.index = i;
        document.getElementsByClassName('game-container')[0].append(square);
        square.setAttribute('onclick','playTurn(this)');
    }
    var boardArray = Array(9).fill('');
    return {boardArray,xIsNext};
})();

const displayController = () => {
    var squareElements = document.getElementsByClassName('square');
    for (let i=0; i<9; i++) {
        squareElements[i].textContent = gameBoard.boardArray[i];
    }
}

const playTurn = (squareElement) => {
    var indexOfSquare = squareElement.dataset.index;
    gameBoard.boardArray[indexOfSquare] = (gameBoard.xIsNext) ? 'X':'O';
    displayController();
    gameBoard.xIsNext = !gameBoard.xIsNext;
    squareElement.removeAttribute('onclick');
    console.log(gameBoard.boardArray);
}