import React from 'react'
import Card from './Card'

export default function StatsCard({ title, value, icon: Icon, className = '', accent = 'bg-teal-500' }) {
  return (
    <Card className={`flex items-center justify-between hover:shadow-lg transition-all ${className}`} variant="default">
      <div style={{ fontSize: 'var(--font-size-md)', color: 'var(--text-secondary)' }}>
        <p className="font-semibold uppercase" style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-muted)', letterSpacing: '0.5px' }}>
          {title}
        </p>
        <p className="font-bold mt-3" style={{ fontSize: 'calc(var(--font-size-lg) * 1.8)', color: 'var(--text-primary)' }}>
          {value}
        </p>
      </div>
      <div 
        className={`${accent} p-4 rounded-2xl text-white shadow-md hover:shadow-lg transition-all duration-300`} 
        style={{ borderRadius: 'calc(var(--control-radius) * 0.75)' }}
      >
        {Icon ? <Icon size={28} strokeWidth={1.5} /> : null}
      </div>
    </Card>
  )
}
