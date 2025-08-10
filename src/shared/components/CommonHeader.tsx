import React from 'react'
import { Button } from '../ui/button'

interface CommonHeaderProps {
  title: string
  subtitle?: string
  userName?: string
  onBackClick?: () => void
}


const CommonHeader: React.FC<CommonHeaderProps> = ({
  title,
  subtitle,
  userName,
  onBackClick
}) => {
  return (
    <header className="bg-white border-b shadow-sm h-14 flex items-center px-4">
      <div className="flex-1 flex items-center min-w-0">
        {onBackClick && (
          <Button variant="ghost" size="sm" onClick={onBackClick} className="mr-2">
            ← 메인
          </Button>
        )}
        <div className="min-w-0">
          <h1 className="text-lg font-semibold text-gray-900 truncate leading-tight">{title}</h1>
          {subtitle && (
            <p className="text-xs text-gray-500 truncate leading-tight">{subtitle}</p>
          )}
        </div>
      </div>
      {userName && (
        <div className="flex flex-col items-end ml-4">
          <span className="text-xs text-gray-500">사용자</span>
          <span className="text-sm font-medium text-gray-900">{userName}</span>
        </div>
      )}
    </header>
  )
}

export default CommonHeader
