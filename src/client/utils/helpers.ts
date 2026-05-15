export const isDevelopment = import.meta.env.DEV

export const isProduction = !isDevelopment

export const isClient = typeof window !== 'undefined'

export const isSSR = typeof window === 'undefined'

export const isExternalLink = (link?: string): boolean => {
  if (typeof link !== 'string') { return false }

  return /^((http|https|ftp):\/\/)/.test(link) || /^((mailto|tel):)/.test(link)
}

export const debounceFn = <T extends (...args: any[]) => void>(
  func: T,
  delay: number,
  options?: { leading?: boolean, trailing?: boolean }
) => {
  let timeoutId: ReturnType<typeof setTimeout> | undefined
  const { leading = false, trailing = true } = options ?? {}
  let isLeadingExecuted = false

  return (...args: Parameters<T>): void => {
    const callNow = leading && !isLeadingExecuted

    if (callNow) {
      func(...args)
      isLeadingExecuted = true
    }

    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    if (trailing) {
      timeoutId = setTimeout(() => {
        if (!leading || isLeadingExecuted) {
          func(...args)
        }
        if (leading) {
          isLeadingExecuted = false
        }
      }, delay)
    }
    else if (!callNow) {
      timeoutId = setTimeout(() => {
        if (leading) {
          isLeadingExecuted = false
        }
      }, delay)
    }
  }
}
