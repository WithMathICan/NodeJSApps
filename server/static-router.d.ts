import { SpLogger } from "common"
import { FRouter } from './router'

export function createStaticRouter(publicRoot: string, console: SpLogger) : FRouter<any>
export function createIndexHtmlRouter(publicRoot: string, urlPrefix: string, console: SpLogger) : FRouter<any>
