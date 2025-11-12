# Mind Control Browser Extensions

Browser extensions that give you complete control over your YouTube experience,
allowing you to remove Shorts, non-subscribed channels, and other unwanted
content.

## Features

- **Remove Shorts**: Hide all YouTube Shorts content from your feed
- **Hide Non-Subscribed Channels**: Only show content from channels you're
subscribed to
- **Hide Recommended Videos**: Remove suggested videos from watch pages
- **Hide Comments**: Hide the comments section on videos

## Installation

The extension should work on **Chrome**, **Firefox**, and **Safari**.

## Usage

1. Enable the extension
2. Visit YouTube.com
3. Check if only subscribed channels are visible

## Development

### Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" using the toggle in the top right
3. Click "Load unpacked"
4. Navigate to and select the `src` folder
5. The extension will be loaded and active

### Firefox

1. Open Firefox and navigate to `about:debugging`
2. Click "This Firefox" in the left sidebar
3. Click "Load Temporary Add-on"
4. Navigate to the `src` folder and select `manifest.json`
5. The extension will be loaded and active

### Safari

1. Open Safari and go to Safari → Preferences → Extensions
2. Enable "Developer" menu in Safari → Preferences → Advanced
3. Go to Develop → Show Extension Builder
4. Click the "+" button and select "Add Extension..."
5. Navigate to the `src` folder and select it
6. Click "Install" to add the extension

### Browser Differences

- **Chrome**: Settings sync across devices using Chrome Sync
- **Firefox**: Settings sync across devices using Firefox Sync
- **Safari**: Settings stored locally only (no cross-device sync)

### Technical Details

#### How it works

- **Domain Detection**: The extension only activates on YouTube domains
- **Content Filtering**: Permanently removes elements from the site
- **Dynamic Loading**: Monitors page changes to filter new content as it loads

#### Browser Compatibility

- **Chrome**: Manifest V3, compatible with Chrome 88+
- **Firefox**: Manifest V3, compatible with Firefox 109+
- **Safari**: Manifest V3, compatible with Safari 14+ on macOS

### File Structure

```
src/
├── manifest.json      # Extension configuration (works for both browsers)
├── content.js         # Main filtering logic (cross-browser compatible)
├── popup.html         # Settings popup UI
├── popup.js          # Settings popup logic (cross-browser compatible)
├── styles.css        # Additional CSS rules
└── icons/
    └── brain-icon.svg # Extension icon
```

**Note**: This extension works on Chrome, Firefox, and Safari using cross-browser
compatible WebExtensions APIs.

## Contributing

1. Fork the repository
2. Make your changes
3. Ensure cross-browser compatibility is maintained
4. Submit a pull request

## FAQ

1. How I can subscribe to new channels?

You have to disable the extension and search for new channels, this tools is
mainly to help reduce the time spent in useless content. I'm not worried about
missing new channels or content, only in not wasting my time.

2. Why not only hide the content?

Because I know how to unhide it. Removing it makes it less likely for me to
waste my spare time doom scrolling.

3. There are other plugins that already do what this one does. What is the
difference?

None. I made this one because I want to be sure no personal information is
collected and the plugin does only what is supposed to do.

## License

MIT License - feel free to modify and distribute as needed.
