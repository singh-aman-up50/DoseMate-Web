import { useContext, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { Menu, X, LogOut, Home, Pill, BarChart3, Clock, User, Users } from 'lucide-react'
import ThemeToggle from './ThemeToggle'

export default function Layout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { logout, user } = useContext(AuthContext)
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  // Different nav items based on role
  const isCaregiver = user?.role === 'ROLE_CAREGIVER'
  
  const profilePath = isCaregiver ? '/caregiver/profile' : '/profile'
  const baseNavItems = [
    { label: 'Dashboard', icon: Home, path: isCaregiver ? '/caregiver/dashboard' : '/dashboard' },
    { label: 'Reminders', icon: Clock, path: '/reminders' },
    { label: 'Reports', icon: BarChart3, path: '/reports' },
    { label: 'Profile', icon: User, path: profilePath }
  ]

  const navItems = isCaregiver 
    ? baseNavItems 
    : [
        ...baseNavItems.slice(0, 1),
        { label: 'Medicines', icon: Pill, path: '/medicines' },
        ...baseNavItems.slice(1),
        { label: 'Caregivers', icon: Users, path: '/caregivers' }
      ]

  const isActive = (path) => location.pathname === path

  return (
    <div className="min-h-screen flex flex-col font-sans transition-colors duration-300" style={{ backgroundColor: 'var(--bg-secondary)' }}>
      {/* Header */}
      <header className="sticky top-0 z-50 w-full transition-colors duration-300" style={{
        backgroundColor: '#1e3a5f',
        boxShadow: '0 4px 12px rgba(30, 58, 95, 0.15)',
        borderRadius: '0px'
      }}>
        <div className="w-full page-surface mx-0 px-0">
          <div className="nav-container w-full px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16 w-full">
            <Link to={isCaregiver ? '/caregiver/dashboard' : '/dashboard'} className="flex items-center gap-2.5 flex-shrink-0 mr-8">
              <div className="w-9 h-9 rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-shadow" style={{ background: 'linear-gradient(135deg,var(--brand),var(--brand-dark))' }}>
                <Pill className="text-white" size={20} />
              </div>
              <span className="text-xl font-bold hidden sm:inline" style={{ color: '#ffffff' }}>DoseMate {isCaregiver ? '👨‍⚕️' : ''}</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-3">
              {navItems.map((item) => {
                const Icon = item.icon
                const active = isActive(item.path)
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`nav-link ${active ? 'active' : ''}`}
                    aria-current={active ? 'page' : undefined}
                  >
                    <Icon size={18} strokeWidth={2} />
                    <span style={{ fontSize: 'var(--font-size-md)', fontWeight: 600 }}>{item.label}</span>
                  </Link>
                )
              })}
            </nav>

            {/* User Menu */}
            <div className="flex items-center gap-3 ml-auto">
              <div className="hidden sm:block">
                <ThemeToggle position="static" />
              </div>
              <span className="hidden lg:inline text-sm font-medium" style={{ color: '#ffffff' }}>{user?.email}</span>
              <button 
                onClick={handleLogout} 
                className="flex items-center justify-center gap-2 px-3.5 py-2 text-white hover:shadow-md hover:scale-105 transition-all duration-200 text-sm font-medium border-2 border-white"
                style={{ 
                  borderRadius: 'var(--control-radius)',
                  background: 'linear-gradient(to right, rgb(239, 68, 68), rgb(220, 38, 38))'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(to right, rgb(159, 18, 18), rgb(127, 29, 29))';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(to right, rgb(239, 68, 68), rgb(220, 38, 38))';
                }}
              >
                <LogOut size={18} />
                <span className="hidden sm:inline">Logout</span>
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg transition-colors"
                style={{ color: 'var(--text-primary)', backgroundColor: 'var(--hover-bg)' }}
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

            {/* Mobile Navigation */}
            {mobileMenuOpen && (
              <nav className="md:hidden pb-4 pt-2 space-y-1 mt-2">
                {navItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
                      style={!isActive(item.path) ? { backgroundColor: 'var(--hover-bg)' } : undefined}
                    >
                      <Icon size={19} strokeWidth={2} />
                      <span>{item.label}</span>
                    </Link>
                  )
                })}
              </nav>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-0">
        <div className="w-full mx-0 py-6 px-0">{children}</div>
      </main>
            <footer className="mt-12 transition-colors duration-300" style={{
        backgroundColor: '#1e3a5f',
        borderTopColor: 'rgba(255, 255, 255, 0.1)',
        borderTopWidth: '1px',
        borderRadius: '0px'
      }}>
        <div className="w-full mx-0 px-0 py-8">
          <div className="text-center text-sm" style={{ color: '#e0e7ff' }}>
            <p>&copy; 2024 DoseMate - Your Medicine Reminder App. Stay healthy!</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

