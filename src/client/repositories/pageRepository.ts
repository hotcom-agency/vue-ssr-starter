import { useQuery } from '@pinia/colada'
import { useLocale } from '~/composables'
import { type EPageSlug } from '~/models/page'
import { apiHost } from '.'

interface IPageQuery {
  slug: keyof typeof EPageSlug
  params?: { enabled?: boolean }
}

const PAGE_QUERY_KEYS = {
  root: ['pages'] as const,
  bySlug: (slug: keyof typeof EPageSlug, locale: string) => [...PAGE_QUERY_KEYS.root, slug, locale] as const
}

export const pageQuery = (query: IPageQuery) => {
  const { currentLocale } = useLocale()

  return useQuery({
    key: () => PAGE_QUERY_KEYS.bySlug(query.slug, currentLocale.value.locale),
    enabled: query.params?.enabled,
    query: () => fetch(
      `${apiHost}/v1/pages/${query.slug}`,
      { headers: { 'Accept-Language': currentLocale.value.locale } }
    )
      .then(async (res) => await res.json())
      .then((res) => res.data)
      .catch((_error: unknown) => undefined)
  })
}
