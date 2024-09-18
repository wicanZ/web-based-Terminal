class PythonInterpreter {
    constructor(terminal) {
        this.terminal = terminal;
        this.pythonInputElement = document.getElementById('python-input-field');
        this.pythonPromptElement = document.getElementById('python-prompt');
        this.pyodide = null; // Initialize pyodide as null
    }

    async loadPyodideAndPackages() {
        return new Promise(resolve => {
            let script = document.createElement("script");
            script.src = "https://cdn.jsdelivr.net/pyodide/v0.21.3/full/pyodide.js";
            script.onload = async () => {
                while (!window.loadPyodide) {
                    await new Promise(res => setTimeout(res, 100));
                }
                this.pyodide = await window.loadPyodide({
                    stdout: (msg) => this.terminal.printLine(msg),
                    stderr: (msg) => this.terminal.printLine(msg, 'error')
                });
                resolve(this.pyodide);
            };
            document.head.appendChild(script);
        });
    }

    async enterPythonMode() {
        // Load Pyodide if not already loaded
        if (!this.pyodide) {
            await this.loadPyodideAndPackages();
        }

        this.terminal.inputElement.style.display = 'none';
        this.terminal.promptElement.style.display = 'none';
        document.querySelector('.command').style.display = 'none';
        this.pythonInputElement.style.display = 'flex';

        this.pythonInputElement.addEventListener("keydown", async (event) => {
            if (event.key === "Enter") {
                const commandLine = this.pythonInputElement.value.trim();
                const newCommand = document.createElement("div");
                newCommand.textContent = '>>> ' + commandLine;
                this.terminal.outputElement.appendChild(newCommand);

                if (commandLine.toLowerCase() === 'exit()' || commandLine.toLowerCase() === 'quit()') {
                    this.exitPythonMode();
                } else {
                    await this.executePython(commandLine);
                }

                this.pythonInputElement.value = '';
                this.pythonInputElement.focus();
                this.terminal.outputElement.scrollTop = this.terminal.outputElement.scrollHeight;
            }
        });
        this.pythonInputElement.focus();
    }

    exitPythonMode() {
        this.pythonInputElement.removeEventListener("keydown", this.enterPythonMode);
        this.pythonInputElement.style.display = 'none';
        document.querySelector('.command').style.display = 'flex';
        this.terminal.inputElement.style.display = 'flex';
        this.terminal.promptElement.style.display = 'inline';
    }

    async executePython(code) {
        try {
            let result = this.pyodide.runPython(code);
            if (result !== undefined) {
                this.terminal.printLine(result);
            }
        } catch (err) {
            this.terminal.printLine(err, 'error');
        }
    }
}

class TerminalStyle {
    constructor(terminal) {
        this.terminal = terminal;
    }

    setBorderColor(color) {
        this.terminal.style.borderColor = color;
    }

    setBoxShadow(shadow) {
        this.terminal.style.boxShadow = shadow;
    }

    setBackgroundColor(color) {
        this.terminal.style.backgroundColor = color;
    }

    setTextColor(color) {
        this.terminal.style.color = color;
    }

    setTitleBarColor(color) {
        this.terminal.style.setProperty('--title-bar-color', color);
    }

    setBorderRadius(radius) {
        this.terminal.style.borderRadius = radius;
    }

    setFontSize(size) {
        this.terminal.style.fontSize = size;
    }

    setPromptColor(color) {
        const prompts = this.terminal.querySelectorAll('.prompt');
        prompts.forEach(prompt => {
            prompt.style.color = color;
        });
    }

    setInputColor(color) {
        const inputs = this.terminal.querySelectorAll('.input');
        inputs.forEach(input => {
            input.style.color = color;
        });
    }

    resetStyles() {
        this.terminal.style.borderColor = '';
        this.terminal.style.boxShadow = '';
        this.terminal.style.backgroundColor = '';
        this.terminal.style.color = '';
        this.terminal.style.setProperty('--title-bar-color', '');
        this.terminal.style.borderRadius = '';
        this.terminal.style.fontSize = '';
        this.setPromptColor(''); // Reset prompt color
        this.setInputColor(''); // Reset input color
    }
}

class Terminal {
    constructor() {
        this.element = document.getElementById('terminal');
        this.outputElement = document.getElementById('output');
        this.inputElement = document.getElementById('input');
        this.pythonInputElement = document.getElementById('python-input-field');
        this.pythonPromptElement = document.getElementById('python-prompt');
        this.promptElement = document.getElementById('promptc');
        this.tabs = document.getElementById('tabs');
        this.newTabButton = document.getElementById('new-tab-button');
        this.fileInput = document.getElementById('fileInput');
        this.uploadForm = document.getElementById('uploadForm');
        this.loadingIndicator = document.getElementById('loading-indicator');

        this.terminalIndex = 1;
        this.activeTab = 0;
        this.tabStates = JSON.parse(localStorage.getItem('tabStates')) || {};
        this.commandHistory = [];
        this.historyIndex = 0;
        this.currentDir = localStorage.getItem('currentDir') || '/';
        this.pythonInterpreter = null;
        this.fontSize = 10;
        this.promptText = 'root@trsh';
        // Add properties for music
        this.musicFileInput = null;
        this.audioElement = null;
        this.audioPlayer = null;
        this.commands = {};
        this.commandCache = {};
        this.isScrolledToBottom = this.element.scrollHeight - this.element.clientHeight <= this.element.scrollTop + 1;
        this.typingSpeed = 35;

        // Bind event listeners
        this.inputElement.addEventListener('keydown', this.handleKeyDown.bind(this));
        document.getElementById('increaseFont').addEventListener('click', this.increaseFontSize.bind(this));
        document.getElementById('decreaseFont').addEventListener('click', this.decreaseFontSize.bind(this));
        window.addEventListener('click', this.handleWindowClick.bind(this));

        this.newTabButton.addEventListener('click', this.addNewTab.bind(this));
        this.initializeFirstTab();
        this.style = new TerminalStyle(this.element);
        // this.newTabButton.addEventListener('click', () => this.addNewTab());
        this.loadStyleFromStorage();
        //this.checkLoginStatus();
        //document.addEventListener('keydown', (event) => this.handleShortcut(event));
        this.inputCallback = null;
        this.inputEnabled = true;
        this.isLoggedIn = false;
        this.username = null;
        this.ip = null;
        this.applyLoadingIndicatorStyles();
        this.displayQuizStartTime();
        this.applySavedStyles() ;
        this.pressedKeys = new Set();
        document.addEventListener('keyup', (event) => this.handleKeyup(event));
    }

