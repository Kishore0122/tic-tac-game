class TicTacToe {
    constructor() {
        this.board = Array(9).fill('');
        this.currentPlayer = 'X';
        this.gameActive = true;
        this.gameMode = 'multiplayer'; // 'multiplayer' or 'ai'
        this.difficulty = 'easy';
        this.winningCombinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6] // Diagonals
        ];

        this.initializeGame();
    }

    initializeGame() {
        this.cells = document.querySelectorAll('.cell');
        this.statusDisplay = document.getElementById('status');
        this.restartButton = document.getElementById('restartButton');
        this.multiplayerButton = document.getElementById('multiplayerButton');
        this.aiButton = document.getElementById('aiButton');
        this.difficultySelect = document.getElementById('difficultySelect');

        this.setupEventListeners();
        this.updateStatus();
    }

    setupEventListeners() {
        this.cells.forEach(cell => {
            cell.addEventListener('click', () => this.handleCellClick(cell));
        });

        this.restartButton.addEventListener('click', () => this.restartGame());
        this.multiplayerButton.addEventListener('click', () => this.setGameMode('multiplayer'));
        this.aiButton.addEventListener('click', () => this.setGameMode('ai'));
        this.difficultySelect.addEventListener('change', (e) => {
            this.difficulty = e.target.value;
            this.restartGame();
        });
    }

    handleCellClick(cell) {
        const index = cell.dataset.index;
        
        if (this.board[index] || !this.gameActive) return;

        this.makeMove(index);

        if (this.gameMode === 'ai' && this.gameActive) {
            setTimeout(() => this.makeAIMove(), 500);
        }
    }

    makeMove(index) {
        this.board[index] = this.currentPlayer;
        this.cells[index].textContent = this.currentPlayer;
        this.cells[index].classList.add(this.currentPlayer.toLowerCase());

        if (this.checkWin()) {
            this.gameActive = false;
            this.statusDisplay.textContent = `Player ${this.currentPlayer} wins!`;
            return;
        }

        if (this.checkDraw()) {
            this.gameActive = false;
            this.statusDisplay.textContent = "Game ended in a draw!";
            return;
        }

        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
        this.updateStatus();
    }

    makeAIMove() {
        let moveIndex;

        switch (this.difficulty) {
            case 'hard':
                moveIndex = this.findBestMove();
                break;
            case 'medium':
                moveIndex = Math.random() < 0.7 ? 
                    this.findBestMove() : 
                    this.getRandomEmptyCell();
                break;
            default: // easy
                moveIndex = this.getRandomEmptyCell();
        }

        if (moveIndex !== null) {
            this.makeMove(moveIndex);
        }
    }

    findBestMove() {
        let bestScore = -Infinity;
        let bestMove = null;

        for (let i = 0; i < 9; i++) {
            if (!this.board[i]) {
                this.board[i] = 'O';
                let score = this.minimax(this.board, 0, false);
                this.board[i] = '';
                if (score > bestScore) {
                    bestScore = score;
                    bestMove = i;
                }
            }
        }
        return bestMove;
    }

    minimax(board, depth, isMaximizing) {
        let result = this.checkWinningCondition();
        if (result !== null) {
            return result === 'O' ? 10 - depth : depth - 10;
        }
        if (!board.includes('')) return 0;

        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < 9; i++) {
                if (!board[i]) {
                    board[i] = 'O';
                    let score = this.minimax(board, depth + 1, false);
                    board[i] = '';
                    bestScore = Math.max(score, bestScore);
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < 9; i++) {
                if (!board[i]) {
                    board[i] = 'X';
                    let score = this.minimax(board, depth + 1, true);
                    board[i] = '';
                    bestScore = Math.min(score, bestScore);
                }
            }
            return bestScore;
        }
    }

    getRandomEmptyCell() {
        const emptyCells = this.board
            .map((cell, index) => cell === '' ? index : null)
            .filter(index => index !== null);
        
        return emptyCells.length > 0 ? 
            emptyCells[Math.floor(Math.random() * emptyCells.length)] : 
            null;
    }

    checkWin() {
        return this.winningCombinations.some(combination => {
            return combination.every(index => {
                return this.board[index] === this.currentPlayer;
            });
        });
    }

    checkWinningCondition() {
        for (let combination of this.winningCombinations) {
            const [a, b, c] = combination;
            if (this.board[a] && this.board[a] === this.board[b] && this.board[a] === this.board[c]) {
                return this.board[a];
            }
        }
        return null;
    }

    checkDraw() {
        return !this.board.includes('');
    }

    updateStatus() {
        this.statusDisplay.textContent = `Player ${this.currentPlayer}'s turn`;
    }

    setGameMode(mode) {
        this.gameMode = mode;
        this.difficultySelect.style.display = mode === 'ai' ? 'block' : 'none';
        this.restartGame();
    }

    restartGame() {
        this.board = Array(9).fill('');
        this.currentPlayer = 'X';
        this.gameActive = true;
        this.cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('x', 'o');
        });
        this.updateStatus();
    }
}

// Initialize the game
document.addEventListener('DOMContentLoaded', () => {
    new TicTacToe();
});