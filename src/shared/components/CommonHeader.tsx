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
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {onBackClick && (
              <Button variant="ghost" size="sm" onClick={onBackClick}>
                ← 메인
              </Button>
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
              {subtitle && (
                <p className="text-sm text-gray-600">{subtitle}</p>
              )}
            </div>
          </div>
          
          {userName && (
            <div className="text-right">
              <p className="text-sm text-gray-600">사용자</p>
              <p className="font-medium text-gray-900">{userName}</p>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default CommonHeader
