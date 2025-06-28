# 🧠 TopoVis - Visual Network Editor

**TopoVis** is a simple, dark-themed, drag-and-drop web application for visualizing and editing network topologies. Built with Node.js and vanilla JS, it provides an intuitive interface for creating nodes (like routers, switches, PCs), linking them, and saving the layout.

> ✨ Easily extensible, self-hosted, no dependencies beyond Express. You own the tool.

---

## 🚀 Features

- 🔐 Login/logout authentication
- 🧱 Dynamic node types (defined in `config.json`)
- 📦 Palette with drag-and-drop nodes
- 🖱️ Click-and-drag node positioning
- 🔗 Shift+click to link nodes
- 🗑️ Toggleable remove mode for deleting nodes or connections
- 💾 Save/load layout (`layout.json`)
- 🎨 Dark theme for comfortable use
- ⚙️ Built-in `/settings` page to manage node types

---

## 🛠️ Installation

1. Clone this repo:

```bash
git clone https://github.com/YOUR_USERNAME/topovis.git
cd topovis
Install dependencies:

bash
Copy
Edit
npm install
Run the app:

bash
Copy
Edit
node app.js
Open in your browser:

arduino
Copy
Edit
http://localhost:3000
🔑 Default Credentials
Username: admin

Password: secret

You can change these in app.js.

📁 Project Structure
text
Copy
Edit
.
├── app.js             # Express server
├── config.json        # Node types (palette items)
├── layout.json        # Saved layout (nodes + connections)
└── public/
    ├── index.html     # Main editor UI
    └── settings.html  # Node type editor (WIP)
🧩 Customizing Node Types
Edit config.json:

json
Copy
Edit
{
  "types": ["Router", "Switch", "PC", "Firewall", "Server"]
}
Then refresh the page — the new types will appear in the palette.

🛡️ Self-Hosting
TopoVis is designed for local or intranet use. To run this on a server, you should:

Set a secure session secret

Use HTTPS (reverse proxy with NGINX or Caddy)

Consider stronger authentication (e.g., OAuth, 2FA)

📜 License
MIT — do whatever you want, just don't sell it as-is.

❤️ Credits
Built with Node.js, passion, and a keyboard.

yaml
Copy
Edit

---

Let me know if you want a `LICENSE`, GitHub Actions CI, Dockerfile, or screenshots added as well.
