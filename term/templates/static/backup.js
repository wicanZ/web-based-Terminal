
loadFile(`static/term.js`, function (loaded) {
    if (loaded) {
        console.log('File loaded successfully!');
        // You can call functions or execute code that depends on the loaded script here
        //testing();
    } else {
        console.log('Failed to load file!');
    }
});

function openModal(modalId) {
    var modal = document.getElementById(modalId);
    modal.style.display = 'block';
}

// Function to close a specific modal
function closeModal(modalId) {
    var modal = document.getElementById(modalId);
    modal.style.display = 'none';
}

// Close all modals if the user clicks anywhere outside of them
window.onclick = function (event) {
    var modals = document.getElementsByClassName('modal');
    for (var i = 0; i < modals.length; i++) {
        if (event.target == modals[i]) {
            modals[i].style.display = 'none';
        }
    }
}

document.addEventListener('DOMContentLoaded', (event) => {
    const tabs = document.getElementById('tabs');
    const newTabButton = document.getElementById('new-tab-button');
    let terminalIndex = 1;
    let activeTab = 1;
    const tabStates = JSON.parse(localStorage.getItem('tabStates')) || {};
    //const commandHistory = {};
    //const commandList = ['ls', 'echo', 'clear', 'help'];


    const input = document.getElementById('input');
    const output = document.getElementById('output');
    const promptc = document.getElementById('promptc');
    const fileInput = document.getElementById('fileInput');
    const uploadForm = document.getElementById('uploadForm');
    let currentDir = '/';
    let currentMatchIndex = 0; // Index to track the current suggestion index
    let currentMatches = [];
    let commandHistory = [];
    const commands = {}; // python command
    let historyIndex = -1;
    const pressedKeys = new Set();
    const possibleCommands = [
        'help', 'cd', 'ls', 'lscpu', 'lscmds', 'pwd', 'cat', 'mkdir', 'rm', 'upload', 'about', 'contact', 'email',
        'grep', 'chmod', 'chown', 'ps', 'top', 'nano', 'vim', 'cat', 'echo', 'find',
        'tar', 'gzip', 'gunzip', 'zip', 'unzip', 'wget', 'curl', 'ssh', 'scp'
    ]; // Add all your commands here
    defaultSetting();
    let fontSize = 16;

    terminal.addEventListener('click', () => {
        input.focus();
    });
    // Increase Font Size
    document.getElementById('increaseFont').addEventListener('click', () => {
        fontSize += 2;
        terminal.style.fontSize = fontSize + 'px';
        if (fontSize >= 30) {
            fontSize -= 2;
        }
        storeItem('font', fontSize);
    });

    // Decrease Font Size
    document.getElementById('decreaseFont').addEventListener('click', () => {
        if (fontSize > 10) {
            fontSize -= 2;
            terminal.style.fontSize = fontSize + 'px';
            storeItem('font', fontSize);
        }
    });
    const terminal = {
        print: (text) => {
            const span = document.createElement('span');
            span.textContent = text;
            outputElement.appendChild(span);
        },
        printLine: (text = '') => {
            terminal.print(text + '\n');
        },
        animatePrint: async (text, delay = 50) => {
            for (let char of text) {
                terminal.print(char);
                await sleep(delay);
            }
            terminal.printLine();
        },
        addCommand: (command, callback) => {
            terminal.commands[command] = callback;
        },
        commands: {}
    };

    // input.addEventListener('input', () => {
    //     showSuggestions(input);
    // });
    document.addEventListener('keydown', function (event) {
        if (event.key === 'Tab') {
            event.preventDefault();
            //currentMatchIndex = (currentMatchIndex + 1) % possibleCommands.length;
            const inputValue = input.value.trim();
            const matches = possibleCommands.filter(cmd => cmd.startsWith(inputValue));
            if (matches.length > 0) {
                let currentMatchIndex = matches.indexOf(inputValue);
                currentMatchIndex = (currentMatchIndex + 1) % matches.length;
                print(matches)
                updateInputAndHighlight(currentMatchIndex);
                input.value = matches[currentMatchIndex];
            }
        }

        // if (event.key === 'Tab') {
        //     event.preventDefault(); // Prevent default tab behavior
        //     const currentInput = input.value.trim();
        //     const completedCommand = autoComplete(currentInput);
        //     input.value = completedCommand;
        //     print( completedCommand ) ;
        // }
        // Step 2: Check if the key pressed is the ArrowUp key
        //console.log('Key code:', event.code);
        if (event.key === 'ArrowUp') {
            //console.log('arroyup')
            if (historyIndex > 0) {
                historyIndex--;
                input.value = commandHistory[historyIndex];
            }
        }
        if (event.key === 'ArrowDown') {
            //console.log('arrow down') ;
            if (historyIndex < commandHistory.length - 1) {
                historyIndex++;
                input.value = commandHistory[historyIndex];
            } else {
                historyIndex = commandHistory.length;
                input.value = '';
            }
        }
    });

    function getStoreItem(title) {
        return localStorage.getItem(title);
    }
    function storeItem(title, data) {
        localStorage.setItem(title, data);
    }



    function updateInputAndHighlight(index) {
        const inputElement = document.getElementById('input');
        const items = document.querySelectorAll('.command-item');

        // Wrap around index if it goes out of bounds
        if (index >= items.length) {
            index = 0;
        } else if (index < 0) {
            index = items.length - 1;
        }

        if (index >= 0 && index < items.length) {
            inputElement.value = items[index].textContent; // Update input with command text
            items.forEach(item => item.classList.remove('selected')); // Remove highlight from all items
            items[index].classList.add('selected'); // Add highlight to the selected item
        } else {
            inputElement.value = ''; // Clear input if index is out of bounds
        }
    }



    // Function to show suggestions based on current input value
    function showSuggestions(inputValue) {
        currentMatches = possibleCommands.filter(cmd => cmd.startsWith(inputValue));
        currentMatchIndex = -1; // Reset match index

        const outputDiv = document.getElementById('output');
        outputDiv.innerHTML = '';

        if (currentMatches.length > 0) {
            const ul = document.createElement('ul');
            currentMatches.forEach((match, index) => {
                const li = document.createElement('li');
                li.textContent = match;
                li.classList.add('command-item');
                li.addEventListener('click', () => {
                    const inputElement = document.getElementById('input');
                    inputElement.value = match;
                    outputDiv.style.display = 'none';
                });
                ul.appendChild(li);
            });
            outputDiv.appendChild(ul);
            outputDiv.style.display = 'block';
        } else {
            outputDiv.style.display = 'none';
            inputElement.value = ''; // Clear input if no matches or out of bounds
        }
    }


    // input.addEventListener('input', function() {
    //     const currentInput = input.value.trim();
    //     showSuggestions(currentInput);
    // });
    // input.addEventListener('change', function() {
    //     const currentInput = input.value.trim();
    //     showSuggestions(currentInput);
    // });



    input.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            const command = input.value.trim();
            const newCommand = document.createElement('div');
            newCommand.textContent = '$ ' + command;
            output.appendChild(newCommand);
            input.value = '';
            if (command === '') {
                newCommand.textContent = '$ ';
                terminal.scrollTop = terminal.scrollHeight + 10;
                return;
            }
            //console.log( commandHistory , historyIndex ) ;
            handleCommand(command);
        }

    });
      // handleKeyDown(event) {
    //     if (event.key === 'Tab') {
    //         event.preventDefault();
    //         const inputValue = this.inputElement.value.trim();
    //         const matches = this.possibleCommands.filter(cmd => cmd.startsWith(inputValue));
    //         if (matches.length > 0) {
    //             let currentMatchIndex = matches.indexOf(inputValue);
    //             currentMatchIndex = (currentMatchIndex + 1) % matches.length;
    //             this.inputElement.value = matches[currentMatchIndex];
    //         }
    //     } else if (event.key === 'ArrowUp') {
    //         //this.handleHistoryNavigation(-1);
    //         if (this.historyIndex > 0) {
    //             this.historyIndex--;
    //             this.inputElement.value = this.commandHistory[this.historyIndex];
    //         }
    //     } else if (event.key === 'ArrowDown') {
    //         //this.handleHistoryNavigation(1);
    //         if (this.historyIndex < this.commandHistory.length - 1) {
    //             this.historyIndex++;
    //             this.inputElement.value = this.commandHistory[this.historyIndex];
    //         } else {
    //             this.historyIndex = this.commandHistory.length;
    //             this.inputElement.value = '';
    //         }
    //     }
    // }

    // async function loadPyodideAndPackages() {
    //     return new Promise(resolve => {
    //         let script = document.createElement("script");
    //         script.src = "https://cdn.jsdelivr.net/pyodide/v0.21.3/full/pyodide.js";
    //         script.onload = async function() {
    //             while (!window.loadPyodide) {
    //                 await new Promise(res => setTimeout(res, 100));
    //             }
    //             const pyodide = await window.loadPyodide({
    //                 stdout: (msg) => printLine(msg),
    //                 stderr: (msg) => printLine(msg, 'error')
    //             });
    //             resolve(pyodide);
    //         };
    //         document.head.appendChild(script);
    //     });
    // }

    // const pyodidePromise = loadPyodideAndPackages();

    // Function to handle auto-completion
    function autoComplete(input) {
        const matches = possibleCommands.filter(cmd => cmd.startsWith(input));
        if (matches.length === 1) {
            return matches[0];
        }
        return input; // No unique match found, return the original input
    }

    // Function to show suggestions
    // function showSuggestions(input) {
    //     const matches = possibleCommands.filter(cmd => cmd.startsWith(input));
    //     suggestionsDiv.innerHTML = '';
    //     input.value = '' ;
    //     matches.forEach(match => {
    //         const div = document.createElement('div');
    //         div.textContent = match;
    //         print( match );
    //         div.addEventListener('click', () => {
    //             input.value = match;
    //             suggestionsDiv.style.display = 'none';
    //         });
    //         suggestionsDiv.appendChild(div);
    //     });
    //     suggestionsDiv.style.display = matches.length ? 'block' : 'none';
    // }


    function handleKeyDown(event) {
        pressedKeys.add(event.code);

        // Define your shortcuts
        if (isShortcutPressed('ControlLeft', 'ShiftLeft', 'KeyO')) {
            event.preventDefault();
            openNewChat();
        } else if (isShortcutPressed('ShiftLeft', 'Escape')) {
            event.preventDefault();
            focusChatInput();
        } else if (isShortcutPressed('ControlLeft', 'ShiftLeft', 'Semicolon')) {
            event.preventDefault();
            copyLastCodeBlock();
        } else if (isShortcutPressed('ControlLeft', 'ShiftLeft', 'KeyC')) {
            event.preventDefault();
            copyLastResponse();
        } else if (isShortcutPressed('ControlLeft', 'ShiftLeft', 'KeyI')) {
            event.preventDefault();
            setCustomInstructions();
        } else if (isShortcutPressed('ControlLeft', 'ShiftLeft', 'KeyS')) {
            event.preventDefault();
            toggleSidebarNav();
        } else if (isShortcutPressed('ControlLeft', 'ShiftLeft', 'KeyD')) {
            event.preventDefault();
            deleteChat();
        } else if (isShortcutPressed('ControlLeft', 'Slash')) {
            event.preventDefault();
            showShortcuts();
            openModal('myModal1');
            print('modal short cut');
        } else if (isShortcutPressed('ControlLeft', 'KeyB')) {
            event.preventDefault();
            changeColor();
        }
    }
    // pv command 
    function typeMessage(message) {
        const outputElement = document.getElementById('output');
        outputElement.innerHTML = '';

        // Remove leading 'pv ' and trailing single quote (if present)
        message = message.trim();
        if (message.startsWith("pv '")) {
            message = message.substring(4); // Remove 'pv '
        }
        if (message.endsWith("'")) {
            message = message.substring(0, message.length - 1); // Remove trailing '
        }

        for (let i = 0; i < message.length; i++) {
            setTimeout(() => {
                outputElement.textContent += message[i];
            }, 100 * i); // Delay each character by 100ms times its position
        }
    }

    function handleCommand(command) {
        const args = command.split(' ');
        const cmd = args[0];
        const inputcmd = command;

        if (command) {
            // Save command in history
            commandHistory.push(command);
            historyIndex = commandHistory.length;
            // Clear the input field
            input.value = '';
        }
        if (command.trim().toLowerCase() === 'clear') {
            output.innerHTML = '';
            return;
        }
        if (cmd === 'pv') {
            print(command.trim());
            typeMessage(command.slice(3));
            output.textContent = '$ ';
        }

        if (cmd === 'upload') {
            fileInput.click();
            fileInput.addEventListener('change', function () {
                const formData = new FormData(uploadForm);
                formData.append('current_dir', currentDir);

                fetch('/upload_file/', {
                    method: 'POST',
                    headers: {
                        'X-CSRFToken': getCookie('csrftoken')
                    },
                    body: formData
                })
                    .then(response => response.json())
                    .then(data => {
                        displayOutput(data.response);
                        currentDir = data.current_dir;
                        promptc.textContent = `${currentDir}$`;
                    })
                    .catch(error => {
                        displayOutput(`Error: ${error}`);
                    });
            });
        } else if (cmd === 'calc') {
            const expression = command.slice(5);
            try {
                const result = eval(expression);
                displayOutput(`Result: ${result}`);
            } catch (e) {
                displayOutput(`Error: Invalid expression`);
            }
        } else if (cmd === 'date') {
            const date = new Date().toLocaleDateString();
            displayOutput(`Current Date: ${date}`);
        } else if (cmd === 'time') {
            const time = new Date().toLocaleTimeString();
            displayOutput(`Current Time: ${time}`);
        } else if (cmd === 'resume') {
            output.innerHTML = "Download here - <a href='/resume/' target='_blank'>/resume/</a>";

        } else if (cmd === 'python') {
            script = cmd.split(" ");
            scriptName = script[1];
            fetch(`/api/execute_python_script/${scriptName}/`, {
                method: 'GET',
            })
                .then(response => response.json())
                .then(data => {
                    // Display the command and output in the terminal
                    const commandOutput = document.createElement('div');
                    commandOutput.textContent = `> ${scriptName}\n${data.output}`;
                    output.appendChild(commandOutput);

                    // Scroll to the bottom of the terminal
                    output.scrollTop = terminalDiv.scrollHeight;
                })
                .catch(error => {
                    console.error('Error executing Python script:', error);
                });

        } else {
            fetch('/execute_command/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken')
                },
                body: JSON.stringify({
                    command: command,
                    current_dir: currentDir
                })
            })
                .then(response => response.json())
                .then(data => {
                    displayOutput(data.response, data.is_html);
                    currentDir = data.current_dir;
                    promptc.textContent = `${currentDir}$`;
                })
                .catch(error => {
                    displayOutput(`Error: ${error}`);
                });
        }
    }


    function displayOutput(response, isHtml = false) {
        const outputElement = document.getElementById('output');

        //outputElement.textContent = '' ;

        if (isHtml) {
            // Set innerHTML directly if the response is HTML
            outputElement.innerHTML = response;
            outputElement.style.maxWidth = '100%';  // Ensure content doesn't exceed the viewport width
            //outputElement.style.overflowX = 'auto'; // Allow horizontal scrolling if content is wider than viewport
            outputElement.style.padding = '30px';   // Add padding for readability
            //outputElement.style.border = '1px solid #ddd'; // Add border for visual separation
            outputElement.style.borderRadius = '5px';  // Rounded corners for a modern look
            print(response);


            // Apply responsive CSS styles based on window width
            window.addEventListener('resize', () => {
                if (window.innerWidth >= 768) {
                    outputElement.style.maxWidth = '80%';   // Adjust as needed
                    outputElement.style.margin = '10px';  // Center align on larger screens
                } else {
                    outputElement.style.maxWidth = '100%';  // Full width on smaller screens
                    outputElement.style.margin = '10px';       // Remove margin on smaller screens
                }
            });

            // Trigger the resize event initially to apply styles based on current window width
            window.dispatchEvent(new Event('resize'));
        } else {
            // Escape angle brackets to prevent them from being interpreted as HTML
            const escapedResponse = response.replace(/</g, '&lt;').replace(/>/g, '&gt;');
            const result = document.createElement('div');
            // Replace newline characters with <br> tags
            result.innerHTML = escapedResponse.replace(/\n/g, '<br>');
            outputElement.appendChild(result);
        }
        outputElement.scrollTop = outputElement.scrollHeight;
        terminal.scrollTop = terminal.scrollHeight;
    }


    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    function handleKeyUp(event) {
        pressedKeys.delete(event.code);
    }

    function isShortcutPressed(...keys) {
        return keys.every(key => pressedKeys.has(key));
    }

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    // Example functions to be called by shortcuts
    function openNewChat() {
        console.log('Opening new chat...');
        // Your logic here
    }

    function focusChatInput() {
        console.log('Focusing chat input...');
        // Your logic here
    }

    function copyLastCodeBlock() {
        console.log('Copying last code block...');
        // Your logic here
    }

    function copyLastResponse() {
        console.log('Copying last response...');
        // Your logic here
    }

    function setCustomInstructions() {
        console.log('Setting custom instructions...');
        // Your logic here
    }

    function toggleSidebarNav() {
        console.log('Toggling sidebar...');

    }

    function deleteChat() {
        console.log('Deleting chat...');
        // Your logic here
    }

    function showShortcuts() {
        console.log('Showing shortcuts...');
        // Your logic here

    }
    function changeColor() {
        console.log('color bg change');
        randombodyBgColor();
    }
    function defaultSetting() {
        let font;
        font = getStoreItem('font');
        terminal.style.fontSize = font + 'px';
        promptc.style.color = '#' + getStoreItem('promptcolor');
    }

    
});



