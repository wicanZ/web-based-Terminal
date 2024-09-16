export default {
    execute: async function(args, terminal) {
        // Simulate fetching app data
        const apps = await this.fetchApps();

        // Create the necessary HTML elements
        this.createAppStoreElements();

        // Display the app store
        this.displayAppStore(apps);
    },

    fetchApps: async function() {
        // Simulated app data
        return [
            { name: 'Snake Game', description: 'A fun snake game.', version: '1.0', size: '1MB', image: 'snake.png' },
            { name: 'Tetris', description: 'Classic block puzzle game.', version: '2.1', size: '2MB', image: 'tetris.png' },
            { name: 'Weather App', description: 'Check the weather.', version: '1.5', size: '3MB', image: 'weather.png' },
            // Add more apps as needed
        ];
    },

    createAppStoreElements: function() {
        // Create and style the app store popup
        const appStorePopup = document.createElement('div');
        appStorePopup.id = 'appStorePopup';
        appStorePopup.className = 'popup hidden';
        document.body.appendChild(appStorePopup);

        const popupContent = document.createElement('div');
        popupContent.className = 'popup-content';
        appStorePopup.appendChild(popupContent);

        const closeAppStore = document.createElement('button');
        closeAppStore.id = 'closeAppStore';
        closeAppStore.textContent = 'Close';
        closeAppStore.style.float = 'right';
        closeAppStore.style.cursor = 'pointer';
        popupContent.appendChild(closeAppStore);

        const appStoreTitle = document.createElement('h2');
        appStoreTitle.textContent = 'App Store';
        popupContent.appendChild(appStoreTitle);

        const appList = document.createElement('div');
        appList.id = 'appList';
        popupContent.appendChild(appList);

        // Create and style the app details modal
        const appDetailsModal = document.createElement('div');
        appDetailsModal.id = 'appDetailsModal';
        appDetailsModal.className = 'modal hidden';
        document.body.appendChild(appDetailsModal);

        const modalContent = document.createElement('div');
        modalContent.className = 'modal-content';
        appDetailsModal.appendChild(modalContent);

        const closeAppDetails = document.createElement('span');
        closeAppDetails.id = 'closeAppDetails';
        closeAppDetails.textContent = '×';
        closeAppDetails.style.float = 'right';
        closeAppDetails.style.cursor = 'pointer';
        closeAppDetails.style.fontSize = '18px';
        closeAppDetails.style.padding = '5px';
        modalContent.appendChild(closeAppDetails);

        const appDetails = document.createElement('div');
        appDetails.id = 'appDetails';
        modalContent.appendChild(appDetails);

        // Add event listeners to close the popups
        closeAppStore.addEventListener('click', () => {
            appStorePopup.classList.add('hidden');
        });

        closeAppDetails.addEventListener('click', () => {
            appDetailsModal.classList.add('hidden');
        });

        // Add CSS styles directly in JS
        const style = document.createElement('style');
        style.textContent = `
            .popup, .modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 1000;
            }

            .popup-content, .modal-content {
                background-color: #fff;
                padding: 20px;
                border-radius: 10px;
                width: 80%;
                max-width: 500px;
            }

            .hidden {
                display: none;
            }

            #appList .app-item {
                cursor: pointer;
                margin: 10px 0;
                padding: 10px;
                background-color: #eee;
                border-radius: 5px;
            }

            #closeAppStore, #closeAppDetails {
                cursor: pointer;
                font-size: 18px;
                border: none;
                background: none;
                padding: 5px;
            }

            #closeAppStore:hover, #closeAppDetails:hover {
                color: red;
            }
        `;
        document.head.appendChild(style);
    },

    displayAppStore: function(apps) {
        const appStorePopup = document.getElementById('appStorePopup');
        const appList = document.getElementById('appList');

        appList.innerHTML = ''; // Clear previous list

        apps.forEach(app => {
            const appItem = document.createElement('div');
            appItem.className = 'app-item';
            appItem.innerText = app.name;
            appItem.addEventListener('click', () => this.displayAppDetails(app));
            appList.appendChild(appItem);
        });

        // Show the app store popup
        appStorePopup.classList.remove('hidden');
    },

    displayAppDetails: function(app) {
        const appDetailsModal = document.getElementById('appDetailsModal');
        const appDetails = document.getElementById('appDetails');

        appDetails.innerHTML = `
            <h3>${app.name}</h3>
            <img src="${app.image}" alt="${app.name}" style="width: 100px; height: auto;" />
            <p><strong>Version:</strong> ${app.version}</p>
            <p><strong>Size:</strong> ${app.size}</p>
            <p>${app.description}</p>
        `;

        // Show the app details modal
        appDetailsModal.classList.remove('hidden');
    }
};
