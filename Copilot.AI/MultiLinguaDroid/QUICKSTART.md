# Quick Start Guide - MultiLinguaDroid

## Prerequisites Checklist

- [ ] Android Studio installed (Hedgehog 2023.1.1+)
- [ ] JDK 17 configured
- [ ] Android SDK API 34 installed
- [ ] LibreTranslate running on port 5432

## Step 1: Start LibreTranslate

```bash
cd /Volumes/RayCue2TB/com.github/kjwenger/NaturalStupidity/MultiLingua/Copilot.AI/multi-lingua
docker-compose up -d

# Verify it's running
curl http://localhost:5432/languages
```

## Step 2: Open Project in Android Studio

1. Launch Android Studio
2. Select "Open" from welcome screen
3. Navigate to: `/Volumes/RayCue2TB/com.github/kjwenger/NaturalStupidity/MultiLingua/MultiLinguaDroid`
4. Click "Open"
5. Wait for Gradle sync to complete

## Step 3: Configure Emulator (if needed)

### Option A: Use Existing Emulator
1. Tools → Device Manager
2. Select any Android 8.0+ device
3. Click ▶️ to start

### Option B: Create New Emulator
1. Tools → Device Manager → Create Device
2. Select device: Pixel 6
3. Select system image: Android 14 (API 34)
4. Click Finish

## Step 4: Build the App

### Via Android Studio
1. Build → Make Project (⌘+F9 / Ctrl+F9)
2. Wait for build to complete

### Via Command Line
```bash
cd /Volumes/RayCue2TB/com.github/kjwenger/NaturalStupidity/MultiLingua/MultiLinguaDroid
./gradlew assembleDebug
```

## Step 5: Run the App

### Via Android Studio
1. Select your emulator/device from dropdown
2. Click Run ▶️ (⇧+F10 / Shift+F10)

### Via Command Line
```bash
./gradlew installDebug
```

## Troubleshooting

### Build Fails

```bash
# Clean and rebuild
./gradlew clean build

# In Android Studio:
# File → Invalidate Caches → Invalidate and Restart
```

### Cannot Connect to LibreTranslate

**Check if LibreTranslate is running**:
```bash
docker ps | grep libretranslate
curl http://localhost:5432/languages
```

**For physical device**, update `TranslationRepository.kt`:
```kotlin
.baseUrl("http://YOUR_LOCAL_IP:5432/")  // e.g., http://192.168.1.100:5432/
```

### Emulator Issues

**Localhost mapping**:
- Emulator uses `10.0.2.2` to access host's `localhost`
- App is already configured for this
- Physical devices need actual IP address

**Check connection**:
```bash
# From emulator terminal (adb shell):
adb shell
ping 10.0.2.2
```

## Expected Behavior

1. **First Launch**:
   - Empty list
   - Floating action button visible
   - Toolbar with app name

2. **Add Entry**:
   - Tap ➕ button
   - New card appears
   - English field is editable

3. **Translate**:
   - Enter English text
   - Tap "Translate" button
   - Wait for API response
   - See 5 translation options
   - Tap option to select

4. **Theme Toggle**:
   - Tap theme icon in toolbar
   - App switches between light/dark
   - Preference persists across restarts

## Quick Test Checklist

- [ ] App launches without crashes
- [ ] Can add new entry
- [ ] Can enter English text
- [ ] Translate button calls API
- [ ] Translation options appear
- [ ] Can select translation option
- [ ] Can delete entry
- [ ] Sort button works
- [ ] Theme toggle works
- [ ] Data persists after restart

## Default Configuration

- **LibreTranslate URL**: `http://10.0.2.2:5432/`
- **Storage**: SharedPreferences (`translations_db`)
- **Theme**: System default
- **Languages**: en → fr, it, es

## File Locations

- **Source**: `app/src/main/java/com/naturalstupidity/multilinguadroid/`
- **Resources**: `app/src/main/res/`
- **Build Output**: `app/build/outputs/apk/debug/`
- **Logs**: Android Studio → Logcat

## Useful Commands

```bash
# List connected devices
adb devices

# Install APK manually
adb install app/build/outputs/apk/debug/app-debug.apk

# View logs
adb logcat | grep MultiLingua

# Uninstall app
adb uninstall com.naturalstupidity.multilinguadroid

# Clear app data
adb shell pm clear com.naturalstupidity.multilinguadroid
```

## Performance Tips

1. **First API call may be slow**: LibreTranslate needs to load models
2. **Subsequent calls are faster**: Models are cached
3. **Network timeout**: 10 seconds default

## Next Steps

After successful launch:
1. Test all translation languages
2. Verify persistence (close/reopen app)
3. Test theme switching
4. Try sorting
5. Test delete functionality

## Support

- Check `README.md` for detailed documentation
- Review `PROJECT_SUMMARY.md` for architecture details
- Examine source code comments for implementation details

---

**Happy Coding!** 🎉
