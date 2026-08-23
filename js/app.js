/* =====================================================
   CAÇA-PALAVRAS
   MOTOR DO JOGO
===================================================== */


/* =====================================================
   CONFIGURAÇÃO
===================================================== */

const DEFAULT_DATA = {

    currentLevel: 1,

    unlockedLevel: 1,

    totalStars: 0,

    soundEnabled: true,

    comfortableMode: false,

    fontSize: 0,

    playerName: "",

    hallOfFame: []

};


let gameData = loadData();


/* =====================================================
   DADOS DO JOGO
===================================================== */

const LEVEL_CONFIG = {

    1:  { size: 8,  words: 5 },
    2:  { size: 8,  words: 5 },
    3:  { size: 8,  words: 6 },
    4:  { size: 9,  words: 6 },
    5:  { size: 9,  words: 7 },

    10: { size: 10, words: 8 },

    20: { size: 10, words: 9 },

    30: { size: 11, words: 10 },

    40: { size: 11, words: 10 },

    50: { size: 12, words: 11 },

    60: { size: 12, words: 12 },

    70: { size: 13, words: 12 },

    80: { size: 13, words: 13 },

    90: { size: 14, words: 14 },

    100: { size: 15, words: 15 }

};


/* =====================================================
   BANCO DE PALAVRAS
===================================================== */

const WORD_BANK = [

    "AMIZADE",
    "SABEDORIA",
    "MEMORIA",
    "FELICIDADE",
    "ALEGRIA",
    "ESPERANCA",
    "FAMILIA",
    "CARINHO",
    "RESPEITO",
    "CORAGEM",
    "SAUDE",
    "PAZ",
    "AMOR",
    "VIDA",
    "SONHO",
    "LIBERDADE",
    "CONFIANCA",
    "BONDADE",
    "PACIENCIA",
    "FORCA",
    "HARMONIA",
    "SUCESSO",
    "VITORIA",
    "APRENDIZADO",
    "EXPERIENCIA",
    "CONHECIMENTO",
    "SABER",
    "LEMBRANCA",
    "HISTORIA",
    "FUTURO",
    "PASSADO",
    "PRESENTE",
    "FLORESTA",
    "MONTANHA",
    "JARDIM",
    "NATUREZA",
    "CAMINHO",
    "VIAGEM",
    "CIDADE",
    "CAMPO",
    "PRAIA",
    "MAR",
    "SOL",
    "LUA",
    "ESTRELA",
    "NUVEM",
    "CHUVA",
    "VENTO",
    "MUSICA",
    "LEITURA",
    "LIVRO",
    "ESCOLA",
    "FAMILIAR",
    "TRABALHO",
    "DESCANSO",
    "MANHA",
    "TARDE",
    "NOITE",
    "PRIMAVERA",
    "VERAO",
    "OUTONO",
    "INVERNO",
    "JANELA",
    "CASA",
    "COZINHA",
    "JARDIM",
    "CADEIRA",
    "MESA",
    "RELACIONAMENTO",
    "GENEROSIDADE",
    "INTELIGENCIA",
    "CRIATIVIDADE",
    "IMAGINACAO",
    "MOTIVACAO",
    "DISCIPLINA",
    "DEDICACAO",
    "ATENCAO",
    "CONCENTRACAO",
    "RACIOCINIO"

];


/* =====================================================
   ESTADO DO JOGO
===================================================== */

let board = [];

let boardSize = 10;

let currentWords = [];

let foundWords = [];

let placedWords = [];

let isSelecting = false;

let selectionStart = null;

let selectionCells = [];

let timerInterval = null;

let elapsedSeconds = 0;


/* =====================================================
   DIREÇÕES
===================================================== */

const DIRECTIONS = [

    { dr: 0,  dc: 1  },
    { dr: 0,  dc: -1 },

    { dr: 1,  dc: 0  },
    { dr: -1, dc: 0 },

    { dr: 1,  dc: 1  },
    { dr: 1,  dc: -1 },

    { dr: -1, dc: 1 },
    { dr: -1, dc: -1 }

];


/* =====================================================
   INICIALIZAÇÃO
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadCustomWordBank();

        updateInterface();

        createLevels();

        loadSettings();

        startLevel(
            gameData.currentLevel
        );

        setupFileImport();

    }
);


/* =====================================================
   NAVEGAÇÃO
===================================================== */

function openScreen(screenId) {

    document
        .querySelectorAll(".screen")
        .forEach(screen => {

            screen.classList.remove(
                "active"
            );

        });


    const screen =
        document.getElementById(
            screenId
        );


    if (screen) {

        screen.classList.add(
            "active"
        );

    }


    if (
        screenId === "gameScreen"
    ) {

        startLevel(
            gameData.currentLevel
        );

    }


    if (
        screenId === "levelsScreen"
    ) {

        createLevels();

    }


    updateInterface();

}


/* =====================================================
   GERENCIAMENTO DE DADOS
===================================================== */

function loadData() {

    try {

        const saved =
            localStorage.getItem(
                "cacapalavrasData"
            );


        if (!saved) {

            return {
                ...DEFAULT_DATA
            };

        }


        return {

            ...DEFAULT_DATA,

            ...JSON.parse(saved)

        };

    }

    catch (error) {

        return {
            ...DEFAULT_DATA
        };

    }

}


function saveData() {

    localStorage.setItem(

        "cacapalavrasData",

        JSON.stringify(gameData)

    );

}


/* =====================================================
   CONFIGURAÇÃO DO NÍVEL
===================================================== */

