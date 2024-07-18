const fortunes = [
    "You will have a great day!",
    "Good news will come your way soon.",
    "Expect the unexpected.",
    "Happiness is just around the corner.",
    "You will achieve your dreams."
];

export default {
    execute: function(args, terminal) {
        const randomIndex = Math.floor(Math.random() * fortunes.length);
        terminal.animateTextLine(fortunes[randomIndex]);
    },
    description: 'Displays a random fortune message'
};
