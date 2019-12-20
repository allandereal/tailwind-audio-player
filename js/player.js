// for legacy browsers
const AudioContext = window.AudioContext || window.webkitAudioContext;

//context
const audioContext = new AudioContext();

//volume
const gainNode = audioContext.createGain();

window.onload = function(){
    //player fields
    let durationField = document.getElementById('duration');
    let progressCount = document.getElementById('progress');
    //let mainProgressBar = document.getElementById('mainProgressBar');
    let progressBar = document.getElementById('progressBar');
    let progressBullet = document.getElementById('progressBullet');

// get the audio element
    const audioElement = document.querySelector('audio');
    let audioDuration = audioElement.duration;
    let audioMinutes = Math.floor(audioDuration/60);
    let audioSeconds = Math.floor(audioDuration - audioMinutes*60);

    let currentTime = 0;
    let currentMinutes = 0;
    let currentSeconds = 0;

    durationField.innerText = audioMinutes +':'+audioSeconds || '00:00';


// pass it into the audio context
    const track = audioContext.createMediaElementSource(audioElement);

    track.connect(gainNode).connect(audioContext.destination);

//initialize volume
    gainNode.gain.value = 1;


// select our play button
    const playButton = document.getElementById('play');
    const pauseBgImage = "url('images/icomoon/entypo-25px-ffffff/SVG/pause.svg') no-repeat center";
    const playBgImage = "url('images/icomoon/entypo-25px-ffffff/SVG/play.svg') no-repeat center";

    playButton.addEventListener('click', function() {

        // check if context is in suspended state (autoplay policy)
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }

        // play or pause track depending on state
        if (this.dataset.playing === 'false') {
            audioElement.play();
            this.dataset.playing = 'true';
            playButton.style.background = pauseBgImage;
        } else if (this.dataset.playing === 'true') {
            audioElement.pause();
            this.dataset.playing = 'false';
            playButton.style.background = playBgImage;
        }

    }, false);

    audioElement.addEventListener('ended', () => {
        playButton.dataset.playing = 'false';
        playButton.style.background = playBgImage;
    }, false);

    audioElement.addEventListener('timeupdate', () => {
        currentTime = audioElement.currentTime;
        currentMinutes = Math.floor(currentTime/60);
        currentSeconds = Math.floor(currentTime - currentMinutes*60);

        progressCount.innerText = currentMinutes +':'+(String(currentSeconds).padStart(2, '0')) || '00:00';
        progressBar.style.width = (currentTime/audioDuration)*100+'%';
        progressBullet.style.marginLeft = progressBar.style.width
    }, false);
};

function volumeControl(e) {
    let volumeController = document.getElementById('volumeController');
    let rect = e.target.getBoundingClientRect();
    let w = e.pageX - rect.left - 8;
    volumeController.style.clipPath = 'inset(0% '+(100 - (w/22)*100)+'% 0% 10%)';
    let gain = ((w/22)*2);
    gain = gain.toFixed(2);
    gainNode.gain.value = gain < 0.10 ? 0 : (gain > 2 ? 2 : gain);
    //console.log(gain);
}