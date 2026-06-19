'use client'

import { useState } from 'react'
import Image from 'next/image'
import Sidebar from '@/components/sidebar'
import {
  Search,
  Bell,
  CheckCircle2,
  AlertTriangle,
  ChevronLeft
} from '@/components/Icons'

type Biller = {
  id: string
  name: string
  logo: string
}

const billers: Biller[] = [
  { id: 'water', name: 'Water Board', logo: '/billers/water-board.png' },
  { id: 'cable', name: 'Cable TV', logo: '/billers/cable-tv.png' },
  { id: 'ceb', name: 'CEB', logo: '/billers/ceb.png' },
  { id: 'airtel', name: 'Airtel', logo: '/billers/airtel.png' },
  { id: 'dialog', name: 'Dialog', logo: '/billers/dialog.png' },
  { id: 'slt', name: 'Sri Lanka Telecom', logo: '/billers/ceb.png' },
  { id: 'peotv', name: 'PEO TV', logo: '/billers/cable-tv.png' },
  { id: 'hutch', name: 'Hutch', logo: '/billers/hutch.png' },
  { id: 'aia', name: 'AIA', logo: '/billers/aia.png' },
  { id: 'lolc', name: 'LOLC', logo: '/billers/lolc.png' },
  { id: 'insurance2', name: 'Insurance', logo: '/billers/insurance2.png' },
  { id: 'hsbc', name: 'HSBC', logo: '/billers/hsbc.png' }
]

type Screen = 'select' | 'form' | 'success' | 'failed'
const MOCK_BALANCE = 5000

type FormErrors = {
  accountNumber?: string
  billId?: string
  dueAmount?: string
}

