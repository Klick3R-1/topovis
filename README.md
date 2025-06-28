# 🌐 TopoVis - Visual Network Editor

**TopoVis** is a simple, dark-themed, drag-and-drop web application for visualizing and editing network topologies. Built with Node.js and Express.

> ✅ Easily extensible, self-hosted, no dependencies beyond Express. You own the tool.
![image](https://github.com/user-attachments/assets/4b033b5e-215b-48f7-9e04-5430f4702c32)

---

## ✨ Features

- 🔐 Login/logout authentication
- 🧱 Dynamic node types (defined in `config.json`)
- 🎨 Palette with drag-and-drop nodes
- 🖱️ Click-and-drag node positioning
- 🔗 Shift+click to link nodes
- ❌ Toggleable remove mode for deleting nodes or connections
- 💾 Save/load layout (`layout.json`)
- 🌒 Dark theme for comfortable use
- ⚙️ Built-in `/settings` page to manage node types

---

## 🛠️ Installation

1. Clone this repo:

```bash
git clone https://github.com/YOUR_USERNAME/topovis.git
cd topovis
```

2. Install dependencies:

```bash
npm install
```

3. Run the app:

```bash
node app.js
```

4. Open in your browser:

```
http://localhost:3000
```

### 🔑 Default Credentials

- **Username:** `admin`  
- **Password:** `secret`

You can change these in `app.js`.

---

## ⚙️ Customizing Node Types

Node types are defined in `config.json`:

```json
{
  "types": ["Router", "Switch", "PC"]
}
```

You can also edit them via the `/settings` page from the sidebar.

---

## 🧾 License

MIT — do whatever you want with it.
