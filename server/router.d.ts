export interface IServerResponse<T> {
   headers: Record<string, string>
   data: T
   statusCode: number
}
export interface IRouterArgs {
   method: string
   url: string
   urlArray: string[]
   getParams?: Record<string, any>
   postParams?: Record<string, any>
   uploadedFilePath?: string
}
export interface IUploadRouter {
   isUrlAccepted: (args: IRouterArgs) => boolean
   handler: (tempFile: string, args: IRouterArgs) => Promise<IServerResponse<{message: string, result: string}>>
   findNameForTemporaryFile: () => string
}

export interface IApiHandler<T> {
   isUrlAccepted(args: IRouterArgs) : boolean
   isPostDataNeeded: boolean
   handler(args: IRouterArgs) : Promise<IServerResponse<{message: srting, result: T}>>
}

export type FUrlHandler<T> = (args: any) => Promise<IServerResponse<T>>
// export type FRouter<T> = (method: string, url: string) => Promise<FUrlHandler<T> | null>
export type FRouter<T> = (args: IRouterArgs) => Promise<IServerResponse<T> | null>



export type FStaticFilesHandler = (url: string) => Promise<IServerResponse<any> | null> 

