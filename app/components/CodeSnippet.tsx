'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import Prism from 'prismjs'
import { stripIndent } from '../utils/dedent'
// CSS imports happen in ClientLayout.tsx via usePrismTheme

// A small set of popular languages. Add more as needed.
export type SnippetLanguage =
  | 'tsx'
  | 'ts'
  | 'jsx'
  | 'js'
  | 'bash'
  | 'sh'
  | 'sql'
  | 'python'
  | 'css'
  | 'html'
  | 'json'
  | 'c'
  | 'cpp'
  | 'java'
  | 'go'
  | 'php'
  | 'rust'
  | 'yaml'

const prismComponentName: Record<SnippetLanguage, string> = {
  tsx: 'tsx',
  ts: 'typescript',
  jsx: 'jsx',
  js: 'javascript',
  bash: 'bash',
  sh: 'bash',
  sql: 'sql',
  python: 'python',
  css: 'css',
  html: 'markup',
  json: 'json',
  c: 'c',
  cpp: 'cpp',
  java: 'java',
  go: 'go',
  php: 'php',
  rust: 'rust',
  yaml: 'yaml',
}

// Cache of loaded Prism language components (so we only import once per lang)
const loaded = new Set<string>()

export type CodeSnippetProps = {
  code: string
  language: SnippetLanguage
  title?: string
  className?: string
  /**
   * If true, long lines will wrap; otherwise the snippet will scroll horizontally.
   * Default: false (scroll)
   */
  wrapLines?: boolean
  normalizeIndent?: boolean
}

export default function CodeSnippet({ code, language, title, className, wrapLines = false, normalizeIndent = true }: CodeSnippetProps) {
  const preRef = useRef<HTMLPreElement | null>(null)
  const codeRef = useRef<HTMLElement | null>(null)
  const [isCopying, setIsCopying] = useState(false)

  // Compute CSS class for Prism based on language.
  const langClass = useMemo(() => `language-${prismComponentName[language] ?? 'markup'}`, [language])
  const displayCode = useMemo(
    () => (normalizeIndent ? stripIndent(code) : code),
    [code, normalizeIndent]
  )

  useEffect(() => {
    let cancelled = false

    async function ensureLanguageLoaded() {
      const comp = prismComponentName[language]
      if (!comp || loaded.has(comp)) {
        // Already available (markup, javascript, etc.) or previously loaded
        return
      }
      try {
        await import(`prismjs/components/prism-${comp}.js`)
        loaded.add(comp)
      } catch (err) {
        // If a language fails to load, fallback to markup highlighting gracefully
        console.warn(`[CodeSnippet] Failed to load Prism language: ${comp}`, err)
      }
    }

    async function highlight() {
      await ensureLanguageLoaded()
      if (codeRef.current) {
        codeRef.current.textContent = displayCode
        Prism.highlightElement(codeRef.current)
      }
    }

    highlight()

    return () => {
      cancelled = true
    }
  }, [code, language])

  async function handleCopy() {
    try {
      setIsCopying(true)
      await navigator.clipboard.writeText(displayCode)
      // Small success delay
      setTimeout(() => setIsCopying(false), 900)
    } catch (err) {
      console.error('Copy failed', err)
      setIsCopying(false)
    }
  }

  return (
    <figure className={`group relative my-4 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-950 ${className ?? ''}`}>
      {/* Header */}
      {(title || language) && (
        <div className="flex items-center justify-between gap-2 border-b border-neutral-200 px-3 py-2 text-sm dark:border-neutral-800">
          <div className="flex items-center gap-2">
            {title && <figcaption className="font-lg font-bold text-neutral-700 dark:text-neutral-200">{title}</figcaption>}
          </div>
          <div>
            <button
              onClick={handleCopy}
              className="z-10 rounded-md border border-neutral-300 bg-white/70 px-2 py-1 text-xs font-medium text-neutral-700 backdrop-blur transition hover:bg-white dark:border-neutral-700 dark:bg-neutral-900/70 dark:text-neutral-200 dark:hover:bg-neutral-900"
              aria-label="Copy code"
            >
              {isCopying ? 'Copied!' : 'Copy'}
            </button>
            {language && (
              <span className="rounded-md bg-neutral-100 px-2 py-0.5 text-[11px] font-mono uppercase tracking-wider text-neutral-600 dark:bg-neutral-900 dark:text-neutral-300">
                {language}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Code block */}
      <div className={`${wrapLines ? 'whitespace-pre-wrap break-words' : 'overflow-x-auto'}`}>
        <pre ref={preRef} className={`!m-0 p-4 text-[13px] leading-5 ${langClass}`}>
          {/* Prism requires a <code> element with the same language- class */}
          <code ref={codeRef} className={langClass} />
        </pre>
      </div>

      {/* Optional tiny helper styles to make long tokens wrap when wrapLines=true */}
      <style jsx>{`
        :global(pre[class*='language-']) { margin: 0; }
        :global(code[class*='language-']) { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace; }
        :global(.dark pre[class*='language-']) { background: transparent; }
      `}</style>
    </figure>
  )
}

