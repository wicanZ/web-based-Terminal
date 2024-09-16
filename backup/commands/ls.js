export default {
    execute: async function(args, terminal) {
        const commandWithArgs = `ls ${args.join(' ')}`;
        const currentDir = localStorage.getItem('current_dir') || '/';

        const response = await fetch('/execute_command/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': terminal.getCookie('csrftoken')
            },
            body: JSON.stringify({ command: commandWithArgs, current_dir: currentDir })
        });

        const data = await response.json();
        console.log(data) ; 
        
        if (data.error) {
            terminal.printLine(data.error);
            return;
        }

        terminal.displayOutput = function(content) {
            this.outputElement.innerHTML = 'ok';
            const rows = this.formatData(content);
            this.printTable(rows);
        };

        terminal.formatData = function(content) {
            const commands = content.map(item => item.name);
            const numCols = 5; // Number of columns in the table
            const rows = [];
            
            for (let i = 0; i < commands.length; i += numCols) {
                const row = commands.slice(i, i + numCols);
                rows.push(row);
            }
            return rows;
        };

        terminal.printTable = function(rows) {
            const table = document.createElement('table');
            table.style.width = '100%';
            table.style.borderCollapse = 'collapse';

            rows.forEach(rowData => {
                const row = document.createElement('tr');
                rowData.forEach(command => {
                    const cell = document.createElement('td');
                    cell.style.border = '1px dashed white';
                    cell.style.padding = '5px';
                    cell.innerText = command || '';
                    
                    // Add click and touch event listeners
                    cell.addEventListener('click', () => this.handleCommandClick(command));
                    cell.addEventListener('touchstart', () => this.handleCommandClick(command));
                    
                    row.appendChild(cell);
                });
                table.appendChild(row);
            });

            this.outputElement.appendChild(table);
            this.outputElement.scrollTop = this.outputElement.scrollHeight;
        };

        terminal.handleCommandClick = function(command) {
            if (command) {
                this.printLine(`Navigating to ${command}...`);
                this.execute([command], terminal);
            }
        };

        terminal.displayOutput(data.response);
    },
    description: 'List directory contents'
};
