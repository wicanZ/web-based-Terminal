export default {
    execute: async function(args, terminal) {
        const commands = Object.keys(terminal.commands);
        const numCols = 6;
        const rows = [];

        // Organize commands into rows of 5 columns
        for (let i = 0; i < commands.length; i += numCols) {
            const row = commands.slice(i, i + numCols);
            rows.push(row);
        }

        // Print the table
        this.printTable(rows, terminal);
    },
    printTable : async function(rows, terminal) {
        const table = document.createElement('table');
        table.style.width = '100%';
        table.style.borderCollapse = 'collapse';

        rows.forEach(rowData => {
            const row = document.createElement('tr');
            rowData.forEach(command => {
                const cell = document.createElement('td');
                cell.style.border = '1px dashed white';
                cell.style.padding = '5px';
                cell.style.margin = '10px';
                cell.innerText = command || '';
                row.appendChild(cell);
            });
            table.appendChild(row);
        });

        terminal.outputElement.appendChild(table);
        terminal.outputElement.scrollTop = terminal.outputElement.scrollHeight;
    },

    description: 'Display available commands in a 5x5 table format'
};
