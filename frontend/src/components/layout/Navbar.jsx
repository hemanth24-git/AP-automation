import { Bell, ChevronDown, LogOut, Menu, Search, User as UserIcon } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'
import { ROLE_LABELS } from '../../utils/navigation'

export default function Navbar({ onMenuClick }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [profileOpen, setProfileOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const profileRef = useRef(null)
  const notifRef = useRef(null)

  useEffect(() => {
    let mounted = true
    const load = async () => {
      try {
        const { data } = await api.get('/notifications/', { params: { page_size: 6 } })
        if (!mounted) return
        setNotifications(data.results || data || [])
        setUnreadCount((data.results || data || []).filter((n) => !n.is_read).length)
      } catch {
        /* notifications endpoint may not be ready yet */
      }
    }
    load()
    const interval = setInterval(load, 30000)
    return () => {
      mounted = false
      clearInterval(interval)
    }
  }, [])

  useEffect(() => {
    const onClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false)
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  const submitSearch = (e) => {
    e.preventDefault()
    if (query.trim()) navigate(`/invoices?search=${encodeURIComponent(query.trim())}`)
  }

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center gap-4 px-4 lg:px-6 sticky top-0 z-30">
      <button className="lg:hidden text-slate-500" onClick={onMenuClick}>
        <Menu size={22} />
      </button>

      <form onSubmit={submitSearch} className="flex-1 max-w-md relative hidden sm:block">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search invoice #, vendor, PO, GSTIN..."
          className="w-full pl-9 pr-3 py-2 rounded-md bg-slate-100 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
        />
      </form>

      <div className="flex-1 sm:hidden" />

      <div className="flex items-center gap-2 ml-auto">
        <div className="relative" ref={notifRef}>
          <button
            className="relative p-2 rounded-md hover:bg-slate-100 text-slate-500"
            onClick={() => setNotifOpen((v) => !v)}
          >
            <Bell size={19} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            )}
          </button>
          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg border border-slate-200 py-2 max-h-96 overflow-y-auto">
              <div className="px-3 py-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Notifications
              </div>
              {notifications.length === 0 ? (
                <p className="px-3 py-6 text-sm text-slate-400 text-center">No notifications yet.</p>
              ) : (
                notifications.map((n) => (
                  <div key={n.id} className="px-3 py-2 hover:bg-slate-50 border-b border-slate-50 last:border-0">
                    <p className="text-sm text-slate-700">{n.message}</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {n.created_at ? new Date(n.created_at).toLocaleString() : ''}
                    </p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <div className="relative" ref={profileRef}>
          <button
            className="flex items-center gap-2 pl-2 pr-1 py-1.5 rounded-md hover:bg-slate-100"
            onClick={() => setProfileOpen((v) => !v)}
          >
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-semibold">
              {(user?.display_name || user?.username || '?').slice(0, 1).toUpperCase()}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-slate-700 leading-tight">{user?.display_name}</p>
              <p className="text-xs text-slate-400 leading-tight">{ROLE_LABELS[user?.role] || user?.role}</p>
            </div>
            <ChevronDown size={14} className="text-slate-400" />
          </button>
          {profileOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-white rounded-md shadow-lg border border-slate-200 py-1">
              <button
                className="w-full text-left px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 flex items-center gap-2"
                onClick={() => {
                  setProfileOpen(false)
                  navigate('/settings')
                }}
              >
                <UserIcon size={15} /> Profile & Settings
              </button>
              <button
                className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                onClick={logout}
              >
                <LogOut size={15} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
