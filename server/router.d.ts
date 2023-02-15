export interface IServerResponse<T> {
   headers: Record<string, string>
   data: T
   statusCode: number
}
export interface IRouterArgs {
   method: string
   url: string
   getParams?: any
   postParams?: any
}
export type FUrlHandler<T> = (args: any) => Promise<IServerResponse<T>>
// export type FRouter<T> = (method: string, url: string) => Promise<FUrlHandler<T> | null>
export type FRouter<T> = (args: IRouterArgs) => Promise<IServerResponse<T> | null>

