import { start, app, removeSection, buildGameSection, startNewGame, reloadGame} from "./utils.js";
start.addEventListener("click", (event) => {
    removeSection(event.target.parentElement);
    const gameSection = buildGameSection(6);
    app.appendChild(gameSection);
})


app.addEventListener("click", event => {
    const element = event.target;

    // Reload The game 
    if(element.classList.contains("reload")) {
        reloadGame(app);
    }
})

function onChildAdded(mutationList, observer) {
    for(const mutation of mutationList) {
        if(mutation.type === "childList" && mutation.addedNodes.length) {
            const childClasses = mutation.addedNodes[1].classList

            if(childClasses.contains("game-section")) {
                const cards = document.querySelectorAll(".card");
                const timerElement = document.querySelector(".timer");
                startNewGame(cards, 1500, timerElement, 30000);
            }
            
            if(childClasses.contains("result")) {
                const resultBtn = document.querySelector(".result .btn");
                resultBtn.addEventListener("click", () => {
                    reloadGame(app);
                });
            }
        }
    }
}

const config = {childList: true};

const observer = new MutationObserver(onChildAdded);

observer.observe(app, config);

