export default {
    execute: async function(args, terminal) {
        const musicInput = document.createElement('input');
        musicInput.type = 'file';
        musicInput.accept = 'audio/*';
        musicInput.style.display = 'none';

        musicInput.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                const audio = new Audio(URL.createObjectURL(file));
                audio.play();

                terminal.displayOutput(`Playing ${file.name}`);
                terminal.audio = audio;
            }
        });

        document.body.appendChild(musicInput);
        musicInput.click();

        musicInput.addEventListener('remove', () => {
            musicInput.remove();
        });
    },
    description: 'Play a music file from your system'
};
