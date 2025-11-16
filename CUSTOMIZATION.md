# Game Customization Guide

This guide shows you how to modify and extend the Moscow Railways Train Simulator.

## Quick Reference

**Main Files**:
- `index.html` - Game structure and UI elements
- `game.js` - All game logic and data
- `styles.css` - Visual styling and themes

**No Database Needed**: Everything uses localStorage

## Adding New Trains

**Location**: `game.js` → `initializeTrainData()` method

```javascript
this.trains = {
    // ... existing trains ...
    
    'your_train_id': {
        name: 'ЭП3Д',                    // Display name (Cyrillic OK)
        nameEn: 'your_train_id',         // English ID for file paths
        maxSpeed: 140,                   // Maximum speed in km/h
        accelerationRate: 2.2,           // Higher = faster acceleration
        brakingRate: 3.0,                // Higher = faster braking
        capacity: 1600,                  // Passenger capacity (display only)
        requiredExp: 2000,               // EXP needed to unlock
        description: 'Modern express',   // Short description
        railcars: 14                     // Number of cars in the train
    }
};
```

**To make it available from start**:
Add `'your_train_id'` to the `unlockedTrains` array in the `newGame()` method.

## Adding New Routes

**Location**: `game.js` → `initializeRouteData()` method

```javascript
this.routes = {
    // ... existing routes ...
    
    'mcd3': {
        name: 'МЦД-3',
        nameEn: 'mcd3',
        requiredExp: 800,
        stations: [
            {
                name: 'Зеленоград',           // Display name
                nameEn: 'zelenograd',         // For asset loading
                distance: 0,                  // Meters from route start
                arrivalTime: { hours: 7, minutes: 0 }
            },
            {
                name: 'Крюково',
                nameEn: 'kryukovo',
                distance: 4200,               // 4.2 km from start
                arrivalTime: { hours: 7, minutes: 6 }
            },
            // ... more stations ...
        ]
    }
};
```

**Station Spacing Tips**:
- Average station spacing: 2-5 km
- Calculate realistic travel times
- Allow ~1 minute per 2-3 km at average speed

## Modifying Existing Routes

### Adding Stations to МЦД-1

Find the `'mcd1'` route and add to the `stations` array:

```javascript
stations: [
    // ... existing stations ...
    {
        name: 'Новая Станция',
        nameEn: 'novaya_stantsiya',
        distance: 45000,  // Must be between previous and next station
        arrivalTime: { hours: 7, minutes: 40 }
    },
    // ... continue ...
]
```

**Important**: Stations must be in order by `distance`!

## Adjusting Game Balance

### Experience Points

**Location**: Search for `this.player.exp` in `game.js`

```javascript
// Passenger delivery (currently +1 EXP)
this.player.exp += 1;

// Route completion (currently +100 EXP)
let routeBonus = 100 - Math.abs(timeDifference);

// Station skip penalty (currently -50 EXP)
this.player.exp -= 50;

// Late/early penalty (currently -1 per minute)
this.player.exp -= Math.abs(timeDifference);

// Unsafe door penalty (currently -10 EXP)
this.player.exp -= 10;
```

### Physics Values

**Location**: `game.js` → Train state initialization

```javascript
// Natural deceleration (friction)
this.trainState.acceleration = -0.3;  // Lower = slower slowdown

// Station detection range
if (Math.abs(distanceToStation) < 50 && this.trainState.speed < 5)

// Passed station threshold
if (distanceToStation < -100 && !this.trainState.stoppedAtStation)

// Time tolerance
if (Math.abs(timeDifference) > 2)  // Currently ±2 minutes
```

### Time Scale

**Location**: `game.js` → Game initialization

```javascript
this.realTimeMultiplier = 60;  // 1 real second = 60 game seconds
                               // Increase for faster gameplay
                               // Decrease for slower, more realistic
```

## Passenger Behavior

### Initial Passengers per Station

**Location**: `game.js` → `initializePassengers()` method

```javascript
const waitingCount = Math.floor(Math.random() * 50) + 30;  // 30-80 passengers
// Change to: Math.floor(Math.random() * 100) + 50 for 50-150 passengers
```

### Boarding Speed

**Location**: `game.js` → `handlePassengerExchange()` method

```javascript
const boardingCount = Math.min(passengersWaiting.length, 30);
// Currently 30 passengers board immediately
// Increase for faster boarding, decrease for more realism
```

## Visual Customization

### Canvas Size

**Location**: `game.js` → `resizeCanvas()` method

The canvas automatically fills the container, but you can set fixed dimensions:

```javascript
resizeCanvas() {
    this.canvas.width = 1920;  // Fixed width
    this.canvas.height = 1080; // Fixed height
}
```

### Train Rendering

**Location**: `game.js` → `drawTrain()` method

