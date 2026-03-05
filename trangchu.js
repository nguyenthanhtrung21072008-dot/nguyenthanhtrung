const searchBar = document.getElementById("searchBar");
const cards = document.querySelectorAll(".game-card");
const noResult = document.getElementById("noResult");
const gameGrid = document.getElementById("gameGrid");
const playerScreen = document.getElementById("player-screen");
const gameFrame = document.getElementById("gameFrame");
const gameTitle = document.getElementById("gameTitle");

/* ===============================
1️⃣ HÀM BỎ DẤU TIẾNG VIỆT
================================ */
function removeVietnameseTones(str) {
    return str.normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/Đ/g, "D");
}

/* ===============================
2️⃣ TÌM KIẾM REALTIME
================================ */
searchBar.addEventListener("input", function () {

    let keyword = removeVietnameseTones(
        searchBar.value.toLowerCase().trim()
    );

    let found = false;

    cards.forEach(card => {

        let gameName = removeVietnameseTones(
            card.dataset.name.toLowerCase()
        );

        if (gameName.includes(keyword)) {
            card.style.display = "block";
            found = true;
        } else {
            card.style.display = "none";
        }
    });

    if (!found) {
        noResult.classList.remove("hidden");
    } else {
        noResult.classList.add("hidden");
    }

});

/* ===============================
3️⃣ CLICK MỞ GAME
================================ */
cards.forEach(card => {

    card.addEventListener("click", function () {

        const gameUrl = card.dataset.url;
        const title = card.querySelector("p").innerText;

        /* Ẩn trang chủ */
        gameGrid.classList.add("hidden");
        noResult.classList.add("hidden");

        /* Hiện màn chơi */
        playerScreen.classList.remove("hidden");

        gameFrame.src = gameUrl;
        gameTitle.innerText = title;

        /* Cuộn lên đầu trang */
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    });

});

/* ===============================
4️⃣ QUAY LẠI
================================ */
function showHome() {

    playerScreen.classList.add("hidden");

    gameGrid.classList.remove("hidden");

    gameFrame.src = "";
    searchBar.value = "";

    /* Hiện lại tất cả game */
    cards.forEach(card => {
        card.style.display = "block";
    });

}