function getLevelConfig(level) {

    if (
        LEVEL_CONFIG[level]
    ) {

        return LEVEL_CONFIG[level];

    }


    if (level <= 10) {

        return {
            size: 9,
            words: 7
        };

    }


    if (level <= 25) {

        return {
            size: 10,
            words: 8
        };

    }


    if (level <= 50) {

        return {
            size: 11,
            words: 10
        };

    }


    if (level <= 75) {

        return {
            size: 12,
            words: 11
        };

    }


    return {

        size: 14,

        words: 13

    };

}


/* =====================================================
   INICIAR NÍVEL
===================================================== */

function startLevel(level) {

    stopTimer();


    const config =
        getLevelConfig(level);


    boardSize =
        config.size;


    currentWords =
        selectWords(
            config.words,
            boardSize
        );


    foundWords = [];

    placedWords = [];


    generateBoard();


    renderBoard();


    renderWords();


    elapsedSeconds = 0;


    updateTimer();


    startTimer();


    updateGameStatus();

}


/* =====================================================
   CRIAR TABULEIRO
===================================================== */

function generateBoard() {

    board = [];

    for (
        let row = 0;
        row < boardSize;
        row++
    ) {

        board[row] = [];

        for (
            let col = 0;
            col < boardSize;
            col++
        ) {

            board[row][col] = "";

        }

    }


    /*
       Primeiro tentamos colocar
       todas as palavras.
    */

    for (const word of currentWords) {

        const success =
            placeWord(word);


        if (!success) {

            continue;

        }

    }


    /*
       Preencher espaços vazios.
    */

    const letters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZ";


    for (
        let row = 0;
        row < boardSize;
        row++
    ) {

        for (
            let col = 0;
            col < boardSize;
            col++
        ) {

            if (
                !board[row][col]
            ) {

                board[row][col] =
                    letters[
                        Math.floor(
                            Math.random() *
                            letters.length
                        )
                    ];

            }

        }

    }

}


/* =====================================================
   POSICIONAR PALAVRA
===================================================== */

function placeWord(word) {

    const attempts = 250;


    for (
        let attempt = 0;
        attempt < attempts;
        attempt++
    ) {

        const direction =
            DIRECTIONS[
                Math.floor(
                    Math.random() *
                    DIRECTIONS.length
                )
            ];


        const startRow =
            Math.floor(
                Math.random() *
                boardSize
            );


        const startCol =
            Math.floor(
                Math.random() *
                boardSize
            );


        const endRow =
            startRow +
            direction.dr *
            (word.length - 1);


        const endCol =
            startCol +
            direction.dc *
            (word.length - 1);


        if (
            endRow < 0 ||
            endRow >= boardSize ||
            endCol < 0 ||
            endCol >= boardSize
        ) {

            continue;

        }


        let valid = true;


        for (
            let i = 0;
            i < word.length;
            i++
        ) {

            const row =
                startRow +
                direction.dr * i;


            const col =
                startCol +
                direction.dc * i;


            const existing =
                board[row][col];


            if (
                existing &&
                existing !== word[i]
            ) {

                valid = false;

                break;

            }

        }


        if (!valid) {

            continue;

        }


        const cells = [];


        for (
            let i = 0;
            i < word.length;
            i++
        ) {

            const row =
                startRow +
                direction.dr * i;


            const col =
                startCol +
                direction.dc * i;


            board[row][col] =
                word[i];


            cells.push({
                row,
                col
            });

        }


        placedWords.push({

            word,

            cells

        });


        return true;

    }


    return false;

}


/* =====================================================
   RENDERIZAR TABULEIRO
===================================================== */

function renderBoard() {

    const container =
        document.getElementById(
            "gameBoard"
        );


    if (!container) return;


    container.innerHTML = "";


    container.style
        .setProperty(
            "--grid-size",
            boardSize
        );


    for (
        let row = 0;
        row < boardSize;
        row++
    ) {

        for (
            let col = 0;
            col < boardSize;
            col++
        ) {

            const cell =
                document.createElement(
                    "div"
                );


            cell.className =
                "letter-cell";


            cell.dataset.row =
                row;


            cell.dataset.col =
                col;


            cell.textContent =
                board[row][col];


            /*
               Importante para ChromeOS,
               mouse e touchscreen.
            */

            cell.style.touchAction =
                "none";

            cell.style.userSelect =
                "none";

            cell.style.webkitUserSelect =
                "none";


            container.appendChild(
                cell
            );

        }

    }


    attachBoardEvents();

}


/* =====================================================
   EVENTOS DO TABULEIRO
===================================================== */

function attachBoardEvents() {

    const boardElement =
        document.getElementById(
            "gameBoard"
        );


    if (!boardElement) return;


    /*
       Remove handlers antigos.
    */

    boardElement.onpointerdown = null;

    boardElement.onpointermove = null;

    boardElement.onpointerup = null;

    boardElement.onpointercancel = null;


    /*
       Garante que o navegador não tente
       interpretar o movimento como seleção,
       scroll ou gesto.
    */

    boardElement.style.touchAction =
        "none";

    boardElement.style.userSelect =
        "none";

    boardElement.style.webkitUserSelect =
        "none";


    boardElement.onpointerdown =
        handlePointerDown;


    boardElement.onpointermove =
        handlePointerMove;


    boardElement.onpointerup =
        handlePointerUp;


    boardElement.onpointercancel =
        handlePointerCancel;

}


/* =====================================================
   PEGAR CÉLULA PELA POSIÇÃO DO MOUSE/TOQUE
===================================================== */

