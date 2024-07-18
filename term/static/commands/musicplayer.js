export default {
    execute: function(args, terminal) {
        const musicPlayer = document.createElement('div');
        musicPlayer.className = 'music-player';
        musicPlayer.innerHTML = `
            <input type="file" id="file-input" accept="audio/*" multiple style="display:none;">
            <button id="add-music-button">Add Music</button>
            <ul id="music-list"></ul>
            <audio id="audio-player" controls style="display:none;">
                <source id="audio-source" src="" type="audio/mpeg">
                Your browser does not support the audio element.
            </audio>
            <div class="controls">
                <button id="play-button">Play</button>
                <button id="pause-button">Pause</button>
                <button id="next-button">Next</button>
                <button id="back-button">Back</button>
                <button id="mute-button">Mute</button>
            </div>
        `;
        terminal.outputElement.appendChild(musicPlayer);

        const fileInput = document.getElementById('file-input');
        const addMusicButton = document.getElementById('add-music-button');
        const musicList = document.getElementById('music-list');
        const audioPlayer = document.getElementById('audio-player');
        const audioSource = document.getElementById('audio-source');

        let tracks = [];
        let currentTrackIndex = 0;

        const loadTrack = (index) => {
            if (tracks.length > 0) {
                audioSource.src = tracks[index].src;
                audioPlayer.load();
                audioPlayer.style.display = 'block';
                audioPlayer.play();
            }
        };

        addMusicButton.addEventListener('click', () => fileInput.click());

        fileInput.addEventListener('change', (event) => {
            const files = event.target.files;
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const url = URL.createObjectURL(file);
                tracks.push({ name: file.name, src: url });

                const listItem = document.createElement('li');
                listItem.textContent = file.name;
                listItem.addEventListener('click', () => {
                    currentTrackIndex = i;
                    loadTrack(currentTrackIndex);
                });
                musicList.appendChild(listItem);
            }
        });

        document.getElementById('play-button').addEventListener('click', () => audioPlayer.play());
        document.getElementById('pause-button').addEventListener('click', () => audioPlayer.pause());
        document.getElementById('next-button').addEventListener('click', () => {
            if (tracks.length > 0) {
                currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
                loadTrack(currentTrackIndex);
            }
        });
        document.getElementById('back-button').addEventListener('click', () => {
            if (tracks.length > 0) {
                currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
                loadTrack(currentTrackIndex);
            }
        });
        document.getElementById('mute-button').addEventListener('click', () => {
            audioPlayer.muted = !audioPlayer.muted;
        });
    },
    description: 'A music player with controls and playlist'
};
