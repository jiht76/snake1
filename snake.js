// snake.js
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const box = 20;
const canvasSize = 400;
let snake = [{ x: 8 * box, y: 10 * box }];
let direction = 'RIGHT';
let food = randomPosition();
let score = 0;
let gameInterval;
let isGameOver = false;

const scoreDiv = document.getElementById('score');
const restartBtn = document.getElementById('restartBtn');

function randomPosition() {
    return {
        x: Math.floor(Math.random() * (canvasSize / box)) * box,
        y: Math.floor(Math.random() * (canvasSize / box)) * box
    };
}

function drawSnake() {
    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = i === 0 ? '#ff6f91' : '#f9f871';
        ctx.shadowColor = i === 0 ? '#ff6f91' : '#f9f871';
        ctx.shadowBlur = i === 0 ? 10 : 0;
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
        ctx.strokeStyle = '#fff';
        ctx.strokeRect(snake[i].x, snake[i].y, box, box);
        ctx.shadowBlur = 0;
    }
}

function drawFood() {
    ctx.beginPath();
    ctx.arc(food.x + box / 2, food.y + box / 2, box / 2 - 2, 0, 2 * Math.PI);
    ctx.fillStyle = '#6a89cc';
    ctx.shadowColor = '#6a89cc';
    ctx.shadowBlur = 10;
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.closePath();
}

function draw() {
    ctx.clearRect(0, 0, canvasSize, canvasSize);
    drawSnake();
    drawFood();
}

function moveSnake() {
    let head = { ...snake[0] };
    if (direction === 'LEFT') head.x -= box;
    if (direction === 'UP') head.y -= box;
    if (direction === 'RIGHT') head.x += box;
    if (direction === 'DOWN') head.y += box;

    // Colisión con paredes
    if (
        head.x < 0 || head.x >= canvasSize ||
        head.y < 0 || head.y >= canvasSize
    ) {
        gameOver();
        return;
    }

    // Colisión con sí mismo
    for (let i = 0; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            gameOver();
            return;
        }
    }

    // Comer comida
    if (head.x === food.x && head.y === food.y) {
        snake.unshift(head);
        score++;
        scoreDiv.textContent = `Puntaje: ${score}`;
        food = randomPosition();
    } else {
        snake.pop();
        snake.unshift(head);
    }
}

function gameLoop() {
    if (!isGameOver) {
        moveSnake();
        draw();
    }
}

function gameOver() {
    clearInterval(gameInterval);
    isGameOver = true;
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.fillRect(0, canvasSize / 2 - 40, canvasSize, 80);
    ctx.font = 'bold 32px Segoe UI';
    ctx.fillStyle = '#ff6f91';
    ctx.textAlign = 'center';
    ctx.fillText('¡Game Over!', canvasSize / 2, canvasSize / 2);
    ctx.font = '20px Segoe UI';
    ctx.fillStyle = '#333';
    ctx.fillText(`Puntaje final: ${score}`, canvasSize / 2, canvasSize / 2 + 30);
    restartBtn.style.display = 'block';
}

function restartGame() {
    snake = [{ x: 8 * box, y: 10 * box }];
    direction = 'RIGHT';
    food = randomPosition();
    score = 0;
    isGameOver = false;
    scoreDiv.textContent = 'Puntaje: 0';
    restartBtn.style.display = 'none';
    draw();
    clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, 100);
}

document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft' && direction !== 'RIGHT') direction = 'LEFT';
    if (e.key === 'ArrowUp' && direction !== 'DOWN') direction = 'UP';
    if (e.key === 'ArrowRight' && direction !== 'LEFT') direction = 'RIGHT';
    if (e.key === 'ArrowDown' && direction !== 'UP') direction = 'DOWN';
});

restartBtn.addEventListener('click', restartGame);

draw();
gameInterval = setInterval(gameLoop, 100);
