'use client'

import { useState } from 'react'
import { Bell, Search, TrendingUp } from '@/components/Icons'
import Sidebar from '@/components/sidebar'

const categories = [
  { name: 'Food & Dining', amount: 12500, color: '#ef4444', percent: 32 },
  { name: 'Transport', amount: 5800, color: '#f59e0b', percent: 15 },
  { name: 'Utilities', amount: 8200, color: '#3b82f6', percent: 21 },
  { name: 'Entertainment', amount: 3400, color: '#8b5cf6', percent: 9 },
  { name: 'Shopping', amount: 6100, color: '#ec4899', percent: 16 },
  { name: 'Other', amount: 2800, color: '#6b7280', percent: 7 }
]

const monthlySpending = [
  { month: 'Jun', amount: 35200 },
  { month: 'Jul', amount: 41500 },
  { month: 'Aug', amount: 38100 },
  { month: 'Sep', amount: 29800 },
  { month: 'Oct', amount: 38800 },
  { month: 'Nov', amount: 33600 }
]

const maxSpending = Math.max(...monthlySpending.map((m) => m.amount))

const tips = [
  {
    emoji: '💡',
    title: 'Save on dining',
    desc: 'You spent 32% on food this month. Try meal prepping to save Rs. 5,000+.'
  },
  {
    emoji: '🚌',
    title: 'Transport savings',
    desc: 'Consider carpooling — you could save up to Rs. 2,400 monthly.'
  },
  {
    emoji: '📊',
    title: 'Budget alert',
    desc: 'Your entertainment spending is within the recommended range. Great job!'
  }
]

