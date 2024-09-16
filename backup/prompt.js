function getRandomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

const colors = ["#FF5733", "#33FF57", "#3357FF", "#FF33A1", "#A133FF", "#FFD733"];
const fonts = ["monospace", "Arial", "Courier New", "Times New Roman", "Verdana"];
const fontWeights = ["normal", "bold", "bolder", "lighter"];
const textDecorations = ["none", "underline", "overline", "line-through"];

export default {
    execute: function(args, terminal) {
        const randomColor = getRandomElement(colors);
        const randomFont = getRandomElement(fonts);
        const randomFontWeight = getRandomElement(fontWeights);
        const randomTextDecoration = getRandomElement(textDecorations);

        terminal.promptElement.style.color = randomColor;
        terminal.promptElement.style.fontFamily = randomFont;
        terminal.promptElement.style.fontWeight = randomFontWeight;
        terminal.promptElement.style.textDecoration = randomTextDecoration;

        terminal.displayOutput(`Prompt style updated: color=${randomColor}, font=${randomFont}, weight=${randomFontWeight}, decoration=${randomTextDecoration}`);
    },
    description: 'Change the prompt style to a random one'
};
