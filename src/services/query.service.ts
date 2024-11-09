import { inject, Injectable, Injector } from '@angular/core';
import {
  CreateMutationOptions,
  CreateMutationResult,
  CreateQueryResult,
  DefaultError,
  injectMutation,
  injectQuery,
  MutationFunction,
  QueryClient,
  QueryFunction,
  QueryFunctionContext,
  QueryKey,
  UndefinedInitialDataOptions,
} from '@tanstack/angular-query-experimental';
import { ApiService, HttpClientOptions } from './api.service';

type HttpClientMethod = keyof ApiService;

@Injectable({ providedIn: 'root' })
export class QueryService {
  private apiService = inject(ApiService);

  query<
    TQueryFnData = unknown,
    TError = DefaultError,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey
  >(
    optionsFn: (client: QueryClient) => UndefinedInitialDataOptions<
      TQueryFnData,
      TError,
      TData,
      TQueryKey
    > & {
      httpClientOptions?: HttpClientOptions & { method: HttpClientMethod };
      onSuccess?: (data: TQueryFnData) => void;
      onError?: (error: unknown) => void;
    },
    injector?: Injector
  ): CreateQueryResult<TData, TError> {
    return injectQuery<TQueryFnData, TError, TData, TQueryKey>(
      (client: QueryClient) => {
        const options = optionsFn(client);
        const {
          queryKey,
          queryFn,
          httpClientOptions,
          onSuccess,
          onError,
          ...restOptions
        } = options;

        const defaultQueryFn: QueryFunction<TQueryFnData, TQueryKey> = async ({
          queryKey,
        }: QueryFunctionContext): Promise<TQueryFnData> => {
          try {
            const method = httpClientOptions?.method || 'get';

            const data = await this.apiService[method]<TQueryFnData>(
              `${queryKey?.[0]}`,
              httpClientOptions
            );

            onSuccess && onSuccess(data);

            return data;
          } catch (error) {
            onError && onError(error);
            throw error;
          }
        };

        return {
          queryKey,
          queryFn: queryFn || defaultQueryFn,
          ...restOptions,
        };
      },
      injector
    );
  }

  mutation<
    TData = unknown,
    TError = DefaultError,
    TVariables = void,
    TContext = unknown
  >(
    optionsFn: (client: QueryClient) => CreateMutationOptions<
      TData,
      TError,
      TVariables,
      TContext
    > & {
      httpClientOptions?: HttpClientOptions & { method: HttpClientMethod };
      endpoint: string;
    },
    injector?: Injector
  ): CreateMutationResult<TData, TError, TVariables, TContext> {
    return injectMutation<TData, TError, TVariables, TContext>(
      (client: QueryClient) => {
        const options = optionsFn(client);
        const { mutationFn, httpClientOptions, endpoint, ...restOptions } =
          options;
        const method = httpClientOptions?.method || 'post';

        const defaultMutationFn: MutationFunction<TData, TVariables> = async (
          variables: TVariables
        ): Promise<TData> => {
          if (['get', 'delete'].includes(method)) {
            return this.apiService[method]<TData>(endpoint, httpClientOptions);
          }

          return this.apiService[method]<TData>(
            endpoint,
            variables,
            httpClientOptions
          );
        };

        return {
          mutationFn: mutationFn || defaultMutationFn,
          ...restOptions,
        };
      },
      injector
    );
  }
}