function getCellFromPoint(x, y) {

    const boardElement =
        document.getElementById(
            "gameBoard"
        );


    if (!boardElement) {

        return null;

    }


    const rect =
        boardElement.getBoundingClientRect();


    /*
       Verifica se o ponto está dentro
       do tabuleiro.
    */

    if (
        x < rect.left ||
        x > rect.right ||
        y < rect.top ||
        y > rect.bottom
    ) {

        return null;

    }


    /*
       Calcula diretamente qual célula
       foi atingida.

       Não usamos elementFromPoint().
    */

    const relativeX =
        x - rect.left;


    const relativeY =
        y - rect.top;


    const cellWidth =
        rect.width / boardSize;


    const cellHeight =
        rect.height / boardSize;


    let col =
        Math.floor(
            relativeX / cellWidth
        );


    let row =
        Math.floor(
            relativeY / cellHeight
        );


    /*
       Proteção contra arredondamentos.
    */

    col =
        Math.max(
            0,
            Math.min(
                boardSize - 1,
                col
            )
        );


    row =
        Math.max(
            0,
            Math.min(
                boardSize - 1,
                row
            )
        );


    const element =
        getCellElement(
            row,
            col
        );


    if (!element) {

        return null;

    }


    return {

        row,

        col,

        element

    };

}


/* =====================================================
   INÍCIO DA SELEÇÃO
===================================================== */

function handlePointerDown(event) {

    /*
       Impede seleção de texto,
       arrastar página etc.
    */

    event.preventDefault();


    /*
       Mantém o pointer preso ao tabuleiro
       durante o arrasto.
    */

    const boardElement =
        document.getElementById(
            "gameBoard"
        );


    if (
        boardElement &&
        boardElement.setPointerCapture &&
        event.pointerId !== undefined
    ) {

        try {

            boardElement.setPointerCapture(
                event.pointerId
            );

        }

        catch (error) {

            /*
               Alguns ambientes podem
               não permitir pointer capture.
               Nesse caso continuamos normalmente.
            */

        }

    }


    const cell =
        getCellFromPoint(
            event.clientX,
            event.clientY
        );


    if (!cell) return;


    isSelecting = true;


    selectionStart = {

        row: cell.row,

        col: cell.col

    };


    selectionCells = [

        {
            row: cell.row,
            col: cell.col
        }

    ];


    updateSelection();


    playFeedbackSound();

}


/* =====================================================
   MOVIMENTO DA SELEÇÃO
===================================================== */

function handlePointerMove(event) {

    if (!isSelecting) return;


    event.preventDefault();


    const cell =
        getCellFromPoint(
            event.clientX,
            event.clientY
        );


    if (!cell) return;


    const cells =
        calculateLine(
            selectionStart,
            {
                row: cell.row,
                col: cell.col
            }
        );


    if (!cells) return;


    selectionCells =
        cells;


    updateSelection();

}


/* =====================================================
   FINALIZAR SELEÇÃO
===================================================== */

function handlePointerUp(event) {

    if (!isSelecting) return;


    event.preventDefault();


    /*
       Libera o pointer capture.
    */

    const boardElement =
        document.getElementById(
            "gameBoard"
        );


    if (
        boardElement &&
        boardElement.releasePointerCapture &&
        event.pointerId !== undefined
    ) {

        try {

            if (
                boardElement.hasPointerCapture(
                    event.pointerId
                )
            ) {

                boardElement.releasePointerCapture(
                    event.pointerId
                );

            }

        }

        catch (error) {

        }

    }


    isSelecting = false;


    checkSelection();

}


/* =====================================================
   CANCELAR SELEÇÃO
===================================================== */

function handlePointerCancel(event) {

    isSelecting = false;

    selectionStart = null;

    selectionCells = [];

    clearSelection();


    const boardElement =
        document.getElementById(
            "gameBoard"
        );


    if (
        boardElement &&
        boardElement.releasePointerCapture &&
        event &&
        event.pointerId !== undefined
    ) {

        try {

            if (
                boardElement.hasPointerCapture(
                    event.pointerId
                )
            ) {

                boardElement.releasePointerCapture(
                    event.pointerId
                );

            }

        }

        catch (error) {

        }

    }

}


/* =====================================================
   CALCULAR LINHA
===================================================== */

function calculateLine(start, end) {

    const rowDiff =
        end.row - start.row;


    const colDiff =
        end.col - start.col;


    const rowStep =
        Math.sign(rowDiff);


    const colStep =
        Math.sign(colDiff);


    /*
       Só permitimos:

       horizontal
       vertical
       diagonal
    */

    const straight =
        rowDiff === 0 ||
        colDiff === 0 ||
        Math.abs(rowDiff) ===
        Math.abs(colDiff);


    if (!straight) {

        return null;

    }


    const length =
        Math.max(
            Math.abs(rowDiff),
            Math.abs(colDiff)
        ) + 1;


    const cells = [];


    for (
        let i = 0;
        i < length;
        i++
    ) {

        cells.push({

            row:
                start.row +
                rowStep * i,

            col:
                start.col +
                colStep * i

        });

    }


    return cells;

}


/* =====================================================
   VISUAL DA SELEÇÃO
===================================================== */

function updateSelection() {

    clearSelection();


    selectionCells.forEach(
        cell => {

            const element =
                getCellElement(
                    cell.row,
                    cell.col
                );


            if (element) {

                element.classList.add(
                    "selected"
                );

            }

        }
    );

}


/* =====================================================
   LIMPAR SELEÇÃO
===================================================== */

