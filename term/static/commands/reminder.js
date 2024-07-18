// reminder.js
export default {
    reminders: [],

    execute: function(args, terminal) {
        if (args.length === 0) {
            terminal.printLine('Usage: reminder <time in minutes> <message>');
            return;
        }

        const time = parseInt(args[0], 10);
        if (isNaN(time) || time <= 0) {
            terminal.printLine('Error: Time must be a positive number.');
            return;
        }

        const message = args.slice(1).join(' ');
        if (!message) {
            terminal.printLine('Error: Please provide a message for the reminder.');
            return;
        }

        const reminderTime = Date.now() + time * 60000; // Convert minutes to milliseconds
        this.reminders.push({ time: reminderTime, message });

        terminal.printLine(`Reminder set for ${time} minute(s) from now.`);

        if (!this.checkRemindersInterval) {
            this.startCheckingReminders(terminal);
        }
    },

    startCheckingReminders: function(terminal) {
        this.checkRemindersInterval = setInterval(() => {
            this.checkReminders(terminal);
        }, 60000); // Check every minute
    },

    checkReminders: function(terminal) {
        const now = Date.now();
        const dueReminders = this.reminders.filter(reminder => reminder.time <= now);

        dueReminders.forEach(reminder => {
            terminal.printLine(`Reminder: ${reminder.message}`);
            // Optional: play sound or show notification
        });

        this.reminders = this.reminders.filter(reminder => reminder.time > now);

        if (this.reminders.length === 0) {
            clearInterval(this.checkRemindersInterval);
            this.checkRemindersInterval = null;
        }
    },

    description: 'Set a reminder'
};


// export default {
//     execute: function(args, terminal) {
//         if (args.length < 2) {
//             terminal.printLine("Usage: reminder <time in minutes> <message>");
//             return;
//         }

//         const time = parseInt(args[0]);
//         if (isNaN(time)) {
//             terminal.printLine("Error: Invalid time. Please provide time in minutes.");
//             return;
//         }

//         const message = args.slice(1).join(" ");
//         terminal.printLine(`Reminder set for ${time} minutes: ${message}`);

//         const fileInput = document.createElement('input');
//         fileInput.type = 'file';
//         fileInput.accept = 'audio/*';
        
//         fileInput.onchange = (event) => {
//             const file = event.target.files[0];
//             if (!file) {
//                 terminal.printLine("Error: No file selected.");
//                 return;
//             }

//             const reader = new FileReader();
//             reader.onload = (e) => {
//                 const musicUrl = e.target.result;

//                 const reminder = { time: Date.now() + time * 60000, musicUrl, message };
//                 const reminders = JSON.parse(localStorage.getItem('reminders')) || [];
//                 reminders.push(reminder);
//                 localStorage.setItem('reminders', JSON.stringify(reminders));

//                 setTimeout(() => {
//                     this.triggerReminder(reminder, terminal);
//                 }, time * 60000); // Convert minutes to milliseconds
//             };
//             reader.readAsDataURL(file);
//         };

//         fileInput.click();
//     },
    
//     triggerReminder: function(reminder, terminal) {
//         terminal.printLine(`Reminder: ${reminder.message}`);
//         const audio = new Audio(reminder.musicUrl);
//         audio.play();
//     },

//     checkReminders: function(terminal) {
//         const reminders = JSON.parse(localStorage.getItem('reminders')) || [];
//         const now = Date.now();
//         const remainingReminders = reminders.filter(reminder => {
//             if (reminder.time <= now) {
//                 this.triggerReminder(reminder, terminal);
//                 return false;
//             }
//             return true;
//         });
//         localStorage.setItem('reminders', JSON.stringify(remainingReminders));
//     },
    
//     description: 'Set a reminder with music from your system. Usage: reminder <time in minutes> <message>',
// };