    applySavedStyles() {
        const savedStyle = localStorage.getItem('terminalStyle');
        if (savedStyle) {
            const style = JSON.parse(savedStyle);
            this.style.setBorderColor(style.borderColor);
            this.style.setBoxShadow(style.boxShadow);
            this.style.setBackgroundColor(style.backgroundColor);
            this.style.setTextColor(style.textColor);
            this.style.setTitleBarColor(style.titleBarColor);
            this.style.setBorderRadius(style.borderRadius);
            this.style.setFontSize(style.fontSize);
            this.style.setPromptColor(style.promptColor);
            this.style.setInputColor(style.inputColor);
            this.promptElement.textContent = style.promptText || '';
        }
    }

    async displayQuizStartTime() {
        try {
            const response = await fetch('/get_quiz_start_time/');
            if (response.ok) {
                const result = await response.json();
                const quizStartTime = new Date(result.start_time);
                const now = new Date();

                if (quizStartTime > now) {
                    this.printLine(`Quiz will start at: ${quizStartTime}`);
                } else {
                    this.printLine('Time to start the quiz type $ quiz');
                }
            } else {
                this.printLine('Error: Unable to fetch quiz start time.');
            }
        } catch (error) {
            this.printLine('Error: Unable to fetch quiz start time.');
        }
    }

    getCurrentUser() {
        return this.isLoggedIn ? this.username : 'Guest';
    }

    async checkLoginStatus() {
        try {
            const response = await fetch('/login_status/');
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const status = await response.json();
    
            if (status.is_logged_in) {
                // User is logged in, do nothing or update UI accordingly
                this.updatePrompt(status);
            } else {
                // User is not logged in, clear session and localStorage
                console.log('User is not logged in, clearing storage...');
                this.clearStorage();
                this.updatePrompt({ logged_in: false });
            }
        } catch (error) {
            console.error('Error fetching login status:', error);
            this.clearStorage();  // Also clear storage in case of any error (e.g., 403 or session expired)
            this.updatePrompt({ logged_in: false });
        }
    }
    
    clearStorage() {
        // Clear sessionStorage
        //sessionStorage.clear();
    
        // Clear localStorage
        localStorage.clear();
    
        // Optionally, you can clear specific keys if you don't want to clear everything
        // localStorage.removeItem('key');
        // sessionStorage.removeItem('key');
    }

    captureInput(callback) {
        this.inputCallback = callback;
    }

    enableInput() {
        this.inputEnabled = true;
        this.inputElement.disabled = true;
    }

    disableInput() {
        this.inputEnabled = false;
        this.inputElement.disabled = false;
    }


    updatePrompt(status) {
        if (status.logged_in) {
            this.promptText = `${status.username}@${status.ip}`;
        } else {
            this.promptText = 'guest@trsh';
        }
        this.renderPrompt();
    }

    renderPrompt() {
        this.promptElement.textContent = this.promptText;
    }

    loadStyleFromStorage() {
        const savedStyle = JSON.parse(localStorage.getItem('terminalStyle'));
        if (savedStyle) {
            this.element.style.backgroundColor = savedStyle.background;
            this.element.style.color = savedStyle.foreground;
            this.promptElement.style.color = savedStyle.prompt;
            this.promptText = savedStyle.promptText;
        }
    }


