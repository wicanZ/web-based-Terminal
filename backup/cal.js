export default {
    execute: function(args, terminal) {
        // Parse arguments
        const [monthStr, yearStr] = args;
        const month = parseInt(monthStr, 10);
        const year = parseInt(yearStr, 10);

        // Validate arguments
        if (isNaN(month) || isNaN(year) || month < 1 || month > 12) {
            terminal.displayOutput('Usage: cal <month> <year>');
            return;
        }

        // Generate calendar
        const daysInMonth = new Date(year, month, 0).getDate();
        const firstDay = new Date(year, month - 1, 1).getDay();

        let calendar = `\n  ${getMonthName(month)} ${year}\n`;
        calendar += 'Su Mo Tu We Th Fr Sa\n';

        // Add leading spaces for the first day
        for (let i = 0; i < firstDay; i++) {
            calendar += '   ';
        }

        // Add the days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            calendar += day.toString().padStart(2, ' ') + ' ';
            if ((firstDay + day) % 7 === 0) {
                calendar += '\n';
            }
        }

        // Display the calendar
        terminal.animateText(calendar.trim());
    },
    description: 'Display a calendar for a given month and year'
};

function getMonthName(month) {
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return monthNames[month - 1];
}
