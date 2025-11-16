# Changelog

Semua perubahan penting pada proyek ini akan didokumentasikan di file ini.

## [Unreleased]

### Added
- Full-stack architecture with Express.js backend server
- RESTful API endpoints for registry operations (/api/check-register, /api/read-register, /api/write-register, /api/system-data)
- Registry utilities module (registryUtils.cjs) with Windows registry operations
- System data retrieval function (getSystemData) for device information
- Toast notifications for user feedback using react-hot-toast
- Automatic registry checking and system data logging on login page load
- Static file serving for production React build

### Changed
- Converted from Vite development server to Express.js production server
- Updated API connectivity to use local Express server endpoints
- Replaced inline status messages with toast notifications
- Modified registry operations to use API calls instead of direct Node.js access
- Updated environment configuration for Express server setup

### Fixed
- Resolved require() error in browser by moving Node.js code to backend
- Fixed registry access issues by implementing server-side operations
- Corrected API endpoint URLs to use local server
- Fixed TypeScript compilation issues with Node.js types

## [1.2.0] - 2025-10-31
### Added
- Responsive design implementation with mobile-first approach
- Tailwind CSS v4 migration with CSS-based configuration
- Gradient background design with modern color scheme
- Adaptive button layouts (vertical on mobile, horizontal on desktop)
- Responsive typography and spacing across all screen sizes
- Perfect centering fix for login frame on all devices
- Breakpoint-specific container sizing and padding

### Changed
- Upgraded from Tailwind CSS v3 to v4 for better performance
- Replaced JavaScript-based config with CSS @theme directives
- Improved form element sizing with responsive padding
- Enhanced text readability with adaptive font sizes
- Fixed layout centering issues across different screen sizes

### Fixed
- Login frame positioning - now properly centered on all screen sizes
- Button layout overflow on mobile devices
- Text wrapping issues in status messages
- Horizontal scroll on small screens
- Container width limitations on larger screens

## [1.1.0] - 2025-10-31
### Changed
- Mengganti library `systeminformation` dengan pendekatan shell command untuk meningkatkan kecepatan eksekusi
- Optimasi pembacaan informasi perangkat menggunakan perintah bawaan sistem (WMIC di Windows, /proc di Linux, sysctl di macOS)
- Perbarui dokumentasi README.md agar sesuai dengan perubahan implementasi

## [1.0.0] - 2025-10-31
### Added
- Implementasi awal sistem aktivasi perangkat
- Tampilan login sederhana menggunakan React dan TypeScript
- Implementasi komponen App.tsx dengan alur aktivasi perangkat
- Fungsi pembacaan informasi perangkat komputer (read-reg.js) dengan library systeminformation
- Fungsi menyimpan informasi ke registry Windows
- Fungsi menyimpan informasi ke file JSON
- File README.md dengan dokumentasi lengkap