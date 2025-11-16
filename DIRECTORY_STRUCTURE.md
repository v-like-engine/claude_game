# Directory Structure for Assets

This document shows the complete directory structure for adding pictures and sounds to the game.

## Complete Project Structure

```
claude_game/
├── index.html
├── game.js
├── styles.css
├── README.md
├── BEGINNERS_GUIDE.md
├── CUSTOMIZATION.md
├── ASSETS_GUIDE.md
├── DIRECTORY_STRUCTURE.md
│
├── pictures/
│   ├── trains/
│   │   ├── er22/                    # ЭР22 (Legendary Soviet train)
│   │   │   ├── 1.png                # Head/front railcar
│   │   │   ├── 2.png                # Motor passenger railcar
│   │   │   ├── 3.png                # Trail passenger railcar
│   │   │   ├── 4.png                # Rear head railcar (optional, will mirror 1.png)
│   │   │   ├── door_left.png        # Left door overlay (optional)
│   │   │   └── door_right.png       # Right door overlay (optional)
│   │   │
│   │   ├── ed4m/                    # ЭД4М (Classic electric)
│   │   │   ├── 1.png
│   │   │   ├── 2.png
│   │   │   ├── 3.png
│   │   │   ├── 4.png
│   │   │   ├── door_left.png
│   │   │   └── door_right.png
│   │   │
│   │   ├── em4/                     # ЭМ4 (Modern electric)
│   │   │   ├── 1.png
│   │   │   ├── 2.png
│   │   │   ├── 3.png
│   │   │   ├── 4.png
│   │   │   ├── door_left.png
│   │   │   └── door_right.png
│   │   │
│   │   ├── ep2d/                    # ЭП2Д (Double-decker)
│   │   │   ├── 1.png
│   │   │   ├── 2.png
│   │   │   ├── 3.png
│   │   │   ├── 4.png
│   │   │   ├── door_left.png
│   │   │   └── door_right.png
│   │   │
│   │   ├── esh2/                    # ЭШ2 (Wide-body)
│   │   │   ├── 1.png
│   │   │   ├── 2.png
│   │   │   ├── 3.png
│   │   │   ├── 4.png
│   │   │   ├── door_left.png
│   │   │   └── door_right.png
│   │   │
│   │   └── es2g/                    # ЭС2Г "Ласточка" (High-speed)
│   │       ├── 1.png
│   │       ├── 2.png
│   │       ├── 3.png
│   │       ├── 4.png
│   │       ├── door_left.png
│   │       └── door_right.png
│   │
│   ├── stations/
│   │   ├── default.png              # Fallback station image
│   │   ├── odintsovo.png            # МЦД-1 Stations (27 total)
│   │   ├── bakovka.png
│   │   ├── skolkovo.png
│   │   ├── nemchinovka.png
│   │   ├── setun.png
│   │   ├── kuntsevskaya.png
│   │   ├── rabochiy_poselok.png
│   │   ├── fili.png
│   │   ├── testovskaya.png
│   │   ├── begovaya.png
│   │   ├── belorusskaya.png
│   │   ├── savelovskaya.png
│   │   ├── petrovsko_razumovskaya.png
│   │   ├── okruzhnaya.png
│   │   ├── mark.png
│   │   ├── likhobory.png
│   │   ├── grazhdanskaya.png
│   │   ├── degunino.png
│   │   ├── beskudnikovo.png
│   │   ├── lianozovo.png
│   │   ├── marfino.png
│   │   ├── dolgoprudnaya.png
│   │   ├── vodniki.png
│   │   ├── khlebnikovo.png
│   │   ├── sheremetyevskaya.png
│   │   ├── katuar.png
│   │   ├── lobnya.png
│   │   │
│   │   ├── nakhabino.png            # МЦД-2 Stations
│   │   ├── pavshino.png
│   │   ├── trikotazhnaya.png
│   │   ├── tushino.png
│   │   ├── shchukinskaya.png
│   │   └── volokolamskaya.png
│   │
│   └── passengers/
│       ├── 1.png                    # Passenger sprites (as many as you want)
│       ├── 2.png                    # Game picks randomly
│       ├── 3.png
│       ├── 4.png
│       ├── 5.png
│       └── ...
│
└── sounds/
    ├── trains/
    │   ├── er22/                    # ЭР22 sounds
    │   │   ├── acceleration.mp3
    │   │   ├── stopping.mp3
    │   │   ├── keeping_speed.mp3
    │   │   ├── door_opening.mp3
    │   │   ├── door_closing.mp3
    │   │   ├── door_closing_warning.mp3
    │   │   ├── horn.mp3
    │   │   └── emergency_brake.mp3
    │   │
    │   ├── ed4m/                    # Same structure for all trains
    │   │   ├── acceleration.mp3
    │   │   ├── stopping.mp3
    │   │   ├── keeping_speed.mp3
    │   │   ├── door_opening.mp3
    │   │   ├── door_closing.mp3
    │   │   ├── door_closing_warning.mp3
    │   │   ├── horn.mp3
    │   │   └── emergency_brake.mp3
    │   │
    │   ├── em4/                     # (repeat for em4)
    │   ├── ep2d/                    # (repeat for ep2d)
    │   ├── esh2/                    # (repeat for esh2)
    │   └── es2g/                    # (repeat for es2g)
    │
    ├── stations/
    │   ├── ambient.mp3              # Default station ambient
    │   ├── odintsovo/
    │   │   └── ambient.mp3          # Station-specific (optional)
    │   ├── bakovka/
    │   │   └── ambient.mp3
    │   └── ...                      # Other stations (optional)
    │
    ├── depot/
    │   └── ambient.mp3              # Depot background sound
    │
    └── background/
        ├── music.mp3                # Background music
        └── calm.mp3                 # Alternative background
```