// Define themes as JavaScript objects
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
    },

};




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
convertTextToStyledOutput('trsh - terminal', 'style3');
function loadFile(url, callback) {
    var script = document.createElement('script');
    script.src = url;

    script.onload = function () {
        console.log('Script loaded successfully: ' + url);
        if (typeof callback === 'function') {
            callback(true); // Pass true to indicate successful load
        }
    };

    script.onerror = function () {
        console.error('Error loading script: ' + url);
        if (typeof callback === 'function') {
            callback(false); // Pass false to indicate error
        }
    };

    document.head.appendChild(script);
}


// css #terminal {
//     flex-grow: 1;
//     padding: 20px;
//     overflow-y: auto;
//     white-space: pre-wrap;
//     display: flex;
//     flex-direction: column;
//     user-select: text;
//     background: #121212; /* Very dark background for a futuristic look */
//     color: #e0e0e0; /* Light gray text color for contrast */
//     border: 2px solid #9c27b0; /* Purple border for a futuristic look */
//     margin: 20px;
//     border-radius: 12px; /* Rounded corners */
//     box-shadow: 0 0 20px rgba(156, 39, 176, 0.6); /* Purple shadow for emphasis */
//     font-family: 'Roboto Mono', 'Courier New', Courier, monospace; /* Monospace font for terminal text */
//     font-size: 14px; /* Standard text size */
//     line-height: 1.5; /* Spacing between lines */
//     position: relative; /* Position relative for pseudo-elements */
// }

