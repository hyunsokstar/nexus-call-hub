import React, { forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

// shadcn/ui 스타일의 버튼 변형 정의
const buttonVariants = cva(
  // 기본 스타일 - shadcn/ui와 동일한 스타일
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        // Default - shadcn/ui primary 스타일
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        
        // Destructive - 위험한 액션
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        
        // Outline - 테두리만 있는 버튼 (가장 많이 사용)
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        
        // Secondary - 보조 버튼
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        
        // Ghost - 투명한 버튼
        ghost: "hover:bg-accent hover:text-accent-foreground",
        
        // Link - 링크 스타일
        link: "text-primary underline-offset-4 hover:underline",
        
        // 추가 컬러 변형들
        success: "bg-green-600 text-white hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700",
        warning: "bg-yellow-600 text-white hover:bg-yellow-700 dark:bg-yellow-600 dark:hover:bg-yellow-700",
        info: "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700",
        
        // Outline 컬러 변형들
        "outline-success": "border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300 dark:border-green-800 dark:text-green-400 dark:hover:bg-green-900/20",
        "outline-warning": "border-yellow-200 text-yellow-700 hover:bg-yellow-50 hover:border-yellow-300 dark:border-yellow-800 dark:text-yellow-400 dark:hover:bg-yellow-900/20",
        "outline-info": "border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-900/20",
        "outline-destructive": "border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
  loadingText?: string
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    asChild = false, 
    loading = false,
    loadingText,
    icon,
    iconPosition = 'left',
    children,
    disabled,
    ...props 
  }, ref) => {
    const isDisabled = disabled || loading

    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={isDisabled}
        {...props}
      >
        {loading && (
          <svg 
            className="mr-2 h-4 w-4 animate-spin" 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M21 12a9 9 0 11-6.219-8.56"/>
          </svg>
        )}
        
        {!loading && icon && iconPosition === 'left' && (
          <span className={cn("inline-flex", children && "mr-2")}>{icon}</span>
        )}
        
        {loading ? (loadingText || children) : children}
        
        {!loading && icon && iconPosition === 'right' && (
          <span className={cn("inline-flex", children && "ml-2")}>{icon}</span>
        )}
      </button>
    )
  }
)

Button.displayName = "Button"

export { Button, buttonVariants }
