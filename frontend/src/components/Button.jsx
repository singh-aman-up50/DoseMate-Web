import React from 'react'

export default function Button({ children, className = '', variant = 'primary', ...props }) {
  const base = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-400'
  const variants = {
    primary: 'text-white shadow-md btn-teal hover:shadow-lg',
    secondary: 'text-teal-700 bg-teal-50 border border-teal-200 hover:bg-teal-100'
  }
  return (
    <button
      className={`${base} ${variants[variant] || variants.primary} ${className}`}
      style={{ borderRadius: 'var(--control-radius)', fontSize: 'var(--font-size-md)' }}
      {...props}
    >
      {children}
    </button>
  )
}