function clearSelection() {

    document
        .querySelectorAll(
            ".letter-cell.selected"
        )
        .forEach(
            element => {

                element.classList.remove(
                    "selected"
                );

            }
        );

}


/* =====================================================
   PEGAR ELEMENTO
===================================================== */

function getCellElement(
    row,
    col
) {

    return document.querySelector(

        `.letter-cell[data-row="${row}"][data-col="${col}"]`

    );

}


/* =====================================================
   VERIFICAR PALAVRA
===================================================== */

function checkSelection() {

    if (
        selectionCells.length < 2
    ) {

        clearSelection();

        return;

    }


    const selectedWord =
        selectionCells
            .map(
                cell =>
                    board[
                        cell.row
                    ][
                        cell.col
                    ]
            )
            .join("");


    const reversed =
        selectedWord
            .split("")
            .reverse()
            .join("");


    const matched =
        currentWords.find(
            word => {

                return (
                    word === selectedWord ||
                    word === reversed
                );

            }
        );


    if (
        matched &&
        !foundWords.includes(
            matched
        )
    ) {

        wordFound(
            matched,
            selectionCells
        );

    }

    else {

        showSelectionError();

    }


    clearSelection();

}


/* =====================================================
   PALAVRA ENCONTRADA
===================================================== */

function wordFound(
    word,
    cells
) {

    foundWords.push(
        word
    );


    cells.forEach(
        cell => {

            const element =
                getCellElement(
                    cell.row,
                    cell.col
                );


            if (element) {

                element.classList.add(
                    "found"
                );

            }

        }
    );


    updateWordsList();

    updateGameStatus();

    playSuccessSound();


    if (
        foundWords.length ===
        currentWords.length
    ) {

        completeLevel();

    }

}


/* =====================================================
   ATUALIZAR LISTA
===================================================== */

function renderWords() {

    const list =
        document.getElementById(
            "wordsList"
        );


    if (!list) return;


    list.innerHTML = "";


    currentWords.forEach(
        word => {

            const element =
                document.createElement(
                    "div"
                );


            element.className =
                "word-item";


            element.dataset.word =
                word;


            element.textContent =
                word;


            list.appendChild(
                element
            );

        }
    );


    updateWordsList();

}


/* =====================================================
   PALAVRAS ENCONTRADAS
===================================================== */

function updateWordsList() {

    document
        .querySelectorAll(
            ".word-item"
        )
        .forEach(
            element => {

                const word =
                    element.dataset.word;


                element.classList.toggle(

                    "found",

                    foundWords.includes(
                        word
                    )

                );

            }
        );

}


/* =====================================================
   STATUS
===================================================== */

function updateGameStatus() {

    const found =
        document.getElementById(
            "foundWords"
        );


    const total =
        document.getElementById(
            "totalWords"
        );


    const stars =
        document.getElementById(
            "stars"
        );


    if (found) {

        found.textContent =
            foundWords.length;

    }


    if (total) {

        total.textContent =
            currentWords.length;

    }


    if (stars) {

        stars.textContent =
            gameData.totalStars;

    }

}


/* =====================================================
   ERRO DE SELEÇÃO
===================================================== */

function showSelectionError() {

    const boardElement =
        document.getElementById(
            "gameBoard"
        );


    if (!boardElement) return;


    boardElement.classList.add(
        "error"
    );


    setTimeout(
        () => {

            boardElement.classList.remove(
                "error"
            );

        },

        300
    );

}


/* =====================================================
   CRONÔMETRO
===================================================== */

function startTimer() {

    stopTimer();


    timerInterval =
        setInterval(
            () => {

                elapsedSeconds++;

                updateTimer();

            },

            1000
        );

}


function stopTimer() {

    if (timerInterval) {

        clearInterval(
            timerInterval
        );

        timerInterval = null;

    }

}


function updateTimer() {

    const element =
        document.getElementById(
            "timer"
        );


    if (!element) return;


    const minutes =
        Math.floor(
            elapsedSeconds / 60
        );


    const seconds =
        elapsedSeconds % 60;


    element.textContent =

        String(minutes)
            .padStart(2, "0")

        +

        ":"

        +

        String(seconds)
            .padStart(2, "0");

}


/* =====================================================
   CONCLUIR NÍVEL
===================================================== */

function completeLevel() {

    stopTimer();


    let earnedStars = 3;


    if (
        elapsedSeconds > 180
    ) {

        earnedStars = 2;

    }


    if (
        elapsedSeconds > 300
    ) {

        earnedStars = 1;

    }


    gameData.totalStars +=
        earnedStars;


    if (
        gameData.currentLevel <
        100
    ) {

        gameData.unlockedLevel =
            Math.max(

                gameData.unlockedLevel,

                gameData.currentLevel + 1

            );

    }


    saveData();


    updateInterface();


    setTimeout(
        () => {

            showLevelComplete(
                earnedStars
            );

        },

        500
    );

}


/* =====================================================
   TELA DE CONCLUSÃO
===================================================== */

function showLevelComplete(
    earnedStars
) {

    const nextLevel =
        gameData.currentLevel < 100

            ? gameData.currentLevel + 1

            : 100;


    const goNext =
        gameData.currentLevel < 100;


    const message =

        `🎉 NÍVEL CONCLUÍDO!\n\n` +

        `Você encontrou todas as palavras.\n\n` +

        `${"⭐".repeat(
            earnedStars
        )}\n\n` +

        `Tempo: ${formatTime(
            elapsedSeconds
        )}`;


    alert(message);


    if (goNext) {

        gameData.currentLevel =
            nextLevel;


        saveData();


        startLevel(
            nextLevel
        );

    }

}