    // Method to print a line of text to the terminal
    printLine(text, className = '') {
        const line = document.createElement("div");
        line.className = className;
        line.innerHTML = text; // textContent
        this.outputElement.appendChild(line);
        this.outputElement.scrollTop = this.outputElement.scrollHeight + 10;
        if (this.isScrolledToBottom) {
            this.element.scrollTop = this.element.scrollHeight + 10;
        }
    }
    async animateTextLine(text) {
        const line = document.createElement('div');
        line.style.whiteSpace = 'nowrap'; // Ensure text stays in a single line
        this.outputElement.appendChild(line);

        for (let i = 0; i <= text.length; i++) {
            line.textContent = text.substring(0, i);
            await new Promise(resolve => setTimeout(resolve, this.typingSpeed));
        }
        this.outputElement.scrollTop = this.outputElement.scrollHeight + 10;
        if (this.isScrolledToBottom) {
            this.element.scrollTop = this.element.scrollHeight + 10;
        }
    }
    async animateTextLineColor(text) {
        const line = document.createElement('div');
        line.style.whiteSpace = 'nowrap'; // Ensure text stays in a single line
        this.outputElement.appendChild(line);

        for (let i = 0; i <= text.length; i++) {
            // Generate a random color in RGB format
            const randomColor = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`;
            // Apply the random color to the text content
            line.textContent = text.substring(0, i);
            line.style.color = randomColor; // Set random color for the current character

            await new Promise(resolve => setTimeout(resolve, this.typingSpeed));
        }
        this.outputElement.scrollTop = this.outputElement.scrollHeight + 10;
        if (this.isScrolledToBottom) {
            this.element.scrollTop = this.element.scrollHeight + 10;
        }
    }

    async animateText(text) {
        const lines = text.split('\n');
        for (let line of lines) {
            this.printLine(line);
            await new Promise(resolve => setTimeout(resolve, this.typingSpeed || 30 ));
        }
        this.outputElement.scrollTop = this.outputElement.scrollHeight + 10;
        if (this.isScrolledToBottom) {
            this.element.scrollTop = this.element.scrollHeight + 10;
        }
    }

    // Method to print help information with animation
    async printHelpAnimated() {
        const commandEntries = Object.entries(this.commands);
        const helpText = commandEntries.map(([command, { description }]) => `   ${command}     -    ${description}`).join('\n');
        await this.animateText(helpText);
        this.outputElement.scrollTop = this.outputElement.scrollHeight + 10;
        if (this.isScrolledToBottom) {
            this.element.scrollTop = this.element.scrollHeight + 10;
        }
    }
    printHelp() {
        // Print help information about available commands
        Object.keys(this.commands).forEach(command => {
            const { description } = this.commands[command];
            this.printLine(`${command}: ${description}`);
        });
    }

    async animatePrint(message) {
        const p = document.createElement('p');
        this.element.appendChild(p);
        for (let i = 0; i < message.length; i++) {
            p.textContent += message[i];
            await new Promise(r => setTimeout(r, 100));
        }
        this.outputElement.scrollTop = this.outputElement.scrollHeight;
    }
    


    handleKeyDown(event) {
        //event.preventDefault();
        this.pressedKeys.add(event.code);

        const inputLength = this.inputElement.value.length;
        if (event.key === 'Enter') {
            const command = this.inputElement.value.trim();
            const newCommand = document.createElement('div');
            newCommand.textContent = `${this.promptText}${this.currentDir}$ ${command}`;
            newCommand.style.color = 'blue';
            this.outputElement.appendChild(newCommand);
            this.handleCommand(command);

            this.inputElement.value = '';
            this.inputElement.focus();
            this.outputElement.scrollTop = this.outputElement.scrollHeight;
            this.element.scrollTop = this.element.scrollHeight + 10;
        } else if (event.key === 'ArrowUp') {
            if (this.historyIndex > 0) {
                this.historyIndex--;
                this.inputElement.value = this.commandHistory[this.activeTab][this.historyIndex] || '';
            }
        } else if (event.key === 'ArrowDown') {
            if (this.historyIndex < this.commandHistory[this.activeTab].length - 1) {
                this.historyIndex++;
                this.inputElement.value = this.commandHistory[this.activeTab][this.historyIndex] || '';
            } else {
                this.historyIndex = this.commandHistory[this.activeTab].length;
                this.inputElement.value = '';
            }
        } else if (event.key === 'Tab') {
            event.preventDefault(); // Prevent default tab behavior
            this.autoCompleteCommand();
        } else if (event.ctrlKey && event.key === 'a') {
            // Move cursor to the start of the input
            event.preventDefault();
            this.inputElement.setSelectionRange(0, 0);
        } else if (event.ctrlKey && event.key === 'e') {
            // Move cursor to the end of the input
            event.preventDefault();
            this.inputElement.setSelectionRange(inputLength, inputLength);
        } else if (this.isShortcutPressed(event.code, 'ControlLeft', 'Slash')) {
            event.preventDefault();
            this.displayOutput('ctrl / work') ;
            
        }else if (this.isShortcutPressed(event.code , 'ControlLeft', 'KeyB')) {
            event.preventDefault();
            this.displayOutput('ctrl B work') ;
            this.handleCommand('randomstyle'); // Example of executing a command via shortcut
            this.inputElement.focus(); // Ensure input field is focused after shortcut
        }else if (this.isShortcutPressed(event.code , 'ControlLeft', 'KeyF')) {
            event.preventDefault();
            this.displayOutput('ctrl F work') ;
            this.handleCommand('randomstyle'); // Example of executing a command via shortcut
            this.inputElement.focus(); // Ensure input field is focused after shortcut
        }
    }

    handleKeyup(event) {
        this.pressedKeys.delete(event.code);
    }

    isShortcutPressed(...keys) {
        return keys.every(key => this.pressedKeys.has(key));
    }
    focusInput() {
        // Your logic to focus input
        this.inputElement.focus();
    }


    autoCompleteCommand() {
        const input = this.inputElement.value.trim();
        const matches = Object.keys(this.commands).filter(cmd => cmd.startsWith(input));

        if (matches.length === 1) {
            this.inputElement.value = matches[0] + ' ';
        } else if (matches.length > 1) {
            this.printLine(matches.join(' '));
        }
    }
    prompt() {
        this.promptElement.textContent = this.promptText;
        this.inputElement.value = '';

        // Set focus on input field
        this.element.addEventListener('dblclick',(e) =>{
            this.inputElement.focus();
        })
        this.element.addEventListener('click' , () => {
            this.inputElement.focus() ;
        });
    }
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    onInterrupt(callback) {
        document.addEventListener('keydown', (event) => {
            if (event.ctrlKey && event.key === 'c') {
                callback();
            }
        });
    }
    printTable(data, headers) {
        const table = document.createElement('table');

        if (headers) {
            const headerRow = document.createElement('tr');
            headers.forEach(header => {
                const th = document.createElement('th');
                th.textContent = header;
                headerRow.appendChild(th);
            });
            table.appendChild(headerRow);
        }

        data.forEach(row => {
            const tr = document.createElement('tr');
            row.forEach(cell => {
                const td = document.createElement('td');
                td.textContent = cell;
                tr.appendChild(td);
            });
            table.appendChild(tr);
        });

        this.outputElement.appendChild(table);
        this.outputElement.scrollTop = this.outputElement.scrollHeight;
    }


    printError(data) {
        // Clear previous content
        this.clear();

        const errorDiv = document.createElement('div');
        errorDiv.className = 'error';
        errorDiv.textContent = data;

        this.outputElement.appendChild(errorDiv);
        this.outputElement.scrollTop = this.outputElement.scrollHeight;
    }
    commandExists(name) {
        return this.commands.hasOwnProperty(name);
    }

    clear() {
        this.outputElement.innerHTML = '';
    }
    saveHistory() {
        const activeTabHistory = this.commandHistory[this.activeTab] || [];
        const outputHTML = this.outputElement.innerHTML;
        const historyData = {
            commandHistory: activeTabHistory,
            outputHTML: outputHTML
        };
        localStorage.setItem(`tabHistory_${this.activeTab}`, JSON.stringify(historyData));
    }

    loadHistory() {
        const historyData = JSON.parse(localStorage.getItem(`tabHistory_${this.activeTab}`));
        if (historyData) {
            this.commandHistory[this.activeTab] = historyData.commandHistory || [];
            this.outputElement.innerHTML = historyData.outputHTML || '';
        }
    }


    // Method to increase font size
    increaseFontSize() {
        this.fontSize += 2;
        this.outputElement.style.fontSize = this.fontSize + 'px';
        if (this.fontSize >= 30) {
            this.fontSize -= 2;
        }
        this.storeItem('font', this.fontSize);
    }

    // Method to decrease font size
    decreaseFontSize() {
        if (this.fontSize > 10) {
            this.fontSize -= 2;
            this.outputElement.style.fontSize = this.fontSize + 'px';
            this.storeItem('font', this.fontSize);
        }
    }

    // Method to store items in localStorage
    storeItem(key, value) {
        localStorage.setItem(key, value);
    }

    // Method to print text to the terminal
    print(text) {
        const span = document.createElement('span');
        span.textContent = text;
        this.outputElement.appendChild(span);
    }


    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'block';
        }
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
        }
    }

    handleWindowClick(event) {
        const modals = document.getElementsByClassName('modal');
        for (let i = 0; i < modals.length; i++) {
            if (event.target == modals[i]) {
                modals[i].style.display = 'none';
            }
        }
    }

    // async handleCommand(command) {
    //     const args = command.split(' ');
    //     const cmd = args[0].trim().toLowerCase();
    //     // args.shift(); // Remove the command itself from args

    //     // Initialize command history if not already
    //     if (!Array.isArray(this.commandHistory[this.activeTab])) {
    //         this.commandHistory[this.activeTab] = [];
    //     }

    //     // Push command into history
    //     this.commandHistory[this.activeTab].push(command);
    //     this.historyIndex = this.commandHistory[this.activeTab].length;

    //     // Split command by any whitespace to handle options if needed
    //     const [cmdName, ...options] = command.trim().split(/\s+/);

    //     // Example command handling logic (replace with your own)
    //     switch (cmdName.toLowerCase()) {
    //         case 'help':
    //             this.printHelp();
    //             break;
    //         case 'modal':
    //             this.openModal(options.join(' '));
    //             break;
    //         case 'python':
    //             if (!this.pythonInterpreter) {
    //                 this.pythonInterpreter = new PythonInterpreter(this);
    //                 await this.pythonInterpreter.loadPyodideAndPackages();
    //             }
    //             this.pythonInterpreter.enterPythonMode();
    //             break;
    //         default:
    //             if (this.commands[cmdName]) {
    //                 try {
    //                     await this.commands[cmdName].execute(options, this); // Execute registered command
    //                 } catch (error) {
    //                     this.printLine(`Error executing command '${cmdName}': ${error.message}`, 'error');
    //                 }
    //             } else {
    //                 this.printLine(`Command '${cmdName}' not found.`, 'error');
    //             }
    //             break;
    //     }

    //     // Clear input field after command execution
    //     this.inputElement.value = '';
    //     this.inputElement.focus();
    // }




    // async handleCommand(command) {
    //     const args = command.split(' ');
    //     const cmd = args[0].trim().toLowerCase();
    //     args.shift(); // Remove the command itself from args

    //     // Initialize command history if not already
    //     if (!Array.isArray(this.commandHistory[this.activeTab])) {
    //         this.commandHistory[this.activeTab] = [];
    //     }

    //     // Push command into history
    //     this.commandHistory[this.activeTab].push(command);
    //     this.historyIndex = this.commandHistory[this.activeTab].length;

    //     // Split command by any whitespace to handle options if needed
    //     const [cmdName, ...options] = command.trim().split(/\s+/);

    //     // Example command handling logic (replace with your own)
    //     switch (cmdName.toLowerCase()) {
    //         case 'clear':
    //             this.outputElement.innerHTML = ''; // Clear output element
    //             break;
    //         case 'music':
    //             if (options[0] === 'play') {
    //                 const fileName = options.slice(1).join(' ').trim();
    //                 this.print('music'); // Display 'music' in output
    //                 this.playMusic(fileName); // Example function to play music
    //             } else if (options[0] === 'stop') {
    //                 this.stopMusic(); // Example function to stop music
    //                 this.print('stop music'); // Display 'stop music' in output
    //             } else {
    //                 this.displayOutput('Invalid music command.'); // Handle invalid music commands
    //             }
    //             break;
    //         default:
    //             if (this.commands[cmdName]) {
    //                 try {
    //                     await this.commands[cmdName].execute(options, this); // Execute registered command
    //                 } catch (error) {
    //                     this.displayOutput(`Error executing command '${cmdName}': ${error.message}`);
    //                 }
    //             } else {
    //                 this.displayOutput(`Command '${cmdName}' not found.`);
    //             }
    //             break;
    //     }

    //     // Clear input field after command execution
    //     this.inputElement.value = '';
    // }

    login(args) {
        // Implement login logic here
        this.isLoggedIn = true;
        this.printLine('Logged in successfully.');
    }

    register(args) {
        // Implement registration logic here
        this.printLine('Registered successfully.');
    }

    

    
    async handleCommand(commandName) {
        // Process the command
        const command = commandName.trim().toLowerCase();
        const args = command.split(' ');
        const cmds = args[0].trim().toLowerCase();
    
        const allowedCommands = ['login', 'register', 'help', 'whoami', 'ls','report']; 
    
        // Handle input callback (e.g., for interactive commands)
        if (this.inputCallback) {
            const callback = this.inputCallback;
            this.inputCallback = null;
            callback(command);
            return;
        }
    
        // If input is disabled, exit
        if (!this.inputEnabled) return;
    
        // If user is logged in or the command is in the allowedCommands array
        if (this.isLoggedIn || allowedCommands.some(cmd => command.startsWith(cmd))) {
            // Initialize history for the active tab if it's not already present
            if (!Array.isArray(this.commandHistory[this.activeTab])) {
                this.commandHistory[this.activeTab] = [];
            }
    
            // Push command into history
            this.commandHistory[this.activeTab].push(command);
            this.historyIndex = this.commandHistory[this.activeTab].length;
    
            // Split command into command and options
            const [cmd, ...options] = command.trim().split(/\s+/);
    
            // Handle empty command
            if (cmd.toLowerCase() === '') {
                this.outputElement.value = '';
            } else if (this.commands[cmd]) {
                // Try executing registered command
                try {
                    await this.commands[cmd].execute(options, this); // Execute registered command
                } catch (error) {
                    this.displayOutput(`Error executing command '${cmd}': ${error.message}`);
                }
            } else {
                // Attempt to fetch command from backend
                try {
                    const commandExists = await this.fetchCommandFromBackend(cmd);
                    if (commandExists) {
                        // If command exists, dynamically execute it
                        await this.executeFetchedCommand(cmd, options);
                    } else {
                        // Suggest an alternative command or handle unknown command
                        this.suggestCommand(cmd);
                    }
                } catch (error) {
                    this.displayOutput(`Error fetching or executing command '${cmd}': ${error.message}`);
                }
            }
        } else {
            this.displayOutput('Please log in or register to use the terminal.');
        }
    
        // Clear input field after command execution
        this.inputElement.value = '';
        this.saveHistory();
    }
    
    
    


    // Method to handle command execution
    // async handleCommand(commandName) {
    //     // Process the command
    //     const command = commandName.trim().toLowerCase()
    //     const args = command.split(' ');
    //     const cmds = args[0].trim().toLowerCase();
    //     const allowedCommands = ['login', 'register', 'help','whoami','calculator']; 
    //     //args.shift();
    //     if (this.inputCallback) {
    //         const callback = this.inputCallback;
    //         this.inputCallback = null;
    //         callback(command);
    //         return;
    //     }
    //     if (!this.inputEnabled) return;


    //     if (this.isLoggedIn || allowedCommands.some(cmd => command.startsWith(cmd))) {
    //         if (!Array.isArray(this.commandHistory[this.activeTab])) {
    //             this.commandHistory[this.activeTab] = [];
    //         }
    //         // Push command into history
    //         this.commandHistory[this.activeTab].push(command);
    //         this.historyIndex = this.commandHistory[this.activeTab].length;

    //         const [cmd, ...options] = command.trim().split(/\s+/); // Split command by any whitespace

    //         // Example command handling logic (replace with your own)

    //         if (cmd.toLowerCase() === '') {
    //             this.outputElement.value = '';
    //         } else if (this.commands[cmd]) {
    //             try {
    //                 await this.commands[cmd].execute(options, this); // Execute registered command  // args

    //             } catch (error) {
    //                 this.displayOutput(`Error executing command '${cmd}': ${error.message}`);
    //             }
    //         } else {
    //             this.suggestCommand(cmd); //this.displayOutput(`Command '${cmd}' not found.`);
    //         }
    //     } else {
    //         this.displayOutput('Please log in or register to use the terminal.');
    //     }



    //     // Clear input field after command execution
    //     this.inputElement.value = '';
    //     this.saveHistory();
    // }




    typeMessage(message) {
        this.displayOutput(message);
    }

    // Method to execute a command
    // executeCommand(command) {

    //     const args = command.split(' ');
    //     const cmd = args[0].trim().toLowerCase();

    //     if (command) {
    //         // Save command in history
    //         this.commandHistory.push(command);
    //         this.historyIndex = this.commandHistory.length;
    //         // Clear the input field
    //         this.inputElement.value = '';
    //     }

    //     switch (cmd) {
    //         case 'clear':
    //             this.outputElement.innerHTML = '';
    //             break;
    //         case 'pv':
    //             this.print(command.trim());
    //             this.typeMessage(command.slice(3));
    //             break;
    //         case 'upload':
    //             this.fileInput.click();
    //             this.fileInput.addEventListener('change', () => {
    //                 const formData = new FormData(this.uploadForm);
    //                 formData.append('current_dir', this.currentDir);

    //                 fetch('/upload_file/', {
    //                     method: 'POST',
    //                     headers: {
    //                         'X-CSRFToken': this.getCookie('csrftoken')
    //                     },
    //                     body: formData
    //                 })
    //                     .then(response => response.json())
    //                     .then(data => {
    //                         this.displayOutput(data.response);
    //                         this.currentDir = data.current_dir;
    //                         this.promptElement.textContent = `${this.currentDir}$`;
    //                     })
    //                     .catch(error => {
    //                         this.displayOutput(`Error: ${error}`);
    //                     });
    //             });
    //             break;
    //         case 'calc':
    //             const expression = command.slice(5).trim();
    //             try {
    //                 const result = eval(expression);
    //                 this.displayOutput(`Result: ${result}`);
    //             } catch (e) {
    //                 this.displayOutput(`Error: Invalid expression`);
    //             }
    //             break;
    //         case 'date':
    //             const date = new Date().toLocaleDateString();
    //             this.displayOutput(`Current Date: ${date}`);
    //             break;
    //         case 'time':
    //             const time = new Date().toLocaleTimeString();
    //             this.displayOutput(`Current Time: ${time}`);
    //             break;
    //         case 'resume':
    //             this.outputElement.innerHTML = "Download here - <a href='/resume/' target='_blank'>/resume/</a>";
    //             break;
    //         case 'python':
    //             const scriptName = args[1];
    //             fetch(`/api/execute_python_script/${scriptName}/`, {
    //                 method: 'GET',
    //             })
    //                 .then(response => response.json())
    //                 .then(data => {
    //                     // Display the command and output in the terminal
    //                     const commandOutput = document.createElement('div');
    //                     commandOutput.textContent = `> ${scriptName}\n${data.output}`;
    //                     this.outputElement.appendChild(commandOutput);

    //                     // Scroll to the bottom of the terminal
    //                     this.outputElement.scrollTop = this.outputElement.scrollHeight;
    //                 })
    //                 .catch(error => {
    //                     console.error('Error executing Python script:', error);
    //                 });
    //             break;
    //         default:
    //             fetch('/execute_command/', {
    //                 method: 'POST',
    //                 headers: {
    //                     'Content-Type': 'application/json',
    //                     'X-CSRFToken': this.getCookie('csrftoken')
    //                 },
    //                 body: JSON.stringify({
    //                     command: command,
    //                     current_dir: this.currentDir
    //                 })
    //             })
    //                 .then(response => response.json())
    //                 .then(data => {
    //                     this.displayOutput(data.response, data.is_html);
    //                     this.currentDir = data.current_dir;
    //                     this.promptElement.textContent = `${this.promptText}${this.currentDir}$`;
    //                     this.element.scrollTop = this.element.scrollHeight;
    //                 })
    //                 .catch(error => {
    //                     this.displayOutput(`Errors: ${error}`);
    //                 });
    //             break;
    //     }
    // }

    // Method to get a cookie value
    getCookie(name) {
        const cookieValue = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
        return cookieValue ? cookieValue.pop() : '';
    }

    // Method to display output in the terminal
    displayOutput(response, isHtml = false) {
        const outputElement = document.getElementById('output');
        //outputElement.innerHTML = ''; // Clear previous content

        if (response.startsWith('Error')
            || response.startsWith('Usage')
            || response.startsWith('Available')) {
            // Escape and format the response
            escapeAndFormat(response);
        } else if (isHtml) {
            // Set innerHTML directly if the response is HTML
            outputElement.innerHTML = response;
            applyStyles(outputElement, true); // Apply styles for HTML content
        } else {
            // Escape angle brackets to prevent them from being interpreted as HTML
            const escapedResponse = escapeHtml(response);
            const lines = escapedResponse.split('\n');

            lines.forEach(line => {
                const lineElement = document.createElement('div');
                lineElement.textContent = line;

                // Check if the line represents a directory or file
                if (line.startsWith('DIR:')) {
                    lineElement.classList.add('directory'); // Add a class for directory styling
                } else if (line.startsWith('FILE:')) {
                    lineElement.classList.add('file'); // Add a class for file styling
                }

                outputElement.appendChild(lineElement);
            });
        }
        this.outputElement.scrollTop = this.outputElement.scrollHeight;


        // Function to apply styles based on content type
        function applyStyles(element, isHtml) {
            element.style.maxWidth = '100%'; // Ensure content doesn't exceed the viewport width
            element.style.padding = '30px'; // Add padding for readability
            element.style.borderRadius = '5px'; // Rounded corners for a modern look

            // Responsive CSS styles based on window width
            window.addEventListener('resize', () => {
                if (window.innerWidth >= 768) {
                    element.style.maxWidth = '80%'; // Adjust as needed
                    element.style.margin = '10px auto'; // Center align on larger screens
                } else {
                    element.style.maxWidth = '100%'; // Full width on smaller screens
                    element.style.margin = '10px'; // Remove margin on smaller screens
                }
            });

            // Trigger the resize event initially to apply styles based on current window width
            window.dispatchEvent(new Event('resize'));
        }

        // Function to escape HTML entities
        function escapeHtml(text) {
            return text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
        }

        // Function to escape and format the response
        function escapeAndFormat(response) {
            const result = document.createElement('div');
            const escapedResponse = response.replace(/</g, '&lt;').replace(/>/g, '&gt;');
            result.innerHTML = escapedResponse.replace(/\n/g, '<br>');
            outputElement.appendChild(result);

            // Scroll to the bottom of the output element
            outputElement.scrollTop = outputElement.scrollHeight;
        }


        if (this.isScrolledToBottom) {
            this.element.scrollTop = this.element.scrollHeight;
        }
    }

    appendOutput(text) {
        this.outputElement.innerHTML += `<p>${text}</p>`;
        this.outputElement.scrollTop = this.outputElement.scrollHeight;
        this.saveState();
    }
    switchTabPosition(tabId) {
        // Store current scroll position
        const terminal = document.getElementById('terminal');
        const scrollPosition = terminal.scrollTop;

        // Switch tab logic here...

        // Restore scroll position
        terminal.scrollTop = scrollPosition;
    }

    saveState() {
        this.tabStates[this.activeTab] = {
            output: this.outputElement.innerHTML,
            command: this.inputElement.value
        };
        localStorage.setItem('tabStates', JSON.stringify(this.tabStates));
    }

    loadState() {
        const state = this.tabStates[this.activeTab] || { output: '', command: '' };
        this.outputElement.innerHTML = state.output;
        this.inputElement.value = state.command;
    }

    addNewTab() {
        this.terminalIndex++;
        const tab = document.createElement('div');
        const tabName = document.createElement('span');
        tabName.textContent = `Tab ${this.terminalIndex}`;
        this.switchTabPosition(this.terminalIndex);
        tabName.addEventListener('dblclick', (event) => this.renameTab(event));
        tab.appendChild(tabName);

        const closeButton = document.createElement('span');
        closeButton.textContent = '×';
        closeButton.classList.add('close-tab');
        closeButton.addEventListener('click', (event) => this.closeTab(event));
        tab.appendChild(closeButton);

        tab.dataset.terminalIndex = this.terminalIndex;
        tab.addEventListener('click', (event) => this.switchTab(event));
        this.tabs.insertBefore(tab, this.newTabButton);
        this.switchTab({ target: tab });
    }
    switchTab(event) {
        this.saveState();
        const previousTab = document.querySelector(`#tabs div.active`);
        if (previousTab) {
            previousTab.classList.remove('active');
        }

        const tab = event.target.closest('div');
        tab.classList.add('active');
        this.activeTab = tab.dataset.terminalIndex;
        this.loadState();
        this.historyIndex = this.commandHistory[this.activeTab] ? this.commandHistory[this.activeTab].length : -1;
    }



    closeTab(event) {
        event.stopPropagation();
        const tab = event.target.closest('div');
        const tabIndex = tab.dataset.terminalIndex;

        // Remove the tab from the DOM
        this.tabs.removeChild(tab);

        // Remove tab state and command history
        delete this.tabStates[tabIndex];
        delete this.commandHistory[tabIndex];

        // Save updated state to localStorage
        localStorage.setItem('tabStates', JSON.stringify(this.tabStates));

        // Switch to the first available tab or create a new one if none left
        const remainingTabs = this.tabs.querySelectorAll('div[data-terminal-index]');
        if (remainingTabs.length > 0) {
            this.switchTab({ target: remainingTabs[0] });
        } else {
            this.addNewTab();
        }
    }

    renameTab(event) {
        const tab = event.target.closest('div');
        const span = tab.querySelector('span:not(.close-tab)');
        if (span) {
            const input = document.createElement('input');
            input.type = 'text';
            input.value = span.textContent;
            input.addEventListener('keydown', function (event) {
                if (event.key === 'Enter') {
                    event.preventDefault();
                    span.textContent = this.value;
                    tab.removeChild(this);
                    span.style.display = 'inline-block';
                }
            });
            tab.insertBefore(input, span);
            span.style.display = 'none';
            input.focus();
        }
    }
    initializeFirstTab() {
        const firstTab = document.createElement('div');
        const tabName = document.createElement('span');
        tabName.textContent = 'Tab 1';
        tabName.addEventListener('dblclick', (event) => this.renameTab(event));
        firstTab.appendChild(tabName);

        const closeButton = document.createElement('span');
        closeButton.textContent = '×';
        closeButton.classList.add('close-tab');
        closeButton.addEventListener('click', (event) => this.closeTab(event));
        firstTab.appendChild(closeButton);

        firstTab.dataset.terminalIndex = 1;
        firstTab.addEventListener('click', (event) => this.switchTab(event));
        this.tabs.insertBefore(firstTab, this.newTabButton);
        this.switchTab({ target: firstTab });
    }



    suggestCommand(cmd) {
        const suggestions = Object.keys(this.commands).filter(command => this.isSimilar(command, cmd));
        if (suggestions.length > 0) {
            this.printLine(`Command not found: ${cmd}. Did you mean: ${suggestions.join(', ')}?`);
        } else {
            this.printLine(`Command not found: ${cmd}.`);
        }
    }

    isSimilar(a, b) {
        if (a.length < b.length) {
            [a, b] = [b, a];
        }
        const distance = (a, b) => {
            const matrix = [];
            for (let i = 0; i <= b.length; i++) {
                matrix[i] = [i];
            }
            for (let j = 0; j <= a.length; j++) {
                matrix[0][j] = j;
            }
            for (let i = 1; i <= b.length; i++) {
                for (let j = 1; j <= a.length; j++) {
                    if (b.charAt(i - 1) === a.charAt(j - 1)) {
                        matrix[i][j] = matrix[i - 1][j - 1];
                    } else {
                        matrix[i][j] = Math.min(
                            matrix[i - 1][j - 1] + 1,
                            Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1)
                        );
                    }
                }
            }
            return matrix[b.length][a.length];
        };
        return distance(a, b) <= 2; // Adjust this value to set the threshold for similarity
    }

