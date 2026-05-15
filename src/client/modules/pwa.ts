import { useRegisterSW } from 'virtual:pwa-register/vue'
import { isDevelopment } from '~/utils/helpers'

export const install: UserModule = ({ isClient, router }) => {
  if (!isClient || isDevelopment) {
    return
  }

  void router.isReady().then(() => {
    useRegisterSW({ immediate: true })
  })
}
