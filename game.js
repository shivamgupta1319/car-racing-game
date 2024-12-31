let playerCar;
let gameContainer;
let score;
let gameLoop;
let isGameOver = false;
let obstacleSpeed = 5;
let obstacleInterval = 2000;
let difficultyLevel = 1;

document.addEventListener('DOMContentLoaded', () => {
    playerCar = document.getElementById('player-car');
    gameContainer = document.querySelector('.game-container');
    score = document.getElementById('score');
    startGame();
});

function startGame() {
    isGameOver = false;
    document.getElementById('game-over').classList.add('hide');
    playerCar.style.left = '50%';
    score.textContent = '0';
    clearInterval(gameLoop);
    removeObstacles();
    obstacleSpeed = 5;
    obstacleInterval = 2000;
    difficultyLevel = 1;
    gameLoop = setInterval(createObstacle, obstacleInterval);
}

function createObstacle() {
    const obstacle = document.createElement('div');
    obstacle.classList.add('obstacle');
    const carType = Math.floor(Math.random() * 3) + 1;
    obstacle.classList.add(`car${carType}`);
    obstacle.style.left = Math.random() * (gameContainer.offsetWidth - 50) + 'px';
    obstacle.style.top = '-80px';
    gameContainer.appendChild(obstacle);

    const movement = setInterval(() => {
        const top = parseInt(obstacle.style.top) || 0;
        if (top > gameContainer.offsetHeight) {
            clearInterval(movement);
            obstacle.remove();
            if (!isGameOver) {
                updateScore();
            }
        }
        obstacle.style.top = (top + obstacleSpeed) + 'px';
        checkCollision(obstacle);
    }, 20);
}

function removeObstacles() {
    const obstacles = document.querySelectorAll('.obstacle');
    obstacles.forEach(obstacle => obstacle.remove());
}

function updateScore() {
    const currentScore = parseInt(score.textContent) + 1;
    score.textContent = currentScore;

    if (currentScore % 5 === 0) {
        increaseDifficulty();
    }
}

function increaseDifficulty() {
    difficultyLevel++;
    obstacleSpeed = Math.min(5 + difficultyLevel, 15);
    obstacleInterval = Math.max(2000 - (difficultyLevel * 200), 800);
    clearInterval(gameLoop);
    gameLoop = setInterval(createObstacle, obstacleInterval);
}

function checkCollision(obstacle) {
    const playerRect = playerCar.getBoundingClientRect();
    const obstacleRect = obstacle.getBoundingClientRect();

    if (!(playerRect.right < obstacleRect.left ||
        playerRect.left > obstacleRect.right ||
        playerRect.bottom < obstacleRect.top ||
        playerRect.top > obstacleRect.bottom)) {
        gameOver();
    }
}

function gameOver() {
    isGameOver = true;
    clearInterval(gameLoop);
    document.getElementById('game-over').classList.remove('hide');
}

document.addEventListener('keydown', (e) => {
    if (isGameOver) return;

    const left = playerCar.offsetLeft;
    const step = 40;

    switch (e.key) {
        case 'ArrowLeft':
            if (left > step) {
                playerCar.style.left = (left - step) + 'px';
            }
            break;
        case 'ArrowRight':
            if (left < gameContainer.offsetWidth - playerCar.offsetWidth - step) {
                playerCar.style.left = (left + step) + 'px';
            }
            break;
    }
});
