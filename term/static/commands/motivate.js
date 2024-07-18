const quotes = [
    "Believe in yourself and all that you are. Know that there is something inside you that is greater than any obstacle.",
    "The only way to do great work is to love what you do.",
    "The harder you work for something, the greater you'll feel when you achieve it.",
    "Don't watch the clock; do what it does. Keep going."
];

export default {
    execute: function(args, terminal) {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        terminal.animateTextLine(quotes[randomIndex]);
    },
    description: 'Displays a random motivational quote'
};