// /* Terminal title bar */
// #terminal::before {
//     content: '';
//     position: absolute;
//     top: -30px; /* Position it above the terminal */
//     left: 0;
//     width: 100%;
//     height: 30px;
//     background: #2d2d2d; /* Dark title bar background */
//     border-top-left-radius: 12px; /* Match the terminal's border radius */
//     border-top-right-radius: 12px; /* Match the terminal's border radius */
//     border-bottom: 1px solid #9c27b0; /* Purple border to simulate the title bar */
//     display: flex;
//     align-items: center;
//     padding: 0 15px;
//     box-shadow: inset 0 2px 4px rgba(156, 39, 176, 0.5); /* Subtle purple shadow inside */
// }

// /* Outer border and shadow effect */
// #terminal::after {
//     content: '';
//     position: absolute;
//     top: 0;
//     left: 0;
//     width: 100%;
//     height: 100%;
//     border: 2px solid rgba(156, 39, 176, 0.3); /* Outer purple border */
//     border-radius: 12px; /* Match the terminal's border radius */
//     pointer-events: none; /* Ensures it doesn’t interfere with clicks */
//     box-shadow: 0 0 15px rgba(156, 39, 176, 0.7); /* Enhanced purple shadow */
// }

// /* Terminal command prompt */
// #terminal .prompt {
//     color: #9c27b0; /* Purple color for the prompt */
//     font-weight: bold;
// }

