# 🌐 TopoVis v2.0.0 - Advanced Network Topology Visualizer

> 🎉 **Major Release**: Complete rewrite with multi-user support, network access control, and enhanced UI/UX

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
- 🔒 **Network Access Control**: Private, shared, and public network access levels
- 👤 **User Sharing**: Grant specific users access to your networks
- 🎯 **Owner Protection**: Network owners are automatically included in shared access
- 🚀 **Enhanced UI/UX**: Improved modal system, better error handling, and responsive design
- 🔧 **Database-Driven Node Types**: Intelligent node type management with user isolation
- 📈 **Type Promotion System**: Promote user types to system-wide admin types
- 🔄 **Intelligent Merging**: Automatic consolidation of duplicate types during promotion

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
- **Network Access Control**: Three levels of network access
  - **Private**: Only the network owner can access
  - **Shared**: Specific users can be granted access
  - **Public**: All authenticated users can access
- **User Sharing**: Grant access to specific users with granular control
- **Owner Protection**: Network owners are automatically included and cannot be removed from shared access

### 🎨 Visual Editor
- **Dynamic Node Types**: Configurable device types via settings
- **Drag & Drop**: Intuitive node placement and connection
- **Interactive Canvas**: Click-and-drag positioning, shift+click for connections
- **Dark Theme**: Professional, eye-friendly interface
- **Responsive Design**: Works on desktop and tablet devices
- **Enhanced Modals**: Improved network settings modal with better UX
- **Real-time Updates**: Alpine.js powered reactive interface
- **Keyboard Shortcuts**: Escape key to close modals, click-outside-to-close

### ⚙️ Administration
- **User Management**: Create, edit, delete users and reset passwords
- **System Statistics**: Overview of users, networks, and system usage
- **Network Ownership**: Users can only access their own networks (admins see all)
- **Device Type Management**: Comprehensive node type administration with promotion system

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
- **network_access**: Network access control and sharing permissions
- **node_types**: Device type definitions with isolation and promotion support

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
Device types are now managed through the database with intelligent isolation:

- **Settings Page**: Users can add/remove their own custom types
- **Admin Panel**: Admins can create system-wide types and promote user types
- **Automatic Isolation**: Users can create types with same names (isolated per user)
- **Type Promotion**: Useful user types can be promoted to system-wide types
- **Smart Merging**: Duplicate types are automatically consolidated during promotion

> **Note**: The old `config.json` file has been replaced with a robust database-driven system.

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

### Network Access Control
- `GET /networks/:id/access` - Get network access settings
- `PUT /networks/:id/access` - Update network access settings
- `GET /users` - List users for network sharing (filtered by role)

### Node Type Management
- `GET /config` - Get node types (filtered by user permissions)
- `POST /config` - Create user-specific node type
- `DELETE /config/:typeId` - Delete node type (with permission checks)
- `POST /admin/config` - Create admin-level node type
- `GET /admin/config/user-types` - Get all user types available for promotion
- `POST /admin/config/:typeId/promote` - Promote user type to admin level (with automatic merging)

### Admin (Admin only)
- `GET /admin/users` - List all users
- `POST /admin/users` - Create new user
- `PUT /admin/users/:id` - Update user
- `DELETE /admin/users/:id` - Delete user
- `POST /admin/users/:id/reset-password` - Reset user password

---

## 🎨 Enhanced User Experience

TopoVis v2.0.0 brings significant improvements to the user interface and experience.

### Modal System Improvements

- **Network Settings Modal**: Comprehensive network access management
- **Smart Defaults**: Owner automatically included in shared networks
- **Keyboard Shortcuts**: Escape key to close modals
- **Click-Outside-to-Close**: Intuitive modal dismissal
- **Real-time Updates**: Immediate feedback on all changes

### Alpine.js Integration

- **Reactive Interface**: Real-time updates without page refreshes
- **Component State Management**: Robust state handling for complex operations
- **Performance**: Lightweight reactivity without heavy framework overhead
- **Debug Tools**: Comprehensive logging and state inspection

### Responsive Design

- **Mobile-Friendly**: Works seamlessly on tablets and mobile devices
- **Dark Theme**: Professional, eye-friendly interface
- **Accessibility**: Clear visual hierarchy and intuitive navigation

---

## 🚀 Development
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

## 🔧 Node Type Management

TopoVis v2.0.0 introduces a sophisticated, database-driven node type management system that provides intelligent type isolation and promotion capabilities.

### Type Categories

- **🔒 Default Types**: System-provided types (Router, Switch, PC, etc.) - cannot be deleted
- **⭐ Admin Types**: System-wide types created by administrators - visible to all users
- **👤 User Types**: Custom types created by individual users - isolated per user

### Intelligent Type Isolation

