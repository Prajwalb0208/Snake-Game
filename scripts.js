const canvas = document.getElementById("canvas");
        const ctx = canvas.getContext("2d", { alpha: false });
        let dirs = { Right: [1, 0], Left: [-1, 0], Down: [0, 1], Up: [0, -1] };
        let snake = [[8, 8]], apple = [4, 4], customApple = null, dir = [0, 0];
        let obstacles = [];
        let score = 0;
        let level = 1; // Initial level
        let gameInterval;

        window.addEventListener("keydown", (e) =>
            dir = dirs[e.key.slice(5)] || dir);
        let appleImage = new Image();
        appleImage.src = 'apple.png';

        function drawApple(x, y) {
            ctx.drawImage(appleImage, x * 16, y * 16, 16, 16);
        }
        function generateObstacles() {
            obstacles = [];
            for (let i = 0; i < level; i++) {
                let obstacle;
                do {
                    obstacle = [Math.floor(Math.random() * 16), Math.floor(Math.random() * 16)];
                } while (obstacles.some(pos => "" + pos === "" + obstacle) ||
                    ("" + obstacle === "" + apple) || ("" + obstacle === "" + snake[0]));

                obstacles.push(obstacle);
            }
        }

        function generateCustomApple() {
            // Customize the probability of appearance (1 in 50 chance in this case)
            if (Math.floor(Math.random() * 300) === 0) {
                do customApple = [Math.floor(Math.random() * 16), Math.floor(Math.random() * 16)];
                while (snake.some(seg => "" + seg == customApple) ||
                    obstacles.some(obstacle => "" + obstacle == customApple) ||
                    ("" + customApple === "" + apple));
            }
        }

        function startGame() {
            if (!gameInterval) {
            generateObstacles(); // Generate obstacles for the current level
            gameInterval = setInterval(() => {
                snake.unshift([snake[0][0] + dir[0] + 16 & 15, snake[0][1] + dir[1] + 16 & 15]);

                if (customApple && "" + snake[0] == customApple) {
                    score += 10;
                    customApple = null;
                } else if (obstacles.some(obstacle => "" + obstacle == snake[0])) {
                    resetGame();
                    return;
                }

                if ("" + snake[0] == apple) {
                    score += 1;
                    do apple = [Math.floor(Math.random() * 16), Math.floor(Math.random() * 16)];
                    while (snake.some(seg => "" + seg == apple) ||
                        obstacles.some(obstacle => "" + obstacle == apple) ||
                        (customApple && "" + customApple == apple));
                } else if (snake.slice(1).some(seg => "" + seg == snake[0])) {
                    score = 0;
                    snake.splice(1);
                } else {
                    snake.pop();
                }

                generateCustomApple(); // Generate custom apple

                ctx.clearRect(0, 0, 256, 256);
                ctx.fillStyle = "red";
                ctx.fillRect(apple[0] * 16, apple[1] * 16, 16, 16);
                ctx.fillStyle = "lime";
                snake.forEach(([x, y]) => ctx.fillRect(x * 16, y * 16, 16, 16));

                // Draw obstacles
                ctx.fillStyle = "gray";
                obstacles.forEach(([x, y]) => ctx.fillRect(x * 16, y * 16, 16, 16));

                // Draw custom apple
                if (customApple) {
                    ctx.fillStyle = "orange";
                    ctx.fillRect(customApple[0] * 16, customApple[1] * 16, 16, 16);
                }

                document.getElementById("score").innerText = "Score: " + score;
                document.getElementById("level").innerText = "Level: " + level;
            }, 175);
        }
    }

    function pauseGame() {
        if (gameInterval) {
            clearInterval(gameInterval);
            gameInterval = null;
            document.getElementById("pauseButton").innerText = "Resume";
        } else {
            if (!isSelfCollision()) {  // Add a check to prevent starting the game if there's a self-collision
                startGame();
                document.getElementById("pauseButton").innerText = "Pause";
            }
        }
    }
    


    function resetGame() {
        clearInterval(gameInterval);
        gameInterval = null;
        snake = [[8, 8]];
        apple = [4, 4];
        customApple = null;
        dir = [0, 0];
        score = 0;
        document.getElementById("score").innerText = "Score: 0";
        generateObstacles(); // Generate obstacles for the current level
        ctx.clearRect(0, 0, 256, 256);
        startGame();
    }

        function isSelfCollision() {
            return snake.slice(1).some(seg => "" + seg == snake[0]);
        }

        function setLevel() {
            const newLevel = parseInt(document.getElementById("levelInput").value, 10);
            if (!isNaN(newLevel) && newLevel > 0 && newLevel <= 25) {
                level = newLevel;
                resetGame();
            }
        }
        document.getElementById("pauseButton").addEventListener("click", pauseGame);
        document.getElementById("resetButton").addEventListener("click", resetGame);
        document.getElementById("levelInputButton").addEventListener("click", setLevel);
        document.addEventListener("keydown", (e) => {
        // Start the game on any arrow key press
        if (!gameInterval && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        document.getElementById("howToPlay").style.display = "none"; // Hide the "How to play" message
        startGame();}});