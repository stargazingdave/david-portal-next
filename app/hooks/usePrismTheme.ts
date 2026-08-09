'use client'
import { useEffect } from 'react'
import { useTheme } from '../contexts/ThemeProvider'

const THEMES = {
    light: 'https://cdn.jsdelivr.net/npm/prismjs/themes/prism.css',
    dark: 'https://cdn.jsdelivr.net/npm/prismjs/themes/prism-okaidia.css',
}

export function usePrismTheme() {
    const { resolvedTheme } = useTheme()

    useEffect(() => {
        const href = resolvedTheme === 'dark' ? THEMES.dark : THEMES.light

        // remove previous
        document.querySelectorAll('link[data-prism-theme]').forEach(l => l.remove())

        // add new
        const link = document.createElement('link')
        link.rel = 'stylesheet'
        link.href = href
        link.dataset.prismTheme = resolvedTheme
        document.head.appendChild(link)
    }, [resolvedTheme])
}
