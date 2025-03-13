# Smart Shelf Front End

This is a simple web app to **scan a product barcode** and **estimate spoilage** based on **temperature** and **humidity**.

## Features

- **Landing Page**: A colorful homepage with a button to go to the scanning page.
- **Scanning Page**: Lets you start the camera, detect barcodes, and input (or accept default) storage conditions.
- **Finland Defaults**: If you don’t fill in temperature/humidity, we offer 5°C and 40% humidity in a modal.

## How to Use

1. **Open** `index.html` in a browser with camera access (Chrome, Firefox, or Safari).
2. **Click** “Get Started” to go to the scanning page.
3. **Start Scanner**: The camera feed appears. Align your barcode so it’s detected.
4. **Enter** or **accept** the default storage conditions.
5. **Analyze**: The back end returns how many days until spoilage.

## Project Structure

frontend/
├── index.html # Landing page  
├── scanning.html # Barcode scanning page  
├── styles.css # Basic styling  
├── js/  
│ ├── app.js # Main initialization  
│ ├── scanner.js # QuaggaJS camera scanning logic  
│ ├── finlandDefaults.js # Offers default conditions if none provided  
└─└── api.js # Calls the back end

## Tips & Notes

- **HTTPS**: You need to serve the pages over HTTPS or use `localhost` to let the camera work on mobile.
- **Barcode**: Make sure there’s enough light and the code is in focus. We use multiple readers (EAN, UPC, Code128) for better detection.

## License

MIT License. See the main repo for details.
