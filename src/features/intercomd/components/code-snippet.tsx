'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import Prism from 'prismjs'
import { stripIndent } from "../utils/strip-indent"

// Prism's browser auto-run can mutate <pre> elements before React hydrates them.
// Highlight explicitly in the effect below instead.
Prism.manual = true

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
  const codeRef = useRef<HTMLElement | null>(null)
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
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
        if (cancelled) return
        loaded.add(comp)
      } catch (err) {
        // If a language fails to load, fallback to markup highlighting gracefully
        console.warn(`[CodeSnippet] Failed to load Prism language: ${comp}`, err)
      }
    }

    async function highlight() {
      await ensureLanguageLoaded()
      if (!cancelled && codeRef.current) {
        codeRef.current.textContent = displayCode
        Prism.highlightElement(codeRef.current)
      }
    }

    highlight()

    return () => {
      cancelled = true
    }
  }, [displayCode, language])

  useEffect(() => () => {
    if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current)
  }, [])

  async function handleCopy() {
    try {
      setIsCopying(true)
      await navigator.clipboard.writeText(displayCode)
      // Small success delay
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current)
      copyTimeoutRef.current = setTimeout(() => setIsCopying(false), 900)
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
        <pre className={`!m-0 p-4 text-[13px] leading-5 ${langClass}`}>
          {/* Prism requires a <code> element with the same language- class */}
          <code ref={codeRef} className={langClass}>{displayCode}</code>
        </pre>
      </div>

      {/* Optional tiny helper styles to make long tokens wrap when wrapLines=true */}
      <style jsx>{`
        :global(pre[class*='language-']) { margin: 0; }
        :global(code[class*='language-']) { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace; }
        :global(.dark pre[class*='language-']) { background: transparent; }
        :global(.token.comment), :global(.token.prolog), :global(.token.doctype), :global(.token.cdata) { color: #708090; }
        :global(.token.punctuation) { color: #999; }
        :global(.token.property), :global(.token.tag), :global(.token.boolean), :global(.token.number), :global(.token.constant), :global(.token.symbol), :global(.token.deleted) { color: #905; }
        :global(.token.selector), :global(.token.attr-name), :global(.token.string), :global(.token.char), :global(.token.builtin), :global(.token.inserted) { color: #690; }
        :global(.token.operator), :global(.token.entity), :global(.token.url), :global(.language-css .token.string), :global(.style .token.string) { color: #9a6e3a; }
        :global(.token.atrule), :global(.token.attr-value), :global(.token.keyword) { color: #07a; }
        :global(.token.function), :global(.token.class-name) { color: #dd4a68; }
        :global(.token.regex), :global(.token.important), :global(.token.variable) { color: #e90; }
        :global(.dark .token.comment), :global(.dark .token.prolog), :global(.dark .token.doctype), :global(.dark .token.cdata) { color: #8292a2; }
        :global(.dark .token.punctuation) { color: #f8f8f2; }
        :global(.dark .token.property), :global(.dark .token.tag), :global(.dark .token.constant), :global(.dark .token.symbol), :global(.dark .token.deleted) { color: #f92672; }
        :global(.dark .token.boolean), :global(.dark .token.number) { color: #ae81ff; }
        :global(.dark .token.selector), :global(.dark .token.attr-name), :global(.dark .token.string), :global(.dark .token.char), :global(.dark .token.builtin), :global(.dark .token.inserted) { color: #a6e22e; }
        :global(.dark .token.operator), :global(.dark .token.entity), :global(.dark .token.url), :global(.dark .language-css .token.string), :global(.dark .style .token.string), :global(.dark .token.variable) { color: #f8f8f2; }
        :global(.dark .token.atrule), :global(.dark .token.attr-value), :global(.dark .token.function), :global(.dark .token.class-name) { color: #e6db74; }
        :global(.dark .token.keyword) { color: #66d9ef; }
        :global(.dark .token.regex), :global(.dark .token.important) { color: #fd971f; }
      `}</style>
    </figure>
  )
}

