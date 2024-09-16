// ./commands/payment.js

export default {
    execute: async function(args, terminal) {
        const promptUser = (question) => {
            return new Promise(resolve => {
                const originalCallback = terminal.inputCallback;
                terminal.inputCallback = (input) => {
                    terminal.inputCallback = originalCallback; // Restore original callback
                    resolve(input.trim());
                };
                terminal.print(question);
            });
        };

        const isEmpty = (text) => {
            if (text.trim() === '') {
                terminal.printLine('Input cannot be empty.');
                return true;
            }
            return false;
        };

        try {
            let amount;
            do {
                amount = await promptUser('Enter amount (INR): ');
            } while (isEmpty(amount));

            terminal.printLine(`Entered amount: ₹${amount}`);

            const phoneNumber = await promptUser('Enter phone number linked to UPI: ');

            terminal.printLine('Initiating payment...');

            const response = await fetch('/initiate_payment/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ amount, phone_number: phoneNumber }),
            });

            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    terminal.printLine('Payment initiated successfully!');
                    terminal.printLine('Please follow the instructions sent to your phone to complete the payment.');

                    const paymentId = await promptUser('Enter payment ID: ');
                    const signature = await promptUser('Enter payment signature: ');

                    const confirmResponse = await fetch('/payment_success/', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ payment_id: paymentId, order_id: result.order_id, signature, amount }),
                    });

                    if (confirmResponse.ok) {
                        const confirmResult = await confirmResponse.json();
                        if (confirmResult.success) {
                            terminal.printLine('Payment confirmed successfully! Your balance has been updated.');
                        } else {
                            terminal.printLine('Payment confirmation failed: ' + confirmResult.message);
                        }
                    } else {
                        terminal.printLine('Error: Unable to reach the server.');
                    }
                } else {
                    terminal.printLine('Payment initiation failed: ' + result.message);
                }
            } else {
                terminal.printLine('Error: Unable to reach the server.');
            }
        } catch (error) {
            terminal.printLine('Error: ' + error.message);
        }
    },
    description: 'Initiate a UPI payment to recharge balance.',
};