/* =====================================================
   FORMATAR TEMPO
===================================================== */

function formatTime(seconds) {

    const minutes =
        Math.floor(
            seconds / 60
        );


    const secs =
        seconds % 60;


    return (

        String(minutes)
            .padStart(2, "0")

        +

        ":"

        +

        String(secs)
            .padStart(2, "0")

    );

}


/* =====================================================
   SOM
===================================================== */

function createTone(
    frequency,
    duration,
    volume
) {

    if (
        !gameData.soundEnabled
    ) {

        return;

    }


    try {

        const AudioContextClass =
            window.AudioContext ||
            window.webkitAudioContext;


        const context =
            new AudioContextClass();


        const oscillator =
            context.createOscillator();


        const gain =
            context.createGain();


        oscillator.connect(
            gain
        );


        gain.connect(
            context.destination
        );


        oscillator.frequency.value =
            frequency;


        gain.gain.value =
            volume;


        oscillator.start();


        gain.gain.exponentialRampToValueAtTime(

            0.001,

            context.currentTime +
            duration

        );


        oscillator.stop(

            context.currentTime +
            duration

        );

    }

    catch (error) {

        console.log(
            "Áudio indisponível."
        );

    }

}


function playFeedbackSound() {

    createTone(
        520,
        0.08,
        0.04
    );

}


function playSuccessSound() {

    createTone(
        700,
        0.10,
        0.06
    );


    setTimeout(
        () => {

            createTone(
                900,
                0.14,
                0.06
            );

        },

        90
    );

}


/* =====================================================
   NÍVEIS
===================================================== */

function createLevels() {

    const grid =
        document.getElementById(
            "levelsGrid"
        );


    if (!grid) return;


    grid.innerHTML = "";


    for (
        let level = 1;
        level <= 100;
        level++
    ) {

        const button =
            document.createElement(
                "button"
            );


        button.className =
            "level-button";


        button.textContent =
            level;


        if (
            level <=
            gameData.unlockedLevel
        ) {

            button.classList.add(
                "unlocked"
            );


            button.onclick =
                () => {

                    selectLevel(
                        level
                    );

                };

        }


        if (
            level ===
            gameData.currentLevel
        ) {

            button.classList.add(
                "current"
            );

        }


        grid.appendChild(
            button
        );

    }

}


function selectLevel(level) {

    if (
        level >
        gameData.unlockedLevel
    ) {

        return;

    }


    gameData.currentLevel =
        level;


    saveData();


    updateInterface();


    openScreen(
        "gameScreen"
    );

}


/* =====================================================
   INTERFACE
===================================================== */

function updateInterface() {

    const homeLevel =
        document.getElementById(
            "currentLevelHome"
        );


    const footerLevel =
        document.getElementById(
            "currentLevelFooter"
        );


    const gameLevel =
        document.getElementById(
            "gameLevel"
        );


    const totalStars =
        document.getElementById(
            "totalStars"
        );


    if (homeLevel) {

        homeLevel.textContent =
            gameData.currentLevel;

    }


    if (footerLevel) {

        footerLevel.textContent =
            gameData.currentLevel;

    }


    if (gameLevel) {

        gameLevel.textContent =
            gameData.currentLevel;

    }


    if (totalStars) {

        totalStars.textContent =
            gameData.totalStars;

    }

}


/* =====================================================
   CONFIGURAÇÕES
===================================================== */

function loadSettings() {

    document.body.classList.toggle(

        "comfortable",

        gameData.comfortableMode

    );


    const comfortable =
        document.getElementById(
            "comfortableMode"
        );


    if (comfortable) {

        comfortable.checked =
            gameData.comfortableMode;

    }


    updateSoundInterface();

    updateFontSize();

}


function toggleComfortableMode() {

    const input =
        document.getElementById(
            "comfortableMode"
        );


    if (!input) return;


    gameData.comfortableMode =
        input.checked;


    document.body.classList.toggle(

        "comfortable",

        gameData.comfortableMode

    );


    saveData();

}


function updateSoundInterface() {

    const button =
        document.getElementById(
            "soundButton"
        );


    const setting =
        document.getElementById(
            "soundSetting"
        );


    if (button) {

        button.textContent =

            gameData.soundEnabled

                ? "🔊"

                : "🔇";

    }


    if (setting) {

        setting.checked =
            gameData.soundEnabled;

    }

}


function toggleSound() {

    gameData.soundEnabled =
        !gameData.soundEnabled;


    saveData();


    updateSoundInterface();


    playFeedbackSound();

}


function updateSoundSetting() {

    const input =
        document.getElementById(
            "soundSetting"
        );


    if (!input) return;


    gameData.soundEnabled =
        input.checked;


    saveData();


    updateSoundInterface();

}


/* =====================================================
   TAMANHO DA FONTE
===================================================== */

function changeFontSize(direction) {

    gameData.fontSize +=
        direction;


    gameData.fontSize =
        Math.max(
            -1,
            Math.min(
                2,
                gameData.fontSize
            )
        );


    updateFontSize();


    saveData();

}


function updateFontSize() {

    let scale = 1;

    let name = "Normal";


    if (
        gameData.fontSize === -1
    ) {

        scale = .9;

        name = "Pequeno";

    }


    if (
        gameData.fontSize === 1
    ) {

        scale = 1.1;

        name = "Grande";

    }


    if (
        gameData.fontSize === 2
    ) {

        scale = 1.2;

        name = "Muito grande";

    }


    document.documentElement.style
        .setProperty(
            "--font-scale",
            scale
        );


    const display =
        document.getElementById(
            "fontSizeDisplay"
        );


    if (display) {

        display.textContent =
            name;

    }

}


