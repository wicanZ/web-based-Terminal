export default {
    execute: function(args, terminal) {
        // Determine the style type from arguments
        const styleType = args[0] || 'bars';

        // Create and style the canvas
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = terminal.outputElement.clientWidth;
        canvas.height = 200;
        canvas.style.border = '1px solid #ccc';
        canvas.style.backgroundColor = '#000';

        terminal.outputElement.appendChild(canvas);
        terminal.inputElement.disabled = true;

        // Create and style the file input
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'audio/*';
        fileInput.style.display = 'none';
        fileInput.style.marginTop = '10px';
        fileInput.style.color = '#fff';
        
        terminal.outputElement.appendChild(fileInput);

        // Audio context setup
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        let animationId;

        function drawBars() {
            analyser.getByteFrequencyData(dataArray);
            context.clearRect(0, 0, canvas.width, canvas.height);

            const barWidth = (canvas.width / bufferLength) * 2.5;
            let barHeight;
            let x = 0;

            for (let i = 0; i < bufferLength; i++) {
                barHeight = dataArray[i];
                context.fillStyle = `rgb(${barHeight+100},50,50)`;
                context.fillRect(x, canvas.height - barHeight / 2, barWidth, barHeight / 2);
                x += barWidth + 1;
            }
            animationId = requestAnimationFrame(drawVisualizer);
        }

        function drawCircles() {
            analyser.getByteFrequencyData(dataArray);
            context.clearRect(0, 0, canvas.width, canvas.height);

            for (let i = 0; i < bufferLength; i++) {
                const radius = dataArray[i] / 2;
                context.beginPath();
                context.arc(canvas.width / 2, canvas.height / 2, radius, 0, 2 * Math.PI);
                context.fillStyle = `rgb(${radius + 100}, 50, 50)`;
                context.fill();
            }
            animationId = requestAnimationFrame(drawVisualizer);
        }

        function drawWaves() {
            analyser.getByteFrequencyData(dataArray);
            context.clearRect(0, 0, canvas.width, canvas.height);

            context.beginPath();
            context.moveTo(0, canvas.height / 2);
            for (let i = 0; i < bufferLength; i++) {
                context.lineTo(i * (canvas.width / bufferLength), canvas.height / 2 + dataArray[i] / 4);
            }
            context.strokeStyle = 'rgb(50, 50, 200)';
            context.stroke();
            animationId = requestAnimationFrame(drawVisualizer);
        }

        function drawDots() {
            analyser.getByteFrequencyData(dataArray);
            context.clearRect(0, 0, canvas.width, canvas.height);

            for (let i = 0; i < bufferLength; i++) {
                const radius = dataArray[i] / 5;
                context.beginPath();
                context.arc(i * (canvas.width / bufferLength), canvas.height / 2, radius, 0, 2 * Math.PI);
                context.fillStyle = `rgb(50, ${radius + 100}, 50)`;
                context.fill();
            }
            animationId = requestAnimationFrame(drawVisualizer);
        }

        function drawRadial() {
            analyser.getByteFrequencyData(dataArray);
            context.clearRect(0, 0, canvas.width, canvas.height);

            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;

            for (let i = 0; i < bufferLength; i++) {
                const angle = (i / bufferLength) * 2 * Math.PI;
                const length = dataArray[i];
                const x = centerX + length * Math.cos(angle);
                const y = centerY + length * Math.sin(angle);
                context.beginPath();
                context.moveTo(centerX, centerY);
                context.lineTo(x, y);
                context.strokeStyle = `rgb(50, ${length + 100}, 50)`;
                context.stroke();
            }
            animationId = requestAnimationFrame(drawVisualizer);
        }

        function drawVisualizer() {
            switch (styleType) {
                case 'circles':
                    drawCircles();
                    break;
                case 'waves':
                    drawWaves();
                    break;
                case 'dots':
                    drawDots();
                    break;
                case 'radial':
                    drawRadial();
                    break;
                default:
                    drawBars();
            }
        }

        fileInput.addEventListener('change', function() {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const audioData = e.target.result;
                    audioContext.decodeAudioData(audioData, function(buffer) {
                        const source = audioContext.createBufferSource();
                        source.buffer = buffer;
                        source.connect(analyser);
                        analyser.connect(audioContext.destination);
                        source.start(0);
                        drawVisualizer();
                    });
                };
                reader.readAsArrayBuffer(file);
            }
        });

        function endVisualizer() {
            cancelAnimationFrame(animationId);
            terminal.outputElement.removeChild(canvas);
            terminal.outputElement.removeChild(fileInput);
            terminal.inputElement.disabled = false;
            terminal.inputElement.focus();
        }

        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape' || (event.ctrlKey && event.key === 'c')) {
                endVisualizer();
            }
        });

        // Show file input when the visualizer is executed
        fileInput.style.display = 'block';

        // Handle tab visibility changes
        document.addEventListener('visibilitychange', function() {
            if (document.hidden) {
                cancelAnimationFrame(animationId);
            } else {
                drawVisualizer();
            }
        });
    },
    description: 'Play music and display a visualizer with various styles within the terminal'
};
