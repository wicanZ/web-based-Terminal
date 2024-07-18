export default {
    execute: function(args, terminal) {
        const text = args.join(' ') || 'Hello';
        const lettersArt = {
            A: ['  A  ', ' A A ', 'AAAAA', 'A   A'],
            B: ['BBBB ', 'B   B', 'BBBB ', 'B   B', 'BBBB '],
            C: [' CCC ', 'C   C', 'C    ', 'C   C', ' CCC '],
            D: ['DDD  ', 'D  D ', 'D   D', 'D  D ', 'DDD  '],
            // Add more letters as needed
        };

        const lines = ['', '', '', '', ''];

        for (const char of text.toUpperCase()) {
            if (lettersArt[char]) {
                for (let i = 0; i < 5; i++) {
                    lines[i] += lettersArt[char][i] + ' ';
                }
            } else {
                for (let i = 0; i < 5; i++) {
                    lines[i] += '     ';
                }
            }
        }

        lines.forEach(line => terminal.printLine(line));
    },
    description: 'Convert text into stylized letters'
};
