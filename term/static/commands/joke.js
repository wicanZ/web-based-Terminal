const jokes = [
    "Why don't scientists trust atoms? Because they make up everything!",
    "How does a penguin build its house? Igloos it together.",
    "Why don't programmers like nature? It has too many bugs.",
    "What do you call fake spaghetti? An impasta."
];

export default {
    execute: function(args, terminal) {
        const randomIndex = Math.floor(Math.random() * jokes.length);
        terminal.animateTextLine(jokes[randomIndex]);
    },
    description: 'Displays a random joke'
};
