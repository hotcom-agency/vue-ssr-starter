type TApiResponse<T = any> = {
  data?: T
  meta?: any
  error?: TApiResponseError | undefined
}

type TApiResponseError = {
  status: number
  name: string
  message: string
  details: any
}
