export const app = document.querySelector(".app");
export const start = document.querySelector(".start-btn");

export function removeSection(section) {
    section.remove();
}

function createRandomImages(numberOfImages) {
    const images = [];

    for(let i = 1; i <= numberOfImages; i++) {
        const img = `img${i}`;
        images.push(img, img)
    }

    const randomImages = [];
    const randomNums = new Set();
    const length = images.length;

    while(randomImages.length < length) {
        const randomNum = Math.floor(Math.random() * length)

        if(!randomNums.has(randomNum)) {
            randomImages.push(images[randomNum]);
            randomNums.add(randomNum);
        }
    }

    return randomImages
}

export function buildGameSection(numberOfCards) {
    const randomImages = createRandomImages(numberOfCards);
    const gameSection = `
    <div class="game-section container">
    <h2 class="main-title">Memory Game</h2>
    <div class="timer"></div>
    <div class="game-board">
    ${
        randomImages.map(img => {
            return `<div class="card" id=${img} data-right="false">
                <img src="./images/${img}.jpg" alt="random image" />
            </div>`
        }).join("")
    }
    </div>
    <button class="reload"><img src="./images/reload.png" alt="reload button" /></button>
    </div>
    `;
    const gameSectionElement = document.createRange().createContextualFragment(gameSection);

    return gameSectionElement;
}

export function backFlip(card) {
    card.style.transform = "rotateY(180deg)";
}

export function frontFlip(card) {
    card.style.transform = "rotateY(0deg)";
}

export function flipCardsBack(cards, timer) {
    setTimeout(() => cards.forEach(card => backFlip(card)), timer)
}

export function reloadGame(app) {
    app.innerHTML = "";
    const newGameSection = buildGameSection(6);
    app.appendChild(newGameSection);
}

export function isSameCard(cards) {
    if(cards[0].id === cards[1].id) {
        cards.forEach(card => {
            card.style.backgroundColor = "limegreen";
            card.dataset.right = "true";
        })
    } else {
        cards.forEach(card => {
            card.style.backgroundColor = "red";
            setTimeout(() => {
                backFlip(card);
                card.style.backgroundColor = "var(--card-color)";
            }, 500)
        })
    }
}

export function showWinPopup(app) {
    const winPopup = `
    <div class="result win">
        <p class="description">You Are Win</p>
        <button class="btn">Play Again</button>
    </div>
    `;
    const winPopupElement = document.createRange().createContextualFragment(winPopup);
    app.innerHTML = "";
    app.appendChild(winPopupElement);
}

export function showLosePopup(app) {
    const losePopup = `
    <div class="result lose">
        <p class="description">Game Over</p>
        <button class="btn">Try Again</button>
    </div>
    `;
    const losePopupElement = document.createRange().createContextualFragment(losePopup);
    app.innerHTML = "";
    app.appendChild(losePopupElement);
}

export function isWin(cards) {
    const cardsArr = [...cards];
    const result = cardsArr.every(card => card.dataset.right === "true");

    return result;
}

export function startTimer(timerElement, timer, cards) {
    timerElement.style.opacity = 1;
    let timelineValue = 100;
    let timeLineColor = "--full-timer-color";

    const decreaseTimer = setInterval(() => {
        timelineValue -= 0.125;

        if(timelineValue < 70 && timelineValue > 30) {
            timeLineColor = "--mid-timer-color";
        } else if(timelineValue < 30) {
            timeLineColor = "--low-timer-color";
        }

        timerElement.style.backgroundImage = `linear-gradient(to right, var(${timeLineColor}) ${timelineValue}%, transparent 0%)`
    }, timer / 800)
    
    setTimeout(() => {
        clearInterval(decreaseTimer);
        if(isWin(cards)) {
            showLosePopup(app);
        }
    }, timer)
}

export function startNewGame(cards, flipBackTimer, timerElement, gameTimer) {
    flipCardsBack(cards, flipBackTimer);
    let twoCards = [];

    setTimeout(() => {
        startTimer(timerElement, gameTimer, cards);
        cards.forEach(card => card.addEventListener("click", () => { 
            twoCards.push(card);  
            if(twoCards.length === 2) {
                isSameCard(twoCards);
                twoCards = [];
            }
            frontFlip(card);
            if(isWin(cards)) showWinPopup(app);
        }))
    }, flipBackTimer + 10);
}