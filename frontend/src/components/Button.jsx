import React from 'react'

export default function Button({ children, className = '', variant = 'primary', ...props }) {
  const base = 'inline-flex items-center justify-center font-semibold rounded-lg transition focus:outline-none'
  const variants = {
    primary: 'px-4 py-2 bg-gradient-to-r from-brand to-brand-700 text-white shadow-sm',
    secondary: 'px-4 py-2 bg-gray-100 text-gray-800 border'
  }
  return (
    <button className={`${base} ${variants[variant] || variants.primary} ${className}`} {...props}>
      {children}
    </button>
  )
}
