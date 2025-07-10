📝 Code Wallet

> A desktop application for managing and organizing code fragments

![Code Wallet](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Platform](https://img.shields.io/badge/platform-Windows-lightgrey.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

Code Wallet is a powerful desktop application built with React and Electron that helps developers organize, store, and quickly access their code fragments. Perfect for keeping track of useful code snippets, templates, and reusable components.

## ✨ Features

### Core Functionality
- 📝 **Fragment Management** - Create, edit, and delete code fragments
- 🏷️ **Tag System** - Organize fragments with custom tags
- 🔍 **Search & Filter** - Find fragments by title, content, or tags
- 💾 **Local Storage** - All data stored locally for privacy and speed

### Advanced Features
- 🌙 **Dark Mode** - Toggle between light and dark themes
- ⌨️ **Keyboard Shortcuts** - Efficient workflow with hotkeys
- 📁 **Drag & Drop** - Import code files by dragging them into the app
- 🎨 **Syntax Highlighting** - Code highlighting for multiple languages
- 📋 **Copy to Clipboard** - One-click copying of code fragments
- 📱 **Responsive Design** - Adapts to different window sizes

## 🚀 Getting Started

### Prerequisites
- Node.js 16 or higher
- npm 8 or higher
- Windows 10/11

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/SNZAMBA65/CodeWallet.git
   cd CodeWallet

Install dependencies
bashnpm install

Run in development mode
bashnpm run electron-dev

Build for production
bashnpm run build
npm run package-win


⌨️ Keyboard Shortcuts
ShortcutActionCtrl + NCreate new fragmentCtrl + SSave fragment (in form)Ctrl + FFocus searchCtrl + DToggle dark modeEscClose modal/cancel actionTabIndent code (in editor)
🛠️ Built With

React - Frontend framework
Electron - Desktop application framework
Webpack - Module bundler
Highlight.js - Syntax highlighting
CSS3 - Styling with CSS variables for theming

📁 Project Structure
CodeWallet/
├── src/
│   ├── components/          # Reusable React components
│   ├── pages/              # Main application pages
│   ├── services/           # Context providers and business logic
│   ├── styles/             # CSS files
│   ├── electron/           # Electron main process
│   └── assets/             # Images and icons
├── public/                 # Static files
├── build/                  # Production build
└── dist/                   # Packaged executables
🎯 Usage
Creating Fragments

Click "New Fragment" or press Ctrl + N
Enter a title and your code
Add tags for better organization
Save with Ctrl + S

Managing Tags

Go to the Tags page
Create new tags with "New Tag"
Edit existing tags by clicking the edit icon
Click on tags to see associated fragments

Importing Files

Drag and drop supported file types (.js, .py, .html, .css, etc.) onto the Fragments page
The app will automatically create a new fragment with the file content

🔒 Privacy & Security

All data is stored locally on your device
No data is transmitted to external servers
Your code fragments remain private and under your control

🤝 Contributing

Fork the project
Create your feature branch (git checkout -b feature/AmazingFeature)
Commit your changes (git commit -m 'Add some AmazingFeature')
Push to the branch (git push origin feature/AmazingFeature)
Open a Pull Request

📄 License
This project is licensed under the MIT License - see the LICENSE file for details.
🙏 Acknowledgments

Built as part of L'École Multimédia Bachelor Year 3 project
Developed for EverydayDev startup
Special thanks to the React and Electron communities

📧 Contact

Developer: Samir NZAMBA
Project: https://github.com/SNZAMBA65/CodeWallet