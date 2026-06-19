'use client'

import Image from 'next/image'

import { Bell, ChevronRight, Search } from '../../components/Icons'
import Sidebar from '../../components/sidebar'

type Goal = {
  label: string
  spent: string
  limit: string
  tone: 'good' | 'warn' | 'alert'
}

const goals: Goal[] = [
  {
    label: 'Groceries',
    spent: 'Rs. 12,400',
    limit: 'Rs. 18,000',
    tone: 'good'
  },
  {
    label: 'Dining out',
    spent: 'Rs. 8,900',
    limit: 'Rs. 10,000',
    tone: 'warn'
  },
  { label: 'Transport', spent: 'Rs. 4,100', limit: 'Rs. 4,500', tone: 'alert' }
]

const tips = [
  'Turn on round-up savings for small, automatic deposits.',
  'Set a weekly dining cap before Friday nights start.',
  'Move unused cash into a high-yield pocket after payday.'
]

export default function SmartSpendPage() {
  return (
    <main className="smart-spend">
      <Sidebar />

      <section className="content">
        <header className="header">
          <div>
            <p className="eyebrow">Money habits</p>
            <h1>Smart Spend</h1>
          </div>
          <div className="header-actions">
            <Search size={22} />
            <Bell size={22} />
            <Image
              src="/person-logo.png"
              alt="profile"
              width={40}
              height={40}
              className="avatar"
            />
          </div>
        </header>

        <div className="hero">
          <div>
            <p className="hero-label">This month’s smart target</p>
            <h2>Keep discretionary spending under Rs. 25,000</h2>
            <p className="hero-copy">
              You are on track, but dining and transport are close to their
              limits. The cards below show where to pull back first.
            </p>
          </div>
          <div className="hero-card">
            <span>Budget health</span>
            <strong>82%</strong>
            <div className="meter">
              <span />
            </div>
            <p>Good control across the last 14 days.</p>
          </div>
        </div>

        <div className="grid">
          <div className="panel">
            <h3>Spending goals</h3>
            <div className="goal-list">
              {goals.map((goal) => (
                <div key={goal.label} className={`goal goal-${goal.tone}`}>
                  <div>
                    <strong>{goal.label}</strong>
                    <p>
                      {goal.spent} spent of {goal.limit}
                    </p>
                  </div>
                  <ChevronRight size={18} />
                </div>
              ))}
            </div>
          </div>

          <div className="panel">
            <h3>Smart tips</h3>
            <ul className="tips">
              {tips.map((tip) => (
                <li key={tip}>{tip}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <style jsx>{`
        .smart-spend {
          min-height: 100vh;
          display: flex;
          background: linear-gradient(135deg, #f8f5ef 0%, #eef3f7 100%);
          color: #1f2937;
        }

        .content {
          flex: 1;
          padding: 2rem;
        }

        .header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .eyebrow {
          margin: 0 0 0.25rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          font-size: 0.72rem;
          color: #6b7280;
        }

        .header h1 {
          margin: 0;
          font-size: 2rem;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .avatar {
          border-radius: 999px;
          object-fit: cover;
        }

        .hero {
          display: grid;
          grid-template-columns: 1.6fr 1fr;
          gap: 1.25rem;
          margin-bottom: 1.25rem;
        }

        .hero,
        .panel,
        .hero-card {
          background: rgba(255, 255, 255, 0.88);
          border: 1px solid rgba(31, 41, 55, 0.08);
          border-radius: 24px;
          box-shadow: 0 18px 40px rgba(31, 41, 55, 0.08);
          backdrop-filter: blur(12px);
        }

        .hero {
          padding: 1.5rem;
          align-items: center;
        }

        .hero-label {
          margin: 0 0 0.5rem;
          color: #0f766e;
          font-weight: 700;
        }

        .hero h2 {
          margin: 0 0 0.75rem;
          font-size: 2.1rem;
          line-height: 1.1;
        }

        .hero-copy {
          margin: 0;
          max-width: 60ch;
          color: #4b5563;
        }

        .hero-card {
          padding: 1.25rem;
          background: linear-gradient(180deg, #0f172a 0%, #1e293b 100%);
          color: #f8fafc;
        }

        .hero-card span,
        .hero-card p {
          color: rgba(248, 250, 252, 0.72);
        }

        .hero-card strong {
          display: block;
          margin: 0.5rem 0 0.75rem;
          font-size: 2.5rem;
        }

        .meter {
          height: 10px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.14);
          overflow: hidden;
          margin-bottom: 0.75rem;
        }

        .meter span {
          display: block;
          width: 82%;
          height: 100%;
          border-radius: inherit;
          background: linear-gradient(90deg, #34d399, #fbbf24);
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 1.25rem;
        }

        .panel {
          padding: 1.25rem;
        }

        .panel h3 {
          margin: 0 0 1rem;
          font-size: 1.1rem;
        }

        .goal-list,
        .tips {
          display: grid;
          gap: 0.75rem;
          padding: 0;
          margin: 0;
          list-style: none;
        }

        .goal {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          border-radius: 18px;
          background: #f9fafb;
        }

        .goal strong,
        .goal p {
          margin: 0;
        }

        .goal p,
        .tips li {
          color: #6b7280;
        }

        .goal-good {
          border-left: 4px solid #10b981;
        }

        .goal-warn {
          border-left: 4px solid #f59e0b;
        }

        .goal-alert {
          border-left: 4px solid #ef4444;
        }

        .tips li {
          padding: 0.9rem 1rem;
          border-radius: 16px;
          background: #f9fafb;
          line-height: 1.5;
        }

        @media (max-width: 960px) {
          .smart-spend {
            flex-direction: column;
          }

          .content {
            padding: 1rem;
          }

          .hero,
          .grid {
            grid-template-columns: 1fr;
          }

          .header {
            align-items: flex-start;
            flex-direction: column;
          }
        }
      `}</style>
    </main>
  )
}
