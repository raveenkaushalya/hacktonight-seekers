'use client'

import type { ButtonHTMLAttributes } from 'react'

type AuthButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean
}

export default function AuthButton({
  className = '',
  type = 'submit',
  loading = false,
  disabled,
  children,
  ...props
}: AuthButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`auth-btn ${className}`}
      {...props}
    >
      {loading ? <span className="auth-btn-spinner" /> : children}

      <style jsx>{`
        .auth-btn {
          height: 64px;
          width: 220px;
          border-radius: 32px;
          background: linear-gradient(135deg, #7a2d78, #450043);
          color: #fff;
          font-size: 1.35rem;
          font-weight: 700;
          letter-spacing: 1px;
          border: none;
          cursor: pointer;
          box-shadow: 0 8px 24px rgba(69, 0, 67, 0.3);
          transition: all 200ms cubic-bezier(0.16, 1, 0.3, 1);
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .auth-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(69, 0, 67, 0.4);
        }

        .auth-btn:active:not(:disabled) {
          transform: translateY(0);
        }

        .auth-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .auth-btn-spinner {
          width: 24px;
          height: 24px;
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </button>
  )
}
