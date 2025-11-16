# Assets Guide for Moscow Railways Train Simulator

This guide explains how to add custom images and sounds to the game. The game is designed to work with default colored shapes, but becomes much more immersive with custom assets.

## Quick Start

1. The game works immediately without any assets - it uses colored rectangles
2. Assets are automatically detected when placed in the correct folders
3. No code changes needed - just drop files in the right place!

## Asset Directories

```
claude_game/
├── pictures/
│   ├── trains/
│   ├── stations/
│   └── passengers/
└── sounds/
    ├── trains/
    ├── stations/
    └── depot/
```

## Train Assets

### Train Images

**Location**: `pictures/trains/<train_name_en>/`

**Train IDs** (use these folder names):
- `ed4m` - ЭД4М
- `em4` - ЭМ4
- `es2g` - ЭС2Г "Ласточка"

**Required Files**:
- `1.png` - Head/front railcar (with driver cabin)
- `2.png` - Motor passenger railcar
- `3.png` - Trail passenger railcar

**Optional Files**:
- `4.png` - Rear head railcar (if missing, 1.png is mirrored)
- `door_left.png` - Left door overlay
- `door_right.png` - Right door overlay

**Specifications**:
- Format: PNG with transparency
- Recommended size: 200-400px wide, 150-300px tall
- View: Side view, facing RIGHT
- Style: Mix of cartoon and realistic

**Example folder structure**:
```
pictures/trains/ed4m/
├── 1.png
├── 2.png
├── 3.png
└── 4.png
```

### Train Sounds

**Location**: `sounds/trains/<train_name_en>/`

**Required Files**:
- `acceleration.mp3` - Engine accelerating (loopable)
- `stopping.mp3` - Braking sound (loopable)
- `keeping_speed.mp3` - Cruising sound (loopable)
- `door_opening.mp3` - Door opening sound effect
- `door_closing.mp3` - Door closing sound effect
- `door_closing_warning.mp3` - "Осторожно, двери закрываются!" announcement

**Specifications**:
- Format: MP3
- Bitrate: 128-320 kbps
- Loop sounds: Should loop seamlessly
- Sound effects: 1-3 seconds
- Warning: Full voice announcement

## Station Assets

### Station Images

**Location**: `pictures/stations/`

**Naming**: Use English transliteration of Russian station names
- Example: Одинцово → `odintsovo.png`
- Example: Баковка → `bakovka.png`

**Special Files**:
- `default.png` - Fallback for stations without custom images

**МЦД-1 Stations** (recommended to create):
- `odintsovo.png`
- `bakovka.png`
- `skolkovo.png`
- `nemchinovka.png`
- `setun.png`
- `kuntsevskaya.png`
- `fili.png`
- `begovaya.png`
- `savelovskaya.png`
- `belorusskaya.png`
- `testovskaya.png`
- `lobnya.png`

**МЦД-2 Stations**:
- `nakhabino.png`
- `pavshino.png`
- `trikotazhnaya.png`
- `tushino.png`
- `shchukinskaya.png`
- `volokolamskaya.png`

**Specifications**:
- Format: PNG with transparency
- Recommended size: 400-800px wide, 200-400px tall
- View: Side view with platform visible
- Include: Platform, station building, signage

### Station Sounds

**Location**: `sounds/stations/<station_name_en>/`

**Required Files**:
- `ambient.mp3` - Station ambient sound (crowd, announcements, etc.)

**Specifications**:
- Format: MP3
- Duration: 30-60 seconds (loopable)
- Should loop seamlessly
- Mix of: crowd noise, train sounds, announcements

## Passenger Assets

### Passenger Images

**Location**: `pictures/passengers/`

**Naming**: Numbered files
- `1.png`, `2.png`, `3.png`, etc.
- Create as many as you want for variety!

**Specifications**:
- Format: PNG with transparency
- Recommended size: 30-60px tall, 20-40px wide
- View: Side profile or slight angle
- Style: Should match train art style
- Variety: Different genders, ages, clothing

**Tips**:
- Create at least 5-10 different passenger sprites
- The game randomly selects from available sprites
- More variety = more realistic crowd

## Depot Assets

### Depot Sounds

**Location**: `sounds/depot/`

**Required Files**:
- `ambient.mp3` - Depot background sound

**Specifications**:
- Format: MP3
- Duration: 30-60 seconds (loopable)
- Ambience: Mechanical sounds, distant trains, echoes

## Testing Your Assets

1. Place your asset in the correct folder
2. Refresh the browser (F5)
3. Start a new game or load a save
4. Check console (F12) for any loading errors

**Common Issues**:
- File not loading? Check the filename spelling and case
- Sound not playing? Check file format is MP3
- Image not appearing? Ensure PNG format with transparency

## Asset Creation Tips

### For Artists

**Train Sprites**:
1. Research real МЦД trains for reference
2. Create in vector (SVG/AI) then export to PNG
3. Maintain consistent scale across all railcars
4. Use bright, appealing colors

**Station Sprites**:
1. Each station should be recognizable
2. Include distinctive architectural features
3. Show platform edge clearly
4. Add details like benches, signs, clocks

**Passenger Sprites**:
1. Create a variety of body types
2. Different colors for clothing
3. Some with bags, phones, etc.
4. Animation-friendly (will swing/walk)

### For Sound Designers

**Train Sounds**:
1. Record real trains if possible
2. Layer multiple sounds for richness
3. Ensure smooth loops (fade in/out ends)
4. Different speeds should sound different

**Station Ambients**:
1. Mix multiple layers:
   - Crowd murmur
   - Distant announcements
   - Train pass-bys
   - Platform sounds
2. Vary by station type (busy vs quiet)

## Optional: Creating Your Own Trains

To add a completely new train not in the default list:

1. Edit `game.js`
2. Find `initializeTrainData()` method
3. Add your train configuration
4. Create asset folders with the same `nameEn` value
5. Add to `unlockedTrains` or set `requiredExp`

**Example**:
```javascript
'ep3d': {
    name: 'ЭП3Д',
    nameEn: 'ep3d',
    maxSpeed: 140,
    accelerationRate: 2.2,
    brakingRate: 3.0,
    capacity: 1600,
    requiredExp: 2000,
    description: 'Double-decker train',
    railcars: 14
}
```

Then create:
- `pictures/trains/ep3d/`
- `sounds/trains/ep3d/`

## Asset Licensing

When adding assets:
- Ensure you have rights to use all assets
- Credit original creators if required
- For commercial use, verify licenses
- Consider creating original content

## Need Help?

- Check browser console (F12) for errors
- Verify file paths are exactly correct
- Ensure file formats match requirements
- Test with one asset at a time

## Example Minimal Asset Set

To get started quickly, create:
1. One full train (ed4m): 4 images + 6 sounds
2. Default station: 1 image
3. 3-5 passenger sprites
4. Depot ambient sound

This will give you a basic but functional visual experience!

---

**Remember**: The game works perfectly with NO assets - they just enhance the experience!
