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
export interface IUploadRouter {
   isUrlAccepted: (args: IRouterArgs) => boolean
   handler: (tempFile: string, args: IRouterArgs) => Promise<IServerResponse<T>>
   findNameForTemporaryFile: () => string
}
export type FUrlHandler<T> = (args: any) => Promise<IServerResponse<T>>
// export type FRouter<T> = (method: string, url: string) => Promise<FUrlHandler<T> | null>
export type FRouter<T> = (args: IRouterArgs) => Promise<IServerResponse<T> | null>

export type FStaticFilesHandler = (url: string) => Promise<IServerResponse<any> | null> 

