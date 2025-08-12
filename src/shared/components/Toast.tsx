import React, { useEffect } from 'react'

interface ToastProps {
    message: string
    type: 'success' | 'error' | 'info'
    onClose: () => void
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000)
        return () => clearTimeout(timer)
    }, [onClose])

    const colors = {
        success: 'bg-green-500 border-green-600',
        error: 'bg-red-500 border-red-600',
        info: 'bg-blue-500 border-blue-600'
    }

    return (
        <div className={`fixed top-4 right-4 z-50 ${colors[type]} text-white px-4 py-3 rounded-lg shadow-lg border-l-4 animate-in slide-in-from-right duration-300`}>
            <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-medium">{message}</span>
                <button onClick={onClose} className="text-white/80 hover:text-white">×</button>
            </div>
        </div>
    )
}

export default Toast