// /* Terminal command input */
// #terminal .input {
//     color: #e0e0e0; /* Light text color for commands */
// }

//// Best 1 for scroll 
// #terminal {
//     flex-grow: 1; /* Allow the terminal to expand */
//     padding: 20px; /* Add padding inside the terminal */
//     overflow-y: auto; /* Enable vertical scrolling */
//     white-space: pre-wrap; /* Preserve whitespace and line breaks */
//     display: flex;
//     flex-direction: column; /* Align children in a column */
//     user-select: text; /* Allow text selection */
//     background: #1e1e1e; /* Dark background for terminal */
//     color: #cfcfcf; /* Light text color for contrast */
//     border: 2px solid #00ff00; /* Green border for classic terminal look */
//     margin: 20px; /* Add margin around the terminal */
//     border-radius: 10px; /* Rounded corners for a softer look */
//     box-shadow: 0 0 20px rgba(0, 255, 0, 0.5); /* Glowing green shadow */
//     font-family: 'Courier New', Courier, monospace; /* Monospace font for terminal text */
//     font-size: 14px; /* Size of the terminal text */
//     line-height: 1.5; /* Space between lines for readability */
//     position: relative; /* Position relative for pseudo-elements */
//     height: 100%; /* Ensure terminal takes full height of its container */
// }