- **User Privacy**: Users can only see default types, admin types, and their own custom types
- **Admin Visibility**: Admins see default types, admin types, and their own types (not other users')
- **No Conflicts**: Users can create types with the same names as other users (isolated)

### Type Promotion System

- **📈 Promotion Interface**: Admin panel dropdown for selecting user types to promote
- **🔄 Automatic Merging**: When promoting a type, all duplicates with the same name are automatically merged
- **🎯 Smart Consolidation**: Nodes using duplicate types are updated to use the promoted type
- **💾 Data Integrity**: Transaction-based operations ensure safe promotion and merging

### Admin Panel Features

- **Device Types Manager**: View and manage all system types with category badges
- **Promotion Controls**: Dropdown interface for selecting user types to promote
- **Type Creation**: Create new admin-level types for system-wide use
- **Visual Indicators**: Color-coded badges (Default, Admin, Custom) for easy identification

---

## 🔒 Network Access Control

TopoVis v2.0.0 introduces sophisticated network access control, allowing network owners to precisely manage who can access their networks.

### Access Levels

- **🔒 Private**: Only the network owner can access (default for new networks)
- **👥 Shared**: Specific users can be granted access by the owner
- **🌐 Public**: All authenticated users can access the network

### User Sharing Features

- **Selective Access**: Choose exactly which users can access your networks
- **Owner Protection**: Network owners are automatically included and cannot be removed
- **Role-Based Filtering**: See only relevant users when setting up sharing
- **Real-time Updates**: Access changes take effect immediately

### Use Cases

- **Team Collaboration**: Share network designs with team members
- **Client Presentations**: Grant temporary access to stakeholders
- **Training**: Allow students to view but not modify networks
- **Audit Trails**: Track who has access to sensitive network designs

---

## 🔒 Security Features

- **Password Hashing**: bcrypt with salt
- **Session Management**: Secure express-session configuration
- **Role-Based Access**: Granular permissions for different user types
- **Input Validation**: Server-side validation for all inputs
- **SQL Injection Protection**: Parameterized queries
- **Network Access Control**: Granular network sharing with user-level permissions
- **Owner Protection**: Network owners cannot be accidentally locked out

---

## 🐛 Troubleshooting

### Common Issues

1. **Port Already in Use**: Change the port in `app.js` or kill existing processes
2. **Database Errors**: Delete `database/topovis.db` to reset the database
3. **Permission Denied**: Ensure the `database/` directory is writable
4. **Network Access Issues**: Check that users have proper access permissions
5. **Modal Display Problems**: Ensure Alpine.js is properly loaded and initialized

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

## 📋 Changelog

### v2.0.0 (2025-08-29) - Major Release

#### ✨ New Features
- **Multi-User System**: Complete user management with authentication
- **Network Access Control**: Private, shared, and public network access levels
- **User Sharing**: Grant specific users access to networks
- **Network Templates**: Pre-built templates for common network types
- **Import/Export**: JSON-based network sharing
- **Admin Panel**: Comprehensive user and system management
- **Role-Based Access Control**: Admin, User, and Read-only roles
- **Database-Driven Node Types**: Intelligent type management with user isolation
- **Type Promotion System**: Promote user types to system-wide admin types
- **Intelligent Merging**: Automatic consolidation of duplicate types during promotion

#### 🔧 Improvements
- **SQLite Database**: Persistent storage replacing file-based system
- **Alpine.js Integration**: Modern reactive UI framework
- **Enhanced Modals**: Improved user experience with better modal system
- **Owner Protection**: Automatic inclusion of network owners in shared access
- **Real-time Updates**: Immediate feedback on all operations
- **Node Type Isolation**: Users can create types with same names (isolated per user)
- **Admin Type Management**: System-wide type creation and management
- **Promotion Interface**: Dropdown-based type promotion system

#### 🐛 Bug Fixes
- **Modal Display Issues**: Fixed modal visibility and state management
- **Network Access**: Resolved 404 errors for shared network access
- **User Management**: Fixed admin panel functionality and user operations
- **Template Networks**: Fixed connection creation in template networks
- **Node Type Conflicts**: Resolved 409 conflicts for user type creation
- **Admin Type Visibility**: Fixed admin seeing other users' custom types
- **Type Promotion Errors**: Resolved undefined variable errors in promotion system

#### 🚀 Technical Improvements
- **Backend Architecture**: Modular Express.js backend with middleware
- **Database Schema**: Proper relational database design
- **Security**: bcrypt password hashing and session management
- **Error Handling**: Comprehensive error handling and user feedback
- **Node Type System**: Database-driven type management with proper isolation
- **Transaction Safety**: Database transactions for type promotion and merging
- **Intelligent Merging**: Automatic duplicate detection and consolidation
- **Permission System**: Granular type management permissions

---

## 📄 License

MIT License - see LICENSE file for details.

---

## 🙏 Acknowledgments

Built with ❤️ using modern web technologies for network engineers and administrators who need powerful, flexible topology visualization tools.
