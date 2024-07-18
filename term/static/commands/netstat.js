export default {
    execute: async function(args, terminal) {
        terminal.printLine("Active Internet connections (only servers)");
        terminal.printLine("Proto Recv-Q Send-Q Local Address           Foreign Address         State       ");
        terminal.printLine("tcp        0      0 127.0.0.1:6379          0.0.0.0:*               LISTEN      ");
        terminal.printLine("tcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN      ");
        terminal.printLine("tcp6       0      0 :::80                   :::*                    LISTEN      ");
        terminal.printLine("tcp6       0      0 :::443                  :::*                    LISTEN      ");
        terminal.printLine("udp        0      0 0.0.0.0:12345           0.0.0.0:*                           ");
        terminal.printLine("udp6       0      0 :::12345                :::*                              ");
    },
    description: 'Display network connections, routing tables, interface statistics, masquerade connections, and multicast memberships',
};
