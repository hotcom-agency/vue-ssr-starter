import statusCode from 'http-status'

export const apiResponse = <T = any>(
  data: TApiResponse[keyof Pick<TApiResponse<T>, 'data'>] = null,
  errorStatus?: number,
  errorDetails: any = null
): TApiResponse<T> => {
  const status = errorStatus ?? 200

  if (status === 200) {
    return (data && typeof data === 'object' && 'data' in data)
      ? (data as TApiResponse<T>)
      : { data }
  }

  const error: TApiResponseError = {
    status,
    name: (statusCode as any)[status] ?? 'Unknown Error',
    message: (statusCode as any)[`${String(status)}_MESSAGE`] ?? 'An error occurred',
    details: errorDetails
  }

  return { data, error }
}