## File Requirements

### Train Images (PNG format)

**Dimensions**: Recommended 200-400px wide, 150-300px tall
**View**: Side view, facing RIGHT
**Format**: PNG with transparency
**Style**: Mix of cartoon and realistic

**Railcar Types**:
- `1.png` - Head/front railcar (with driver cabin, windows, front design)
- `2.png` - Motor passenger railcar (has motors underneath, passenger windows)
- `3.png` - Trail passenger railcar (no motors, passenger windows)
- `4.png` - Rear head railcar (back of train, optional - will mirror 1.png if missing)

**Optional**:
- `door_left.png` - Left door overlay when open
- `door_right.png` - Right door overlay when open

### Station Images (PNG format)

**Dimensions**: Recommended 400-800px wide, 200-400px tall
**View**: Side view with platform visible
**Format**: PNG with transparency
**Content**: Platform, station building, signage, distinctive features

**Naming**: Use English transliteration
- Russian: Одинцово → English: `odintsovo.png`
- Russian: Белорусская → English: `belorusskaya.png`

### Passenger Images (PNG format)

**Dimensions**: Recommended 30-60px tall, 20-40px wide
**View**: Side profile or slight angle
**Format**: PNG with transparency
**Variety**: Create multiple (1.png, 2.png, etc.) for diversity

**Tips**:
- Different genders, ages, clothing colors
- Some with bags, phones, briefcases
- Animation-friendly poses (walking stance)

### Sound Files (MP3 format)

**Bitrate**: 128-320 kbps recommended
**Duration**:
- Sound effects: 1-5 seconds
- Ambients: 30-60 seconds (loopable)
- Music: 1-3 minutes (loopable)

**Required Sounds per Train**:
1. `acceleration.mp3` - Engine accelerating (loopable)
2. `stopping.mp3` - Braking/stopping sound (loopable)
3. `keeping_speed.mp3` - Cruising sound (loopable)
4. `door_opening.mp3` - Door opening sound effect (1-2 sec)
5. `door_closing.mp3` - Door closing sound effect (1-2 sec)
6. `door_closing_warning.mp3` - "Осторожно, двери закрываются!" (voice)
7. `horn.mp3` - Train horn/signal (1-3 sec)
8. `emergency_brake.mp3` - Emergency brake sound (1-2 sec)

## How Assets Are Used

### Priority System

**If custom asset exists**: Game uses your custom image/sound
**If custom asset missing**: Game uses default (colored rectangles for graphics)

**Example**:
1. Game tries to load `pictures/trains/er22/1.png`
2. If found → Uses your custom image
3. If not found → Uses default red rectangle

### Asset Loading

**Automatic**: Just place files in correct folders, no code changes needed!

**File paths from game root**:
```javascript
// Train image
pictures/trains/er22/1.png

// Train sound
sounds/trains/er22/acceleration.mp3

// Station image
pictures/stations/odintsovo.png

// Station sound
sounds/stations/odintsovo/ambient.mp3
```

## Quick Start Checklist

### Minimum Assets for Playable Experience

**For ONE train (e.g., er22)**:
- [ ] `pictures/trains/er22/1.png`
- [ ] `pictures/trains/er22/2.png`
- [ ] `pictures/trains/er22/3.png`
- [ ] `sounds/trains/er22/acceleration.mp3`
- [ ] `sounds/trains/er22/door_opening.mp3`
- [ ] `sounds/trains/er22/door_closing.mp3`

**Global**:
- [ ] `pictures/stations/default.png`
- [ ] `sounds/depot/ambient.mp3`

### Full Experience

**All 6 trains** with images and sounds:
- [ ] er22 (6 images + 8 sounds)
- [ ] ed4m (6 images + 8 sounds)
- [ ] em4 (6 images + 8 sounds)
- [ ] ep2d (6 images + 8 sounds)
- [ ] esh2 (6 images + 8 sounds)
- [ ] es2g (6 images + 8 sounds)

**27 МЦД-1 station images**
**6 МЦД-2 station images**
**10+ passenger sprites**

## Creating Assets

### Where to Find Assets

**Train Photos**: Search for "ЭР22 side view", "ЭД4М electric train"
**Edit Tools**:
- GIMP (free) - Remove background, resize
- Photopea (online) - Browser-based editing
- Paint.NET (Windows) - Simple editing

**Sounds**: See `sounds/SOUND_SOURCES.txt` for download links

### Creating Pixel Art

If you prefer simple graphics:
1. Use pixel art style (retro look)
2. 64x64 or 128x128 sprites
3. Tools: Aseprite, Piskel (online)
4. Easier than realistic photos

## Testing Your Assets

1. Add asset to correct folder
2. Refresh browser (F5)
3. Start game
4. Check if asset appears
5. Check browser console (F12) for errors

## Common Issues

**Image not showing**:
- Check filename spelling (case-sensitive)
- Ensure PNG format
- Verify path is correct

**Sound not playing**:
- Check filename spelling
- Ensure MP3 format
- Check browser console for errors

**Game still uses default**:
- Refresh browser (hard refresh: Ctrl+F5)
- Check file is in correct folder
- Verify filename matches expected name

## Next Steps

1. **Read**: `sounds/SOUND_SOURCES.txt` for download links
2. **Download**: Priority sounds (doors, horn, acceleration)
3. **Add**: Sounds to train folders
4. **Test**: Play game and listen!
5. **Gradually add**: More assets over time

---

**Remember**: The game works perfectly without any custom assets! Add them gradually to enhance your experience.
