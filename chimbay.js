/* =========================================
   1️⃣ CÀI ĐẶT
========================================= */

let move_speed = 3;
let gravity = 0.5;
let jump_force = -8;

let bird = document.querySelector('.bird');
let background = document.querySelector('.background');
let score_val = document.querySelector('.score_val');
let message = document.querySelector('.message');

let bird_imgs = [
    'images/b1.png',
    'images/b2.png',
    'images/b3.png',
    'images/b4.png'
];

let bird_img_index = 0;

let game_state = 'Start';
let bird_dy = 0;

let animation_id;
let gravity_id;
let pipe_id;
let bird_anim_id;

let score = 0;
let level = 1;
let pipe_gap = 35;
let pipe_sep = 0;


/* =========================================
   2️⃣ ĐIỀU KHIỂN CHUỘT
========================================= */

// Click để bắt đầu hoặc đập cánh
document.addEventListener('mousedown', () => {

    // Nếu chưa chơi -> bắt đầu
    if (game_state !== 'Play') {
        resetGame();
        startGame();
        return;
    }

    // Nếu đang chơi -> đập cánh
    bird_dy = jump_force;
});


// Enter để restart
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && game_state !== 'Play') {
        resetGame();
        startGame();
    }
});


/* =========================================
   3️⃣ BẮT ĐẦU GAME
========================================= */

function startGame() {

    game_state = 'Play';
    message.innerHTML = '';

    score = 0;
    level = 1;
    bird_dy = 0;

    updateUI();

    move();
    apply_gravity();
    create_pipe();
    animate_bird();
}


/* =========================================
   4️⃣ RESET
========================================= */

function resetGame() {

    document.querySelectorAll('.pipe_sprite').forEach(p => p.remove());

    bird.style.top = '40vh';
    bird.style.transform = 'rotate(0deg)';

    bird_dy = 0;
    move_speed = 3;
    pipe_gap = 35;
    pipe_sep = 0;

    cancelAnimationFrame(animation_id);
    cancelAnimationFrame(gravity_id);
    cancelAnimationFrame(pipe_id);
    clearTimeout(bird_anim_id);
}


/* =========================================
   5️⃣ UPDATE UI
========================================= */

function updateUI() {
    score_val.innerHTML = `Score: ${score} | Level: ${level}`;
}


/* =========================================
   6️⃣ DI CHUYỂN ỐNG
========================================= */

function move() {

    if (game_state !== 'Play') return;

    document.querySelectorAll('.pipe_sprite').forEach(pipe => {

        let pipeRect = pipe.getBoundingClientRect();
        let birdRect = bird.getBoundingClientRect();

        if (pipeRect.right <= 0) {
            pipe.remove();
        }
        else {

            // Va chạm
            if (
                birdRect.left < pipeRect.left + pipeRect.width &&
                birdRect.left + birdRect.width > pipeRect.left &&
                birdRect.top < pipeRect.top + pipeRect.height &&
                birdRect.top + birdRect.height > pipeRect.top
            ) {
                endGame();
            }

            // Tính điểm
            if (pipe.dataset.score === '1' && pipeRect.right < birdRect.left) {
                score++;
                pipe.dataset.score = '0';
                checkLevelUp();
                updateUI();
            }

            pipe.style.left = pipe.offsetLeft - move_speed + 'px';
        }
    });

    animation_id = requestAnimationFrame(move);
}


/* =========================================
   7️⃣ VẬT LÝ CHUẨN FLASH
========================================= */

function apply_gravity() {

    if (game_state !== 'Play') return;

    bird_dy += gravity;

    let bird_top = bird.offsetTop + bird_dy;

    // Xoay chim theo vận tốc
    let rotation = bird_dy * 3;
    if (rotation > 90) rotation = 90;
    if (rotation < -25) rotation = -25;

    bird.style.transform = `rotate(${rotation}deg)`;

    // Chạm trần / đất
    if (
        bird_top <= 0 ||
        bird_top + bird.offsetHeight >= background.offsetHeight
    ) {
        endGame();
        return;
    }

    bird.style.top = bird_top + 'px';

    gravity_id = requestAnimationFrame(apply_gravity);
}


/* =========================================
   8️⃣ TẠO ỐNG
========================================= */

function create_pipe() {

    if (game_state !== 'Play') return;

    if (pipe_sep > 115) {

        pipe_sep = 0;

        let y = Math.floor(Math.random() * 40) + 10;

        let pipe_top = document.createElement('div');
        pipe_top.className = 'pipe_sprite';
        pipe_top.style.top = y - 70 + 'vh';
        pipe_top.style.left = '100vw';
        background.appendChild(pipe_top);

        let pipe_bot = document.createElement('div');
        pipe_bot.className = 'pipe_sprite';
        pipe_bot.style.top = y + pipe_gap + 'vh';
        pipe_bot.style.left = '100vw';
        pipe_bot.dataset.score = '1';

        background.appendChild(pipe_bot);
    }

    pipe_sep++;
    pipe_id = requestAnimationFrame(create_pipe);
}


/* =========================================
   9️⃣ LEVEL SYSTEM
========================================= */

function checkLevelUp() {

    if (score % 5 === 0) {

        level++;
        move_speed += 0.7;
        pipe_gap -= 2;

        if (pipe_gap < 20) pipe_gap = 20;

        showLevelUp();
    }
}

function showLevelUp() {

    let levelText = document.createElement('div');

    levelText.innerHTML = `LEVEL ${level}`;
    levelText.style.position = "absolute";
    levelText.style.top = "40%";
    levelText.style.left = "50%";
    levelText.style.transform = "translate(-50%, -50%)";
    levelText.style.fontSize = "50px";
    levelText.style.color = "yellow";
    levelText.style.fontWeight = "bold";

    background.appendChild(levelText);

    setTimeout(() => levelText.remove(), 1000);
}


/* =========================================
   🔟 ANIMATION CHIM
========================================= */

function animate_bird() {

    if (game_state !== 'Play') return;

    bird_img_index = (bird_img_index + 1) % bird_imgs.length;
    bird.src = bird_imgs[bird_img_index];

    bird_anim_id = setTimeout(animate_bird, 120);
}


/* =========================================
   1️⃣1️⃣ GAME OVER
========================================= */

function endGame() {

    game_state = 'End';

    cancelAnimationFrame(animation_id);
    cancelAnimationFrame(gravity_id);
    cancelAnimationFrame(pipe_id);
    clearTimeout(bird_anim_id);

    message.innerHTML = `
        Game Over<br>
        Score: ${score}<br>
        Level: ${level}<br>
        Click chuột để chơi lại
    `;
}