    async executeFetchedCommand(cmd, options) {
        if (this.commands[cmd]) {
            try {
                await this.commands[cmd](options, this);  // Execute the dynamically loaded command
            } catch (error) {
                this.displayOutput(`Error executing command '${cmd}': ${error.message}`);
            }
        } else {
            this.displayOutput(`Command '${cmd}' not found.`);
        }
    }

    async fetchCommandFromBackend(cmd) {
        try {
            const response = await fetch(`/api/command/${cmd}/`);
            if (response.ok) {
                const data = await response.json();
                // Dynamically store the fetched command
                this.commands[cmd] = new Function('args', 'terminal', data.command);
                return true;  // Command was found and fetched successfully
            }
        } catch (error) {
            this.displayOutput(`Error fetching command '${cmd}': ${error.message}`);
        }
        return false;  // Command was not found on the backend
    }

    async loadCommand(fileName) {
        const commandName = fileName.replace('.js', '');
        //this.showLoadingIndicator();
        try {
            const module = await import(`/static/commands/${fileName}`);
            if (module.default && typeof module.default.execute === 'function') {
                this.addCommand(commandName, module.default.execute.bind(module.default), module.default.description);
                for (let [key, value] of Object.entries(module.default)) {
                    if (key !== 'execute' && typeof value === 'function') {
                        this.addCommand(`${commandName} ${key}`, value.bind(module.default), `Run ${commandName} ${key}`);
                    }
                }
            } else {
                throw new Error(`Invalid command module: ${fileName}. Missing execute function.`);
            }
        } catch (error) {
            // console.error(`Error loading command ${fileName}:`, error);
            this.displayOutput(`Error loading command ${commandName}: `); //${error.message}
        } finally {
            //this.hideLoadingIndicator();
        }
    }