export default function PayBillsPage() {
  const [screen, setScreen] = useState<Screen>('select')
  const [selectedBiller, setSelectedBiller] = useState<Biller | null>(null)
  const [accountNumber, setAccountNumber] = useState('')
  const [billId, setBillId] = useState('')
  const [dueAmount, setDueAmount] = useState('')
  const [remarks, setRemarks] = useState('')
  const [confirmationNumber, setConfirmationNumber] = useState('')
  const [failReason, setFailReason] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})

  function handleSelectBiller(biller: Biller) {
    setSelectedBiller(biller)
    setErrors({})
    setScreen('form')
  }

  function validateForm(): boolean {
    const newErrors: FormErrors = {}
    if (!accountNumber.trim())
      newErrors.accountNumber = 'Account number is required'
    else if (!/^[0-9]{6,16}$/.test(accountNumber.trim()))
      newErrors.accountNumber = 'Enter a valid account number (6–16 digits)'
    if (!billId.trim()) newErrors.billId = 'Bill ID is required'
    else if (billId.trim().length < 3)
      newErrors.billId = 'Bill ID looks too short'
    if (!dueAmount.trim()) newErrors.dueAmount = 'Due amount is required'
    else {
      const amount = Number(dueAmount)
      if (Number.isNaN(amount) || amount <= 0)
        newErrors.dueAmount = 'Enter a valid amount greater than 0'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  function handlePayNow() {
    if (!validateForm()) return
    const amount = Number(dueAmount)
    if (amount > MOCK_BALANCE) {
      setFailReason(
        `Insufficient Balance\nCurrent Balance is: Rs.${MOCK_BALANCE}`
      )
      setScreen('failed')
      return
    }
    setConfirmationNumber(
      Math.floor(10000000 + Math.random() * 90000000).toString()
    )
    setScreen('success')
  }

  function resetToHome() {
    setScreen('select')
    setSelectedBiller(null)
    setAccountNumber('')
    setBillId('')
    setDueAmount('')
    setRemarks('')
    setErrors({})
  }

  return (
    <div className="page-shell">
      <Sidebar />

      <div className="page-content">
        <header className="pb-topbar">
          <h1>Pay Bills</h1>
          <div className="pb-topbar-icons">
            <button className="pb-icon-btn" aria-label="Search">
              <Search size={20} />
            </button>
            <button className="pb-icon-btn" aria-label="Notifications">
              <Bell size={20} />
            </button>
            <Image
              src="/person-logo.png"
              alt="Profile"
              width={36}
              height={36}
              className="pb-avatar"
            />
          </div>
        </header>

        <main className="pb-main">
          <div className="pb-card-wrapper">
            {screen === 'select' && (
              <div className="nova-card pb-card animate-fade-in">
                <h2 className="pb-section-title">Select a Biller</h2>
                <div className="pb-biller-grid">
                  {billers.map((biller) => (
                    <button
                      key={biller.id}
                      onClick={() => handleSelectBiller(biller)}
                      className="pb-biller-btn"
                    >
                      <div className="pb-biller-icon">
                        <Image
                          src={biller.logo}
                          alt={biller.name}
                          width={40}
                          height={40}
                          style={{ objectFit: 'contain' }}
                        />
                      </div>
                      <span className="pb-biller-name">{biller.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {screen === 'form' && selectedBiller && (
              <div className="nova-card pb-card animate-fade-in">
                <button
                  className="pb-back-btn"
                  onClick={() => setScreen('select')}
                >
                  <ChevronLeft size={16} /> Back to billers
                </button>

                <div className="pb-biller-header">
                  <div className="pb-biller-icon small">
                    <Image
                      src={selectedBiller.logo}
                      alt={selectedBiller.name}
                      width={28}
                      height={28}
                      style={{ objectFit: 'contain' }}
                    />
                  </div>
                  <span className="pb-biller-header-name">
                    {selectedBiller.name}
                  </span>
                </div>

                <div className="pb-field">
                  <label className="nova-label">Account Number</label>
                  <input
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    placeholder="Enter account number"
                    className={`nova-input ${errors.accountNumber ? 'nova-input-error' : ''}`}
                  />
                  {errors.accountNumber && (
                    <span className="pb-error">{errors.accountNumber}</span>
                  )}
                </div>

                <div className="pb-field">
                  <label className="nova-label">Bill ID</label>
                  <input
                    value={billId}
                    onChange={(e) => setBillId(e.target.value)}
                    placeholder="Enter bill ID"
                    className={`nova-input ${errors.billId ? 'nova-input-error' : ''}`}
                  />
                  {errors.billId && (
                    <span className="pb-error">{errors.billId}</span>
                  )}
                </div>

                <div className="pb-field">
                  <label className="nova-label">Due Amount</label>
                  <input
                    type="number"
                    value={dueAmount}
                    onChange={(e) => setDueAmount(e.target.value)}
                    placeholder="0.00"
                    className={`nova-input ${errors.dueAmount ? 'nova-input-error' : ''}`}
                  />
                  {errors.dueAmount && (
                    <span className="pb-error">{errors.dueAmount}</span>
                  )}
                </div>

                <div className="pb-field">
                  <label className="nova-label">Remarks</label>
                  <input
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="Optional"
                    className="nova-input"
                  />
                </div>

                <button
                  className="nova-btn nova-btn-primary pb-pay-btn"
                  onClick={handlePayNow}
                >
                  PAY NOW
                </button>
              </div>
            )}

            {screen === 'success' && (
              <div className="nova-card pb-card pb-status-card animate-fade-in">
                <div className="pb-status-circle success">
                  <CheckCircle2 size={48} />
                </div>
                <h2>Payment Successful!</h2>
                <p className="pb-status-sub">
                  Confirmation: {confirmationNumber}
                </p>
                <button
                  className="nova-btn nova-btn-primary"
                  onClick={resetToHome}
                >
                  <ChevronLeft size={16} /> BACK TO HOME
                </button>
              </div>
            )}

            {screen === 'failed' && (
              <div className="nova-card pb-card pb-status-card animate-fade-in">
                <div className="pb-status-circle failed">
                  <AlertTriangle size={48} />
                </div>
                <h2>Payment Failed</h2>
                <p className="pb-status-sub">{failReason}</p>
                <button
                  className="nova-btn nova-btn-primary"
                  onClick={resetToHome}
                >
                  <ChevronLeft size={16} /> BACK TO HOME
                </button>
              </div>
            )}
          </div>
        </main>
      </div>

      <style jsx>{`
        .pb-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.5rem 2rem;
        }
        .pb-topbar h1 {
          font-size: 1.75rem;
          font-weight: 800;
          color: var(--text-primary);
        }
        .pb-topbar-icons {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .pb-icon-btn {
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
        .pb-icon-btn:hover {
          box-shadow: var(--shadow-md);
        }
        .pb-avatar {
          border-radius: 12px !important;
          box-shadow: var(--shadow-sm);
        }

        .pb-main {
          flex: 1;
          display: flex;
          justify-content: center;
          padding: 0 2rem 2rem;
        }
        .pb-card-wrapper {
          width: 100%;
          max-width: 720px;
        }
        .pb-card {
          padding: 2rem;
        }
        .pb-section-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 1.5rem;
        }

        .pb-biller-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
        }
        .pb-biller-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          background: none;
          border: none;
          cursor: pointer;
          transition: transform 200ms var(--ease-out);
        }
        .pb-biller-btn:hover {
          transform: translateY(-3px);
        }
        .pb-biller-icon {
          width: 64px;
          height: 64px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--ivory-100);
          border: 1px solid var(--ivory-200);
          transition: box-shadow 200ms;
        }
        .pb-biller-icon.small {
          width: 44px;
          height: 44px;
          border-radius: 12px;
        }
        .pb-biller-btn:hover .pb-biller-icon {
          box-shadow: var(--shadow-md);
        }
        .pb-biller-name {
          font-size: 0.78rem;
          color: var(--text-secondary);
          text-align: center;
          font-weight: 500;
          line-height: 1.2;
        }

        .pb-back-btn {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          background: none;
          border: none;
          color: var(--text-muted);
          font-size: 0.85rem;
          cursor: pointer;
          margin-bottom: 1.5rem;
          transition: color 200ms;
        }
        .pb-back-btn:hover {
          color: var(--text-secondary);
        }
        .pb-biller-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1.75rem;
        }
        .pb-biller-header-name {
          font-weight: 700;
          font-size: 1.05rem;
          color: var(--text-primary);
        }

        .pb-field {
          margin-bottom: 1.25rem;
        }
        .pb-error {
          font-size: 0.75rem;
          color: var(--error);
          margin-top: 0.25rem;
          display: block;
        }
        .pb-pay-btn {
          width: 100%;
          margin-top: 1.5rem;
          padding: 1rem;
        }

        /* Status */
        .pb-status-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 3rem 2rem;
        }
        .pb-status-circle {
          width: 96px;
          height: 96px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.5rem;
        }
        .pb-status-circle.success {
          background: var(--success-bg);
          color: var(--success);
        }
        .pb-status-circle.failed {
          background: var(--error-bg);
          color: var(--error);
        }
        .pb-status-card h2 {
          font-size: 1.35rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 0.5rem;
        }
        .pb-status-sub {
          font-size: 0.85rem;
          color: var(--text-muted);
          margin-bottom: 2rem;
          white-space: pre-line;
        }

        @media (max-width: 640px) {
          .pb-biller-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 1rem;
          }
        }
      `}</style>
    </div>
  )
}
