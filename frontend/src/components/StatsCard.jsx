import React from 'react'
import Card from './Card'

export default function StatsCard({ title, value, icon: Icon, className = '', accent = 'bg-brand' }) {
  return (
    <Card className={`flex items-center justify-between ${className}`}>
      <div>
        <p className="text-sm text-muted font-semibold uppercase">{title}</p>
        <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
      </div>
      <div className={`${accent} p-3 rounded-lg text-white shadow`}>
        {Icon ? <Icon size={24} /> : null}
      </div>
    </Card>
  )
}