    async loadInitialCommands() {
        try {
            const response = await fetch('/list-commands/');
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const commandFiles = await response.json();
            for (const file of commandFiles) {
                await this.loadCommand(file);
            }
        } catch (error) {
            console.error('Error fetching or parsing command list:', error);
        }
    }


    
    applyLoadingIndicatorStyles() {
        // Basic styling for the loading indicator
        this.loadingIndicator.style.position = 'fixed';
        this.loadingIndicator.style.top = '0';
        this.loadingIndicator.style.left = '0';
        this.loadingIndicator.style.width = '100%';
        this.loadingIndicator.style.height = '100%';
        this.loadingIndicator.style.display = 'flex';
        this.loadingIndicator.style.alignItems = 'center';
        this.loadingIndicator.style.justifyContent = 'center';
        this.loadingIndicator.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        this.loadingIndicator.style.color = '#fff';
        this.loadingIndicator.style.fontSize = '1.5em';
        this.loadingIndicator.style.zIndex = '9999';
        this.loadingIndicator.style.transition = 'opacity 0.3s ease';

        // Spinner styling
        const spinner = document.createElement('div');
        spinner.classList.add('spinner');
        this.loadingIndicator.appendChild(spinner);

        const style = document.createElement('style');
        style.textContent = `
            .spinner {
                border: 16px solid #f3f3f3;
                border-top: 16px solid #3498db;
                border-radius: 50%;
                width: 120px;
                height: 120px;
                animation: spin 2s linear infinite;
            }

            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }

    showLoadingIndicator() {
        this.loadingIndicator.style.opacity = '1';
    }

    hideLoadingIndicator() {
        this.loadingIndicator.style.opacity = '0';
        setTimeout(() => {
            this.loadingIndicator.style.display = 'none';
        }, 300); // Match the duration of the opacity transition
    }



    addCommand(name, execute, description) {
        this.commands[name] = { execute, description };
    }

    promptUser = (message) => {
        return new Promise(resolve => {
            const originalCallback = this.inputCallback;
            this.inputCallback = (input) => {
                this.inputCallback = originalCallback;  // Reset callback
                resolve(input.trim());
            };
            this.printLine(`<span style="color: lightyellow;">${message}</span>`);
        });
    };


    // addCommand(name, execute, description, docString = '') {
    //     this.commands[name] = { execute, description, docString };
    // }

}



document.addEventListener('DOMContentLoaded', async () => {
    const terminal = new Terminal();


    // Example: Display initial prompt
    terminal.prompt();
    terminal.hideLoadingIndicator() ;

    // Example: Handle form submission or command execution
    // (you'll need to implement this based on your application logic)
    // Make the closeModal method globally accessible
    window.closeModal = terminal.closeModal.bind(terminal);
    window.openModal = terminal.openModal.bind(terminal);
    //terminal.newTabButton.addEventListener('click', terminal.addNewTab);
    //addCommandListener();
    //terminal.initializeFirstTab();

    const is_logged_in = localStorage.getItem('is_logged_in') === 'true';
    const username = localStorage.getItem('username');
    const ip = localStorage.getItem('userIp');
    

    if (is_logged_in) {
        terminal.isLoggedIn = true;
        terminal.username = username;
        terminal.promptText = `${username}@${ip}`;
        terminal.animateTextLineColor(`Welcome back, ${username} : ip : ${ip}!`);
    } else {
        terminal.animateText('Please log in by typing $ login or $ register');
        // terminal.animatePrint("Register if you're not yet create an account");
        terminal.animateTextLine("Login if you're already have an account");
        terminal.animateTextLineColor('Type help to see all commands');
    }

    await terminal.loadInitialCommands();




    // document.getElementById('openModalButton').addEventListener('click', () => {
    //     terminal.openModal('settingsMenu');
    // });

    // // Example: Close a modal on a button click
    // document.getElementById('closeModalButton').addEventListener('click', () => {
    //     terminal.closeModal('myModal1');
    // });


    document.getElementById('theme1').addEventListener('click', () => {
        applyTheme('theme1');
        applyFont('Verdana, sans-serif');
    });

    document.getElementById('theme2').addEventListener('click', () => {
        applyTheme('theme2');
        applyFont('Arial, sans-serif');
    });

    document.getElementById('theme3').addEventListener('click', () => {
        applyTheme('theme3');
    });

    // Initial theme application
    applyTheme('theme1'); // Apply default theme on page load
    applyFont('Verdana, sans-serif');

    document.getElementById('new-tab').addEventListener('click', () => executeCommand('new-tab'));
    document.getElementById('open').addEventListener('click', () => executeCommand('open'));
    document.getElementById('save').addEventListener('click', () => executeCommand('save'));
    document.getElementById('undo').addEventListener('click', () => executeCommand('undo'));
    document.getElementById('redo').addEventListener('click', () => executeCommand('redo'));

});

const themes = {
    theme1: {
        terminal: {
            backgroundColor: '#000',
            color: '#fff'
        },
        promptc: {
            color: '#0f0'
        },
        input: {
            color: '#0f0'
        }
    },
    theme2: {
        terminal: {
            backgroundColor: '#222',
            color: '#ddd'
        },
        promptc: {
            color: '#f90'
        },
        input: {
            color: '#f90'
        }
    },
    theme3: {
        terminal: {
            backgroundColor: '#555',
            color: '#ccc'
        },
        promptc: {
            color: '#00f'
        },
        input: {
            color: '#00f'
        }
    }
};

// Function to apply theme styles
function applyTheme(themeName) {
    const theme = themes[themeName];
    const terminal = document.getElementById('terminal');
    const promptc = document.getElementById('promptc');
    const input = document.getElementById('input');

    // Apply terminal styles
    terminal.style.backgroundColor = theme.terminal.backgroundColor;
    terminal.style.color = theme.terminal.color;

    // Apply promptc styles
    promptc.style.color = theme.promptc.color;

    // Apply input styles
    input.style.color = theme.input.color;
}

function applyFont(fontFamily) {
    const terminal = document.getElementById('terminal');
    const promptc = document.getElementById('promptc');
    const output = document.getElementById('output');

    // Apply font family to terminal, prompt, and output
    //terminal.style.fontFamily = fontFamily;
    //promptc.style.fontFamily = fontFamily;
    output.style.fontFamily = fontFamily;
    output.style.color = 'red';
}




const fonts = {
    "style1": {
        "A": "🅰", "B": "🅱", "C": "🅲", "D": "🅳", "E": "🅴",
        "F": "🅵", "G": "🅶", "H": "🅷", "I": "🅸", "J": "🅹",
        "K": "🅺", "L": "🅻", "M": "🅼", "N": "🅽", "O": "🅾",
        "P": "🅿", "Q": "🆀", "R": "🆁", "S": "🆂", "T": "🆃",
        "U": "🆄", "V": "🆅", "W": "🆆", "X": "🆇", "Y": "🆈",
        "Z": "🆉"
    },
    "style2": {
        "A": "Ⓐ", "B": "Ⓑ", "C": "Ⓒ", "D": "Ⓓ", "E": "Ⓔ",
        "F": "Ⓕ", "G": "Ⓖ", "H": "Ⓗ", "I": "Ⓘ", "J": "Ⓙ",
        "K": "Ⓚ", "L": "Ⓛ", "M": "Ⓜ", "N": "Ⓝ", "O": "Ⓞ",
        "P": "Ⓟ", "Q": "Ⓠ", "R": "Ⓡ", "S": "Ⓢ", "T": "Ⓣ",
        "U": "Ⓤ", "V": "Ⓥ", "W": "Ⓦ", "X": "Ⓧ", "Y": "Ⓨ",
        "Z": "Ⓩ"
    },
    "style3": {
        "A": "🄰", "B": "🄱", "C": "🄲", "D": "🄳", "E": "🄴",
        "F": "🄵", "G": "🄶", "H": "🄷", "I": "🄸", "J": "🄹",
        "K": "🄺", "L": "🄻", "M": "🄼", "N": "🄽", "O": "🄾",
        "P": "🄿", "Q": "🅀", "R": "🅁", "S": "🅂", "T": "🅃",
        "U": "🅄", "V": "🅅", "W": "🅆", "X": "🅇", "Y": "🅈",
        "Z": "🅉"
    }
    // Add more font styles here if needed
};


// Function to convert input text to styled output
function convertTextToStyledOutput(inputText, fontStyle) {
    const outputDiv = document.getElementById('ascii-art');
    outputDiv.innerHTML = '';

    for (let char of inputText.toUpperCase()) {
        if (fonts[fontStyle][char]) {
            outputDiv.innerHTML += fonts[fontStyle][char] + ' ';
        } else {
            outputDiv.innerHTML += char + ' ';
        }
    }
}

// Example usage: convert "trsh" to styled output in style3
convertTextToStyledOutput('trsh-shell', 'style3');

