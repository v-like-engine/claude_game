# Moscow Railways Train Simulator

A realistic train simulation game for Moscow Railways where you control electric trains on various routes, manage passengers, and follow timetables.

## Features

- **Multiple Trains**: Choose from different electric trains (ЭД4М, ЭМ4, ЭС2Г "Ласточка")
- **Multiple Routes**: Drive on МЦД-1, МЦД-2, and more (expandable)
- **Realistic Physics**: Acceleration, braking, speed management
- **Passenger Management**: Pick up and drop off passengers at stations
- **Timetable System**: Follow schedules and earn EXP for punctuality
- **Progression System**: Unlock new trains and routes with EXP
- **Save/Load System**: 6 save slots to manage your progress
- **Immersive Audio**: Train sounds, station ambients, and warnings
- **Full Keyboard Controls**: Complete control of your train

## How to Play

### Getting Started

1. Open `index.html` in a modern web browser
2. Click "New Game" to start fresh or "Load Game" to continue
3. Select your train in the depot
4. Choose your route
5. Start driving!

### Controls

- **↑ (Arrow Up)**: Accelerate
- **↓ (Arrow Down)**: Brake
- **D**: Open/Close Doors
- **W**: Play Warning Sound ("Be careful, doors closing!")
- **L**: Toggle Lights
- **TAB**: Show Full Timetable
- **ESC**: Pause Menu

### Gameplay Loop

1. **Start in Depot**: Each day begins at 6:00 AM in the depot
2. **Select Train & Route**: Choose your train and route based on your EXP
3. **Follow Timetable**: Drive to each station on time
4. **Manage Passengers**:
   - Stop at stations (slow down to < 5 km/h within 50m of station)
   - Open doors (press D)
   - Wait for passengers to board/exit
   - Close doors and continue
5. **Complete Route**: Reach the final station to complete the day
6. **Earn EXP**: Delivered passengers and punctuality earn EXP
7. **Unlock Content**: Use EXP to unlock new trains and routes

### Scoring System

#### Earn EXP:
- **+1 EXP**: Per passenger delivered to their destination
- **+100 EXP**: Base reward for completing route
- **Bonus**: Punctuality bonus (reduced by minutes late/early)

#### Lose EXP:
- **-50 EXP**: Skipping a station
- **-10 EXP**: Per door not safely positioned on platform
- **-1 EXP/minute**: Being late or early by more than 2 minutes

## Asset Structure

The game is designed to automatically use custom assets when available. Simply place your files in the correct directories.

### Directory Structure

```
pictures/
├── trains/
│   ├── ed4m/
│   │   ├── 1.png           # Head railcar
│   │   ├── 2.png           # Motor passenger railcar
│   │   ├── 3.png           # Trail passenger railcar
│   │   ├── 4.png           # Rear head railcar
│   │   ├── door_left.png
│   │   └── door_right.png
│   ├── em4/
│   └── es2g/
├── stations/
│   ├── odintsovo.png
│   ├── default.png
│   └── ...
└── passengers/
    ├── 1.png
    ├── 2.png
    └── ...

sounds/
├── trains/
│   ├── ed4m/
│   │   ├── acceleration.mp3
│   │   ├── stopping.mp3
│   │   ├── keeping_speed.mp3
│   │   ├── door_opening.mp3
│   │   ├── door_closing.mp3
│   │   └── door_closing_warning.mp3
├── stations/
│   └── ...
└── depot/
    └── ambient.mp3
```

## Customization

### Adding New Trains

Edit `game.js`, find `initializeTrainData()` and add:

```javascript
'train_id': {
    name: 'Display Name',
    nameEn: 'train_id',
    maxSpeed: 120,
    accelerationRate: 1.8,
    brakingRate: 2.5,
    capacity: 1500,
    requiredExp: 1000,
    description: 'Description',
    railcars: 10
}
```

### Adding New Routes

Edit `game.js`, find `initializeRouteData()` and add stations to existing routes or create new ones.

## Technical Details

- **Technology**: HTML5, CSS3, JavaScript (ES6)
- **Storage**: localStorage (6 save slots)
- **Rendering**: Canvas 2D API
- **No Backend**: Fully client-side

## Tips

1. Start braking early before stations
2. Watch the timetable (press TAB)
3. More passengers = more EXP
4. Stop accurately on platforms
5. Save your progress often

## License

Created for Moscow Railways.