/* =====================================================
   HALL DA FAMA
===================================================== */

function showHall(type) {

    document
        .querySelectorAll(
            ".tab-button"
        )
        .forEach(
            button => {

                button.classList.remove(
                    "active"
                );

            }
        );


    const buttons =
        document.querySelectorAll(
            ".tab-button"
        );


    if (
        type === "general"
    ) {

        buttons[0]?.classList.add(
            "active"
        );

    }

    else {

        buttons[1]?.classList.add(
            "active"
        );

    }

}


/* =====================================================
   MODAL DE RECORDE
===================================================== */

function openRecordModal(time) {

    const modal =
        document.getElementById(
            "recordModal"
        );


    const recordTime =
        document.getElementById(
            "recordTime"
        );


    const playerName =
        document.getElementById(
            "playerName"
        );


    if (recordTime) {

        recordTime.textContent =
            time;

    }


    if (playerName) {

        playerName.value =
            gameData.playerName;

    }


    if (modal) {

        modal.classList.add(
            "show"
        );

    }

}


function closeRecordModal() {

    const modal =
        document.getElementById(
            "recordModal"
        );


    if (modal) {

        modal.classList.remove(
            "show"
        );

    }

}


function saveRecord() {

    const nameInput =
        document.getElementById(
            "playerName"
        );

    const recordTime =
        document.getElementById(
            "recordTime"
        );


    if (!nameInput || !recordTime) {

        return;

    }


    const time =
        recordTime.textContent;


    const name =
        nameInput.value
            .trim()
            .toUpperCase();


    if (!name) {

        alert(
            "Digite um nome para o Hall da Fama."
        );

        return;

    }


    gameData.playerName =
        name;


    gameData.hallOfFame.push({

        name,

        level:
            gameData.currentLevel,

        time,

        date:
            new Date()
                .toLocaleDateString(
                    "pt-BR"
                )

    });


    saveData();

    closeRecordModal();

}


/* =====================================================
   MÚSICA DE FUNDO — PIANO CLÁSSICO
   Web Audio API
===================================================== */

let musicContext = null;

let musicMasterGain = null;

let musicTimer = null;

let musicStarted = false;

let musicEnabled =
    localStorage.getItem("musicEnabled") !== "false";


/* =====================================================
   CONFIGURAÇÃO DA MÚSICA
===================================================== */

const MUSIC_TEMPO = 72;

const MUSIC_BEAT =
    60 / MUSIC_TEMPO;


/* =====================================================
   MELODIA
===================================================== */

const MUSIC_MELODY = [

    ["E4", 1],
    ["G4", 1],
    ["B4", 2],

    ["A4", 1],
    ["G4", 1],
    ["E4", 2],

    ["D4", 1],
    ["F#4", 1],
    ["A4", 2],

    ["G4", 1],
    ["F#4", 1],
    ["D4", 2],

    ["C4", 1],
    ["E4", 1],
    ["G4", 2],

    ["F#4", 1],
    ["A4", 1],
    ["C5", 2],

    ["B4", 1],
    ["A4", 1],
    ["G4", 1],
    ["E4", 1],

    ["D4", 2],
    ["E4", 1],
    ["G4", 1],

    ["B4", 1],
    ["D5", 1],
    ["G5", 2],

    ["F#5", 1],
    ["E5", 1],
    ["D5", 2],

    ["C5", 1],
    ["E5", 1],
    ["A5", 2],

    ["G5", 1],
    ["F#5", 1],
    ["E5", 2],

    ["D5", 1],
    ["F#5", 1],
    ["A5", 2],

    ["G5", 1],
    ["E5", 1],
    ["C5", 2],

    ["B4", 1],
    ["A4", 1],
    ["G4", 2],

    ["E4", 4]

];


/* =====================================================
   ACORDES
===================================================== */

const MUSIC_CHORDS = [

    ["C3", "G3", "C4", "E4"],

    ["G2", "D3", "G3", "B3"],

    ["A2", "E3", "A3", "C4"],

    ["F2", "C3", "F3", "A3"],

    ["C3", "G3", "C4", "E4"],

    ["A2", "E3", "A3", "C4"],

    ["D3", "A3", "D4", "F#4"],

    ["G2", "D3", "G3", "B3"]

];


/* =====================================================
   NOTA → FREQUÊNCIA
===================================================== */