```javascript
const railcarWidth = 80;   // Width of each railcar
const railcarHeight = 70;  // Height of each railcar
const gap = 5;             // Gap between railcars

// Colors
this.ctx.fillStyle = '#CC0000';  // Train body color
```

### Sky and Ground Colors

**Location**: `game.js` → `renderGame()` method

```javascript
// Sky gradient
gradient.addColorStop(0, '#87CEEB');  // Top color
gradient.addColorStop(1, '#E0F6FF');  // Bottom color

// Ground
this.ctx.fillStyle = '#90EE90';  // Grass green
```

## UI Customization

### Menu Colors

**Location**: `styles.css`

```css
.menu {
    background: rgba(26, 26, 46, 0.95);  /* Menu background */
}

.menu-btn {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

### HUD Layout

**Location**: `styles.css` → `.hud-*` classes

Reposition HUD elements by changing `top`, `left`, `right`, `bottom` values.

## Sound System

### Volume Defaults

**Location**: `game.js` → Initialization

```javascript
this.sounds = {
    master: 0.7,  // 70% master volume
    sfx: 0.8,     // 80% sound effects
    music: 0.5    // 50% music
};
```

### Enabling Audio Playback

Currently, audio is logged to console. To enable real playback:

**Location**: `game.js` → `playSound()` method

Uncomment these lines:
```javascript
const audio = new Audio(soundPath);
audio.volume = this.sounds.master * this.sounds.sfx;
audio.play().catch(e => console.log('Sound not found:', soundPath));
```

## Save System

### Number of Save Slots

**Location**: `game.js` → `populateSaveSlots()` method

```javascript
for (let i = 1; i <= 6; i++) {  // Change 6 to desired number
```

Also update `index.html` description if changed.

### Auto-Save Behavior

**Location**: `game.js` → `endDay()` and `saveAndExit()` methods

```javascript
this.saveGame(1);  // Auto-saves to slot 1
// Change number to use different slot
```

## Adding New Gameplay Features

### Example: Fuel System

1. Add to player state:
```javascript
this.player = {
    // ... existing properties ...
    fuel: 100
};
```

2. Decrease during gameplay:
```javascript
update(deltaTime) {
    // ... existing code ...
    this.player.fuel -= (this.trainState.speed / 1000) * (deltaTime / 1000);
}
```

3. Add to HUD in `index.html` and update in `updateHUD()`

### Example: Weather System

1. Add weather state:
```javascript
this.weather = {
    type: 'clear',  // clear, rain, snow
    intensity: 0
};
```

2. Modify physics:
```javascript
if (this.weather.type === 'rain') {
    this.trainState.brakingRate *= 0.8;  // 20% worse braking
}
```

3. Render weather effects in `renderGame()`

## Testing Changes

1. Make your changes
2. Save the file
3. Refresh browser (F5 or Ctrl+R)
4. Check console (F12) for errors
5. Test the feature

**Tip**: Use `console.log()` to debug:
```javascript
console.log('Current speed:', this.trainState.speed);
```

## Performance Optimization

### Reduce Canvas Rendering

Lower the frame rate for better performance:

```javascript
gameLoop() {
    setTimeout(() => {
        this.update(deltaTime);
        this.render();
        requestAnimationFrame(() => this.gameLoop());
    }, 1000 / 30);  // 30 FPS instead of 60
}
```

### Reduce Passenger Count

Lower max passengers for better performance:

```javascript
const waitingCount = Math.floor(Math.random() * 20) + 10;  // 10-30 instead of 30-80
```

## Common Modifications

### Change Starting EXP

```javascript
newGame() {
    this.player = {
        exp: 1000,  // Start with 1000 EXP instead of 0
        // ...
    };
}
```

### Unlock All Content From Start

```javascript
newGame() {
    this.player = {
        exp: 10000,
        unlockedTrains: ['ed4m', 'em4', 'es2g'],  // All trains
        unlockedRoutes: ['mcd1', 'mcd2'],         // All routes
        // ...
    };
}
```

### Change Start Time

```javascript
this.gameTime = { hours: 8, minutes: 30 };  // Start at 8:30 AM
```

## Need More Help?

1. Check browser console for errors (F12)
2. Use `console.log()` to debug values
3. Test changes incrementally
4. Keep backups before major changes
5. Refer to existing code as examples

## Code Structure Overview

```
MoscowRailwaysGame class
├── constructor()           - Initialize everything
├── initializeTrainData()   - Train definitions
├── initializeRouteData()   - Route definitions
├── initializeMenus()       - UI event handlers
├── update(deltaTime)       - Physics & logic (called every frame)
├── render()                - Drawing (called every frame)
├── gameLoop()              - Main loop
└── Helper methods          - Various utilities
```

Happy customizing!
