# 🌐 TopoVis v2.0.0 - Advanced Network Topology Visualizer

**TopoVis** is a powerful, feature-rich web application for visualizing, designing, and managing network topologies. Built with Node.js, Express, SQLite, and Alpine.js for a modern, responsive experience.

> ✅ **Enterprise-ready**: Multi-user support, role-based access control, network templates, and persistent storage
> ✅ **Self-hosted**: You own the tool and your data
> ✅ **Extensible**: Easy to add new node types and network templates

---

## ✨ What's New in v2.0.0

- 🗄️ **SQLite Database**: Persistent storage for networks, users, and configurations
- 👥 **Multi-User Support**: User management with role-based access control
- 🌐 **Multi-Network Management**: Create, switch between, and manage multiple networks
- 🎯 **Network Templates**: Pre-built templates for LAN, Hetzner, and Office environments
- 📤 **Import/Export**: Share networks via JSON export/import
- 🎨 **Alpine.js Integration**: Modern reactive UI with smooth interactions
- 🔐 **Role-Based Access Control**: Admin, User, and Read-only roles
- ⚙️ **Admin Panel**: Comprehensive user and system management

---

## 🚀 Features

### 🔐 Authentication & Authorization
- **Secure Login System**: bcrypt password hashing
- **Role-Based Access Control**:
  - **Admin**: Full access to all networks and user management
  - **User**: Create and manage own networks
  - **Read-only**: View networks without editing capabilities

### 🌐 Network Management
- **Multi-Network Support**: Switch between different network topologies
- **Network Templates**: Quick-start with pre-configured layouts
  - **LAN**: Basic local network with routers, switches, and workstations
  - **Hetzner**: Server infrastructure with load balancers and databases
  - **Office**: Corporate network with VLANs and security zones
- **Import/Export**: Share networks via JSON files

### 🎨 Visual Editor
- **Dynamic Node Types**: Configurable device types via settings
- **Drag & Drop**: Intuitive node placement and connection
- **Interactive Canvas**: Click-and-drag positioning, shift+click for connections
- **Dark Theme**: Professional, eye-friendly interface
- **Responsive Design**: Works on desktop and tablet devices

### ⚙️ Administration
- **User Management**: Create, edit, delete users and reset passwords
- **System Statistics**: Overview of users, networks, and system usage
- **Network Ownership**: Users can only access their own networks (admins see all)

---

## 🛠️ Technology Stack

- **Backend**: Node.js + Express.js
- **Database**: SQLite3 with automatic schema creation
- **Frontend**: Vanilla JavaScript + Alpine.js for reactivity
- **Authentication**: express-session + bcrypt
- **Styling**: Custom CSS with dark theme

---

## 📦 Installation

1. **Clone the repository**:
```bash
git clone https://github.com/Klick3R-1/topovis.git
cd topovis
```

2. **Install dependencies**:
```bash
npm install
```

3. **Start the server**:
```bash
npm start
```

4. **Open in your browser**:
```
http://localhost:3000
```

### 🔑 Default Credentials

- **Username:** `admin`  
- **Password:** `secret`

> ⚠️ **Important**: Change the default admin password after first login!

---

## 🗄️ Database Schema

The application automatically creates the following tables:

- **users**: User accounts with roles and authentication
- **networks**: Network definitions and metadata
- **nodes**: Network devices with positions and properties
- **connections**: Links between network nodes

---

## 🎯 Network Templates

### LAN Template
- Router → Core Switch → Floor Switch
- Workstations connected to switches
- Basic local network structure

### Hetzner Template
- Load Balancer → Web Servers
- Database server with application server
- Cloud infrastructure layout

### Office Template
- Firewall → Core Router → VLAN Switches
- Separate VLANs for Admin, User, and Guest PCs
- Corporate security zone design

---

## 🔧 Configuration

### Node Types
Edit device types in the Settings page or modify `config.json`:
```json
{
  "types": ["Router", "Switch", "PC", "Firewall", "Server"]
}
```

### Environment Variables
- `PORT`: Server port (default: 3000)
- `SESSION_SECRET`: Session encryption key

---

## 📚 API Endpoints

### Authentication
- `POST /login` - User login
- `POST /logout` - User logout
- `GET /user/info` - Current user information

### Networks
- `GET /networks` - List user's networks
- `POST /networks` - Create new network
- `POST /networks/template` - Create from template
- `GET /networks/:id/layout` - Get network layout
- `POST /networks/:id/save` - Save network layout
- `GET /networks/:id/export` - Export network to JSON
- `DELETE /networks/:id` - Delete network

### Admin (Admin only)
- `GET /admin/users` - List all users
- `POST /admin/users` - Create new user
- `PUT /admin/users/:id` - Update user
- `DELETE /admin/users/:id` - Delete user
- `POST /admin/users/:id/reset-password` - Reset user password

---

## 🚀 Development

### Development Mode
```bash
npm run dev
```

### Project Structure
```
topovis/
├── app.js              # Main server file
├── database/           # SQLite database files
├── public/             # Frontend assets
│   ├── index.html      # Main network editor
│   ├── admin.html      # Admin panel
│   └── settings.html   # Settings page
├── config.json         # Node type configuration
└── package.json        # Dependencies and scripts
```

---

## 🔒 Security Features

- **Password Hashing**: bcrypt with salt
- **Session Management**: Secure express-session configuration
- **Role-Based Access**: Granular permissions for different user types
- **Input Validation**: Server-side validation for all inputs
- **SQL Injection Protection**: Parameterized queries

---

## 🐛 Troubleshooting

### Common Issues

1. **Port Already in Use**: Change the port in `app.js` or kill existing processes
2. **Database Errors**: Delete `database/topovis.db` to reset the database
3. **Permission Denied**: Ensure the `database/` directory is writable

### Debug Mode
Check browser console for detailed error messages and Alpine.js component state.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

## 📄 License

MIT License - see LICENSE file for details.

---

## 🙏 Acknowledgments

Built with ❤️ using modern web technologies for network engineers and administrators who need powerful, flexible topology visualization tools.
