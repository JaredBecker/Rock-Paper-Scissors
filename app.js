/* ======================================= */
/* ----- THE BRAINS BEHIND THE GAMES ----- */
/* ======================================= */
let playersScore;
let pcScore;
let winning_score;
let playersCurrentSelection;
let pcsCurrentSelection;
const selections = [
    {
        weapon: 'rock',
        icon: '✊',
        beats: 'scissors'
    },
    {
        weapon: 'paper',
        icon: '✋',
        beats: 'rock'
    },
    {
        weapon: 'scissors',
        icon: '✌',
        beats: 'paper'
    }
]
let failClips = ['why_are_you_gae.mp3', 'sad_tune.mp3', 'youstoopid.mp3', 'know_the_way.mp3', 'combobreaker.mp3', 'wud.mp3', 'wrong.mp3', 'haha.mp3', 'oof.mp3', 'shutup.mp3'];
let winClips = ['thats_pretty_good.mp3', 'yeet.mp3', 'wow.mp3', 'legitness.mp3', 'noice.mp3', 'headshot.mp3', 'winwinwin.mp3', 'success.mp3'];

function selectOption(el) {
    let playersOption = el.dataset.option;
    let pcsOption = pcWeaponDraw();
    whoWinsRound(playersOption, pcsOption);
}

function pcWeaponDraw() {
    let pcOption = Math.floor(Math.random() * selections.length);
    return selections[pcOption];
}

function whoWinsRound(player, pc) {
    selections.forEach(selection => {
        if (player == selection.weapon) {
            playersCurrentSelection = selection;
            pcsCurrentSelection = pc;
            
            if (selection.beats == pc.weapon) {
                playersScore++;
                playAudio('win', false)
                updateRemainder();
                drawResults('player');
            }
            if (pc.beats == selection.weapon) {
                pcScore++;
                playAudio('lose', false)
                drawResults('pc');
            }
            if (selection.weapon == pc.weapon) {
                let audio = document.getElementById('audio');
                audio.setAttribute('src', 'assets/audio/draw.mp3');
                audio.play();
                drawResults('draw');
            }
            isGameFinished();
        }
    })
}

function drawResults(winner) {
    let outcomesContainer = document.getElementById('outcomes');
    let playerDiv = document.createElement('div');
    let pcDiv = document.createElement('div');
    
    if (winner == 'player') {
        playerDiv.classList.add('col-6', 'winner');
        pcDiv.classList.add('col-6', 'loser');
    }
    if (winner == 'pc') {
        playerDiv.classList.add('col-6', 'loser');
        pcDiv.classList.add('col-6', 'winner');
    }
    if (winner == 'draw') {
        playerDiv.classList.add('col-6', 'loser');
        pcDiv.classList.add('col-6', 'loser');
    }
    
    playerDiv.innerText = playersCurrentSelection.icon;
    pcDiv.innerText = pcsCurrentSelection.icon;
    outcomesContainer.insertBefore(playerDiv, outcomesContainer.childNodes[0]);
    outcomesContainer.insertBefore(pcDiv, outcomesContainer.childNodes[1]);
    updateScores();
}

function updateScores() {
    document.getElementById('you').innerText = playersScore;
    document.getElementById('pc').innerText = pcScore;
}

function updateRemainder() {
    let points_left = winning_score - playersScore;
    document.querySelector('.remainder').innerText = points_left;
}

function isGameFinished() {
    if (playersScore == winning_score) {
        let confettiSettings = {
            target: 'make-it-rain',
            start_from_edge: true,
            rotate: true,
            clock: 50,
            size: 1.5,
            max: 300
        };
        let confetti = new ConfettiGenerator(confettiSettings);
        confetti.render();
        playAudio('win', true);
        Swal.fire({
            icon: 'success',
            title: 'You Win!',
            text: 'Noice! You rick rolled a PC!',
            confirmButtonText: 'Restart Game'
        }).then((result) => {
            if (result) {
                confetti.clear();
                let audio = document.getElementById('audio');
                audio.pause();
                audio.currentTime = 0;
                startGame(winning_score);
            }
        })
    }
    if (pcScore == winning_score) {
        playAudio('lose', true);
        Swal.fire({
            icon: 'error',
            title: 'You Lost!',
            text: 'Sucks to be you right now!',
            confirmButtonText: 'Restart Game'
        }).then((result) => {
            if (result) {
                let audio = document.getElementById('audio');
                audio.pause();
                audio.currentTime = 0;
                startGame(winning_score);
            }
        })
    }
}

function playAudio(outcome, gameComplete) {
    let clip;
    let audio = document.getElementById('audio');
    if (!gameComplete) {     
        if (outcome == 'win') {
            clip = winClips[Math.floor(Math.random() * winClips.length)]
        } else {
            clip = failClips[Math.floor(Math.random() * failClips.length)]
        }
        audio.setAttribute('src', 'assets/audio/' + clip);
    } else {
        clip = outcome == 'win' ? 'shooting_stars.mp3' : 'you_fail.mp3';
        audio.setAttribute('src', 'assets/audio/' + clip);
    } 
    audio.play();
}

function openSettings() {
    Swal.fire({
        icon: 'info',
        title: 'Settings',
        html: `
            <p>Changing settings will reset your current game</p>
            <hr>
             <div class="form-group row align-items-center">
                <label class="col-6 text-right">Points required to win</label>
                <input type="text" class="form-control col-6 text-center" size="2" id="winning_score">
            </div>
        `,
        confirmButtonText: 'Save'
        
    }).then((result) => {
        if (result.isConfirmed) {
            winning_score = document.getElementById('winning_score').value;
            Swal.fire({
                icon: 'success',
                title: 'Settings Save',
                timer: 1000,
                showConfirmButton: false
            })
            startGame(winning_score);
        }
    });
    document.getElementById('winning_score').value = winning_score;
}

function startGame(win_score) {
    playersScore = 0;
    pcScore = 0;
    winning_score = win_score != undefined ? win_score : 3;
    playersCurrentSelection = {};
    pcsCurrentSelection = {};
    document.querySelector('.remainder').innerText = winning_score;
    document.getElementById('outcomes').innerHTML = '';
    document.getElementById('you').innerText = 0;
    document.getElementById('pc').innerText = 0;  
}
startGame();