function noteFrequency(note) {

    const notes = {

        C: 0,
        "C#": 1,
        D: 2,
        "D#": 3,
        E: 4,
        F: 5,
        "F#": 6,
        G: 7,
        "G#": 8,
        A: 9,
        "A#": 10,
        B: 11

    };


    const match =
        note.match(
            /^([A-G]#?)(\d)$/
        );


    if (!match) {

        return 440;

    }


    const name =
        match[1];


    const octave =
        Number(match[2]);


    const midi =
        (octave + 1) * 12 +
        notes[name];


    return 440 *
        Math.pow(
            2,
            (midi - 69) / 12
        );

}


/* =====================================================
   PIANO
===================================================== */

function playPianoNote(
    note,
    startTime,
    duration,
    volume = 0.12
) {

    if (
        !musicContext ||
        !musicMasterGain
    ) {

        return;

    }


    const frequency =
        noteFrequency(note);


    const oscillator1 =
        musicContext.createOscillator();


    const oscillator2 =
        musicContext.createOscillator();


    const gain =
        musicContext.createGain();


    const filter =
        musicContext.createBiquadFilter();


    oscillator1.type =
        "triangle";


    oscillator2.type =
        "sine";


    oscillator1.frequency.value =
        frequency;


    oscillator2.frequency.value =
        frequency * 2;


    oscillator2.detune.value =
        3;


    filter.type =
        "lowpass";


    filter.frequency.value =
        3200;


    filter.Q.value =
        0.7;


    oscillator1.connect(filter);

    oscillator2.connect(filter);

    filter.connect(gain);

    gain.connect(
        musicMasterGain
    );


    gain.gain.setValueAtTime(
        0.0001,
        startTime
    );


    gain.gain.exponentialRampToValueAtTime(
        volume,
        startTime + 0.015
    );


    gain.gain.exponentialRampToValueAtTime(
        volume * 0.45,
        startTime + 0.25
    );


    gain.gain.exponentialRampToValueAtTime(
        0.0001,
        startTime + duration
    );


    oscillator1.start(startTime);

    oscillator2.start(startTime);

    oscillator1.stop(
        startTime + duration
    );

    oscillator2.stop(
        startTime + duration
    );

}


/* =====================================================
   ACORDE
===================================================== */

function playChord(
    chord,
    startTime,
    duration
) {

    chord.forEach(note => {

        playPianoNote(
            note,
            startTime,
            duration,
            0.025
        );

    });

}


/* =====================================================
   AGENDAR MÚSICA
===================================================== */

function scheduleMusic() {

    if (
        !musicContext ||
        !musicMasterGain ||
        !musicEnabled
    ) {

        return;

    }


    const start =
        musicContext.currentTime + 0.05;


    let time = start;


    for (
        let i = 0;
        i < MUSIC_CHORDS.length;
        i++
    ) {

        playChord(
            MUSIC_CHORDS[i],
            time,
            MUSIC_BEAT * 4
        );


        time +=
            MUSIC_BEAT * 4;

    }


    time = start;


    MUSIC_MELODY.forEach(item => {

        const note =
            item[0];


        const beats =
            item[1];


        const duration =
            beats * MUSIC_BEAT;


        playPianoNote(
            note,
            time,
            duration * 0.95,
            0.11
        );


        time += duration;

    });


    const totalDuration =
        time - start;


    musicTimer =
        setTimeout(
            () => {

                if (musicEnabled) {

                    scheduleMusic();

                }

            },
            Math.max(
                100,
                (totalDuration - 0.15) * 1000
            )
        );

}


/* =====================================================
   INICIAR MÚSICA
===================================================== */

function startMusic() {

    if (!musicEnabled) {

        return;

    }


    if (!musicContext) {

        const AudioContextClass =
            window.AudioContext ||
            window.webkitAudioContext;


        if (!AudioContextClass) {

            console.log(
                "Web Audio API não disponível."
            );

            return;

        }


        musicContext =
            new AudioContextClass();


        musicMasterGain =
            musicContext.createGain();


        musicMasterGain.gain.value =
            0.35;


        musicMasterGain.connect(
            musicContext.destination
        );

    }


    if (
        musicContext.state ===
        "suspended"
    ) {

        musicContext.resume();

    }


    if (musicStarted) {

        return;

    }


    musicStarted = true;


    scheduleMusic();

    updateMusicButton();

}


/* =====================================================
   PARAR MÚSICA
===================================================== */

function stopMusic() {

    musicEnabled = false;


    localStorage.setItem(
        "musicEnabled",
        "false"
    );


    if (musicTimer) {

        clearTimeout(
            musicTimer
        );

        musicTimer = null;

    }


    if (
        musicMasterGain &&
        musicContext
    ) {

        musicMasterGain.gain.cancelScheduledValues(
            musicContext.currentTime
        );


        musicMasterGain.gain.setTargetAtTime(
            0,
            musicContext.currentTime,
            0.08
        );

    }


    musicStarted = false;

    updateMusicButton();

}


/* =====================================================
   LIGAR / DESLIGAR
===================================================== */

function toggleMusic() {

    if (musicEnabled) {

        stopMusic();

        return;

    }


    musicEnabled = true;


    localStorage.setItem(
        "musicEnabled",
        "true"
    );


    if (
        musicMasterGain &&
        musicContext
    ) {

        musicMasterGain.gain.cancelScheduledValues(
            musicContext.currentTime
        );


        musicMasterGain.gain.setTargetAtTime(
            0.35,
            musicContext.currentTime,
            0.08
        );

    }


    startMusic();

}


/* =====================================================
   BOTÃO DA MÚSICA
===================================================== */

function updateMusicButton() {

    const button =
        document.getElementById(
            "musicButton"
        );


    if (!button) {

        return;

    }


    button.textContent =
        musicEnabled
            ? "🎵"
            : "🔇";

}


/* =====================================================
   PRIMEIRA INTERAÇÃO
===================================================== */

document.addEventListener(
    "click",
    () => {

        if (
            musicEnabled &&
            !musicStarted
        ) {

            startMusic();

        }

    }
);


/* =====================================================
   INICIALIZAÇÃO DO BOTÃO
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        updateMusicButton();

    }
);


/* =====================================================
   BANCO DE PALAVRAS PERSONALIZADO
===================================================== */

let customWordBank = [];


/* =====================================================
   CARREGAR BANCO PERSONALIZADO
===================================================== */

function loadCustomWordBank() {

    try {

        const saved =
            localStorage.getItem(
                "customWordBank"
            );


        if (saved) {

            customWordBank =
                JSON.parse(saved);

        }

    }

    catch (error) {

        customWordBank = [];

    }

}


/* =====================================================
   SALVAR BANCO
===================================================== */

function saveCustomWordBank() {

    localStorage.setItem(

        "customWordBank",

        JSON.stringify(
            customWordBank
        )

    );

}


/* =====================================================
   NORMALIZAR PALAVRA
===================================================== */

function normalizeWord(word) {

    return word

        .normalize("NFD")

        .replace(
            /[\u0300-\u036f]/g,
            ""
        )

        .replace(
            /[^A-Za-z]/g,
            ""
        )

        .toUpperCase();

}


/* =====================================================
   EXTRAIR PALAVRAS
===================================================== */

function extractWords(text) {

    if (!text) {

        return [];

    }


    const rawWords =
        text.match(
            /[A-Za-zÀ-ÿ]+/g
        ) || [];


    const words =
        rawWords

            .map(
                word =>
                    normalizeWord(
                        word
                    )
            )

            .filter(
                word =>
                    word.length >= 5
            )

            .filter(
                word =>
                    word.length <= 15
            );


    return [
        ...new Set(
            words
        )
    ];

}


/* =====================================================
   PROCESSAR TEXTO
===================================================== */

function processSourceText() {

    const textarea =
        document.getElementById(
            "sourceText"
        );


    const result =
        document.getElementById(
            "importResult"
        );


    if (!textarea) return;


    const text =
        textarea.value.trim();


    if (!text) {

        if (result) {

            result.innerHTML =

                `<span class="import-warning">
                    Cole algum texto primeiro.
                 </span>`;

        }

        return;

    }


    const words =
        extractWords(
            text
        );


    if (!words.length) {

        if (result) {

            result.innerHTML =

                `<span class="import-warning">
                    Não encontrei palavras com
                    5 letras ou mais.
                 </span>`;

        }

        return;

    }


    customWordBank =
        words;


    saveCustomWordBank();


    if (result) {

        result.innerHTML =

            `<span class="import-success">
                ✓ Texto processado com sucesso!
             </span>
             <br><br>
             Foram encontradas
             <strong>${words.length}</strong>
             palavras.
             <br><br>
             O próximo caça-palavras usará
             automaticamente esse banco.`;

    }

}


/* =====================================================
   IMPORTAR ARQUIVO TXT
===================================================== */

function setupFileImport() {

    const fileInput =
        document.getElementById(
            "textFile"
        );


    if (!fileInput) return;


    fileInput.addEventListener(
        "change",
        event => {

            const file =
                event.target.files[0];


            if (!file) return;


            const reader =
                new FileReader();


            reader.onload =
                function(event) {

                    const text =
                        event.target.result;


                    const textarea =
                        document.getElementById(
                            "sourceText"
                        );


                    if (textarea) {

                        textarea.value =
                            text;

                    }


                    processSourceText();

                };


            reader.onerror =
                function() {

                    alert(
                        "Não foi possível ler o arquivo."
                    );

                };


            reader.readAsText(
                file,
                "UTF-8"
            );

        }
    );

}


/* =====================================================
   BANCO USADO PELO JOGO
===================================================== */

function getActiveWordBank() {

    if (
        customWordBank.length >= 5
    ) {

        return customWordBank;

    }


    return WORD_BANK;

}


/* =====================================================
   NOVA SELEÇÃO DE PALAVRAS
===================================================== */

function selectWords(count, size) {

    const bank = getActiveWordBank();

    /*
       Só aceita palavras que realmente
       cabem no tabuleiro.
    */
    const possible = bank.filter(word => {

        return (
            word.length >= 5 &&
            word.length <= size
        );

    });

    /*
       Embaralha as palavras.
    */
    const shuffled = [...possible];

    for (
        let i = shuffled.length - 1;
        i > 0;
        i--
    ) {

        const j = Math.floor(
            Math.random() * (i + 1)
        );

        [
            shuffled[i],
            shuffled[j]
        ] = [
            shuffled[j],
            shuffled[i]
        ];

    }

    /*
       Retorna somente a quantidade
       que realmente poderá ser colocada.
    */
    return shuffled.slice(0, count);

}

/* =====================================================
   PWA — SERVICE WORKER
===================================================== */

if (
    "serviceWorker" in navigator
) {

    window.addEventListener(
        "load",
        () => {

            /*
               Service Worker só funciona
               em HTTPS ou localhost.

               Quando abrimos o index.html
               diretamente pelo arquivo,
               o protocolo é file:// e o navegador
               bloqueia o registro.

               Por isso verificamos o protocolo
               antes de tentar registrar.
            */

            if (
                location.protocol === "https:" ||
                location.hostname === "localhost" ||
                location.hostname === "127.0.0.1"
            ) {

                navigator.serviceWorker
                    .register(
                        "./service-worker.js"
                    )
                    .then(
                        registration => {

                            console.log(
                                "PWA ativado:",
                                registration.scope
                            );

                        }
                    )
                    .catch(
                        error => {

                            console.error(
                                "Erro no PWA:",
                                error
                            );

                        }
                    );

            }

        }

    );

}
/* =====================================================
   REINICIAR NÍVEL
===================================================== */

function restartLevel() {

    const confirmRestart =
        confirm(
            "🔄 Reiniciar este nível?\n\n" +
            "Todo o progresso deste nível será perdido."
        );

    if (!confirmRestart) {
        return;
    }

    startLevel(
        gameData.currentLevel
    );

}

/* =====================================================
   INICIAR JOGO COM MÚSICA
===================================================== */

function startGameWithMusic() {

   startMusic() {

    openScreen(
        "gameScreen"
    );

}
