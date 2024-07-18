export default {
    execute: function(args, terminal) {
        console.log("Music command executed");
        
        // Create a file input element if it doesn't already exist
        if (!terminal.musicFileInput) {
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = 'audio/*';
            fileInput.style.display = 'none';
            
            fileInput.addEventListener('change', (event) => {
                const file = event.target.files[0];
                console.log("File selected:", file);
                if (file) {
                    this.playMusic(file, terminal);
                } else {
                    terminal.displayOutput("No file selected");
                }
            });

            terminal.element.appendChild(fileInput);
            terminal.musicFileInput = fileInput;
        }

        // Trigger the file input click event to open the file dialog
        terminal.musicFileInput.click();
    },
    playMusic(file, terminal) {
        console.log("Playing music:", file.name);
    
        // Create an audio element if it doesn't already exist
        if (!terminal.audioElement) {
            const audio = document.createElement('audio');
            audio.controls = true;
            terminal.element.appendChild(audio);
            terminal.audioElement = audio;
            audio.style.display = 'none';
        }
    
        // Set the selected file as the source of the audio element
        const url = URL.createObjectURL(file);
        terminal.audioElement.src = url;
    
        // Ensure the audio is loaded before attempting to play it
        terminal.audioElement.addEventListener('canplay', () => {
            terminal.audioElement.play()
                .then(() => {
                    terminal.displayOutput(`Playing: ${file.name}`);
                })
                .catch(error => {
                    terminal.displayOutput(`Error playing file: ${error}`);
                });
        });
    
        // Handle errors during audio load
        terminal.audioElement.addEventListener('error', (event) => {
            terminal.displayOutput(`Error loading audio: ${event.message}`);
        });
    },
    description: 'Select and play an audio file (MP3)'
};
