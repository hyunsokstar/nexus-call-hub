import React from 'react'
import Markdown from 'markdown-to-jsx'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Copy, Check } from 'lucide-react'

interface CodeBlockProps {
    children: string
    className?: string
}

const CodeBlock: React.FC<CodeBlockProps> = ({ children, className }) => {
    const [copied, setCopied] = React.useState(false)
    const language = className?.replace('lang-', '') || 'text'

    const handleCopy = async () => {
        await navigator.clipboard.writeText(children)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="relative my-4 rounded-lg overflow-hidden border">
            <div className="flex items-center justify-between bg-gray-100 px-4 py-2 border-b">
                <span className="text-sm font-medium text-gray-600">{language}</span>
                <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
                >
                    {copied ? <><Check size={14} />Copied</> : <><Copy size={14} />Copy</>}
                </button>
            </div>
            <SyntaxHighlighter
                language={language}
                style={oneLight}
                customStyle={{ margin: 0, padding: '1rem', fontSize: '14px' }}
            >
                {children}
            </SyntaxHighlighter>
        </div>
    )
}

interface Props {
    content: string
}

const MarkdownRenderer: React.FC<Props> = ({ content }) => {
    return (
        <Markdown
            options={{
                overrides: {
                    code: {
                        component: ({ children, className }) => {
                            // 인라인 코드
                            if (!className) {
                                return <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">{children}</code>
                            }
                            // 코드 블록
                            return <CodeBlock className={className}>{children}</CodeBlock>
                        }
                    },
                    pre: {
                        component: ({ children }) => <>{children}</> // pre 태그 제거
                    }
                }
            }}
        >
            {content}
        </Markdown>
    )
}

export default MarkdownRenderer