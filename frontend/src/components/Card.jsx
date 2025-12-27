import React from 'react'

export default function Card({ children, className = '', variant = 'default' }) {
  const baseClasses = 'rounded-2xl transition-all duration-300'
  const variants = {
    default: 'card-premium bg-white shadow-soft border border-teal-100',
    glass: 'glass-card',
    elevated: 'bg-white shadow-lg border border-teal-100'
  }
  
  return (
    <div 
      className={`${baseClasses} ${variants[variant] || variants.default} ${className}`} 
      style={{ 
        borderRadius: 'var(--control-radius)', 
        fontSize: 'var(--font-size-md)', 
        color: 'var(--text-primary)',
        padding: '1.5rem'
      }}
    >
      {children}
    </div>
  )
}