// /* Add a title bar with close, minimize, and maximize buttons */
// #terminal::before {
//     content: '';
//     position: absolute;
//     top: -20px; /* Position it above the terminal */
//     left: 0;
//     width: 100%;
//     height: 20px;
//     background: #333; /* Dark title bar background */
//     border-top-left-radius: 10px; /* Match the terminal's border radius */
//     border-top-right-radius: 10px; /* Match the terminal's border radius */
//     border-bottom: 1px solid #00ff00; /* Green border to simulate the title bar */
//     display: flex;
//     align-items: center;
//     padding: 0 10px;
//     box-shadow: inset 0 1px 2px rgba(0, 255, 0, 0.3); /* Subtle shadow inside */
// }

// /* Add a border and shadow effect */
// #terminal::after {
//     content: '';
//     position: absolute;
//     top: 0;
//     left: 0;
//     width: 100%;
//     height: 100%;
//     border: 2px solid rgba(0, 255, 0, 0.5); /* Outer green border for emphasis */
//     border-radius: 10px; /* Match the terminal's border radius */
//     pointer-events: none; /* Ensures it doesn’t interfere with clicks */
//     box-shadow: 0 0 10px rgba(0, 255, 0, 0.8); /* Enhanced green shadow */
// }

// /* Terminal command prompt */
// #terminal .prompt {
//     color: #00ff00; /* Green color for the prompt */
//     font-weight: bold;
// }

// /* Terminal command input */
// #terminal .input {
//     color: #cfcfcf; /* Light text color for commands */
// }
