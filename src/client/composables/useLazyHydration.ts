import { isSSR } from '~/utils/helpers'

type MaybeElement = HTMLElement | null | undefined

const DEFAULT_OPTIONS: IntersectionObserverInit = {
  threshold: 0,
  rootMargin: '100px'
}

export const useLazyHydration = (
  target: Ref<MaybeElement>,
  callback?: () => void | Promise<void>,
  options: IntersectionObserverInit = DEFAULT_OPTIONS
) => {
  // eslint-disable-next-line unicorn/consistent-function-scoping
  const noopStop = () => { /* empty */ }

  if (isSSR) {
    return { stop: noopStop }
  }

  let observer: IntersectionObserver | null = null

  const stopObserver = () => {
    if (observer) {
      observer.disconnect()
      observer = null
    }
  }

  const runCallback = async () => {
    try {
      await callback?.()
    }
    catch (error) {
      console.error('[LazyHydration] error:', error)
    }
  }

  const start = (el: HTMLElement) => {
    if (!('IntersectionObserver' in window)) {
      void runCallback()

      return
    }

    stopObserver()

    observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        stopObserver()
        void runCallback()
      }
    }, { ...options })

    observer.observe(el)
  }

  const unwatch = watch(
    target,
    (el) => {
      if (el instanceof HTMLElement) {
        start(el)
      }
      else {
        stopObserver()
      }
    },
    { immediate: true, flush: 'post' }
  )

  const fullStop = () => {
    unwatch()
    stopObserver()
  }

  if (getCurrentScope()) {
    onScopeDispose(fullStop)
  }

  return { stop: fullStop }
}

export type UseLazyHydrationReturn = ReturnType<typeof useLazyHydration>
