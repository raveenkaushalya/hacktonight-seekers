'use client'

import Sidebar from '@/components/sidebar'
import { Bell, Search, ChevronRight, TrendingUp } from '@/components/Icons'

const transactions = [
  {
    date: 'Oct 16, 2025',
    account: '......3423',
    amount: '-Rs. 4,500.00',
    type: 'debit'
  },
  {
    date: 'Oct 16, 2025',
    account: '......4876',
    amount: '-Rs. 10,000.00',
    type: 'debit'
  },
  {
    date: 'Oct 16, 2025',
    account: '......6754',
    amount: '+Rs. 9,870.00',
    type: 'credit'
  }
]

const quickActions = [
  { label: 'Transfer', href: '/bank-transfer', emoji: '💸' },
  { label: 'Pay Bills', href: '/pay-bills', emoji: '🧾' },
  { label: 'Statement', href: '/e-statement', emoji: '📄' },
  { label: 'Smart Spend', href: '/smart-spend', emoji: '📊' }
]

export default function Dashboard() {
  return (
    <div className="page-shell">
      <Sidebar />

      <section className="page-content">
        {/* Header */}
        <header className="dash-header">
          <h1 className="dash-title">Dashboard</h1>
          <div className="dash-header-actions">
            <button className="dash-icon-btn" aria-label="Search">
              <Search size={20} />
            </button>
            <button className="dash-icon-btn" aria-label="Notifications">
              <Bell size={20} />
            </button>
            <img src="/person-logo.png" alt="Profile" className="dash-avatar" />
          </div>
        </header>

        {/* Content */}
        <div className="dash-content">
          {/* Welcome + Balance */}
          <div className="dash-grid animate-fade-in">
            <div className="welcome-card">
              <div className="welcome-text">
                <p className="welcome-greeting">Good evening,</p>
                <h2 className="welcome-name">Dilara!</h2>
                <div className="balance-chip">
                  <span className="balance-label">Current Balance</span>
                  <span className="balance-amount">Rs. 100,000</span>
                </div>
              </div>
              <img
                src="/Dashboard-logo.png"
                alt=""
                className="welcome-illustration"
              />
            </div>

            <div className="payees-card">
              <h3 className="card-heading">Saved Payees</h3>
              <div className="payees-list">
                {[1, 2].map((item) => (
                  <div key={item} className="payee-item">
                    <img
                      src="/person-logo.png"
                      alt="Payee"
                      className="payee-avatar"
                    />
                    <div className="payee-info">
                      <p className="payee-name">HKDS Wickramanayake</p>
                      <p className="payee-detail">Nova Bank • Colombo</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="view-all-btn">
                View all <ChevronRight size={14} />
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="quick-actions animate-fade-in-delay-1">
            {quickActions.map((action) => (
              <a
                key={action.label}
                href={action.href}
                className="quick-action-card"
              >
                <span className="quick-action-emoji">{action.emoji}</span>
                <span className="quick-action-label">{action.label}</span>
              </a>
            ))}
          </div>

          {/* Transactions */}
          <div className="transactions-section animate-fade-in-delay-2">
            <div className="section-header">
              <h2 className="section-title">Recent Transactions</h2>
              <button className="view-all-btn">
                View all <ChevronRight size={14} />
              </button>
            </div>

            <div className="transactions-card">
              {transactions.map((t, i) => (
                <div key={i} className="transaction-row">
                  <div className={`transaction-icon ${t.type}`}>
                    <TrendingUp size={16} />
                  </div>
                  <div className="transaction-details">
                    <span className="transaction-label">{t.account}</span>
                    <span className="transaction-date">{t.date}</span>
                  </div>
                  <span className={`transaction-amount ${t.type}`}>
                    {t.amount}
                  </span>
                  <span className="transaction-badge">Success</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .dash-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem 2rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .dash-title {
          font-size: 1.75rem;
          font-weight: 800;
          color: var(--text-primary);
        }

        .dash-header-actions {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .dash-icon-btn {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          border: none;
          background: var(--bg-card);
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: var(--shadow-sm);
          transition: all 200ms;
        }

        .dash-icon-btn:hover {
          box-shadow: var(--shadow-md);
          color: var(--plum-600);
        }

        .dash-avatar {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          object-fit: cover;
          box-shadow: var(--shadow-sm);
        }

        .dash-content {
          padding: 0 2rem 2rem;
        }

        /* Grid */
        .dash-grid {
          display: grid;
          grid-template-columns: 1fr 320px;
          gap: 1.5rem;
        }

        /* Welcome Card */
        .welcome-card {
          background: linear-gradient(135deg, var(--plum-800), var(--plum-900));
          border-radius: var(--radius-xl);
          padding: 2rem;
          position: relative;
          overflow: hidden;
          min-height: 220px;
          display: flex;
          align-items: flex-start;
          color: white;
        }

        .welcome-text {
          position: relative;
          z-index: 1;
        }

        .welcome-greeting {
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.6);
          margin-bottom: 0.25rem;
        }

        .welcome-name {
          font-size: 1.75rem;
          font-weight: 800;
          margin-bottom: 1.25rem;
        }

        .balance-chip {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          padding: 1rem 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .balance-label {
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.6);
        }

        .balance-amount {
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--citrine-400);
          font-variant-numeric: tabular-nums;
        }

        .welcome-illustration {
          position: absolute;
          right: -10px;
          bottom: -10px;
          height: 230px;
          object-fit: contain;
          opacity: 0.9;
        }

        /* Payees Card */
        .payees-card {
          background: var(--bg-card);
          border-radius: var(--radius-xl);
          padding: 1.5rem;
          box-shadow: var(--shadow-md);
          border: 1px solid rgba(0, 0, 0, 0.04);
        }

        .card-heading {
          font-size: 1rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 1.25rem;
        }

        .payees-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .payee-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .payee-avatar {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          object-fit: cover;
        }

        .payee-info {
          flex: 1;
        }

        .payee-name {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .payee-detail {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .view-all-btn {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          background: none;
          border: none;
          color: var(--plum-500);
          font-weight: 600;
          font-size: 0.8rem;
          cursor: pointer;
          margin-top: 1rem;
          margin-left: auto;
          transition: color 200ms;
        }

        .view-all-btn:hover {
          color: var(--plum-700);
        }

        /* Quick Actions */
        .quick-actions {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
          margin-top: 1.5rem;
        }

        .quick-action-card {
          background: var(--bg-card);
          border-radius: var(--radius-lg);
          padding: 1.25rem 1rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          box-shadow: var(--shadow-sm);
          border: 1px solid rgba(0, 0, 0, 0.04);
          text-decoration: none;
          transition: all 200ms var(--ease-out);
        }

        .quick-action-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }

        .quick-action-emoji {
          font-size: 1.5rem;
        }

        .quick-action-label {
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-secondary);
        }

        /* Transactions */
        .transactions-section {
          margin-top: 1.5rem;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .section-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .transactions-card {
          background: var(--bg-card);
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-md);
          border: 1px solid rgba(0, 0, 0, 0.04);
          overflow: hidden;
        }

        .transaction-row {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem 1.5rem;
          transition: background 150ms;
        }

        .transaction-row:hover {
          background: var(--ivory-50);
        }

        .transaction-row:not(:last-child) {
          border-bottom: 1px solid var(--ivory-200);
        }

        .transaction-icon {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .transaction-icon.debit {
          background: var(--error-bg);
          color: var(--error);
        }

        .transaction-icon.credit {
          background: var(--success-bg);
          color: var(--success);
        }

        .transaction-details {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .transaction-label {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .transaction-date {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .transaction-amount {
          font-size: 0.9rem;
          font-weight: 700;
          font-variant-numeric: tabular-nums;
        }

        .transaction-amount.debit {
          color: var(--error);
        }

        .transaction-amount.credit {
          color: var(--success);
        }

        .transaction-badge {
          font-size: 0.7rem;
          font-weight: 600;
          background: var(--success-bg);
          color: var(--success);
          padding: 0.25rem 0.75rem;
          border-radius: var(--radius-pill);
        }

        @media (max-width: 1024px) {
          .dash-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .dash-header {
            padding: 1rem;
          }
          .dash-content {
            padding: 0 1rem 1rem;
          }
          .quick-actions {
            grid-template-columns: repeat(2, 1fr);
          }
          .welcome-illustration {
            height: 160px;
          }
        }

        @media (max-width: 480px) {
          .dash-title {
            font-size: 1.25rem;
          }
          .balance-amount {
            font-size: 1.2rem;
          }
        }
      `}</style>
    </div>
  )
}
