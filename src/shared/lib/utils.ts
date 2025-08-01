// C:\pilot-tauri\nexus-call-hub\src\shared\lib\utils.ts

// src/shared/lib/utils.ts
import { ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}
