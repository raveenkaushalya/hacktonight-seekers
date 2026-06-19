'use client'

import { useState } from 'react'
import { Bell, Search } from '@/components/Icons'
import Sidebar from '@/components/sidebar'

type Errors = Partial<{
  amount: string
  accountNumber: string
  accountName: string
  bank: string
}>

export default function BankTransferPage() {
  const [amount, setAmount] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [accountName, setAccountName] = useState('')
  const [bank, setBank] = useState('')
  const [description, setDescription] = useState('')
  const [errors, setErrors] = useState<Errors>({})
  const [step, setStep] = useState<'form' | 'confirm' | 'success' | 'failure'>(
    'form'
  )
  const [confirmation, setConfirmation] = useState<string | null>(null)

  function validate() {
    const e: Errors = {}
    if (!amount) e.amount = 'Amount is required'
    else if (Number(amount) <= 0 || isNaN(Number(amount)))
      e.amount = 'Enter a valid positive amount'

    if (!accountNumber) e.accountNumber = 'Account number is required'
    else if (!/^\d{6,}$/.test(accountNumber))
      e.accountNumber = 'Enter a valid account number'

    if (!accountName) e.accountName = 'Account name is required'

    if (!bank) e.bank = 'Select a bank'

    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleNext(e: React.FormEvent) {
    e.preventDefault()
    if (validate()) {
      setStep('confirm')
    }
  }

  async function handleTransfer(e: React.FormEvent) {
    e.preventDefault()
    // In production, this would call POST /api/transfer
    const conf = String(Math.floor(10000000 + Math.random() * 89999999))
    setConfirmation(conf)
    setStep('success')
  }

  function resetForm() {
    setAmount('')
    setAccountNumber('')
    setAccountName('')
    setBank('')
    setDescription('')
    setErrors({})
    setConfirmation(null)
    setStep('form')
  }

  return (
    <div className="page-shell">
      <Sidebar />

      <main className="page-content">
        {/* Header */}
        <header className="transfer-header">
          <h1 className="transfer-title">Bank Transfer</h1>
          <div className="transfer-header-actions">
            <button className="dash-icon-btn" aria-label="Search">
              <Search size={20} />
            </button>
            <button className="dash-icon-btn" aria-label="Notifications">
              <Bell size={20} />
            </button>
            <img
              src="/person-logo.png"
              alt="Profile"
              className="header-avatar"
            />
          </div>
        </header>

        <div className="transfer-container">
          {step === 'form' ? (
            <form
              onSubmit={handleNext}
              className="transfer-card animate-fade-in"
            >
              <h2 className="form-heading">Transfer Details</h2>
              <div className="form-grid">
                <label className="form-label">Amount</label>
                <div className="form-field">
                  <input
                    aria-label="amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="underline-input"
                    placeholder="0.00"
                    type="number"
                    step="0.01"
                  />
                  {errors.amount && (
                    <div className="field-error">{errors.amount}</div>
                  )}
                </div>

                <label className="form-label">Account Number</label>
                <div className="form-field">
                  <input
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    className="underline-input"
                    placeholder="Enter recipient account"
                  />
                  {errors.accountNumber && (
                    <div className="field-error">{errors.accountNumber}</div>
                  )}
                </div>

                <label className="form-label">Account Name</label>
                <div className="form-field">
                  <input
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                    className="underline-input"
                    placeholder="Recipient name"
                  />
                  {errors.accountName && (
                    <div className="field-error">{errors.accountName}</div>
                  )}
                </div>

                <label className="form-label">Select Bank</label>
                <div className="form-field">
                  <select
                    value={bank}
                    onChange={(e) => setBank(e.target.value)}
                    className="underline-input"
                  >
                    <option value="">Choose bank</option>
                    <option>First National</option>
                    <option>Global Trust</option>
                    <option>Union Bank</option>
                    <option>Nova Bank</option>
                  </select>
                  {errors.bank && (
                    <div className="field-error">{errors.bank}</div>
                  )}
                </div>

                <label className="form-label">Description</label>
                <div className="form-field">
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="description-box"
                    placeholder="Optional note"
                  />
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="next-btn">
                  NEXT
                </button>
              </div>
            </form>
          ) : step === 'confirm' ? (
            <div className="transfer-card animate-fade-in">
              <h2 className="form-heading">Confirm Transfer</h2>
              <div className="confirm-panel">
                <div className="confirm-details">
                  <div className="confirm-row">
                    <span className="confirm-label">Amount</span>
                    <span className="confirm-value">Rs. {amount || '0'}</span>
                  </div>
                  <div className="confirm-row">
                    <span className="confirm-label">Recipient</span>
                    <span className="confirm-value">{accountName || '—'}</span>
                  </div>
                  <div className="confirm-row">
                    <span className="confirm-label">Account</span>
                    <span className="confirm-value">{accountNumber}</span>
                  </div>
                  <div className="confirm-row">
                    <span className="confirm-label">Bank</span>
                    <span className="confirm-value">{bank}</span>
                  </div>
                  {description && (
                    <div className="confirm-row">
                      <span className="confirm-label">Note</span>
                      <span className="confirm-value">{description}</span>
                    </div>
                  )}
                </div>

                <p className="confirm-fee">
                  Additional fee of Rs.50 will be charged
                </p>

                <div className="confirm-actions">
                  {/* FIX: BACK goes to 'form', not 'failure' */}
                  <button
                    onClick={() => setStep('form')}
                    className="nova-btn nova-btn-secondary"
                  >
                    BACK
                  </button>
                  <button
                    onClick={handleTransfer}
                    className="nova-btn nova-btn-primary"
                  >
                    TRANSFER
                  </button>
                </div>
              </div>
            </div>
          ) : step === 'success' ? (
            <div className="transfer-card animate-fade-in">
              <div className="status-container">
                <div className="status-icon success">
                  <svg
                    viewBox="0 0 24 24"
                    width="48"
                    height="48"
                    fill="none"
                    stroke="#fff"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                </div>
                <h3 className="status-title">Transfer Successful!</h3>
                <p className="status-subtitle">Confirmation: {confirmation}</p>
                <button
                  onClick={resetForm}
                  className="nova-btn nova-btn-primary"
                >
                  ← BACK TO HOME
                </button>
              </div>
            </div>
          ) : (
            <div className="transfer-card animate-fade-in">
              <div className="status-container">
                <div className="status-icon failed">
                  <svg
                    viewBox="0 0 24 24"
                    width="48"
                    height="48"
                    fill="none"
                    stroke="#fff"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </div>
                <h3 className="status-title">Transaction Failed</h3>
                <p className="status-subtitle">
                  Insufficient balance or an error occurred.
                </p>
                <button
                  onClick={resetForm}
                  className="nova-btn nova-btn-primary"
                >
                  ← TRY AGAIN
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <style jsx>{`
        .transfer-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem 2rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .transfer-title {
          font-size: 1.75rem;
          font-weight: 800;
          color: var(--text-primary);
        }

        .transfer-header-actions {
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

        .header-avatar {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          object-fit: cover;
          box-shadow: var(--shadow-sm);
        }

        .transfer-container {
          padding: 0 2rem 2rem;
          max-width: 800px;
        }

        .form-heading {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 2rem;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 140px 1fr;
          gap: 1.25rem 1.5rem;
          align-items: start;
        }

        .form-label {
          color: var(--text-secondary);
          font-weight: 500;
          font-size: 0.9rem;
          padding-top: 0.6rem;
        }

        .form-field {
          min-width: 0;
        }

        .field-error {
          font-size: 0.78rem;
          color: var(--error);
          margin-top: 0.25rem;
        }

        .form-actions {
          display: flex;
          justify-content: center;
          margin-top: 2.5rem;
        }

        /* Confirm */
        .confirm-panel {
          max-width: 500px;
          margin: 0 auto;
        }

        .confirm-details {
          background: var(--ivory-100);
          border-radius: var(--radius-lg);
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .confirm-row {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
        }

        .confirm-label {
          font-size: 0.85rem;
          color: var(--text-muted);
        }

        .confirm-value {
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .confirm-fee {
          text-align: center;
          font-size: 0.8rem;
          color: var(--text-muted);
          margin-top: 1rem;
        }

        .confirm-actions {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-top: 1.5rem;
        }

        /* Status */
        .status-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 2rem 0;
        }

        .status-icon {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.5rem;
        }

        .status-icon.success {
          background: linear-gradient(135deg, #22c55e, #16a34a);
          box-shadow: 0 8px 24px rgba(34, 197, 94, 0.3);
        }

        .status-icon.failed {
          background: linear-gradient(135deg, #ef4444, #dc2626);
          box-shadow: 0 8px 24px rgba(239, 68, 68, 0.3);
        }

        .status-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 0.5rem;
        }

        .status-subtitle {
          font-size: 0.9rem;
          color: var(--text-muted);
          margin-bottom: 2rem;
        }

        @media (max-width: 640px) {
          .form-grid {
            grid-template-columns: 1fr;
            gap: 0.75rem;
          }
          .transfer-container {
            padding: 0 1rem 1rem;
          }
        }
      `}</style>
    </div>
  )
}
