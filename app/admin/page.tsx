'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
  ChevronRight,
  FileText,
  LogOut,
  Search,
  Shield,
  User,
  Wallet
} from '@/components/Icons'

export default function AdminPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [systemData, setSystemData] = useState<{
    users: any[]
    accounts: any[]
    auditLogs: any[]
  }>({ users: [], accounts: [], auditLogs: [] })

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } catch {
      // ignore
    }
    router.push('/login')
  }

  const [activeTab, setActiveTab] = useState<'users' | 'accounts' | 'logs'>(
    'users'
  )
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedLogId, setExpandedLogId] = useState<number | null>(null)

  useEffect(() => {
    async function initAdmin() {
      try {
        // 1. Auth check
        const authRes = await fetch('/api/auth/login')
        if (!authRes.ok) {
          router.push('/login')
          return
        }
        const authData = await authRes.json()
        if (!authData.ok || authData.user.role !== 'admin') {
          router.push('/dashboard')
          return
        }
        setIsAdmin(true)

        // 2. Fetch admin system details
        const systemRes = await fetch('/api/admin/system')
        if (systemRes.ok) {
          const sysData = await systemRes.json()
          if (sysData.ok) {
            setSystemData({
              users: sysData.users || [],
              accounts: sysData.accounts || [],
              auditLogs: sysData.auditLogs || []
            })
          }
        }
      } catch (err) {
        console.error('Admin initialization failed:', err)
      } finally {
        setLoading(false)
      }
    }
    initAdmin()
  }, [router])

  if (loading) {
    return (
      <div className="admin-loading-screen">
        <div className="admin-spinner"></div>
        <p>Verifying credentials...</p>
        <style jsx>{`
          .admin-loading-screen {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            background: #1d0730;
            color: #fff;
            font-family: var(--font-bai), sans-serif;
            gap: 1.5rem;
          }
          .admin-spinner {
            width: 48px;
            height: 48px;
            border: 4px solid rgba(255, 255, 255, 0.1);
            border-top: 4px solid #bde65e;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  if (!isAdmin) return null

  // Calculate statistics
  const totalUsers = systemData.users.length
  const totalAccounts = systemData.accounts.length
  const totalAssets = systemData.accounts.reduce(
    (sum, acc) => sum + parseFloat(acc.balance || 0),
    0
  )
  const totalAudits = systemData.auditLogs.length

  // Filter lists based on search query
  const filteredUsers = systemData.users.filter(
    (u) =>
      u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.email && u.email.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const filteredAccounts = systemData.accounts.filter(
    (a) =>
      a.account_number.includes(searchQuery) ||
      a.account_name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredLogs = systemData.auditLogs.filter(
    (l) =>
      l.event.toLowerCase().includes(searchQuery.toLowerCase()) ||
      JSON.stringify(l.payload)
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  )

  return (
    <div className="admin-container">
      <header className="admin-header">
        <div className="admin-title-area">
          <Shield size={28} className="admin-title-icon" />
          <div>
            <h1 className="admin-title">Admin Portal</h1>
            <p className="admin-subtitle">
              Secure System Overview & Registry Control
            </p>
          </div>
        </div>
        <div className="admin-header-actions">
          <div className="admin-badge">SYSTEM ADMINISTRATOR</div>
          <button className="admin-logout-btn" onClick={handleLogout}>
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </header>

      <div className="admin-body">
        {/* Stats Cards */}
        <div className="admin-stats animate-fade-in">
          <div className="stat-card">
            <div className="stat-header">
              <span className="stat-label">Total Platform Deposits</span>
              <Wallet size={20} className="stat-icon assets" />
            </div>
            <h3 className="stat-value">
              Rs.{' '}
              {totalAssets.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}
            </h3>
            <div className="stat-indicator positive">
              <span>Live Reserves</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <span className="stat-label">Registered Members</span>
              <User size={20} className="stat-icon users" />
            </div>
            <h3 className="stat-value">{totalUsers}</h3>
            <div className="stat-indicator neutral">
              <span>Active Profiles</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <span className="stat-label">Open Bank Accounts</span>
              <Wallet size={20} className="stat-icon accounts" />
            </div>
            <h3 className="stat-value">{totalAccounts}</h3>
            <div className="stat-indicator positive">
              <span>Linked Accounts</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <span className="stat-label">Monitored Logs</span>
              <FileText size={20} className="stat-icon audits" />
            </div>
            <h3 className="stat-value">{totalAudits}</h3>
            <div className="stat-indicator negative">
              <span>Audit Entries</span>
            </div>
          </div>
        </div>

        {/* Tab Panel */}
        <div className="admin-panel animate-fade-in-delay-1">
          <div className="panel-header">
            <div className="panel-tabs">
              <button
                className={`panel-tab ${activeTab === 'users' ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab('users')
                  setSearchQuery('')
                }}
              >
                User Directory
              </button>
              <button
                className={`panel-tab ${activeTab === 'accounts' ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab('accounts')
                  setSearchQuery('')
                }}
              >
                Account Registry
              </button>
              <button
                className={`panel-tab ${activeTab === 'logs' ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab('logs')
                  setSearchQuery('')
                }}
              >
                Security Audit Trail
              </button>
            </div>

            <div className="panel-search">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
          </div>

          <div className="panel-body">
            {activeTab === 'users' && (
              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Username</th>
                      <th>Full Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Created At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((user) => (
                        <tr key={user.id}>
                          <td className="font-mono">#{user.id}</td>
                          <td className="font-bold text-plum">
                            {user.username}
                          </td>
                          <td>{user.full_name}</td>
                          <td className="text-muted">{user.email || 'N/A'}</td>
                          <td>
                            <span className={`role-badge ${user.role}`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="text-muted">
                            {new Date(user.created_at).toLocaleString()}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="text-center py-8 text-muted">
                          No users found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'accounts' && (
              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>User ID</th>
                      <th>Account Number</th>
                      <th>Account Name</th>
                      <th>Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAccounts.length > 0 ? (
                      filteredAccounts.map((acc) => (
                        <tr key={acc.id}>
                          <td className="font-mono">#{acc.id}</td>
                          <td className="font-mono">User #{acc.user_id}</td>
                          <td className="font-mono font-bold">
                            {acc.account_number}
                          </td>
                          <td>{acc.account_name}</td>
                          <td className="font-bold text-success text-right">
                            Rs.{' '}
                            {parseFloat(acc.balance).toLocaleString('en-US', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2
                            })}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="text-center py-8 text-muted">
                          No accounts found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'logs' && (
              <div className="audit-timeline">
                {filteredLogs.length > 0 ? (
                  filteredLogs.map((log) => {
                    const isExpanded = expandedLogId === log.id
                    return (
                      <div
                        key={log.id}
                        className={`audit-card ${isExpanded ? 'expanded' : ''}`}
                      >
                        <div
                          className="audit-summary"
                          onClick={() =>
                            setExpandedLogId(isExpanded ? null : log.id)
                          }
                        >
                          <div className="audit-main">
                            <span className="audit-time">
                              {new Date(log.created_at).toLocaleTimeString()}
                            </span>
                            <span className="audit-event">{log.event}</span>
                          </div>
                          <div className="audit-action">
                            <span className="audit-date-badge">
                              {new Date(log.created_at).toLocaleDateString()}
                            </span>
                            <ChevronRight
                              size={16}
                              className="expand-chevron"
                            />
                          </div>
                        </div>
                        {isExpanded && (
                          <div className="audit-details">
                            <h4>Event Payload:</h4>
                            <pre className="font-mono">
                              {JSON.stringify(log.payload, null, 2)}
                            </pre>
                          </div>
                        )}
                      </div>
                    )
                  })
                ) : (
                  <p className="text-center py-8 text-muted">
                    No audit logs found.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .admin-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 2rem 2.5rem 1.5rem;
          border-bottom: 1px solid rgba(0, 0, 0, 0.05);
          background: var(--bg-card);
          box-shadow: var(--shadow-sm);
        }

        .admin-title-area {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        :global(.admin-title-icon) {
          color: var(--plum-600);
          background: var(--plum-100);
          padding: 8px;
          border-radius: 12px;
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .admin-title {
          font-size: 1.8rem;
          font-weight: 800;
          color: var(--plum-900);
          letter-spacing: -0.5px;
        }

        .admin-subtitle {
          font-size: 0.85rem;
          color: var(--text-muted);
          margin-top: 2px;
        }

        .admin-badge {
          font-size: 0.75rem;
          font-weight: 700;
          background: var(--plum-900);
          color: var(--citrine-400);
          padding: 0.5rem 1rem;
          border-radius: var(--radius-pill);
          letter-spacing: 1px;
          box-shadow: 0 4px 12px rgba(29, 7, 48, 0.15);
        }

        .admin-body {
          padding: 2rem 2.5rem;
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        /* Stats Cards */
        .admin-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1.5rem;
        }

        .stat-card {
          background: var(--bg-card);
          border-radius: var(--radius-xl);
          padding: 1.5rem;
          box-shadow: var(--shadow-md);
          border: 1px solid rgba(0, 0, 0, 0.04);
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .stat-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .stat-label {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-muted);
        }

        :global(.stat-icon) {
          padding: 6px;
          border-radius: 8px;
        }

        :global(.stat-icon.assets) { background: #dcfce7; color: #16a34a; }
        :global(.stat-icon.users) { background: #e0f2fe; color: #0284c7; }
        :global(.stat-icon.accounts) { background: #fef3c7; color: #d97706; }
        :global(.stat-icon.audits) { background: #f3e8ff; color: #7c3aed; }

        .stat-value {
          font-size: 1.6rem;
          font-weight: 800;
          color: var(--text-primary);
          letter-spacing: -0.5px;
        }

        .stat-indicator {
          font-size: 0.75rem;
          font-weight: 600;
          display: inline-flex;
          width: fit-content;
          padding: 0.15rem 0.5rem;
          border-radius: var(--radius-pill);
        }

        .stat-indicator.positive { background: var(--success-bg); color: var(--success); }
        .stat-indicator.neutral { background: var(--ivory-200); color: var(--text-secondary); }
        .stat-indicator.negative { background: var(--error-bg); color: var(--error); }

        /* Panel */
        .admin-panel {
          background: var(--bg-card);
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-lg);
          border: 1px solid rgba(0, 0, 0, 0.04);
          overflow: hidden;
        }

        .panel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid rgba(0, 0, 0, 0.05);
          background: var(--plum-50);
          flex-wrap: wrap;
          gap: 1rem;
        }

        .panel-tabs {
          display: flex;
          gap: 0.5rem;
        }

        .panel-tab {
          background: transparent;
          border: none;
          padding: 0.6rem 1.2rem;
          font-weight: 600;
          font-size: 0.9rem;
          color: var(--text-muted);
          cursor: pointer;
          border-radius: var(--radius-md);
          transition: all var(--duration);
        }

        .panel-tab:hover {
          background: rgba(0, 0, 0, 0.03);
          color: var(--text-primary);
        }

        .panel-tab.active {
          background: var(--plum-900);
          color: #fff;
          box-shadow: 0 4px 12px rgba(29, 7, 48, 0.2);
        }

        .panel-search {
          position: relative;
          width: 280px;
        }

        :global(.search-icon) {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
        }

        .search-input {
          width: 100%;
          padding: 0.5rem 1rem 0.5rem 2.25rem;
          border-radius: var(--radius-md);
          border: 1px solid var(--ivory-300);
          background: #fff;
          outline: none;
          font-size: 0.875rem;
          transition: all var(--duration);
        }

        .search-input:focus {
          border-color: var(--plum-400);
          box-shadow: 0 0 0 3px rgba(154, 92, 151, 0.1);
        }

        .panel-body {
          padding: 1.5rem;
        }

        /* Tables */
        .table-responsive {
          overflow-x: auto;
        }

        .admin-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          font-size: 0.9rem;
        }

        .admin-table th {
          padding: 0.75rem 1rem;
          font-weight: 700;
          color: var(--text-secondary);
          border-bottom: 2px solid var(--ivory-200);
          text-transform: uppercase;
          font-size: 0.75rem;
          letter-spacing: 0.5px;
        }

        .admin-table td {
          padding: 1rem;
          border-bottom: 1px solid var(--ivory-200);
          color: var(--text-primary);
        }

        .admin-table tr:hover td {
          background: var(--plum-50);
        }

        .text-right {
          text-align: right;
        }

        .text-plum {
          color: var(--plum-700);
        }

        .role-badge {
          font-size: 0.75rem;
          font-weight: 700;
          padding: 0.25rem 0.6rem;
          border-radius: var(--radius-pill);
          text-transform: uppercase;
        }

        .role-badge.admin {
          background: var(--error-bg);
          color: var(--error);
        }

        .role-badge.customer {
          background: var(--success-bg);
          color: var(--success);
        }

        /* Audit Timeline */
        .audit-timeline {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .audit-card {
          background: #fff;
          border: 1px solid var(--ivory-200);
          border-radius: var(--radius-md);
          overflow: hidden;
          transition: all var(--duration) var(--ease-out);
        }

        .audit-card:hover {
          border-color: var(--plum-300);
          box-shadow: var(--shadow-sm);
        }

        .audit-summary {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1.25rem;
          cursor: pointer;
        }

        .audit-main {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .audit-time {
          font-size: 0.8rem;
          color: var(--text-muted);
          font-family: var(--font-mono);
        }

        .audit-event {
          font-weight: 700;
          color: var(--plum-900);
          font-size: 0.95rem;
        }

        .audit-action {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .audit-date-badge {
          font-size: 0.75rem;
          background: var(--ivory-200);
          color: var(--text-secondary);
          padding: 0.15rem 0.5rem;
          border-radius: 4px;
          font-weight: 500;
        }

        :global(.expand-chevron) {
          transition: transform var(--duration);
          color: var(--text-muted);
        }

        .audit-card.expanded :global(.expand-chevron) {
          transform: rotate(90deg);
          color: var(--plum-700);
        }

        .audit-details {
          padding: 1rem 1.25rem 1.25rem;
          border-top: 1px solid var(--ivory-200);
          background: #fafaf9;
        }

        .audit-details h4 {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--text-secondary);
          margin-bottom: 0.5rem;
          text-transform: uppercase;
        }

        .audit-details pre {
          font-size: 0.8rem;
          background: #1d0730;
          color: var(--citrine-400);
          padding: 1rem;
          border-radius: var(--radius-sm);
          overflow-x: auto;
          max-height: 300px;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        @media (max-width: 768px) {
          .admin-header {
            padding: 1.5rem;
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }
          .admin-badge {
            margin-left: 0;
          }
          .admin-body {
            padding: 1.5rem;
          }
          .panel-header {
            flex-direction: column;
            align-items: flex-start;
          }
          .panel-search {
            width: 100%;
          }
          .panel-tabs {
            width: 100%;
            overflow-x: auto;
            padding-bottom: 0.5rem;
          }
        }

        .admin-container {
          min-height: 100vh;
          background: var(--bg-body);
          display: flex;
          flex-direction: column;
        }

        .admin-header-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .admin-logout-btn {
          background: var(--error-bg);
          color: var(--error);
          border: none;
          padding: 0.5rem 1.2rem;
          border-radius: var(--radius-pill);
          font-weight: 600;
          font-size: 0.85rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.4rem;
          transition: all var(--duration);
        }

        .admin-logout-btn:hover {
          background: var(--error);
          color: #fff;
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2);
        }
      `}</style>
    </div>
  )
}
