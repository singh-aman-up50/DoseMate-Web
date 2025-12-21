import { useContext, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { Menu, X, LogOut, Home, Pill, BarChart3, Clock, User } from 'lucide-react'
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

  const navItems = [
    { label: 'Dashboard', icon: Home, path: '/dashboard' },
    { label: 'Medicines', icon: Pill, path: '/medicines' },
    { label: 'Reminders', icon: Clock, path: '/reminders' },
    { label: 'Reports', icon: BarChart3, path: '/reports' },
    { label: 'Profile', icon: User, path: '/profile' }
  ]

  const isActive = (path) => location.pathname === path

  return (
    <div className="min-h-screen flex flex-col font-sans transition-colors duration-300" style={{ backgroundColor: 'var(--bg-secondary)' }}>
      {/* Header */}
      <header className="sticky top-0 z-50 w-full transition-colors duration-300" style={{
        backgroundColor: 'var(--bg-primary)',
        borderBottomColor: 'var(--border-light)',
        borderBottomWidth: '1px',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/dashboard" className="flex items-center gap-2.5 flex-shrink-0">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#009665] to-[#006644] flex items-center justify-center shadow-md hover:shadow-lg transition-shadow">
                <Pill className="text-white" size={20} />
              </div>
              <span className="text-xl font-bold hidden sm:inline" style={{ color: 'var(--text-primary)' }}>DoseMate</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg transition-all duration-300 text-sm font-medium relative group ${
                      isActive(item.path)
                        ? 'bg-gradient-to-r from-[#009665] to-[#00b876] text-white shadow-md'
                        : 'hover:text-[#009665]'
                    }`}
                    style={!isActive(item.path) ? { color: 'var(--text-secondary)' } : {}}
                  >
                    <Icon size={19} strokeWidth={2} />
                    <span>{item.label}</span>
                    {!isActive(item.path) && (
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#009665] to-[#daf800] group-hover:w-full transition-all duration-300"></span>
                    )}
                  </Link>
                )
              })}
            </nav>

            {/* User Menu */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:block">
                <ThemeToggle position="static" />
              </div>
              <span className="hidden lg:inline text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{user?.email}</span>
              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 px-3.5 py-2 bg-gradient-to-r from-[#009665] to-[#00b876] text-white rounded-lg hover:shadow-md hover:scale-105 transition-all duration-200 text-sm font-medium"
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
            <nav className="md:hidden pb-4 pt-2 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium ${
                      isActive(item.path)
                        ? 'bg-gradient-to-r from-[#009665] to-[#00b876] text-white shadow-sm'
                        : 'hover:text-[#009665]'
                    }`}
                    style={!isActive(item.path) ? { color: 'var(--text-secondary)', backgroundColor: 'var(--hover-bg)' } : {}}
                  >
                    <Icon size={19} strokeWidth={2} />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </nav>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="mt-12 transition-colors duration-300" style={{
        backgroundColor: 'var(--bg-primary)',
        borderTopColor: 'var(--border-light)',
        borderTopWidth: '1px'
      }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-sm" style={{ color: 'var(--text-secondary)' }}>
            <p>&copy; 2024 DoseMate - Your Medicine Reminder App. Stay healthy!</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
