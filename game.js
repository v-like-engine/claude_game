// Moscow Railways Train Simulator
// Main Game Engine

class MoscowRailwaysGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());

        // Game State
        this.state = 'MAIN_MENU'; // MAIN_MENU, DEPOT, TRAIN_SELECTION, ROUTE_SELECTION, PLAYING, PAUSED
        this.gameStarted = false;

        // Player Data
        this.player = {
            exp: 0,
            currentTrain: null,
            currentRoute: null,
            unlockedTrains: ['ed4m', 'em4'],
            unlockedRoutes: ['mcd1']
        };

        // Game Time
        this.gameTime = { hours: 6, minutes: 0 }; // Starts at 6:00 AM
        this.realTimeMultiplier = 60; // 1 real second = 60 game seconds

        // Train State
        this.trainState = {
            speed: 0, // km/h
            position: 0, // meters from start
            acceleration: 0,
            maxSpeed: 90,
            accelerationRate: 1.5,
            brakingRate: 2.5,
            doorsOpen: false,
            lightsOn: false,
            hornActive: false,
            cruiseControl: false,
            cruiseSpeed: 0,
            passengersOnBoard: 0,
            stoppedAtStation: false,
            currentStationIndex: 0
        };

        // Animation State
        this.animationOffset = 0; // For scrolling background
        this.cloudPositions = this.generateClouds();

        // Passenger Management
        this.passengers = [];
        this.passengersDelivered = 0;

        // Audio
        this.sounds = {
            master: 0.7,
            sfx: 0.8,
            music: 0.5
        };
        this.currentAmbient = null;
        this.currentTrainSound = null;

        // Images Cache
        this.images = {};
        this.imageLoadQueue = [];

        // Input
        this.keys = {};
        this.setupInput();

        // Initialize
        this.initializeTrainData();
        this.initializeRouteData();
        this.initializeMenus();
        this.lastFrameTime = Date.now();

        // Start game loop
        this.gameLoop();
    }

    resizeCanvas() {
        const container = document.getElementById('game-container');
        this.canvas.width = container.clientWidth;
        this.canvas.height = container.clientHeight;
    }

    generateClouds() {
        const clouds = [];
        for (let i = 0; i < 8; i++) {
            clouds.push({
                x: Math.random() * 2000,
                y: Math.random() * 200 + 50,
                size: Math.random() * 60 + 40,
                speed: Math.random() * 0.3 + 0.1
            });
        }
        return clouds;
    }

    initializeTrainData() {
        this.trains = {
            'ed4m': {
                name: 'ЭД4М',
                nameEn: 'ed4m',
                maxSpeed: 90,
                accelerationRate: 4.5,  // Increased from 1.2
                brakingRate: 6.0,       // Increased from 2.0
                capacity: 1200,
                requiredExp: 0,
                description: 'Classic electric train',
                railcars: 10,
                icon: '🚃'
            },
            'em4': {
                name: 'ЭМ4',
                nameEn: 'em4',
                maxSpeed: 100,
                accelerationRate: 5.5,  // Increased from 1.5
                brakingRate: 7.0,       // Increased from 2.3
                capacity: 1400,
                requiredExp: 0,
                description: 'Modern electric multiple unit',
                railcars: 12,
                icon: '🚄'
            },
            'es2g': {
                name: 'ЭС2Г "Ласточка"',
                nameEn: 'es2g',
                maxSpeed: 130,
                accelerationRate: 7.0,  // Increased from 2.0
                brakingRate: 8.5,       // Increased from 2.8
                capacity: 1200,
                requiredExp: 500,
                description: 'High-speed Lastochka train',
                railcars: 10,
                icon: '🚅'
            }
        };
    }

    initializeRouteData() {
        this.routes = {
            'mcd1': {
                name: 'МЦД-1 (Белорусско-Савёловский)',
                nameEn: 'mcd1',
                requiredExp: 0,
                stations: [
                    { name: 'Одинцово', nameEn: 'odintsovo', distance: 0, arrivalTime: { hours: 6, minutes: 30 } },
                    { name: 'Баковка', nameEn: 'bakovka', distance: 2400, arrivalTime: { hours: 6, minutes: 33 } },
                    { name: 'Сколково', nameEn: 'skolkovo', distance: 4600, arrivalTime: { hours: 6, minutes: 36 } },
                    { name: 'Немчиновка', nameEn: 'nemchinovka', distance: 6800, arrivalTime: { hours: 6, minutes: 39 } },
                    { name: 'Сетунь', nameEn: 'setun', distance: 13200, arrivalTime: { hours: 6, minutes: 49 } },
                    { name: 'Кунцевская', nameEn: 'kuntsevskaya', distance: 15800, arrivalTime: { hours: 6, minutes: 53 } },
                    { name: 'Рабочий Поселок', nameEn: 'rabochiy_poselok', distance: 17600, arrivalTime: { hours: 6, minutes: 56 } },
                    { name: 'Фили', nameEn: 'fili', distance: 19400, arrivalTime: { hours: 6, minutes: 59 } },
                    { name: 'Тестовская', nameEn: 'testovskaya', distance: 22100, arrivalTime: { hours: 7, minutes: 3 } },
                    { name: 'Беговая', nameEn: 'begovaya', distance: 25300, arrivalTime: { hours: 7, minutes: 8 } },
                    { name: 'Белорусская', nameEn: 'belorusskaya', distance: 27200, arrivalTime: { hours: 7, minutes: 11 } },
                    { name: 'Савёловская', nameEn: 'savelovskaya', distance: 29800, arrivalTime: { hours: 7, minutes: 15 } },
                    { name: 'Петровско-Разумовская', nameEn: 'petrovsko_razumovskaya', distance: 34200, arrivalTime: { hours: 7, minutes: 22 } },
                    { name: 'Окружная', nameEn: 'okruzhnaya', distance: 36500, arrivalTime: { hours: 7, minutes: 25 } },
                    { name: 'Марк', nameEn: 'mark', distance: 38100, arrivalTime: { hours: 7, minutes: 28 } },
                    { name: 'Лихоборы', nameEn: 'likhobory', distance: 39900, arrivalTime: { hours: 7, minutes: 31 } },
                    { name: 'Гражданская', nameEn: 'grazhdanskaya', distance: 42300, arrivalTime: { hours: 7, minutes: 34 } },
                    { name: 'Дегунино', nameEn: 'degunino', distance: 44100, arrivalTime: { hours: 7, minutes: 37 } },
                    { name: 'Бескудниково', nameEn: 'beskudnikovo', distance: 45800, arrivalTime: { hours: 7, minutes: 40 } },
                    { name: 'Лианозово', nameEn: 'lianozovo', distance: 47600, arrivalTime: { hours: 7, minutes: 43 } },
                    { name: 'Марфино', nameEn: 'marfino', distance: 49400, arrivalTime: { hours: 7, minutes: 46 } },
                    { name: 'Долгопрудная', nameEn: 'dolgoprudnaya', distance: 52200, arrivalTime: { hours: 7, minutes: 51 } },
                    { name: 'Водники', nameEn: 'vodniki', distance: 54800, arrivalTime: { hours: 7, minutes: 55 } },
                    { name: 'Хлебниково', nameEn: 'khlebnikovo', distance: 58100, arrivalTime: { hours: 8, minutes: 0 } },
                    { name: 'Шереметьевская', nameEn: 'sheremetyevskaya', distance: 60500, arrivalTime: { hours: 8, minutes: 4 } },
                    { name: 'Катуар', nameEn: 'katuar', distance: 62800, arrivalTime: { hours: 8, minutes: 8 } },
                    { name: 'Лобня', nameEn: 'lobnya', distance: 65200, arrivalTime: { hours: 8, minutes: 12 } }
                ]
            },
            'mcd2': {
                name: 'МЦД-2',
                nameEn: 'mcd2',
                requiredExp: 300,
                stations: [
                    { name: 'Нахабино', nameEn: 'nakhabino', distance: 0, arrivalTime: { hours: 6, minutes: 30 } },
                    { name: 'Павшино', nameEn: 'pavshino', distance: 4200, arrivalTime: { hours: 6, minutes: 36 } },
                    { name: 'Трикотажная', nameEn: 'trikotazhnaya', distance: 8900, arrivalTime: { hours: 6, minutes: 44 } },
                    { name: 'Тушино', nameEn: 'tushino', distance: 15300, arrivalTime: { hours: 6, minutes: 55 } },
                    { name: 'Щукинская', nameEn: 'shchukinskaya', distance: 19800, arrivalTime: { hours: 7, minutes: 2 } },
                    { name: 'Волоколамская', nameEn: 'volokolamskaya', distance: 80000, arrivalTime: { hours: 8, minutes: 30 } }
                ]
            }
        };
    }

    initializeMenus() {
        // Main Menu
        document.getElementById('newGameBtn').addEventListener('click', () => this.newGame());
        document.getElementById('loadGameBtn').addEventListener('click', () => this.showLoadMenu());
        document.getElementById('settingsBtn').addEventListener('click', () => this.showSettings());
        document.getElementById('exitBtn').addEventListener('click', () => this.exitGame());

        // Load Menu
        document.getElementById('backToMainBtn').addEventListener('click', () => this.showMainMenu());

        // Settings
        document.getElementById('backToMainFromSettings').addEventListener('click', () => this.showMainMenu());
        document.getElementById('masterVolume').addEventListener('input', (e) => {
            this.sounds.master = e.target.value / 100;
            document.getElementById('volumeValue').textContent = e.target.value + '%';
        });
        document.getElementById('sfxVolume').addEventListener('input', (e) => {
            this.sounds.sfx = e.target.value / 100;
            document.getElementById('sfxValue').textContent = e.target.value + '%';
        });
        document.getElementById('musicVolume').addEventListener('input', (e) => {
            this.sounds.music = e.target.value / 100;
            document.getElementById('musicValue').textContent = e.target.value + '%';
        });

        // Pause Menu
        document.getElementById('resumeBtn').addEventListener('click', () => this.resumeGame());
        document.getElementById('saveExitBtn').addEventListener('click', () => this.saveAndExit());

        // Train Selection
        document.getElementById('backToDepotBtn').addEventListener('click', () => this.backToDepot());

        // Route Selection
        document.getElementById('backToTrainSelection').addEventListener('click', () => this.showTrainSelection());

        // Timetable
        document.getElementById('closeTimetable').addEventListener('click', () => this.closeTimetable());
    }

    setupInput() {
        window.addEventListener('keydown', (e) => {
            this.keys[e.key.toLowerCase()] = true;
            this.handleKeyPress(e);
        });

        window.addEventListener('keyup', (e) => {
            this.keys[e.key.toLowerCase()] = false;
        });
    }

    handleKeyPress(e) {
        if (this.state !== 'PLAYING') return;

        switch(e.key.toLowerCase()) {
            case 'escape':
                e.preventDefault();
                this.pauseGame();
                break;
            case 'd':
                this.toggleDoors();
                break;
            case 'w':
                this.playWarningSound();
                break;
            case 'l':
                this.toggleLights();
                break;
            case 'h':
                this.activateHorn();
                break;
            case 'c':
                this.toggleCruiseControl();
                break;
            case ' ':
                e.preventDefault();
                this.emergencyBrake();
                break;
            case 'tab':
                e.preventDefault();
                this.toggleTimetable();
                break;
        }
    }

    // Menu Functions
    showMainMenu() {
        this.state = 'MAIN_MENU';
        document.getElementById('mainMenu').classList.remove('hidden');
        document.getElementById('loadMenu').classList.add('hidden');
        document.getElementById('settingsMenu').classList.add('hidden');
        document.getElementById('trainSelectionMenu').classList.add('hidden');
        document.getElementById('routeSelectionMenu').classList.add('hidden');
        document.getElementById('pauseMenu').classList.add('hidden');
        document.getElementById('hud').classList.add('hidden');
    }

    showLoadMenu() {
        this.state = 'LOAD_MENU';
        document.getElementById('mainMenu').classList.add('hidden');
        document.getElementById('loadMenu').classList.remove('hidden');
        this.populateSaveSlots();
    }

    showSettings() {
        document.getElementById('mainMenu').classList.add('hidden');
        document.getElementById('settingsMenu').classList.remove('hidden');
    }

    newGame() {
        this.player = {
            exp: 0,
            currentTrain: null,
            currentRoute: null,
            unlockedTrains: ['ed4m', 'em4'],
            unlockedRoutes: ['mcd1']
        };
        this.gameTime = { hours: 6, minutes: 0 };
        this.showDepot();
    }

    showDepot() {
        this.state = 'DEPOT';
        document.getElementById('mainMenu').classList.add('hidden');
        document.getElementById('hud').classList.add('hidden');
        this.showTrainSelection();
    }

    showTrainSelection() {
        this.state = 'TRAIN_SELECTION';
        document.getElementById('routeSelectionMenu').classList.add('hidden');
        document.getElementById('trainSelectionMenu').classList.remove('hidden');
        this.populateTrainsList();
    }

    populateTrainsList() {
        const trainsList = document.getElementById('trainsList');
        trainsList.innerHTML = '';

        Object.values(this.trains).forEach(train => {
            const isUnlocked = this.player.unlockedTrains.includes(train.nameEn);
            const canUnlock = this.player.exp >= train.requiredExp;

            const card = document.createElement('div');
            card.className = 'train-card' + (isUnlocked ? '' : ' locked');
            card.innerHTML = `
                <div class="train-icon">${train.icon}</div>
                <h3>${train.name}</h3>
                <p>Max Speed: ${train.maxSpeed} km/h</p>
                <p>Capacity: ${train.capacity}</p>
                <p>Railcars: ${train.railcars}</p>
                <p>${isUnlocked ? 'Available' : `Requires ${train.requiredExp} EXP`}</p>
            `;

            if (isUnlocked) {
                card.addEventListener('click', () => this.selectTrain(train.nameEn));
            }

            trainsList.appendChild(card);
        });
    }

    selectTrain(trainId) {
        this.player.currentTrain = trainId;
        const train = this.trains[trainId];
        this.trainState.maxSpeed = train.maxSpeed;
        this.trainState.accelerationRate = train.accelerationRate;
        this.trainState.brakingRate = train.brakingRate;
        this.showRouteSelection();
    }

    showRouteSelection() {
        this.state = 'ROUTE_SELECTION';
        document.getElementById('trainSelectionMenu').classList.add('hidden');
        document.getElementById('routeSelectionMenu').classList.remove('hidden');
        this.populateRoutesList();
    }

    populateRoutesList() {
        const routesList = document.getElementById('routesList');
        routesList.innerHTML = '';

        Object.values(this.routes).forEach(route => {
            const isUnlocked = this.player.unlockedRoutes.includes(route.nameEn);

            const card = document.createElement('div');
            card.className = 'route-card' + (isUnlocked ? '' : ' locked');
            card.innerHTML = `
                <h3>${route.name}</h3>
                <p>Stations: ${route.stations.length}</p>
                <p>${isUnlocked ? 'Available' : `Requires ${route.requiredExp} EXP`}</p>
            `;

            if (isUnlocked) {
                card.addEventListener('click', () => this.selectRoute(route.nameEn));
            }

            routesList.appendChild(card);
        });
    }

    selectRoute(routeId) {
        this.player.currentRoute = routeId;
        this.startGame();
    }

    backToDepot() {
        this.showTrainSelection();
    }

    startGame() {
        this.state = 'PLAYING';
        document.getElementById('trainSelectionMenu').classList.add('hidden');
        document.getElementById('routeSelectionMenu').classList.add('hidden');
        document.getElementById('hud').classList.remove('hidden');

        // Reset train state
        this.trainState.speed = 0;
        this.trainState.position = 0;
        this.trainState.doorsOpen = false;
        this.trainState.lightsOn = false;
        this.trainState.passengersOnBoard = 0;
        this.trainState.currentStationIndex = 0;
        this.trainState.stoppedAtStation = false;

        // Reset passengers
        this.passengers = [];
        this.passengersDelivered = 0;

        // Initialize passengers at stations
        this.initializePassengers();

        this.updateHUD();
        this.gameStarted = true;
    }

    initializePassengers() {
        const route = this.routes[this.player.currentRoute];
        route.stations.forEach((station, index) => {
            if (index === route.stations.length - 1) return; // Last station has no boarding passengers

            const waitingCount = Math.floor(Math.random() * 50) + 30; // 30-80 passengers
            for (let i = 0; i < waitingCount; i++) {
                // Passengers will board at this station and get off at a random future station
                const destinationIndex = index + 1 + Math.floor(Math.random() * (route.stations.length - index - 1));
                this.passengers.push({
                    currentStation: index,
                    destinationStation: destinationIndex,
                    onBoard: false,
                    delivered: false,
                    boardingTime: 0,
                    swingOffset: Math.random() * Math.PI * 2
                });
            }
        });
    }

    pauseGame() {
        if (this.state === 'PLAYING') {
            this.state = 'PAUSED';
            document.getElementById('pauseMenu').classList.remove('hidden');
        }
    }

    resumeGame() {
        this.state = 'PLAYING';
        document.getElementById('pauseMenu').classList.add('hidden');
    }

    saveAndExit() {
        this.saveGame();
        this.showMainMenu();
    }

    exitGame() {
        window.close();
    }

    // Save/Load System
    saveGame(slotNumber = null) {
        if (slotNumber === null) {
            // Auto-save to slot 1
            slotNumber = 1;
        }

        const saveData = {
            player: this.player,
            gameTime: this.gameTime,
            trainState: this.trainState,
            passengersDelivered: this.passengersDelivered,
            timestamp: new Date().toISOString()
        };

        localStorage.setItem(`moscowRailways_save${slotNumber}`, JSON.stringify(saveData));
    }

    loadGame(slotNumber) {
        const saveData = JSON.parse(localStorage.getItem(`moscowRailways_save${slotNumber}`));
        if (saveData) {
            this.player = saveData.player;
            this.gameTime = saveData.gameTime;
            this.trainState = saveData.trainState || this.trainState;
            this.passengersDelivered = saveData.passengersDelivered || 0;
            this.showDepot();
        }
    }

    populateSaveSlots() {
        const slotsContainer = document.getElementById('saveSlots');
        slotsContainer.innerHTML = '';

        for (let i = 1; i <= 6; i++) {
            const saveData = localStorage.getItem(`moscowRailways_save${i}`);
            const slot = document.createElement('div');
            slot.className = 'save-slot' + (saveData ? '' : ' empty');

            if (saveData) {
                const data = JSON.parse(saveData);
                slot.innerHTML = `
                    <h3>Save ${i}</h3>
                    <p>EXP: ${data.player.exp}</p>
                    <p>Train: ${this.trains[data.player.currentTrain]?.name || 'None'}</p>
                    <p>Date: ${new Date(data.timestamp).toLocaleString()}</p>
                `;
                slot.addEventListener('click', () => {
                    this.loadGame(i);
                });
            } else {
                slot.innerHTML = `<h3>Save ${i}</h3><p>Empty Slot</p>`;
            }

            slotsContainer.appendChild(slot);
        }
    }

    // Game Controls
    toggleDoors() {
        if (this.trainState.speed === 0) {
            this.trainState.doorsOpen = !this.trainState.doorsOpen;

            if (this.trainState.doorsOpen) {
                this.playSound('door_opening');
                if (this.trainState.stoppedAtStation) {
                    this.handlePassengerExchange();
                }
            } else {
                this.playSound('door_closing');
            }

            this.updateHUD();
        }
    }

    toggleLights() {
        this.trainState.lightsOn = !this.trainState.lightsOn;
        this.updateHUD();
    }

    playWarningSound() {
        this.playSound('door_closing_warning');
    }

    activateHorn() {
        this.trainState.hornActive = true;
        this.playSound('horn');
        setTimeout(() => {
            this.trainState.hornActive = false;
        }, 1500);
    }

    toggleCruiseControl() {
        if (this.trainState.speed > 20) {
            this.trainState.cruiseControl = !this.trainState.cruiseControl;
            if (this.trainState.cruiseControl) {
                this.trainState.cruiseSpeed = this.trainState.speed;
            }
            this.updateHUD();
        }
    }

    emergencyBrake() {
        this.trainState.speed = Math.max(0, this.trainState.speed - 20);
        this.trainState.cruiseControl = false;
        this.playSound('emergency_brake');
    }

    toggleTimetable() {
        const modal = document.getElementById('timetableModal');
        if (modal.classList.contains('hidden')) {
            this.showFullTimetable();
        } else {
            this.closeTimetable();
        }
    }

    showFullTimetable() {
        const modal = document.getElementById('timetableModal');
        const timetable = document.getElementById('fullTimetable');
        const route = this.routes[this.player.currentRoute];

        timetable.innerHTML = '';
        route.stations.forEach((station, index) => {
            const row = document.createElement('div');
            row.className = 'timetable-row';
            if (index < this.trainState.currentStationIndex) {
                row.classList.add('passed');
            } else if (index === this.trainState.currentStationIndex) {
                row.classList.add('current');
            }

            row.innerHTML = `
                <span>${station.name}</span>
                <span>${String(station.arrivalTime.hours).padStart(2, '0')}:${String(station.arrivalTime.minutes).padStart(2, '0')}</span>
            `;
            timetable.appendChild(row);
        });

        modal.classList.remove('hidden');
    }

    closeTimetable() {
        document.getElementById('timetableModal').classList.add('hidden');
    }

    // Passenger Management
    handlePassengerExchange() {
        const route = this.routes[this.player.currentRoute];
        const currentStationIndex = this.trainState.currentStationIndex;

        // Passengers getting off
        const passengersGettingOff = this.passengers.filter(p =>
            p.onBoard && p.destinationStation === currentStationIndex
        );

        passengersGettingOff.forEach(p => {
            p.onBoard = false;
            p.delivered = true;
            this.trainState.passengersOnBoard--;
            this.passengersDelivered++;
            this.player.exp += 1; // 1 EXP per delivered passenger
        });

        // Passengers getting on
        const passengersWaiting = this.passengers.filter(p =>
            !p.onBoard && !p.delivered && p.currentStation === currentStationIndex
        );

        // Boarding happens over time, but we'll simulate a portion boarding immediately
        const boardingCount = Math.min(passengersWaiting.length, 30);
        for (let i = 0; i < boardingCount; i++) {
            passengersWaiting[i].onBoard = true;
            passengersWaiting[i].boardingTime = Date.now();
            this.trainState.passengersOnBoard++;
        }

        this.updateHUD();
    }

    // Physics Update
    update(deltaTime) {
        if (this.state !== 'PLAYING') return;

        // Update game time
        this.updateGameTime(deltaTime);

        // Handle cruise control
        if (this.trainState.cruiseControl) {
            const speedDiff = this.trainState.cruiseSpeed - this.trainState.speed;
            if (Math.abs(speedDiff) > 2) {
                this.trainState.acceleration = speedDiff > 0 ? this.trainState.accelerationRate * 0.5 : -this.trainState.brakingRate * 0.5;
            } else {
                this.trainState.acceleration = 0;
            }
        } else {
            // Handle acceleration/braking
            if (this.keys['arrowup'] && !this.trainState.doorsOpen) {
                this.trainState.acceleration = this.trainState.accelerationRate;
                this.playTrainSound('acceleration');
            } else if (this.keys['arrowdown']) {
                this.trainState.acceleration = -this.trainState.brakingRate;
                this.playTrainSound('stopping');
            } else {
                this.trainState.acceleration = -0.5; // Natural deceleration (slightly increased)
                if (this.trainState.speed > 5) {
                    this.playTrainSound('keeping_speed');
                }
            }
        }

        // Update speed
        this.trainState.speed += this.trainState.acceleration * (deltaTime / 1000);
        this.trainState.speed = Math.max(0, Math.min(this.trainState.speed, this.trainState.maxSpeed));

        // Update position
        this.trainState.position += (this.trainState.speed * 1000 / 3600) * (deltaTime / 1000); // Convert km/h to m/s

        // Update animation offset for scrolling background
        this.animationOffset += this.trainState.speed * (deltaTime / 1000) * 2; // Speed up animation

        // Update clouds
        this.cloudPositions.forEach(cloud => {
            cloud.x -= cloud.speed * (deltaTime / 1000) * 50;
            if (cloud.x < -100) {
                cloud.x = this.canvas.width + 100;
            }
        });

        // Check for station arrival
        this.checkStationArrival();

        // Check for route completion
        this.checkRouteCompletion();

        // Update HUD
        this.updateHUD();
    }

    updateGameTime(deltaTime) {
        const gameSeconds = (deltaTime / 1000) * this.realTimeMultiplier;
        this.gameTime.minutes += gameSeconds / 60;

        while (this.gameTime.minutes >= 60) {
            this.gameTime.hours++;
            this.gameTime.minutes -= 60;
        }

        if (this.gameTime.hours >= 24) {
            this.gameTime.hours -= 24;
        }
    }

    checkStationArrival() {
        const route = this.routes[this.player.currentRoute];
        const nextStationIndex = this.trainState.currentStationIndex;

        if (nextStationIndex >= route.stations.length) return;

        const nextStation = route.stations[nextStationIndex];
        const distanceToStation = nextStation.distance - this.trainState.position;

        // Check if we're at the station (within 50 meters)
        if (Math.abs(distanceToStation) < 50 && this.trainState.speed < 5) {
            if (!this.trainState.stoppedAtStation) {
                this.trainState.stoppedAtStation = true;
                this.arriveAtStation();
            }
        } else {
            this.trainState.stoppedAtStation = false;
        }

        // Check if we passed the station without stopping
        if (distanceToStation < -100 && !this.trainState.stoppedAtStation) {
            this.player.exp -= 50; // Penalty for skipping station
            this.trainState.currentStationIndex++;
        }
    }

    arriveAtStation() {
        const route = this.routes[this.player.currentRoute];
        const station = route.stations[this.trainState.currentStationIndex];

        // Check if on time
        const scheduledMinutes = station.arrivalTime.hours * 60 + station.arrivalTime.minutes;
        const currentMinutes = this.gameTime.hours * 60 + this.gameTime.minutes;
        const timeDifference = currentMinutes - scheduledMinutes;

        if (Math.abs(timeDifference) > 2) {
            this.player.exp -= Math.abs(timeDifference); // Penalty for being late/early
        }

        // Check door safety (simplified - check if fully on platform)
        const platformLength = 300; // meters
        const trainLength = this.trains[this.player.currentTrain].railcars * 25;

        // Simplified check - in real implementation would check each door
        if (Math.abs(this.trainState.position - station.distance) > platformLength / 2) {
            this.player.exp -= 10; // Some doors not safe
        }

        this.playStationAmbient(station.nameEn);
    }

    checkRouteCompletion() {
        const route = this.routes[this.player.currentRoute];
        const lastStation = route.stations[route.stations.length - 1];

        if (this.trainState.position >= lastStation.distance && this.trainState.speed < 5) {
            // Route completed
            const scheduledMinutes = lastStation.arrivalTime.hours * 60 + lastStation.arrivalTime.minutes;
            const currentMinutes = this.gameTime.hours * 60 + this.gameTime.minutes;
            const timeDifference = currentMinutes - scheduledMinutes;

            let routeBonus = 100 - Math.abs(timeDifference);
            this.player.exp += Math.max(0, routeBonus);

            // End of day - return to depot
            setTimeout(() => {
                this.endDay();
            }, 3000);
        }
    }

    endDay() {
        alert(`Day completed! You earned ${this.passengersDelivered} EXP from passengers. Total EXP: ${this.player.exp}`);
        this.saveGame(1); // Auto-save
        this.showDepot();
    }

    // Rendering
    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        if (this.state === 'PLAYING') {
            this.renderGame();
        } else if (this.state === 'DEPOT' || this.state === 'TRAIN_SELECTION' || this.state === 'ROUTE_SELECTION') {
            this.renderDepot();
        } else {
            this.renderMainMenu();
        }
    }

    renderMainMenu() {
        // Sky gradient
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#87CEEB');
        gradient.addColorStop(0.5, '#E0F6FF');
        gradient.addColorStop(1, '#90EE90');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw decorative train silhouette
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        this.drawSimpleTrain(this.canvas.width / 2 - 200, this.canvas.height - 150, 0.5);
    }

    renderDepot() {
        // Depot background
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#4a5568');
        gradient.addColorStop(1, '#2d3748');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw depot building
        this.ctx.fillStyle = '#1a202c';
        this.ctx.fillRect(0, this.canvas.height - 200, this.canvas.width, 200);

        // Draw tracks
        for (let i = 0; i < 3; i++) {
            const y = this.canvas.height - 50 - i * 60;
            this.ctx.fillStyle = '#8b7355';
            this.ctx.fillRect(0, y, this.canvas.width, 4);
            this.ctx.fillRect(0, y + 10, this.canvas.width, 4);
        }
    }

    renderGame() {
        const route = this.routes[this.player.currentRoute];

        // Sky - realistic gradient
        const skyGradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height * 0.6);
        skyGradient.addColorStop(0, '#1e3a8a');  // Deep blue at top
        skyGradient.addColorStop(0.3, '#3b82f6'); // Bright blue
        skyGradient.addColorStop(0.7, '#93c5fd'); // Light blue
        skyGradient.addColorStop(1, '#dbeafe');   // Very light blue at horizon
        this.ctx.fillStyle = skyGradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height * 0.6);

        // Draw clouds
        this.drawClouds();

        // Ground - with gradient
        const groundGradient = this.ctx.createLinearGradient(0, this.canvas.height * 0.6, 0, this.canvas.height);
        groundGradient.addColorStop(0, '#86efac'); // Light green
        groundGradient.addColorStop(0.5, '#22c55e'); // Green
        groundGradient.addColorStop(1, '#16a34a');   // Darker green
        this.ctx.fillStyle = groundGradient;
        this.ctx.fillRect(0, this.canvas.height * 0.6, this.canvas.width, this.canvas.height * 0.4);

        // Draw track with animation
        const trackY = this.canvas.height * 0.7;
        this.ctx.fillStyle = '#8b7355';
        this.ctx.fillRect(0, trackY, this.canvas.width, 3);
        this.ctx.fillRect(0, trackY + 8, this.canvas.width, 3);

        // Draw ties with scrolling animation
        const tieOffset = this.animationOffset % 30;
        for (let x = -tieOffset; x < this.canvas.width + 30; x += 30) {
            this.ctx.fillStyle = '#654321';
            this.ctx.fillRect(x, trackY - 5, 20, 20);
        }

        // Draw upcoming station
        const nextStation = route.stations[this.trainState.currentStationIndex];
        if (nextStation) {
            const stationDistance = nextStation.distance - this.trainState.position;
            if (stationDistance > -200 && stationDistance < 1000) {
                const stationX = this.canvas.width / 2 + stationDistance / 2;
                this.drawStation(stationX, trackY, nextStation);
            }
        }

        // Draw train (always centered on screen)
        const trainX = this.canvas.width / 2 - 200;
        const trainY = trackY - 80;
        this.drawTrain(trainX, trainY);

        // Draw speed signs
        this.drawSpeedSigns();
    }

    drawStation(x, trackY, station) {
        // Platform
        this.ctx.fillStyle = '#808080';
        this.ctx.fillRect(x - 150, trackY + 15, 300, 20);

        // Station building (simplified)
        this.ctx.fillStyle = '#d4d4d4';
        this.ctx.fillRect(x - 100, trackY - 100, 200, 100);

        // Roof
        this.ctx.fillStyle = '#8b0000';
        this.ctx.beginPath();
        this.ctx.moveTo(x - 120, trackY - 100);
        this.ctx.lineTo(x, trackY - 130);
        this.ctx.lineTo(x + 120, trackY - 100);
        this.ctx.closePath();
        this.ctx.fill();

        // Station name
        this.ctx.fillStyle = '#000';
        this.ctx.font = 'bold 16px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(station.name, x, trackY - 110);

        // Draw waiting passengers
        if (this.trainState.doorsOpen && Math.abs(this.trainState.position - station.distance) < 50) {
            this.drawPassengers(x - 100, trackY + 35, station);
        }
    }

    drawPassengers(x, y, station) {
        const stationIndex = this.trainState.currentStationIndex;
        const waitingPassengers = this.passengers.filter(p =>
            !p.onBoard && !p.delivered && p.currentStation === stationIndex
        );

        const displayCount = Math.min(waitingPassengers.length, 15);
        for (let i = 0; i < displayCount; i++) {
            const passenger = waitingPassengers[i];
            const px = x + (i % 5) * 30;
            const py = y - Math.floor(i / 5) * 40;

            // Simple passenger rectangle with swing animation
            const swing = Math.sin(Date.now() / 500 + passenger.swingOffset) * 2;

            // Body
            this.ctx.fillStyle = `hsl(${Math.random() * 360}, 50%, 50%)`;
            this.ctx.fillRect(px + swing, py - 30, 15, 30);

            // Head
            this.ctx.fillStyle = '#ffdbac';
            this.ctx.beginPath();
            this.ctx.arc(px + 7 + swing, py - 35, 7, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }

    drawClouds() {
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        this.cloudPositions.forEach(cloud => {
            // Draw fluffy cloud shape
            this.ctx.beginPath();
            this.ctx.arc(cloud.x, cloud.y, cloud.size * 0.5, 0, Math.PI * 2);
            this.ctx.arc(cloud.x + cloud.size * 0.4, cloud.y, cloud.size * 0.4, 0, Math.PI * 2);
            this.ctx.arc(cloud.x - cloud.size * 0.4, cloud.y, cloud.size * 0.4, 0, Math.PI * 2);
            this.ctx.arc(cloud.x, cloud.y - cloud.size * 0.3, cloud.size * 0.3, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }

    drawTrain(x, y) {
        const train = this.trains[this.player.currentTrain];
        const railcarWidth = 150;  // Increased from 80 to 150
        const railcarHeight = 90;  // Increased proportionally
        const gap = 8;

        for (let i = 0; i < train.railcars; i++) {
            const rx = x + i * (railcarWidth + gap);

            // Try to load image, otherwise draw rectangle
            const railcarType = (i === 0) ? '1' :
                               (i === train.railcars - 1) ? '4' :
                               (i % 2 === 0) ? '2' : '3';

            // Draw railcar body with more detail
            this.ctx.fillStyle = '#CC0000';
            this.ctx.fillRect(rx, y, railcarWidth, railcarHeight);

            // Add roof
            this.ctx.fillStyle = '#990000';
            this.ctx.fillRect(rx, y, railcarWidth, 10);

            // Windows - more windows for wider car
            this.ctx.fillStyle = this.trainState.lightsOn ? '#FFFF99' : '#4A90E2';
            for (let w = 0; w < 7; w++) {
                this.ctx.fillRect(rx + 12 + w * 20, y + 18, 14, 25);
            }

            // Doors - positioned better
            const doorColor = this.trainState.doorsOpen ? '#1a1a1a' : '#666';
            this.ctx.fillStyle = doorColor;
            this.ctx.fillRect(rx + 8, y + 48, 18, 42);
            this.ctx.fillRect(rx + railcarWidth - 26, y + 48, 18, 42);

            // Door details
            if (!this.trainState.doorsOpen) {
                this.ctx.fillStyle = '#888';
                this.ctx.fillRect(rx + 10, y + 50, 14, 38);
                this.ctx.fillRect(rx + railcarWidth - 24, y + 50, 14, 38);
            }

            // Wheels - larger and more detailed
            this.ctx.fillStyle = '#1a1a1a';
            this.ctx.beginPath();
            this.ctx.arc(rx + 30, y + railcarHeight + 8, 12, 0, Math.PI * 2);
            this.ctx.arc(rx + railcarWidth - 30, y + railcarHeight + 8, 12, 0, Math.PI * 2);
            this.ctx.fill();

            // Wheel details
            this.ctx.strokeStyle = '#666';
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.arc(rx + 30, y + railcarHeight + 8, 12, 0, Math.PI * 2);
            this.ctx.arc(rx + railcarWidth - 30, y + railcarHeight + 8, 12, 0, Math.PI * 2);
            this.ctx.stroke();

            // Undercarriage
            this.ctx.fillStyle = '#333';
            this.ctx.fillRect(rx + 20, y + railcarHeight, railcarWidth - 40, 6);
        }
    }

    drawSimpleTrain(x, y, scale = 1) {
        const railcarWidth = 80 * scale;
        const railcarHeight = 70 * scale;

        for (let i = 0; i < 4; i++) {
            this.ctx.fillRect(x + i * (railcarWidth + 5), y, railcarWidth, railcarHeight);
        }
    }

    drawSpeedSigns() {
        // Draw speed limit signs in the distance
        const route = this.routes[this.player.currentRoute];
        const nextStation = route.stations[this.trainState.currentStationIndex];

        if (nextStation) {
            const distance = nextStation.distance - this.trainState.position;
            if (distance > 200 && distance < 800) {
                const signX = this.canvas.width / 2 + distance / 3;
                const signY = this.canvas.height * 0.6;

                this.ctx.fillStyle = '#fff';
                this.ctx.beginPath();
                this.ctx.arc(signX, signY, 20, 0, Math.PI * 2);
                this.ctx.fill();

                this.ctx.strokeStyle = '#f00';
                this.ctx.lineWidth = 3;
                this.ctx.stroke();

                this.ctx.fillStyle = '#000';
                this.ctx.font = 'bold 16px Arial';
                this.ctx.textAlign = 'center';
                this.ctx.fillText('40', signX, signY + 5);
            }
        }
    }

    // HUD Updates
    updateHUD() {
        document.getElementById('speed').textContent = `${Math.round(this.trainState.speed)} km/h`;
        document.getElementById('exp').textContent = this.player.exp;
        document.getElementById('currentTime').textContent =
            `${String(Math.floor(this.gameTime.hours)).padStart(2, '0')}:${String(Math.floor(this.gameTime.minutes)).padStart(2, '0')}`;

        document.getElementById('doorsStatus').textContent =
            `Doors: ${this.trainState.doorsOpen ? 'OPEN' : 'CLOSED'}`;
        document.getElementById('lightsStatus').textContent =
            `Lights: ${this.trainState.lightsOn ? 'ON' : 'OFF'}`;
        document.getElementById('cruiseStatus').textContent =
            `Cruise: ${this.trainState.cruiseControl ? 'ON (' + Math.round(this.trainState.cruiseSpeed) + ' km/h)' : 'OFF'}`;
        document.getElementById('passengersCount').textContent =
            `Passengers: ${this.trainState.passengersOnBoard}`;

        this.updateStationsList();
    }

    updateStationsList() {
        const route = this.routes[this.player.currentRoute];
        const stationsList = document.getElementById('stationsList');
        stationsList.innerHTML = '';

        const currentIndex = this.trainState.currentStationIndex;
        const lastStation = route.stations[route.stations.length - 1];

        // Show current, next 2, and last station
        const stationsToShow = [
            currentIndex < route.stations.length ? route.stations[currentIndex] : null,
            currentIndex + 1 < route.stations.length ? route.stations[currentIndex + 1] : null,
            currentIndex + 2 < route.stations.length ? route.stations[currentIndex + 2] : null,
            lastStation
        ].filter((s, i, arr) => s && arr.indexOf(s) === i); // Remove duplicates

        stationsToShow.forEach((station, index) => {
            const div = document.createElement('div');
            div.className = 'station-item';
            if (index === 0) div.classList.add('current');
            if (index === 1) div.classList.add('next');

            const distance = Math.round((station.distance - this.trainState.position) / 1000 * 10) / 10;
            div.innerHTML = `
                <span>${station.name}</span>
                <span>${distance > 0 ? distance + ' km' : 'Arrived'} - ${String(station.arrivalTime.hours).padStart(2, '0')}:${String(station.arrivalTime.minutes).padStart(2, '0')}</span>
            `;
            stationsList.appendChild(div);
        });
    }

    // Audio System
    playSound(soundName) {
        const trainName = this.player.currentTrain;
        const soundPath = `sounds/trains/${trainName}/${soundName}.mp3`;

        // In a real implementation, we'd load and play the audio
        // For now, we'll just log it
        console.log(`Playing sound: ${soundPath}`);

        // Example implementation:
        // const audio = new Audio(soundPath);
        // audio.volume = this.sounds.master * this.sounds.sfx;
        // audio.play().catch(e => console.log('Sound not found:', soundPath));
    }

    playTrainSound(soundName) {
        // Prevent rapid sound switching
        if (this.currentTrainSound === soundName) return;

        this.currentTrainSound = soundName;
        this.playSound(soundName);
    }

    playStationAmbient(stationName) {
        const soundPath = `sounds/stations/${stationName}/ambient.mp3`;
        console.log(`Playing ambient: ${soundPath}`);
    }

    // Game Loop
    gameLoop() {
        const currentTime = Date.now();
        const deltaTime = currentTime - this.lastFrameTime;
        this.lastFrameTime = currentTime;

        this.update(deltaTime);
        this.render();

        requestAnimationFrame(() => this.gameLoop());
    }
}

// Initialize game when page loads
window.addEventListener('load', () => {
    new MoscowRailwaysGame();
});
