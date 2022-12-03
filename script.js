const gameBoard = () => {
    //var board = ['X','O','','O','O','X','X','X',''];//dummy game board
    let board = [];

    const cell = () => {
        var cellMarker = '';
        const addMarker = (marker) => { cellMarker = marker }
        const getMarker = () => cellMarker;
        return {addMarker, getMarker};
    }
    for (let i=0; i<9; i++) {
        board.push(cell());
    }

    const getBoard = () => board;

    const setMarker = (index,marker) => {
        board[index].addMarker(marker);
    }

    const logBoard = () => {
        console.log(board.map(obj => obj.getMarker()));
    }

    return {getBoard, setMarker, logBoard};
}

const gameController = (gameType) => {
    const board = gameBoard();

    const players = [
        {name: (gameType === 'pvp') ? 'PlayerOne':'Player', marker: 'O'},
        {name: (gameType === 'pvp') ? 'PlayerTwo':'Computer', marker: 'X'}
    ]
    let activePlayer = players[0];

    const switchPlayerTurn = () => {
        activePlayer = (activePlayer === players[0]) ? players[1] : players[0];
    }
    const getActivePlayer = () => activePlayer;

    const logNewRound = () => {
        board.logBoard();
        console.log(`${activePlayer.name}'s turn ...`);
    }

    const checkForWin = () => {
        const markers = board.getBoard().map(obj => obj.getMarker());
        const playerOfMarker = (marker) => {
            const player = players.filter(obj => obj.marker === marker);
            return player[0];
        }
        const lines = [
            [0, 1, 2],[3, 4, 5],[6, 7, 8],[0, 3, 6],[1, 4, 7],
            [2, 5, 8],[0, 4, 8],[2, 4, 6]
          ];
          for (let i = 0; i < lines.length; i++) {
            const [a, b, c] = lines[i];
            if (markers[a] && markers[a] === markers[b] && markers[a] === markers[c]) {
              return playerOfMarker(markers[a]);
            }
          }
          return null;
    }
    const getWinner = () => checkForWin();

    const checkForTie = () => {
        const boardIsFull = board.getBoard().every(obj => obj.getMarker() != '');
        if (boardIsFull && !checkForWin()) {
            return true;
        }
    }

    const computerPlaysRound = () => {
        const getRandomMove = () => {
            const emptyCellIndices = [];
            board.getBoard().forEach((obj,index) => {
                if (obj.getMarker() === '') emptyCellIndices.push(index);
            })
            const randomIndex = Math.floor(Math.random() * emptyCellIndices.length);
            console.log(emptyCellIndices);
            console.log(randomIndex);
            return emptyCellIndices[randomIndex];
        }
        playRound(getRandomMove());
    }

    const playRound = (index) => {
        board.setMarker(index,activePlayer.marker);
        if (checkForWin()) return;
        if (checkForTie()) return;
        switchPlayerTurn();
        logNewRound();
        if (gameType === 'pvc' && activePlayer.name === 'Computer') computerPlaysRound();
    }
    logNewRound();

    return {getActivePlayer, playRound, getBoard: board.getBoard(), getWinner, checkForTie};
}

const screenController = ((gameType) => {
    let game;
    const gameOptionsDiv = document.querySelector('.options');
    gameOptionsDiv.addEventListener('dblclick',(e) => {
        console.log('double click event');
        const gameType = e.target.value;
        if (!gameType) return;
        document.querySelector('.container').style.display = 'grid';
        document.querySelector('.modal-backdrop').style.display = 'none';
        game = gameController(gameType);
        updateScreen();
    })

    const turnInfo = document.querySelector('.turn-info');
    const boardDiv = document.querySelector('.board');

    const updateScreen = () => {
        boardDiv.textContent = '';
        // get the newest version of the board and player turn
        const board = game.getBoard;
        const activePlayer = game.getActivePlayer();
        const winner = game.getWinner();
        const isTie = game.checkForTie();

        //Update player turn info
        turnInfo.textContent = `${activePlayer.name}'s turn (${activePlayer.marker}) ...`;
        //Update winner if game over
        if (winner) turnInfo.textContent = `${winner.name} wins !!!`;
        //Check for tie/draw and update turn info
        if (isTie) turnInfo.textContent = `It's a TIE, play again !`;

        //Render board squares
        board.forEach((obj, index) => {
            //the above 'index' argument refers to index of 'obj' in the array
            //check MDN 'forEach' to learn about multiple arguments
            const cellButton = document.createElement('button');
            cellButton.classList.add('square');
            //Set data-index attribute only for empty cells/squares
            if (!obj.getMarker()) cellButton.dataset.index = index;
            cellButton.textContent = obj.getMarker();
            boardDiv.appendChild(cellButton);
        })
    }

    //Add click handler for board
    const clickHandlerBoard = (event) => {
        const index = event.target.dataset.index;
        //Make sure index is not undefined
        if (!index || game.getWinner()) return;
        game.playRound(index);
        event.target.removeAttribute('data-index');
        updateScreen();
    }
    boardDiv.addEventListener('click',(e) => clickHandlerBoard(e));

    //Add click event for the restart button
    const restartButton = document.querySelector('.restart');
    restartButton.addEventListener('click',() => {
        window.location.reload();
    })
})();