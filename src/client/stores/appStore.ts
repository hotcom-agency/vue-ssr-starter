import { defineStore } from 'pinia'
import { useContext } from '~/composables'
import { isClient } from '~/utils/helpers'

export const useAppStore = defineStore('appStore', () => {
  const { cookies } = useContext()

  /**
   * Theme color-scheme state.
   */
  const theme = ref<'light' | 'dark' | undefined>([
    'light',
    'dark'
  ]
    .includes(cookies.get('color-scheme'))
    ? cookies.get('color-scheme')
    : undefined)

  /**
   * Theme prefers color-scheme detected on client side
   */
  const themePrefers: typeof theme.value = isClient
    ? (matchMedia('(prefers-color-scheme: light)').matches
      ? 'light'
      : 'dark')
    : undefined

  /**
   * Theme prefers color-scheme detected on client side.
   */
  const themeIsDark = computed(() =>
    theme.value === 'dark'
    || (!theme.value && themePrefers === 'dark'))

  /**
   * Change theme.
   */
  const themeChange = (mode: typeof theme.value) => {
    theme.value = mode

    cookies.set('color-scheme', theme.value)
  }

  /**
   * Toggle theme.
   */
  const themeToggle = () => {
    if (theme.value) {
      theme.value = theme.value === 'light' ? 'dark' : 'light'
    }
    else {
      theme.value = themePrefers === 'light'
        ? 'dark'
        : 'light'
    }

    cookies.set('color-scheme', theme.value)
  }

  return {
    theme: computed(() => theme.value),
    themePrefers: computed(() => themePrefers),
    themeIsDark,
    themeChange,
    themeToggle
  }
})