export default function SmartSpendPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('This Month')
  const totalSpent = categories.reduce((sum, c) => sum + c.amount, 0)

  return (
    <div className="page-shell">
      <Sidebar />

      <main className="page-content">
        <header className="ss-header">
          <h1 className="ss-title">Smart Spend</h1>
          <div className="ss-header-actions">
            <button className="ss-icon-btn" aria-label="Search">
              <Search size={20} />
            </button>
            <button className="ss-icon-btn" aria-label="Notifications">
              <Bell size={20} />
            </button>
            <img src="/person-logo.png" alt="Profile" className="ss-avatar" />
          </div>
        </header>

        <div className="ss-body">
          {/* Period Selector */}
          <div className="ss-period-bar animate-fade-in">
            {['This Week', 'This Month', 'Last 3 Months'].map((p) => (
              <button
                key={p}
                className={`ss-period-btn ${selectedPeriod === p ? 'active' : ''}`}
                onClick={() => setSelectedPeriod(p)}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Stats Cards */}
          <div className="ss-stats animate-fade-in-delay-1">
            <div className="ss-stat-card">
              <span className="ss-stat-label">Total Spent</span>
              <span className="ss-stat-value">
                Rs. {totalSpent.toLocaleString()}
              </span>
            </div>
            <div className="ss-stat-card">
              <span className="ss-stat-label">Budget Remaining</span>
              <span className="ss-stat-value positive">
                Rs. {(50000 - totalSpent).toLocaleString()}
              </span>
            </div>
            <div className="ss-stat-card">
              <span className="ss-stat-label">Savings Goal</span>
              <span className="ss-stat-value">72%</span>
              <div className="ss-progress-bar">
                <div className="ss-progress-fill" style={{ width: '72%' }} />
              </div>
            </div>
          </div>

          <div className="ss-grid">
            {/* Spending by Category */}
            <div className="nova-card ss-card animate-fade-in-delay-2">
              <h2 className="ss-card-heading">Spending by Category</h2>
              <div className="ss-categories">
                {categories.map((cat) => (
                  <div key={cat.name} className="ss-category">
                    <div className="ss-cat-info">
                      <span
                        className="ss-cat-dot"
                        style={{ background: cat.color }}
                      />
                      <span className="ss-cat-name">{cat.name}</span>
                    </div>
                    <div className="ss-cat-right">
                      <div className="ss-cat-bar-wrapper">
                        <div
                          className="ss-cat-bar"
                          style={{
                            width: `${cat.percent}%`,
                            background: cat.color
                          }}
                        />
                      </div>
                      <span className="ss-cat-amount">
                        Rs. {cat.amount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Monthly Trend */}
            <div className="nova-card ss-card animate-fade-in-delay-3">
              <h2 className="ss-card-heading">Monthly Trend</h2>
              <div className="ss-chart">
                {monthlySpending.map((m) => (
                  <div key={m.month} className="ss-chart-col">
                    <div className="ss-chart-bar-wrapper">
                      <div
                        className="ss-chart-bar"
                        style={{ height: `${(m.amount / maxSpending) * 100}%` }}
                      />
                    </div>
                    <span className="ss-chart-label">{m.month}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Smart Tips */}
          <div className="ss-tips animate-fade-in-delay-3">
            <h2 className="ss-section-title">
              <TrendingUp size={20} /> Smart Tips
            </h2>
            <div className="ss-tips-grid">
              {tips.map((tip) => (
                <div key={tip.title} className="nova-card ss-tip-card">
                  <span className="ss-tip-emoji">{tip.emoji}</span>
                  <h3 className="ss-tip-title">{tip.title}</h3>
                  <p className="ss-tip-desc">{tip.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`
        .ss-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem 2rem;
          flex-wrap: wrap;
          gap: 1rem;
        }
        .ss-title {
          font-size: 1.75rem;
          font-weight: 800;
          color: var(--text-primary);
        }
        .ss-header-actions {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .ss-icon-btn {
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
        .ss-icon-btn:hover { box-shadow: var(--shadow-md); }
        .ss-avatar {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          object-fit: cover;
          box-shadow: var(--shadow-sm);
        }
        .ss-body {
          padding: 0 2rem 2rem;
        }

        /* Period */
        .ss-period-bar {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
        }
        .ss-period-btn {
          padding: 0.5rem 1.25rem;
          border-radius: var(--radius-pill);
          border: 1.5px solid var(--ivory-300);
          background: transparent;
          color: var(--text-secondary);
          font-weight: 600;
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 200ms var(--ease-out);
        }
        .ss-period-btn.active {
          background: linear-gradient(135deg, var(--plum-500), var(--plum-700));
          color: white;
          border-color: transparent;
          box-shadow: 0 4px 12px rgba(69, 0, 67, 0.25);
        }

        /* Stats */
        .ss-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        .ss-stat-card {
          background: var(--bg-card);
          border-radius: var(--radius-lg);
          padding: 1.25rem;
          box-shadow: var(--shadow-sm);
          border: 1px solid rgba(0, 0, 0, 0.04);
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        .ss-stat-label {
          font-size: 0.8rem;
          color: var(--text-muted);
          font-weight: 500;
        }
        .ss-stat-value {
          font-size: 1.35rem;
          font-weight: 800;
          color: var(--text-primary);
          font-variant-numeric: tabular-nums;
        }
        .ss-stat-value.positive {
          color: var(--success);
        }
        .ss-progress-bar {
          height: 6px;
          background: var(--ivory-200);
          border-radius: 3px;
          margin-top: 0.5rem;
          overflow: hidden;
        }
        .ss-progress-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--citrine-500), var(--citrine-400));
          border-radius: 3px;
          transition: width 600ms var(--ease-out);
        }

        /* Grid */
        .ss-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
          margin-bottom: 1.5rem;
        }
        .ss-card {
          padding: 1.5rem;
        }
        .ss-card-heading {
          font-size: 1rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 1.25rem;
        }

        /* Categories */
        .ss-categories {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .ss-category {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .ss-cat-info {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          min-width: 130px;
        }
        .ss-cat-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .ss-cat-name {
          font-size: 0.85rem;
          color: var(--text-secondary);
          font-weight: 500;
        }
        .ss-cat-right {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .ss-cat-bar-wrapper {
          flex: 1;
          height: 8px;
          background: var(--ivory-200);
          border-radius: 4px;
          overflow: hidden;
        }
        .ss-cat-bar {
          height: 100%;
          border-radius: 4px;
          transition: width 600ms var(--ease-out);
        }
        .ss-cat-amount {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--text-primary);
          min-width: 80px;
          text-align: right;
          font-variant-numeric: tabular-nums;
        }

        /* Chart */
        .ss-chart {
          display: flex;
          align-items: flex-end;
          gap: 1rem;
          height: 200px;
          padding-top: 1rem;
        }
        .ss-chart-col {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          height: 100%;
        }
        .ss-chart-bar-wrapper {
          flex: 1;
          width: 100%;
          display: flex;
          align-items: flex-end;
          justify-content: center;
        }
        .ss-chart-bar {
          width: 70%;
          max-width: 40px;
          background: linear-gradient(180deg, var(--plum-400), var(--plum-600));
          border-radius: 6px 6px 0 0;
          transition: height 600ms var(--ease-out);
          min-height: 4px;
        }
        .ss-chart-label {
          font-size: 0.75rem;
          color: var(--text-muted);
          font-weight: 600;
          margin-top: 0.5rem;
        }

        /* Tips */
        .ss-section-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .ss-tips-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
        }
        .ss-tip-card {
          padding: 1.25rem;
        }
        .ss-tip-emoji {
          font-size: 1.5rem;
          display: block;
          margin-bottom: 0.5rem;
        }
        .ss-tip-title {
          font-size: 0.9rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 0.375rem;
        }
        .ss-tip-desc {
          font-size: 0.8rem;
          color: var(--text-muted);
          line-height: 1.4;
        }

        @media (max-width: 768px) {
          .ss-body { padding: 0 1rem 1rem; }
          .ss-stats { grid-template-columns: 1fr; }
          .ss-grid { grid-template-columns: 1fr; }
          .ss-tips-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  )
}
