export interface WriteServerResponse {
  status?: number
  statusText?: string
  headers?: Record<string, string>
}

const UNSAFE_CHARS_REGEXP = /[/<>\u2028\u2029]/g

const ESCAPED_CHARS = {
  '<': String.raw`\u003C`,
  '>': String.raw`\u003E`,
  '/': String.raw`\u002F`,
  '\u2028': String.raw`\u2028`,
  '\u2029': String.raw`\u2029`
}

function escapeUnsafeChars(unsafeChar: string) {
  return ESCAPED_CHARS[unsafeChar as keyof typeof ESCAPED_CHARS]
}
export const withPrefix = (string: string, prefix: string) => string.startsWith(prefix) ? string : prefix + string
export const withoutPrefix = (string: string, prefix: string) => string.startsWith(prefix) ? string.slice(prefix.length) : string
export const withSuffix = (string: string, suffix: string) => string.endsWith(suffix) ? string : string + suffix
export const withoutSuffix = (string: string, suffix: string) => string.endsWith(suffix) ? string.slice(0, -1 * suffix.length) : string

const isRedirect = ({ status = 0 }) => status >= 300 && status < 400
const isError = ({ status = 0 }) => status >= 400 && status <= 526

const externalRedirect = (location: string) => {
  if (typeof window !== 'undefined') {
    window.location.href = location
  }
}

const defer = <T = unknown>() => {
  const deferred = { status: 'pending' } as {
    promise: Promise<T>
    status: 'pending' | 'resolved' | 'rejected'
    resolve: (value: T) => void
    reject: (reason?: any) => void
  }

  deferred.promise = new Promise<T>((resolve, reject) => {
    deferred.resolve = (value: T) => {
      deferred.status = 'resolved'
      resolve(value)
    }
    deferred.reject = (error: Error) => {
      deferred.status = 'rejected'
      reject(error)
    }
  })

  return deferred
}

export const createClientResponse = (spaRedirect = externalRedirect) => ({
  writeServerResponse: () => {
    console.warn('[SSR] Do not call writeServerResponse in browser')
  },
  redirect: (params: { location: string, _status?: number }) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    params.location.startsWith('/')
      ? spaRedirect(params.location)
      : externalRedirect(params.location)
  }
})

export const createServerResponse = () => {
  const deferred = defer<WriteServerResponse>()
  const response = {} as WriteServerResponse

  const writeServerResponse = (params: WriteServerResponse) => {
    Object.assign(response, params)
    if (isRedirect(params) || isError(params)) {
      deferred.resolve(response)
    }
  }

  return {
    deferred,
    response,
    writeServerResponse,
    isRedirect: () => isRedirect(response),
    isError: () => isError(response),
    redirect: (params: { location: string, status?: number }) => {
      writeServerResponse({ headers: { location: params.location }, status: params.status ?? 302 })
    }
  }
}

export const escapeCharacters = (string: string) => string
  .replaceAll('\n', String.raw`\n`)
  .replaceAll('\\', String.raw`\\`)
  .replaceAll(UNSAFE_CHARS_REGEXP, escapeUnsafeChars)

export const createServerUrlUtils = () => {
  const S = '/'

  const createUrl = (urlLike: string | URL | Location) => {
    if (typeof urlLike === 'string' && !(urlLike || '').includes('://')) {
      urlLike = 'http://e.g' + withPrefix(urlLike, S)
    }

    return new URL(urlLike.toString())
  }

  const getFullPath = (url: string | URL | Location, routeBase?: string) => {
    url = createUrl(url)
    url.pathname = withSuffix(url.pathname, S)
    let fullPath = withoutPrefix(url.href, url.origin)

    if (routeBase) {
      routeBase = withSuffix(withPrefix(routeBase, S), S)
      if (fullPath.startsWith(routeBase)) {
        fullPath = withPrefix(fullPath.replace(routeBase, ''), S)
      }
    }

    return fullPath
  }

  return {
    withPrefix,
    withoutPrefix,
    withSuffix,
    withoutSuffix,
    createUrl,
    getFullPath
  }
}
