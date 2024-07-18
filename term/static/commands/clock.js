export default {
    execute: function(args, terminal) {
        const canvas = document.createElement('canvas');
        canvas.width = 300;
        canvas.height = 200;
        terminal.outputElement.appendChild(canvas);
        const ctx = canvas.getContext('2d');

        function drawClock() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const now = new Date();
            ctx.save();
            ctx.translate(100, 100);
            ctx.scale(0.4, 0.4);
            ctx.rotate(-Math.PI / 2);
            ctx.strokeStyle = 'blue';
            ctx.fillStyle = 'white';
            ctx.lineWidth = 8;
            ctx.lineCap = 'round';

            // Hour marks
            ctx.save();
            for (let i = 0; i < 12; i++) {
                ctx.beginPath();
                ctx.rotate(Math.PI / 6);
                ctx.moveTo(100, 0);
                ctx.lineTo(120, 0);
                ctx.stroke();
            }
            ctx.restore();

            // Minute marks
            ctx.save();
            ctx.lineWidth = 5;
            for (let i = 0; i < 60; i++) {
                if (i % 5 !== 0) {
                    ctx.beginPath();
                    ctx.moveTo(117, 0);
                    ctx.lineTo(120, 0);
                    ctx.stroke();
                }
                ctx.rotate(Math.PI / 30);
            }
            ctx.restore();

            const sec = now.getSeconds();
            const min = now.getMinutes();
            const hr = now.getHours();
            ctx.fillStyle = 'red';

            // Write hours
            ctx.save();
            ctx.rotate((Math.PI / 6) * hr + (Math.PI / 360) * min + (Math.PI / 21600) * sec);
            ctx.lineWidth = 14;
            ctx.beginPath();
            ctx.moveTo(-20, 0);
            ctx.lineTo(80, 0);
            ctx.stroke();
            ctx.restore();

            // Write minutes
            ctx.save();
            ctx.rotate((Math.PI / 30) * min + (Math.PI / 1800) * sec);
            ctx.lineWidth = 10;
            ctx.beginPath();
            ctx.moveTo(-28, 0);
            ctx.lineTo(112, 0);
            ctx.stroke();
            ctx.restore();

            // Write seconds
            ctx.save();
            ctx.rotate((Math.PI / 30) * sec);
            ctx.strokeStyle = '#D40000';
            ctx.fillStyle = '#D40000';
            ctx.lineWidth = 6;
            ctx.beginPath();
            ctx.moveTo(-30, 0);
            ctx.lineTo(83, 0);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(0, 0, 10, 0, Math.PI * 2, true);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(95, 0, 10, 0, Math.PI * 2, true);
            ctx.stroke();
            ctx.fillStyle = '#555';
            ctx.arc(0, 0, 3, 0, Math.PI * 2, true);
            ctx.fill();
            ctx.restore();

            ctx.restore();
        }

        setInterval(drawClock, 1000);
    },
    description: 'Display a real-time clock'
};
