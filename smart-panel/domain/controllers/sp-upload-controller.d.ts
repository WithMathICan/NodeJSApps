import { IRouterArgs } from "server/router";
import { IApiResult } from "./sp-controller";

export interface IUploadGetParams {
   schema: string
   table: string
   fileName: string
   fileType: string
   lastModified: string
   size: string
}

export interface IAploadArgs extends IRouterArgs {
   getParams: IUploadGetParams
}

export function uploadController(file: string, args: IAploadArgs) : Promise<IApiResult<string>>
export type FUploadController = typeof uploadController
