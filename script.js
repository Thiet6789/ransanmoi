const gameContainer = document.getElementById('game-container');
const snakeElement = document.getElementById('snake');
const foodElement = document.getElementById('food');
const scoreValueElement = document.getElementById('score-value');

let snake = [{ x: 10, y: 10 }];
let foodX = 15;
let foodY = 15;
let gridSize = 20;
let dx = 0;
let dy = 0;
let speed = 150;
let gameOver = false;
let currentSnakeImage = 'dau.jpg'; // Hình ảnh mặc định của đầu con rắn
let hasEaten = false; // Biến để kiểm tra xem con rắn đã ăn quả táo chưa
let score = 0;

// Thêm sự kiện cảm ứng
document.addEventListener('touchstart', handleTouchStart, false);        
document.addEventListener('touchmove', handleTouchMove, false);

var xDown = null;                                                        
var yDown = null;

function handleTouchStart(evt) {                                         
    xDown = evt.touches[0].clientX;                                      
    yDown = evt.touches[0].clientY;                                      
};                                                

function handleTouchMove(evt) {
    if (!xDown || !yDown) {
        return;
    }

    var xUp = evt.touches[0].clientX;                                    
    var yUp = evt.touches[0].clientY;

    var xDiff = xDown - xUp;
    var yDiff = yDown - yUp;

    if (Math.abs(xDiff) > Math.abs(yDiff)) {
        if (xDiff > 0) {
            /* left swipe */ 
            if (dx === 0) {
                dx = -1;
                dy = 0;
            }
        } else {
            /* right swipe */
            if (dx === 0) {
                dx = 1;
                dy = 0;
            }
        }                       
    } else {
        if (yDiff > 0) {
            /* up swipe */ 
            if (dy === 0) {
                dx = 0;
                dy = -1;
            }
        } else { 
            /* down swipe */
            if (dy === 0) {
                dx = 0;
                dy = 1;
            }
        }                                                                 
    }
    /* reset values */
    xDown = null;
    yDown = null;                                             
};

function main() {
    if (gameOver) return;

    setTimeout(function onTick() {
        clearCanvas();
        moveSnake();
        drawSnake();
        drawFood();
        checkCollision();
        main();
    }, speed);
}

function clearCanvas() {
    snakeElement.innerHTML = '';
}

function moveSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);
    if (snake[0].x === foodX && snake[0].y === foodY) {
        createFood();
        hasEaten = true;
        score++;
        scoreValueElement.textContent = score;
    } else {
        if (!hasEaten) {
            snake.pop();
        } else {
            hasEaten = false;
        }
    }
}

function drawSnake() {
    snake.forEach((segment, index) => {
        const snakePart = document.createElement('div');
        snakePart.classList.add('snake-part');
        snakePart.style.width = gridSize + 'px';
        snakePart.style.height = gridSize + 'px';
        snakePart.style.position = 'absolute';
        snakePart.style.left = segment.x * gridSize + 'px';
        snakePart.style.top = segment.y * gridSize + 'px';
        if (index === 0) {
            const snakeHead = document.createElement('div');
            snakeHead.classList.add('snake-head');
            snakeHead.style.width = gridSize + 'px';
            snakeHead.style.height = gridSize + 'px';
            snakeHead.style.backgroundImage = `url('${currentSnakeImage}')`; // Sử dụng hình ảnh hiện tại của đầu con rắn
            snakeHead.style.backgroundSize = 'cover';
            snakeHead.style.position = 'absolute';
            snakeHead.style.left = segment.x * gridSize + 'px';
            snakeHead.style.top = segment.y * gridSize + 'px';

            // Thêm logic để quay hình ảnh đầu con rắn
            if (dx === 1) { // Di chuyển sang phải
                snakeHead.style.transform = 'rotate(0deg)';
            } else if (dx === -1) { // Di chuyển sang trái
                snakeHead.style.transform = 'rotate(180deg)';
            } else if (dy === 1) { // Di chuyển xuống
                snakeHead.style.transform = 'rotate(90deg)';
            } else if (dy === -1) { // Di chuyển lên
                snakeHead.style.transform = 'rotate(-90deg)';
            }

            snakeElement.appendChild(snakeHead);
        } else {
            const snakeBodyPart = document.createElement('div');
            snakeBodyPart.classList.add('snake-part');
            snakeBodyPart.style.width = gridSize + 'px';
            snakeBodyPart.style.height = gridSize + 'px';
            snakeBodyPart.style.backgroundImage = `url('than.jpg')`; // Hình ảnh thân của con rắn
            snakeBodyPart.style.backgroundSize = 'cover';
            snakeBodyPart.style.position = 'absolute';
            snakeBodyPart.style.left = segment.x * gridSize + 'px';
            snakeBodyPart.style.top = segment.y * gridSize + 'px';
            snakeElement.appendChild(snakeBodyPart);
        }
    });
}


function drawFood() {
    foodElement.style.left = foodX * gridSize + 'px';
    foodElement.style.top = foodY * gridSize + 'px';
}

function checkCollision() {
    if (snake[0].x < 0 || snake[0].x >= gridSize || snake[0].y < 0 || snake[0].y >= gridSize) {
        gameOver = true;
        alert("Game Over! Press OK to play again.");
        resetGame();
    }
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            gameOver = true;
            alert("Game Over! Press OK to play again.");
            resetGame();
            break;
        }
    }
}

function createFood() {
    foodX = Math.floor(Math.random() * gridSize);
    foodY = Math.floor(Math.random() * gridSize);
}

function resetGame() {
    snake = [{ x: 10, y: 10 }];
    foodX = 15;
    foodY = 15;
    dx = 0;
    dy = 0;
    gameOver = false;
    score = 0;
    scoreValueElement.textContent = score;
}

document.addEventListener('keydown', function(e) {
    switch (e.key) {
        case 'ArrowUp':
            if (dy === 0) {
                dx = 0;
                dy = -1;
            }
            break;
        case 'ArrowDown':
            if (dy === 0) {
                dx = 0;
                dy = 1;
            }
            break;
        case 'ArrowLeft':
            if (dx === 0) {
                dx = -1;
                dy = 0;
            }
            break;
        case 'ArrowRight':
            if (dx === 0) {
                dx = 1;
                dy = 0;
            }
            break;
    }
});

createFood();
main();
