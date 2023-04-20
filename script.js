const rulesBtn = document.getElementById("rules-btn");
const closeBtn = document.getElementById("close-btn");
const rules = document.getElementById('rules');
const scorecard = document.getElementById('score');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let score = 0;
scorecard.innerHTML = `Score: ${score}`;

const brickRowCount = 9;
const brickColumnCount = 5;
const delay = 1500;

//ball properties
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    size: 10,
    speed: 4,
    dx: 4,
    dy: -4,
    visible: true
};

//paddle properties
const paddle = {
    x: canvas.width / 2 - 40,
    y: canvas.height - 20,
    w: 80,
    h: 10,
    speed: 8,
    dx: 0,
    visible: true
};

//brick properties
const brickInfo = {
    w: 70,
    h: 20,
    padding: 10,
    offsetX: 45,
    offsetY: 60,
    visible: true
};

//create bricks
const bricks = [];
for (let i=0; i<brickRowCount; i++) {
    bricks[i] = [];
    for (let j=0; j<brickColumnCount; j++) {
        const x = i * (brickInfo.w + brickInfo.padding) + brickInfo.offsetX;
        const y = j * (brickInfo.h + brickInfo.padding) + brickInfo.offsetY;
        //give each brick a unique color in rgb
        const color = 'rgb(' + Math.floor(Math.random() * 255) + ',' + Math.floor(Math.random() * 255) + ',' + Math.floor(Math.random() * 255) + ')';
        // update the brick object
        bricks[i][j] = {x, y, color, ...brickInfo}
    }
}

//draw ball
function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
    ctx.fillStyle = ball.visible ? '#00ffff' : 'transparent';
    ctx.fill();
    ctx.closePath();
}

//draw paddle
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddle.x, paddle.y, paddle.w, paddle.h);
    ctx.fillStyle = paddle.visible ? '#00ffff' : 'transparent';
    ctx.fill();
    ctx.closePath();
}

//draw bricks
function drawBricks() {
    bricks.forEach(column => {
        column.forEach(brick => {
            ctx.beginPath();
            ctx.rect(brick.x, brick.y, brick.w, brick.h);
            ctx.fillStyle = brick.visible ? brick.color : 'transparent';
            ctx.fill();
            ctx.closePath();
        })
    })
}

//move paddle
function movePaddle() {
    paddle.x += paddle.dx;
    //wall collision
    if (paddle.x + paddle.w > canvas.width) {
        paddle.x = canvas.width - paddle.w
    }
    if (paddle.x < 0) {
        paddle.x = 0;
    }
}

//move ball
function moveBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;
    //wall collision right/left
    if (ball.x + ball.size > canvas.width || ball.x - ball.size < 0) {
        ball.dx *= -1
    }
    //wall collision top/bottom
    if (ball.y + ball.size > canvas.height || ball.y - ball.size < 0) {
        ball.dy *= -1
    }
    //paddle collision
    if (
        ball.x - ball.size > paddle.x &&
        ball.x + ball.size < paddle.x + paddle.w &&
        ball.y + ball.size > paddle.y
    ) {
        ball.dy = -ball.speed
    }
    //brick collision
    bricks.forEach(column => {
        column.forEach(brick => {
            if (brick.visible) {
                if (
                ball.x - ball.size > brick.x && // hit brick left side
                ball.x + ball.size < brick.x + brick.w && // hit right side
                ball.y + ball.size > brick.y && // hit top 
                ball.y - ball.size < brick.y + brick.h // hit bottom
                ) {
                    ball.dy *= -1;
                    brick.visible = false;

                    increaseScore();
                }
            }
        })
    })
    //hit bottom wall - lose
    if (ball.y + ball.size > canvas.height) {
        showAllBricks();
        score = 0;
        scorecard.innerHTML = `Score: ${score}`;
    }
}

//increase score
function increaseScore() {
    score++;
    scorecard.innerHTML = `Score: ${score}`;

    if (score % (brickColumnCount * brickRowCount) === 0) {
        ball.visible = false;
        paddle.visible - false;

        //after 1.5sec restart the game
        setTimeout(function() {
            showAllBricks();
            score = 0;
            scorecard.innerHTML = `Score: ${score}`;
            paddle.x = canvas.width/2 - 40;
            paddle.y = canvas.height - 20;
            ball.x = canvas.width/2;
            ball.y = canvas.height/2;
            ball.visible = true;
            paddle.visible = true;
        }, delay)
    }
}

//make all bricks appear
function showAllBricks() {
    bricks.forEach(column => {
        column.forEach(brick => brick.visible = true)
    })
}

//draw everything
function draw() {
    //clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBall();
    drawPaddle();
    drawBricks();
}

//update canvas drawing and animation

function update() {
    movePaddle();
    moveBall();

    draw();
    requestAnimationFrame(update);
}

update();

//keydown event

function keyDown(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
        paddle.dx = paddle.speed
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        paddle.dx = -paddle.speed
    }
}

//keyup event

function keyUp(e) {
    if (
        e.key === 'Right' ||
        e.key === 'ArrowRight' ||
        e.key === 'Left' ||
        e.key === 'ArrowLeft'
    ) {
        paddle.dx = 0;
    }
}

//keyboard event handlers
document.addEventListener('keydown', keyDown)
document.addEventListener('keyup', keyUp)

// Rules and close event handlers
rulesBtn.addEventListener('click', () => rules.classList.add('show'));
closeBtn.addEventListener('click', () => rules.classList.remove('show'));