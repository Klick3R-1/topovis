# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [2.1.0] - 2025-01-XX

### Added
- Beautiful, professional login system with TopoVis branding
- Enhanced wiki system with ASCII-style tree navigation
- Standardized header navigation across all application pages
- Documentation protection during node deletion
- UUID conflict resolution for network imports

### Changed
- Improved login user experience with responsive design
- Enhanced wiki tree styling and navigation
- Unified navigation design across all pages
- Better documentation handling and storage
- Enhanced import/export with documentation preservation

### Fixed
- Tree navigation CSS issues preventing proper display
- Documentation detection during node deletion
- UUID conflicts during network import operations
- Navigation spacing and alignment issues in header
- Wiki tree expansion defaults on page load
- Active node highlighting in tree navigation
- Documentation parsing errors during deletion checks

### Technical Improvements
- Professional HTML/CSS-based login interface
- Enhanced tree navigation with improved styling
- Consistent header-based navigation system
- Improved storage and retrieval of node properties
- UUID regeneration system for network imports

## [2.0.0] - 2025-08-29

### Added
- **Multi-User System**: Complete user management with authentication and role-based access control
- **Network Access Control**: Private, shared, and public network access levels
- **User Sharing**: Grant specific users access to networks with granular control
- **Network Templates**: Pre-built templates for LAN, Hetzner, and Office environments
- **Import/Export**: JSON-based network sharing functionality
- **Admin Panel**: Comprehensive user and system management interface
- **Role-Based Access Control**: Admin, User, and Read-only roles
- **Database-Driven Node Types**: Intelligent type management with user isolation
- **Type Promotion System**: Promote user types to system-wide admin types
- **Intelligent Merging**: Automatic consolidation of duplicate types during promotion

### Changed
- **Backend Architecture**: Modular Express.js backend with middleware
- **Database System**: SQLite3 replacing file-based storage
- **Frontend Framework**: Alpine.js integration for reactive UI
- **Modal System**: Enhanced user experience with better modal interactions
- **Owner Protection**: Automatic inclusion of network owners in shared access
- **Real-time Updates**: Immediate feedback on all operations
- **Node Type Isolation**: Users can create types with same names (isolated per user)
- **Admin Type Management**: System-wide type creation and management
- **Promotion Interface**: Dropdown-based type promotion system

### Fixed
- Modal display issues and state management problems
- Network access 404 errors for shared network access
- User management functionality and user operations
- Connection creation in template networks
- Node type conflicts for user type creation
- Admin visibility of other users' custom types
- Type promotion errors and undefined variable issues

### Technical Improvements
- **Backend Architecture**: Modular Express.js backend with middleware
- **Database Schema**: Proper relational database design
- **Security**: bcrypt password hashing and session management
- **Error Handling**: Comprehensive error handling and user feedback
- **Node Type System**: Database-driven type management with proper isolation
- **Transaction Safety**: Database transactions for type promotion and merging
- **Intelligent Merging**: Automatic duplicate detection and consolidation
- **Permission System**: Granular type management permissions

### Security Features
- Password hashing with bcrypt and salt
- Secure express-session configuration
- Role-based access control with granular permissions
- Server-side input validation
- SQL injection protection with parameterized queries
- Network access control with user-level permissions
- Owner protection to prevent accidental lockouts

---

## [1.0.0] - 2024-06-29

### Added
- **Initial Release**: Basic network topology visualization tool
- **Node Management**: Create, edit, and delete network nodes
- **Connection System**: Link nodes to create network topologies
- **Basic UI**: Simple web interface for network design
- **File-based Storage**: Local storage of network configurations
- **Core Functionality**: Fundamental network visualization capabilities

### Technical Foundation
- **Frontend**: HTML, CSS, and JavaScript
- **Backend**: Basic server functionality
- **Storage**: File-based network configuration storage
- **Core Features**: Essential network topology visualization

---

## Version History

- **v2.1.0**: Enhanced user experience, professional login system, improved wiki navigation
- **v2.0.0**: Major rewrite with multi-user support, database backend, and comprehensive features
- **v1.0.0**: Initial release with basic network topology visualization capabilities
