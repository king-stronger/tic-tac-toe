// Factory function to create a display instance
const display = (game) => {
    const updateSquare = (squarePosition, value) => {
        const square = game.querySelector(`button[data-square='${squarePosition}']`);
        square.textContent = value;
    };

    const updateComment = (comment) => {
        game.querySelector('.comments > p').textContent = comment;
    };

    const updateScore = (firstPlayer = null, secondPlayer = null) => {
        if (firstPlayer) {
            game.querySelector('.players .first-player').innerHTML = `
                <p class="player-name">${firstPlayer.getName()}</p>
                <p class="player-score">${firstPlayer.getScore()}</p>
            `;
        }

        if (secondPlayer) {
            game.querySelector('.players .second-player').innerHTML = `
                <p class="player-name">${secondPlayer.getName()}</p>
                <p class="player-score">${secondPlayer.getScore()}</p>
            `;
        }
    };

    const resetBoard = () => {
        game.querySelectorAll("button[data-square]").forEach(square => {
            square.textContent = "";
        });

        game.querySelector('.comments > p').textContent = "";
    };

    const startGame = (firstPlayer, secondPlayer) => {
        resetBoard();
        updateScore(firstPlayer, secondPlayer);
        game.querySelector('.start').textContent = "Restart";
    };

    return { updateSquare, updateComment, updateScore, resetBoard, startGame };
};

// Factory function to create a player instance
const createPlayer = (name, marker) => {
    let score = 0;

    const getName = () => name;
    const getMarker = () => marker;
    const getScore = () => score;
    const incrementScore = () => score++;

    return { getName, getMarker, getScore, incrementScore };
};

const gameboard = (() => {
    const gameUi = document.querySelector('.game');
    const displayInstance = display(gameUi);

    let board = new Array(9).fill(null);
    const winPossibilities = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    const save = (marker, position) => {
        if (!board[position]) {
            board[position] = marker;
            displayInstance.updateSquare(position, marker);
            return true;
        }
        return false;
    };

    const check = () => {
        for (const [a, b, c] of winPossibilities) {
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return { status: true, marker: board[a] };
            }
        }
        return false;
    };

    const reset = () => {
        board.fill(null);
        displayInstance.resetBoard();
    };

    return { save, check, reset };
})();

const game = (() => {
    const gameUi = document.querySelector('.game');
    const displayInstance = display(gameUi);
    let firstPlayer, secondPlayer, currentPlayer, turn = 0;

    const chooseMarker = (existingMarker = null) => {
        let marker;
        if(existingMarker){
            return firstPlayer.getMarker() === "X" ? "O" : "X";
        }

        do {
            marker = prompt("Choose a marker X or O");
        } while(marker !== "X" && marker !== "O");

        return marker;
    };

    const chooseName = (isSecondPlayer = false) => {
        let name;
        do {
            name = prompt(`The ${isSecondPlayer ? 'second' : 'first'} player should write his name:`);
        } while (!name);
        return name;
    };

    const chooseSide = (isSecondPlayer = false) => {
        return createPlayer(chooseName(isSecondPlayer), chooseMarker(isSecondPlayer));
    };

    const resetRound = () => {
        gameboard.reset();
        turn = 0;
        currentPlayer = firstPlayer;
        displayInstance.updateComment('');
    };

    const playRound = (position) => {
        if (turn < 9) {
            if (gameboard.save(currentPlayer.getMarker(), parseInt(position))) {
                const roundStatus = gameboard.check();

                if (roundStatus) {
                    displayInstance.updateComment(`${currentPlayer.getName()} has won`);
                    currentPlayer.incrementScore();
                    displayInstance.updateScore(firstPlayer, secondPlayer);
                    return;
                }

                turn++;
                currentPlayer = currentPlayer === firstPlayer ? secondPlayer : firstPlayer;
            }
        } else {
            displayInstance.updateComment("It's a draw");
            displayInstance.updateScore(firstPlayer, secondPlayer);
            resetRound();
        }
    };

    const start = () => {
        firstPlayer = chooseSide(false);
        secondPlayer = chooseSide(true);
        currentPlayer = firstPlayer;
        resetRound();
        displayInstance.startGame(firstPlayer, secondPlayer);
    };

    const replay = () => {
        resetRound();
    };

    return { start, playRound, replay };
})();

const startButton = document.querySelector(".start");
const replayButton = document.querySelector(".replay");
const squareButtons = document.querySelectorAll("button[data-square]");
let gameStarted = false;

startButton.addEventListener("click", () => {
    gameStarted = true;
    game.start();
});

replayButton.addEventListener("click", () => {
    if (gameStarted) {
        game.replay();
    }
});

squareButtons.forEach(square => {
    square.addEventListener("click", () => {
        if (gameStarted) {
            game.playRound(square.getAttribute("data-square"));
        } else {
            gameStarted = true;
            game.start();
            game.playRound(square.getAttribute("data-square"));
        }

        if(square.textContent == "X"){
            square.classList.add("x-button");
        } else {
            square.classList.remove("x-button");
        }
    });
});
