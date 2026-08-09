export function stripIndent(input: string) {
    // drop first leading newline and trailing whitespace
    const text = input.replace(/^\n/, '').replace(/\s+$/, '')
    const lines = text.split('\n')
    const indents = lines
        .filter(l => l.trim().length)
        .map(l => (l.match(/^[ \t]*/)?.[0].length ?? 0))
    const min = indents.length ? Math.min(...indents) : 0
    return lines.map(l => l.slice(min)).join('\n')
}

