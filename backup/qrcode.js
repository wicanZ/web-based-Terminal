export default {
    execute: async function(args , terminal  ){
        if(args.length === 0 ) {
            terminal.printLine('[-] Create qrcode by typing $ qrcode <text></text>') ;
            return ;
        }
        terminal.displayOutput('Start generate qr code and then display image to user to download ') ;

        const image = document.createElement('img');
        const displayImage = document.createElement('div') ;
        displayImage.style.width =  100 + 'px';
        displayImage.style.border = '2px solid black';
        image.src = 'hello.png';
        displayImage.appendChild(image);
        document.body.appendChild(displayImage) ;
        terminal.displayOutput('Qrcode has been generate');

        
        const keydownHandler = (event) => {
            if (event.key === 'Escape' || (event.ctrlKey && event.key === 'c')) {
                terminal.displayOutput(`key typing qrcode : ${event.key}`) ;
                document.body.removeChild(displayImage);
                terminal.printLine('Exited  game.');
                
                document.removeEventListener('keydown', keydownHandler);
                return;
            }
        };
        document.addEventListener('keydown', keydownHandler); 
    }
}