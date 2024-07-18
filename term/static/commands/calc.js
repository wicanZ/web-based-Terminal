export default {
    async execute(args, terminal) {
        const expression = args.join(' ').trim();

        try {
            // Validate the expression (basic check for a mathematical expression)
            if (!expression) {
                throw new Error("No expression provided");
            }

            // Replace any potential issues with the expression
            const sanitizedExpression = expression.replace(/[^-()\d/*+.]/g, '');

            terminal.printLine(sanitizedExpression) ;
            
            // Evaluate the expression
            const result = eval(sanitizedExpression);
            terminal.displayOutput(`Result: ${result}`);
        } catch (e) {
            terminal.displayOutput(`Error: Invalid expression. ${e.message}`);
        }
    },
    description: 'Evaluate a mathematical expression',
    args: {
        "expression": "The mathematical expression to evaluate"
    }
};

