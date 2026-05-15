import { plainToInstance } from 'class-transformer'
import { type ClassConstructor } from 'class-transformer'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useContext } from '~/composables'
import { type EPageSlug, type Page } from '~/models/page'
import { pageQuery } from '~/repositories/pageRepository'
import { isSSR } from '~/utils/helpers'

/**
 * Fetch and transform page data.
 */
const fetchPage = async <T extends Page>({
  slug,
  model: Model
}: {
  slug: keyof typeof EPageSlug
  model: ClassConstructor<T>
}) => {
  const { data, refresh } = pageQuery({ slug })

  if (!data.value) {
    await refresh()
  }

  return data.value
    ? plainToInstance(
      Model,
      data.value,
      {
        enableImplicitConversion: true,
        excludeExtraneousValues: true
      }
    )
    : undefined
}

/**
 * Store page response status and redirection logic.
 */
export const usePageStore = defineStore('pageStore', () => {
  const status = ref<number | undefined>()

  const setStatus = (httpStatus: typeof status.value, redirect?: string) => {
    status.value = httpStatus

    const context = useContext()

    if (isSSR) {
      context.writeServerResponse({
        status: httpStatus,
        headers: redirect ? { location: redirect } : {}
      })
    }
    else if (redirect) {
      context.redirect({ location: redirect })
    }
  }

  return {
    status,
    setStatus,
    fetchPage
  }
})
