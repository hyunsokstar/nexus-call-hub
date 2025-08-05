// ✅ GPTCodeHighlighter.tsx
import React, { useState } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneLight, oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Copy, Check } from 'lucide-react'

interface Props {
    content: string
    theme?: 'dark' | 'light'
}

const GPTCodeHighlighter: React.FC<Props> = ({ content, theme = 'light' }) => {
    const [copiedCode, setCopiedCode] = useState<string | null>(null)

    const handleCopy = async (code: string) => {
        try {
            await navigator.clipboard.writeText(code)
            setCopiedCode(code)
            setTimeout(() => setCopiedCode(null), 2000)
        } catch (err) {
            console.error('Failed to copy:', err)
        }
    }

    const renderContent = () => {
        // content가 구조화된 JSON 형태인 경우 처리
        try {
            const parsed = JSON.parse(content)
            if (parsed.blocks) {
                return parsed.blocks.map((block: any, index: number) => {
                    if (block.type === 'code') {
                        return (
                            <div key={index} className="relative my-4 rounded-lg overflow-hidden border border-gray-200">
                                <div className="flex items-center justify-between bg-gray-100 px-4 py-2 border-b border-gray-200">
                                    <span className="text-sm font-medium text-gray-600">
                                        {block.language || 'text'}
                                    </span>
                                    <button
                                        onClick={() => handleCopy(block.content)}
                                        className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                                    >
                                        {copiedCode === block.content ? (
                                            <>
                                                <Check size={14} /> Copied
                                            </>
                                        ) : (
                                            <>
                                                <Copy size={14} /> Copy
                                            </>
                                        )}
                                    </button>
                                </div>
                                <SyntaxHighlighter
                                    language={block.language || 'text'}
                                    style={theme === 'dark' ? oneDark : oneLight}
                                    customStyle={{
                                        margin: 0,
                                        padding: '1rem',
                                        fontSize: '14px',
                                        lineHeight: '1.5',
                                        background: theme === 'dark' ? '#1e1e1e' : '#f8f9fa'
                                    }}
                                    showLineNumbers={block.content.split('\n').length > 5}
                                    wrapLines
                                    wrapLongLines
                                >
                                    {block.content}
                                </SyntaxHighlighter>
                            </div>
                        )
                    }
                    return (
                        <div key={index} className="whitespace-pre-wrap mb-4 leading-relaxed">
                            {block.content}
                        </div>
                    )
                })
            }
        } catch (e) {
            // fall back to 기존 처리
        }

        // 백틱 기반 fallback 처리
        const parts = content.split(/(```[\s\S]*?```)/g)
        return parts.map((part, index) => {
            if (part.startsWith('```') && part.endsWith('```')) {
                const lines = part.slice(3, -3).split('\n')
                const language = lines[0].trim() || 'text'
                const code = lines.slice(1).join('\n').trim()

                return (
                    <div key={index} className="relative my-4 rounded-lg overflow-hidden border border-gray-200">
                        <div className="flex items-center justify-between bg-gray-100 px-4 py-2 border-b border-gray-200">
                            <span className="text-sm font-medium text-gray-600">{language}</span>
                            <button
                                onClick={() => handleCopy(code)}
                                className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                            >
                                {copiedCode === code ? (
                                    <>
                                        <Check size={14} /> Copied
                                    </>
                                ) : (
                                    <>
                                        <Copy size={14} /> Copy
                                    </>
                                )}
                            </button>
                        </div>
                        <SyntaxHighlighter
                            language={language}
                            style={theme === 'dark' ? oneDark : oneLight}
                            customStyle={{
                                margin: 0,
                                padding: '1rem',
                                fontSize: '14px',
                                lineHeight: '1.5',
                                background: theme === 'dark' ? '#1e1e1e' : '#f8f9fa'
                            }}
                            showLineNumbers={code.split('\n').length > 5}
                            wrapLines
                            wrapLongLines
                        >
                            {code}
                        </SyntaxHighlighter>
                    </div>
                )
            }
            return (
                <div key={index} className="whitespace-pre-wrap mb-4 leading-relaxed">
                    {part.trim()}
                </div>
            )
        }).filter(el => el.props.children)
    }

    return <div className="gpt-code-highlighter">{renderContent()}</div>
}

export default GPTCodeHighlighter