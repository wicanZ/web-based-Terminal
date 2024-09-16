export default {
    execute: async function(args, terminal) {
        const todoList = JSON.parse(localStorage.getItem('todoList')) || [];

        const saveTodos = () => {
            localStorage.setItem('todoList', JSON.stringify(todoList));
        };

        const listTodos = () => {
            if (todoList.length === 0) {
                terminal.printLine('No tasks found.');
            } else {
                todoList.forEach((todo, index) => {
                    terminal.printLine(`${index + 1}. ${todo.completed ? '[x]' : '[ ]'} ${todo.task}`);
                });
            }
        };

        const promptUserForTask = async (message) => {
            return new Promise((resolve) => {
                const inputHandler = (input) => {
                    if (input.trim() === '' || input.trim().toLowerCase() === 'exit') {
                        terminal.printLine('Input cannot be empty. Please enter a valid task or type "exit" to cancel.');
                        terminal.inputCallback = inputHandler; // Keep asking for input
                    } else {
                        terminal.inputCallback = null;
                        resolve(input.trim());
                    }
                };

                terminal.printLine(message);
                terminal.inputCallback = inputHandler;
            });
        };

        const addTodo = async () => {
            const task = await promptUserForTask('Please enter the task:');
            if (task.toLowerCase() !== 'exit') {
                todoList.push({ task, completed: false });
                saveTodos();
                terminal.printLine(`Added task: "${task}"`);
            } else {
                terminal.printLine('Task addition cancelled.');
            }
        };

        const deleteTodo = async () => {
            const index = await promptUserForTask('Please enter the task number to delete (or type "exit" to cancel):');
            if (index.toLowerCase() !== 'exit') {
                const taskIndex = parseInt(index, 10) - 1;
                if (taskIndex >= 0 && taskIndex < todoList.length) {
                    const removed = todoList.splice(taskIndex, 1);
                    saveTodos();
                    terminal.printLine(`Removed task: "${removed[0].task}"`);
                } else {
                    terminal.printLine('Invalid task number.');
                }
            } else {
                terminal.printLine('Task deletion cancelled.');
            }
        };

        const updateTodo = async () => {
            const index = await promptUserForTask('Please enter the task number to update (or type "exit" to cancel):');
            if (index.toLowerCase() !== 'exit') {
                const taskIndex = parseInt(index, 10) - 1;
                if (taskIndex >= 0 && taskIndex < todoList.length) {
                    const newTask = await promptUserForTask('Please enter the new task description:');
                    if (newTask.toLowerCase() !== 'exit') {
                        todoList[taskIndex].task = newTask;
                        saveTodos();
                        terminal.printLine(`Updated task ${taskIndex + 1} to: "${newTask}"`);
                    } else {
                        terminal.printLine('Task update cancelled.');
                    }
                } else {
                    terminal.printLine('Invalid task number.');
                }
            } else {
                terminal.printLine('Task update cancelled.');
            }
        };

        const toggleComplete = async () => {
            const index = await promptUserForTask('Please enter the task number to toggle completion (or type "exit" to cancel):');
            if (index.toLowerCase() !== 'exit') {
                const taskIndex = parseInt(index, 10) - 1;
                if (taskIndex >= 0 && taskIndex < todoList.length) {
                    todoList[taskIndex].completed = !todoList[taskIndex].completed;
                    saveTodos();
                    terminal.printLine(`Task ${taskIndex + 1} marked as ${todoList[taskIndex].completed ? 'complete' : 'incomplete'}`);
                } else {
                    terminal.printLine('Invalid task number.');
                }
            } else {
                terminal.printLine('Task toggle cancelled.');
            }
        };

        const command = args[0];
        if (!command || command === 'list') {
            listTodos();
        } else if (command === 'add') {
            await addTodo();
        } else if (command === 'delete') {
            await deleteTodo();
        } else if (command === 'update') {
            await updateTodo();
        } else if (command === 'toggle') {
            await toggleComplete();
        } else {
            terminal.printLine(`Unknown command: ${command}`);
        }
    },

    description: 'Manage your todo list (list, add, delete, update, toggle) with user prompts'
};
