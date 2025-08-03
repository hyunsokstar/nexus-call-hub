// C:\pilot-tauri\nexus-call-hub\src\widgets\UserInfo\index.tsx
import { User } from "@/shared/api/types"
import { useTauriUser } from "../../shared/hooks/useAuth"

interface UserInfoProps {
    user?: User | null
    showDepartment?: boolean
    showRole?: boolean
    size?: 'sm' | 'md' | 'lg'
    className?: string
}

function UserInfo({
    user: propUser,
    showDepartment = true,
    showRole = true,
    size = 'md',
    className = ""
}: UserInfoProps) {
    const { data: tauriUser } = useTauriUser()

    // props로 받은 user 우선, 없으면 Tauri에서 가져온 user 사용
    const user = propUser || tauriUser

    if (!user) {
        return null
    }

    const sizeClasses = {
        sm: {
            container: 'gap-2',
            avatar: 'w-6 h-6 text-xs',
            name: 'text-xs',
            details: 'text-xs'
        },
        md: {
            container: 'gap-3',
            avatar: 'w-8 h-8 text-sm',
            name: 'text-sm',
            details: 'text-xs'
        },
        lg: {
            container: 'gap-4',
            avatar: 'w-10 h-10 text-base',
            name: 'text-base',
            details: 'text-sm'
        }
    }

    const classes = sizeClasses[size]

    return (
        <div className={`flex items-center ${classes.container} ${className}`}>
            <div className="text-right">
                <p className={`font-medium text-gray-900 ${classes.name}`}>
                    {user.name}
                </p>
                {(showDepartment || showRole) && (
                    <p className={`text-gray-500 ${classes.details}`}>
                        {[
                            showDepartment ? user.department : null,
                            showRole ? user.role : null
                        ].filter(Boolean).join(' · ')}
                    </p>
                )}
            </div>
            <div className={`bg-blue-100 rounded-full flex items-center justify-center ${classes.avatar}`}>
                <span className="text-blue-600 font-medium">
                    {user.name[0]}
                </span>
            </div>
        </div>
    )
}

export default UserInfo