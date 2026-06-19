'use client'

import { useState } from 'react'
import Sidebar from '@/components/sidebar'
import { Search, Bell } from '@/components/Icons'

export default function EStatementPage() {
  const [accountNumber, setAccountNumber] = useState('')

  // Mock data — in production, this would fetch from /api/transactions
  const mockStatement =
    accountNumber.length >= 6
      ? {
          holder: 'Dilara Perera',
          account: accountNumber,
          period: 'Oct 1, 2025 — Oct 31, 2025',
          branch: 'Colombo 05',
          opening: '142,000.00',
          credits: '9,870.00',
          debits: '14,500.00',
          closing: '137,370.00',
          transactions: [
            {
              date: 'Oct 05',
              desc: 'Lunch money',
              ref: 'TXN001',
              debit: '4,500.00',
              credit: '',
              balance: '137,500.00'
            },
            {
              date: 'Oct 12',
              desc: 'Totally normal fee',
              ref: 'TXN002',
              debit: '10,000.00',
              credit: '',
              balance: '127,500.00'
            },
            {
              date: 'Oct 20',
              desc: 'Refund maybe',
              ref: 'TXN003',
              debit: '',
              credit: '9,870.00',
              balance: '137,370.00'
            }
          ]
        }
      : null

  return (
    <div className="page-shell">
      <Sidebar />

      <main className="page-content">
        <header className="es-header">
          <h1 className="es-title">E-Statement</h1>
          <div className="es-header-actions">
            <button className="es-icon-btn" aria-label="Search">
              <Search size={20} />
            </button>
            <button className="es-icon-btn" aria-label="Notifications">
              <Bell size={20} />
            </button>
            <img src="/person-logo.png" alt="Profile" className="es-avatar" />
          </div>
        </header>

        <div className="es-body">
          {/* Account Input */}
          <div className="nova-card es-input-card animate-fade-in">
            <form
              onSubmit={(e) => e.preventDefault()}
              className="es-input-form"
            >
              <label htmlFor="statement-account" className="es-input-label">
                Enter account number:
              </label>
              <input
                id="statement-account"
                inputMode="numeric"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="nova-input es-account-input"
                placeholder="e.g. 1000003423"
              />
            </form>
          </div>

          {/* Statement Preview */}
          <div className="es-statement animate-fade-in-delay-1">
            <div className="es-statement-inner">
              {/* Bank Logo & Info */}
              <div className="es-bank-header">
                <img
                  src="/loginlogo.png"
                  alt="Nova Bank"
                  className="es-bank-logo"
                />
                <div>
                  <h2 className="es-bank-name">Nova Bank</h2>
                  <p className="es-bank-sub">Bank Statement</p>
                </div>
              </div>

              {mockStatement ? (
                <>
                  {/* Account Details */}
                  <div className="es-details">
                    <div className="es-detail-row">
                      <span className="es-detail-label">Account Holder:</span>
                      <span className="es-detail-value">
                        {mockStatement.holder}
                      </span>
                    </div>
                    <div className="es-detail-row">
                      <span className="es-detail-label">Account Number:</span>
                      <span className="es-detail-value">
                        {mockStatement.account}
                      </span>
                    </div>
                    <div className="es-detail-row">
                      <span className="es-detail-label">Statement Period:</span>
                      <span className="es-detail-value">
                        {mockStatement.period}
                      </span>
                    </div>
                    <div className="es-detail-row">
                      <span className="es-detail-label">Branch:</span>
                      <span className="es-detail-value">
                        {mockStatement.branch}
                      </span>
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="es-summary">
                    <h3 className="es-section-heading">Account Summary</h3>
                    <div className="es-summary-grid">
                      <div className="es-summary-item">
                        <span className="es-summary-label">
                          Opening Balance
                        </span>
                        <span className="es-summary-value">
                          Rs. {mockStatement.opening}
                        </span>
                      </div>
                      <div className="es-summary-item">
                        <span className="es-summary-label">Total Credits</span>
                        <span className="es-summary-value credit">
                          +Rs. {mockStatement.credits}
                        </span>
                      </div>
                      <div className="es-summary-item">
                        <span className="es-summary-label">Total Debits</span>
                        <span className="es-summary-value debit">
                          -Rs. {mockStatement.debits}
                        </span>
                      </div>
                      <div className="es-summary-item">
                        <span className="es-summary-label">
                          Closing Balance
                        </span>
                        <span className="es-summary-value">
                          Rs. {mockStatement.closing}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Transactions Table */}
                  <div className="es-transactions">
                    <h3 className="es-section-heading">Transaction Details</h3>
                    <div className="es-table-wrapper">
                      <table className="es-table">
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>Description</th>
                            <th>Reference</th>
                            <th>Debit (-)</th>
                            <th>Credit (+)</th>
                            <th>Balance</th>
                          </tr>
                        </thead>
                        <tbody>
                          {mockStatement.transactions.map((t, i) => (
                            <tr key={i}>
                              <td>{t.date}</td>
                              <td>{t.desc}</td>
                              <td className="es-ref">{t.ref}</td>
                              <td className="debit">
                                {t.debit ? `Rs. ${t.debit}` : '—'}
                              </td>
                              <td className="credit">
                                {t.credit ? `Rs. ${t.credit}` : '—'}
                              </td>
                              <td>Rs. {t.balance}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              ) : (
                <div className="es-empty">
                  <p>Enter an account number above to view the statement</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`
        .es-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem 2rem;
          flex-wrap: wrap;
          gap: 1rem;
        }
        .es-title {
          font-size: 1.75rem;
          font-weight: 800;
          color: var(--text-primary);
        }
        .es-header-actions {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .es-icon-btn {
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
        .es-icon-btn:hover { box-shadow: var(--shadow-md); }
        .es-avatar {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          object-fit: cover;
          box-shadow: var(--shadow-sm);
        }

        .es-body {
          padding: 0 2rem 2rem;
        }
        .es-input-card {
          padding: 1.5rem 2rem;
          margin-bottom: 1.5rem;
        }
        .es-input-form {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          flex-wrap: wrap;
        }
        .es-input-label {
          font-weight: 600;
          color: var(--text-primary);
          white-space: nowrap;
        }
        .es-account-input {
          max-width: 300px;
        }

        /* Statement */
        .es-statement {
          background: var(--ivory-50);
          border-radius: var(--radius-xl);
          border: 1px solid var(--ivory-200);
          overflow: hidden;
        }
        .es-statement-inner {
          padding: 2rem;
        }
        .es-bank-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 2rem;
          padding-bottom: 1.5rem;
          border-bottom: 2px solid var(--ivory-200);
        }
        .es-bank-logo {
          width: 56px;
          height: 56px;
          border-radius: 14px;
          object-fit: cover;
        }
        .es-bank-name {
          font-size: 1.1rem;
          font-weight: 800;
          color: var(--text-primary);
        }
        .es-bank-sub {
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        .es-details {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.75rem;
          margin-bottom: 2rem;
        }
        .es-detail-row {
          display: flex;
          flex-direction: column;
        }
        .es-detail-label {
          font-size: 0.75rem;
          color: var(--text-muted);
          font-weight: 500;
        }
        .es-detail-value {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .es-section-heading {
          font-size: 0.9rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 1rem;
        }

        .es-summary {
          margin-bottom: 2rem;
          padding-top: 1.5rem;
          border-top: 1px solid var(--ivory-200);
        }
        .es-summary-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
        }
        .es-summary-item {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        .es-summary-label {
          font-size: 0.75rem;
          color: var(--text-muted);
        }
        .es-summary-value {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text-primary);
          font-variant-numeric: tabular-nums;
        }
        .es-summary-value.credit { color: var(--success); }
        .es-summary-value.debit { color: var(--error); }

        .es-transactions {
          padding-top: 1.5rem;
          border-top: 1px solid var(--ivory-200);
        }
        .es-table-wrapper {
          overflow-x: auto;
        }
        .es-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.85rem;
        }
        .es-table th {
          text-align: left;
          padding: 0.75rem 0.5rem;
          font-weight: 600;
          color: var(--text-secondary);
          border-bottom: 2px solid var(--ivory-300);
          white-space: nowrap;
        }
        .es-table td {
          padding: 0.75rem 0.5rem;
          color: var(--text-primary);
          border-bottom: 1px solid var(--ivory-200);
          font-variant-numeric: tabular-nums;
        }
        .es-table .debit { color: var(--error); }
        .es-table .credit { color: var(--success); }
        .es-ref { font-family: var(--font-mono, monospace); font-size: 0.8rem; color: var(--text-muted); }

        .es-empty {
          min-height: 300px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-muted);
          font-size: 0.9rem;
        }

        @media (max-width: 768px) {
          .es-body { padding: 0 1rem 1rem; }
          .es-details { grid-template-columns: 1fr; }
          .es-summary-grid { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>
    </div>
  )
}
