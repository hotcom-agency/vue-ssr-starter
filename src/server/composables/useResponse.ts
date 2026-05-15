import statusCode from 'http-status'

export const ApiResponse = <T = any>(
  data: TApiResponse[keyof Pick<TApiResponse<T>, 'data'>] = null,
  errorStatus?: number,
  errorDetails?: any
): TApiResponse<T> => {
  const status: number = errorStatus ?? 200

  const error: TApiResponseError | undefined
    = status === 200
      ? undefined
      : {
        status,
        name: (statusCode as any)[`${String(status)}_NAME`]?.toString() ?? '',
        message: (statusCode as any)[`${String(status)}_MESSAGE`]?.toString() ?? '',
        details: errorDetails
      }

  return error ? { data, error: error } : (data?.data ? { ...data } : { data })
}
