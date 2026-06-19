'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutGrid,
  Wallet,
  ArrowUpDown,
  Receipt,
  PieChart,
  FileText,
  Settings,
  HelpCircle,
  LogOut
} from './Icons'

const menuItems = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutGrid },
  { label: 'Accounts', path: '/bank-accounts', icon: Wallet },
  { label: 'Transfer', path: '/bank-transfer', icon: ArrowUpDown },
  { label: 'Pay Bills', path: '/pay-bills', icon: Receipt },
  { label: 'Smart Spend', path: '/smart-spend', icon: PieChart },
  { label: 'E-Statement', path: '/e-statement', icon: FileText }
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } catch {
      // ignore
    }
    router.push('/login')
  }

  return (
    <aside className="nova-sidebar">
      {/* Logo */}
      <div className="sidebar-brand">
        <div className="brand-logo">
          <img src="/loginlogo.png" alt="Nova Bank" />
        </div>
        <h1 className="brand-text">
          NOVA<span>BANK</span>
        </h1>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const isActive = pathname === item.path
          const IconComp = item.icon
          return (
            <Link key={item.path} href={item.path} className="sidebar-link">
              <div className={`sidebar-item${isActive ? ' active' : ''}`}>
                <div className="sidebar-icon">
                  <IconComp size={20} />
                </div>
                <span>{item.label}</span>
              </div>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <button className="sidebar-footer-btn" aria-label="Settings">
          <Settings size={20} />
        </button>
        <button className="sidebar-footer-btn" aria-label="Help">
          <HelpCircle size={20} />
        </button>
        <button
          className="sidebar-footer-btn logout"
          aria-label="Log out"
          onClick={handleLogout}
        >
          <LogOut size={20} />
        </button>
      </div>

      <style jsx>{`
        .nova-sidebar {
          width: 260px;
          background: linear-gradient(180deg, #1d0730 0%, #2e0a46 50%, #1d0730 100%);
          display: flex;
          flex-direction: column;
          border-radius: 0 24px 24px 0;
          box-shadow: 4px 0 24px rgba(29, 7, 48, 0.2);
          flex-shrink: 0;
          padding: 1.5rem 0;
          position: relative;
          overflow: hidden;
        }

        /* Subtle texture overlay */
        .nova-sidebar::before {
          content: '';
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 32px,
            rgba(255, 255, 255, 0.015) 32px,
            rgba(255, 255, 255, 0.015) 33px
          );
          pointer-events: none;
        }

        .sidebar-brand {
          display: flex;
          align-items: center;
          gap: 0.875rem;
          padding: 0.5rem 1.25rem 1.75rem;
          position: relative;
          z-index: 1;
        }

        .brand-logo {
          width: 52px;
          height: 52px;
          border-radius: 14px;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .brand-logo img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .brand-text {
          color: #fff;
          font-size: 1.15rem;
          font-weight: 800;
          letter-spacing: 2px;
          line-height: 1;
        }

        .brand-text span {
          display: block;
          font-weight: 300;
          font-size: 0.75rem;
          letter-spacing: 4px;
          color: rgba(255, 255, 255, 0.6);
          margin-top: 2px;
        }

        .sidebar-nav {
          flex: 1;
          padding: 0 0.75rem;
          display: flex;
          flex-direction: column;
          gap: 4px;
          position: relative;
          z-index: 1;
        }

        .sidebar-link {
          text-decoration: none;
        }

        .sidebar-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          border-radius: 12px;
          color: rgba(255, 255, 255, 0.65);
          font-weight: 500;
          font-size: 0.9rem;
          transition: all 200ms cubic-bezier(0.16, 1, 0.3, 1);
          cursor: pointer;
          border: none;
          background: transparent;
          width: 100%;
          text-align: left;
          position: relative;
        }

        .sidebar-item:hover {
          color: rgba(255, 255, 255, 0.95);
          background: rgba(255, 255, 255, 0.06);
        }

        .sidebar-item.active {
          color: #fff;
          background: linear-gradient(135deg, rgba(154, 92, 151, 0.5), rgba(122, 45, 120, 0.5));
          font-weight: 700;
          box-shadow: 0 4px 16px rgba(69, 0, 67, 0.3);
        }

        .sidebar-item.active::before {
          content: '';
          position: absolute;
          left: -0.75rem;
          top: 50%;
          transform: translateY(-50%);
          width: 3px;
          height: 24px;
          background: #bde65e;
          border-radius: 0 3px 3px 0;
        }

        .sidebar-icon {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          flex-shrink: 0;
          transition: background 200ms;
        }

        .sidebar-item.active .sidebar-icon {
          background: rgba(255, 255, 255, 0.1);
        }

        .sidebar-footer {
          display: flex;
          gap: 0.5rem;
          padding: 1rem 1.25rem 0.5rem;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          margin-top: 0.5rem;
          position: relative;
          z-index: 1;
        }

        .sidebar-footer-btn {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          border: none;
          background: transparent;
          color: rgba(255, 255, 255, 0.45);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 200ms;
        }

        .sidebar-footer-btn:hover {
          background: rgba(255, 255, 255, 0.08);
          color: rgba(255, 255, 255, 0.85);
        }

        .sidebar-footer-btn.logout:hover {
          background: rgba(239, 68, 68, 0.15);
          color: #f87171;
        }

        @media (max-width: 768px) {
          .nova-sidebar {
            width: 100%;
            border-radius: 0 0 20px 20px;
            flex-direction: row;
            flex-wrap: wrap;
            padding: 0.75rem 1rem;
            align-items: center;
            gap: 0.75rem;
          }

          .nova-sidebar::before {
            display: none;
          }

          .sidebar-brand {
            padding: 0;
          }

          .brand-logo {
            width: 36px;
            height: 36px;
            border-radius: 10px;
          }

          .brand-text {
            font-size: 0.95rem;
          }
          .brand-text span {
            display: none;
          }

          .sidebar-nav {
            flex-direction: row;
            flex-wrap: wrap;
            padding: 0;
            gap: 2px;
            flex: 1;
          }

          .sidebar-item {
            padding: 0.5rem 0.75rem;
            font-size: 0.75rem;
            white-space: nowrap;
            width: auto;
            gap: 0.4rem;
          }

          .sidebar-item.active::before {
            display: none;
          }

          .sidebar-icon {
            width: 24px;
            height: 24px;
          }

          .sidebar-footer {
            border-top: none;
            margin-top: 0;
            padding: 0;
          }

          .sidebar-footer-btn {
            width: 32px;
            height: 32px;
          }
        }
      `}</style>
    </aside>
  )
}
