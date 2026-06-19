'use client'

import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { Suspense, useEffect, useState } from 'react'
import { Bell, Search } from '@/components/Icons'
import Sidebar from '@/components/sidebar'

type Screen = 'list' | 'add' | 'edit'

function AccountsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [screen, setScreen] = useState<Screen>('list')

  const isEditMode = searchParams.get('mode') === 'edit'
  const accountNumberParam = searchParams.get('accountNumber') || ''
  const nicknameParam = searchParams.get('nickname') || ''
  const accountNameParam = searchParams.get('accountName') || ''
  const emailParam = searchParams.get('email') || ''

  const [formData, setFormData] = useState({
    accountNumber: '',
    accountName: '',
    email: '',
    nickname: ''
  })

  const [nickname, setNickname] = useState('')

  const [errors, setErrors] = useState({
    accountNumber: '',
    accountName: '',
    email: '',
    nickname: ''
  })

  useEffect(() => {
    if (isEditMode) {
      setFormData({
        accountNumber: accountNumberParam,
        accountName: accountNameParam,
        email: emailParam,
        nickname: nicknameParam
      })
      setNickname(nicknameParam || accountNameParam)
      setScreen('edit')
    }
  }, [
    isEditMode,
    accountNumberParam,
    accountNameParam,
    emailParam,
    nicknameParam
  ])

  const validateField = (name: string, value: string) => {
    let error = ''
    switch (name) {
      case 'accountNumber':
        if (!value.trim()) error = 'Account number is required'
        else if (!/^\d+$/.test(value)) error = 'Must contain only numbers'
        else if (value.length < 8 || value.length > 20)
          error = 'Must be 8–20 digits'
        break
      case 'accountName':
        if (!value.trim()) error = 'Account name is required'
        else if (value.trim().length < 2) error = 'At least 2 characters'
        break
      case 'email':
        if (!value.trim()) error = 'Email is required'
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          error = 'Invalid email'
        break
      case 'nickname':
        if (!value.trim()) error = 'Nickname is required'
        else if (value.trim().length < 2) error = 'At least 2 characters'
        break
    }
    return error
  }

  const validateForm = () => {
    const newErrors = {
      accountNumber: validateField('accountNumber', formData.accountNumber),
      accountName: validateField('accountName', formData.accountName),
      email: validateField('email', formData.email),
      nickname: validateField('nickname', formData.nickname)
    }
    setErrors(newErrors)
    return !Object.values(newErrors).some((e) => e !== '')
  }

  const resetForm = () => {
    setFormData({ accountNumber: '', accountName: '', email: '', nickname: '' })
    setNickname('')
    setErrors({ accountNumber: '', accountName: '', email: '', nickname: '' })
  }

  const goToList = () => {
    resetForm()
    setScreen('list')
    router.push('/bank-accounts')
  }
  const goToAdd = () => {
    resetForm()
    setScreen('add')
  }
  const goToEdit = () => {
    setScreen('edit')
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }))
  }

  const handleAddAccount = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return
    alert('Account added successfully!')
    goToList()
  }

  const handleEditNickname = (e: React.FormEvent) => {
    e.preventDefault()
    if (!nickname.trim() || nickname.trim().length < 2) {
      alert('Nickname must be at least 2 characters')
      return
    }
    alert(`Nickname updated to: ${nickname}`)
    goToList()
  }

  return (
    <>
      {/* Header */}
      <header className="acct-header">
        <h1 className="acct-title">Accounts</h1>
        <div className="acct-header-actions">
          <button className="acct-icon-btn" aria-label="Search">
            <Search size={20} />
          </button>
          <button className="acct-icon-btn" aria-label="Notifications">
            <Bell size={20} />
          </button>
          <Image
            src="/person-logo.png"
            alt="Profile"
            width={40}
            height={40}
            className="acct-avatar"
          />
        </div>
      </header>

      <div className="acct-body">
        {/* LIST */}
        {screen === 'list' && (
          <div className="acct-cards animate-fade-in">
            <div
              className="acct-card"
              onClick={goToEdit}
              role="button"
              tabIndex={0}
            >
              <div className="acct-card-avatar">
                <Image
                  src="/account-logo.png"
                  alt="profile"
                  width={80}
                  height={80}
                  style={{ objectFit: 'cover', borderRadius: '50%' }}
                />
              </div>
              <div className="acct-card-info">
                <h2 className="acct-card-name">Anura</h2>
                <p className="acct-card-detail">Nova Bank • Colombo 05</p>
              </div>
              <span className="acct-card-edit">Edit ✏️</span>
            </div>

            <button className="acct-add-card" onClick={goToAdd}>
              <span className="acct-add-icon">+</span>
              <span className="acct-add-label">Add Bank Account</span>
            </button>
          </div>
        )}

        {/* ADD */}
        {screen === 'add' && (
          <div className="acct-form-wrapper animate-fade-in">
            <div className="nova-card" style={{ padding: '2rem' }}>
              <h2 className="form-heading">Add Another Bank Account</h2>
              <form onSubmit={handleAddAccount} className="acct-form">
                {(
                  ['accountNumber', 'accountName', 'email', 'nickname'] as const
                ).map((field) => (
                  <div key={field} className="acct-form-group">
                    <label className="nova-label" htmlFor={field}>
                      {field === 'accountNumber'
                        ? 'Account Number'
                        : field === 'accountName'
                          ? 'Account Name'
                          : field === 'email'
                            ? 'Email'
                            : 'Nickname'}
                    </label>
                    <input
                      id={field}
                      name={field}
                      value={formData[field]}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`nova-input ${errors[field] ? 'nova-input-error' : ''}`}
                      placeholder={`Enter ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`}
                    />
                    {errors[field] && (
                      <span className="field-err">{errors[field]}</span>
                    )}
                  </div>
                ))}
                <div className="acct-form-actions">
                  <button
                    type="button"
                    className="nova-btn nova-btn-secondary"
                    onClick={goToList}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="nova-btn nova-btn-primary">
                    Add Account
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* EDIT */}
        {screen === 'edit' && (
          <div className="acct-form-wrapper animate-fade-in">
            <div className="nova-card" style={{ padding: '2rem' }}>
              <h2 className="form-heading">Edit Nickname</h2>
              <form onSubmit={handleEditNickname} className="acct-form">
                <div className="acct-form-group">
                  <label className="nova-label">Account Number</label>
                  <input
                    value={formData.accountNumber || '1234567890'}
                    disabled
                    className="nova-input"
                    style={{ opacity: 0.6, cursor: 'not-allowed' }}
                  />
                </div>
                <div className="acct-form-group">
                  <label className="nova-label" htmlFor="edit-nickname">
                    Nickname
                  </label>
                  <input
                    id="edit-nickname"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    className="nova-input"
                    placeholder="Enter new nickname"
                  />
                </div>
                <div className="acct-form-actions">
                  <button
                    type="button"
                    className="nova-btn nova-btn-secondary"
                    onClick={goToList}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="nova-btn nova-btn-primary">
                    UPDATE
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .acct-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem 2rem;
          flex-wrap: wrap;
          gap: 1rem;
        }
        .acct-title {
          font-size: 1.75rem;
          font-weight: 800;
          color: var(--text-primary);
        }
        .acct-header-actions {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .acct-icon-btn {
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
        .acct-icon-btn:hover {
          box-shadow: var(--shadow-md);
          color: var(--plum-600);
        }
        .acct-avatar {
          border-radius: 12px !important;
          box-shadow: var(--shadow-sm);
        }
        .acct-body {
          padding: 0 2rem 2rem;
        }

        /* Cards */
        .acct-cards {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
          margin-top: 1rem;
        }
        .acct-card {
          width: 520px;
          max-width: 100%;
          background: var(--bg-card);
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-md);
          border: 2px solid var(--plum-200);
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1.25rem;
          cursor: pointer;
          transition: all 200ms var(--ease-out);
        }
        .acct-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-lg);
          border-color: var(--plum-400);
        }
        .acct-card-avatar {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          overflow: hidden;
          flex-shrink: 0;
        }
        .acct-card-info {
          flex: 1;
        }
        .acct-card-name {
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--text-primary);
        }
        .acct-card-detail {
          font-size: 0.8rem;
          color: var(--text-muted);
          margin-top: 0.25rem;
        }
        .acct-card-edit {
          font-size: 0.8rem;
          color: var(--plum-500);
          font-weight: 600;
        }

        .acct-add-card {
          width: 520px;
          max-width: 100%;
          height: 120px;
          background: var(--bg-card);
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-sm);
          border: 2px dashed var(--ivory-300);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          cursor: pointer;
          transition: all 200ms var(--ease-out);
          font-family: inherit;
        }
        .acct-add-card:hover {
          border-color: var(--plum-300);
          box-shadow: var(--shadow-md);
          transform: translateY(-2px);
        }
        .acct-add-icon {
          font-size: 2rem;
          color: var(--plum-400);
          font-weight: 300;
          line-height: 1;
        }
        .acct-add-label {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-secondary);
        }

        /* Form */
        .acct-form-wrapper {
          max-width: 600px;
          margin: 1rem auto 0;
        }
        .form-heading {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--ivory-200);
        }
        .acct-form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .acct-form-group {
          display: flex;
          flex-direction: column;
        }
        .field-err {
          font-size: 0.75rem;
          color: var(--error);
          margin-top: 0.25rem;
        }
        .acct-form-actions {
          display: flex;
          gap: 0.75rem;
          justify-content: flex-end;
          margin-top: 0.5rem;
          padding-top: 1rem;
          border-top: 1px solid var(--ivory-200);
        }

        @media (max-width: 768px) {
          .acct-body {
            padding: 0 1rem 1rem;
          }
        }
      `}</style>
    </>
  )
}

// Wrap with Suspense boundary for useSearchParams (Next.js App Router requirement)
export default function AccountsPage() {
  return (
    <div className="page-shell">
      <Sidebar />
      <section className="page-content">
        <Suspense
          fallback={
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh'
              }}
            >
              <p style={{ color: 'var(--text-muted)' }}>Loading accounts...</p>
            </div>
          }
        >
          <AccountsContent />
        </Suspense>
      </section>
    </div>
  )
}
