const score = document.querySelector('.score'),
    start = document.querySelector('.start'),
    gameArea = document.querySelector('.gameArea'),
    car = document.createElement('div');
car.classList.add('car');

const keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false
}

const gameController = {
    start: false,
    score: 0,
    speed: 3,
    traffic: 3
}

const moveAxis = (e) => {
    e.preventDefault();
    keys[e.key] = true;
}

const stopAxis = (e) => {
    e.preventDefault();
    keys[e.key] = false;
}

const getQuantityElements = elementHeight => {
    return document.documentElement.clientHeight / elementHeight +1;
}

const startGame = (e) => {
    start.classList.add('hide');
    gameArea.innerHTML = '';
    car.style.left = (gameArea.offsetWidth / 2) - (car.offsetWidth / 2);
    car.style.top = 'auto';
    car.style.bottom = '10px';
    for (let i = 0; i < getQuantityElements(100); i++){
        const line = document.createElement('div');
        line.classList.add('line')
        line.style.top = (i * 100) + 'px';
        line.y = i * 100;
        gameArea.appendChild(line)

    }

    for (let i = 0; i < getQuantityElements(100) * gameController.traffic; i++) {
        const enemy = document.createElement('div');
        enemy.classList.add('enemy');
        enemy.y = -100 * gameController.traffic * (i + 1);
        enemy.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
        enemy.style.top = enemy.y + 'px';
        enemy.style.background ='transparent url(\'./images/enemy2.png\') center / cover no-repeat';
        gameArea.appendChild(enemy);
    }
    gameController.score = 0;
    gameController.start = true;
    gameArea.appendChild(car)
    gameController.x = car.offsetLeft;
    gameController.y = car.offsetTop;
    requestAnimationFrame(gameplay);
}

const moveEnemy = () => {
    let enemy = document.querySelectorAll('.enemy');
    enemy.forEach(item => {
        let carCollider = car.getBoundingClientRect();
        let enemyCollider = item.getBoundingClientRect();

        if (carCollider.top <= enemyCollider.bottom &&
            carCollider.right >= enemyCollider.left &&
            carCollider.left <= enemyCollider.right &&
            carCollider.bottom >= enemyCollider.top) {
            gameController.start = false;
            start.classList.remove('hide');
            start.style.top = score.offsetHeight;
        }

        item.y += gameController.speed / 0.5;
        item.style.top = item.y + 'px';

        if(item.y >= document.documentElement.clientHeight) {
            item.y = -100 * gameController.traffic;
            item.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
        }
    })
}

const moveRoad = () => {
    let lines = document.querySelectorAll('.line');
    lines.forEach((line) =>{
        line.y += gameController.speed;
        line.style.top = line.y + 'px';

        if (line.y > document.documentElement.clientHeight + 100) {
            line.y = -100;
        }
    })
}

const gameplay = () => {
    if (gameController.start) {
        gameController.score += gameController.speed;
        score.textContent = `Score: ${gameController.score}`;
        moveRoad();
        moveEnemy();
        if (keys.ArrowLeft && gameController.x > 0){
            gameController.x -= gameController.speed;
        }

        if (keys.ArrowRight && gameController.x < (gameArea.offsetWidth - car.offsetWidth)) {
            gameController.x += gameController.speed;
        }

        if (keys.ArrowDown && gameController.y < (gameArea.offsetHeight - car.offsetHeight)) {
            gameController.y += gameController.speed;
        }

        if (keys.ArrowUp && gameController.y > 0) {
            gameController.y -= gameController.speed;
        }

        car.style.left = gameController.x + 'px';
        car.style.top = gameController.y + 'px';
        requestAnimationFrame(gameplay)
    }
}

document.addEventListener('keydown', moveAxis);
document.addEventListener('keyup', stopAxis)

start.addEventListener('click', startGame);

