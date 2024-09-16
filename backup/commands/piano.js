export default {
    execute: function(args, terminal) {
        const notes = {
            'a': 'C4',
            's': 'D4',
            'd': 'E4',
            'f': 'F4',
            'g': 'G4',
            'h': 'A4',
            'j': 'B4',
            'k': 'C5',
        };

        const audioContext = new (window.AudioContext || window.webkitAudioContext)();

        function playNote(note) {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.type = 'sine';
            oscillator.frequency.value = noteToFrequency(note);
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.5);
        }

        function noteToFrequency(note) {
            const A4 = 440;
            const notes = {
                'C4': -9, 'C#4': -8, 'D4': -7, 'D#4': -6, 'E4': -5,
                'F4': -4, 'F#4': -3, 'G4': -2, 'G#4': -1, 'A4': 0,
                'A#4': 1, 'B4': 2, 'C5': 3
            };
            return A4 * Math.pow(2, notes[note] / 12);
        }

        terminal.printLine("Piano game started! Press keys 'a' through 'k' to play notes.");
        terminal.printLine("Type 'exit' to stop the game.");

        function handleKeyPress(event) {
            const key = event.key.toLowerCase();
            if (key === 'exit') {
                document.removeEventListener('keydown', handleKeyPress);
                terminal.printLine("Piano game exited.");
                return;
            }

            if (notes[key]) {
                terminal.printLine(`Playing note: ${notes[key]}`);
                playNote(notes[key]);
            } else {
                terminal.printLine("Invalid key. Use keys 'a' through 'k' to play notes.");
            }
        }

        document.addEventListener('keydown', handleKeyPress);
    },
    description: 'Play a piano game with your keyboard'
};
