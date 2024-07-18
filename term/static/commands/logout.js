export default {
    execute: function(args, terminal) {
        terminal.isLoggedIn = false;
        terminal.username = null;
        terminal.ip = null;
        terminal.printLine('You have been logged out.');
    },
    description: 'Log out the current user',
};
