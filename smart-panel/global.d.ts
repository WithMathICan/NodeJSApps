import {createCRUD, slugify} from 'common'
import { createCols } from './lib/sp-functions'
import { FSpModel, FCreateSpModel } from './domain/models/sp-model'
import { FQuery } from 'common/types'
import {M2M} from './classes/M2M'
import { promises, PathLike } from 'node:fs'
import * as tfunc from 'common'


type TCreateCols = typeof createCols
type TSlugify = typeof slugify
type TM2M = typeof M2M
type TFs = typeof promises
type TFunc = typeof tfunc


export global {
   namespace sp{
      const PG_DATABASE: string
      const createCols: TCreateCols
      const models: Record<string, FSpModel>
      const createSpModel: FCreateSpModel
      const poolQuery: FQuery
      const M2M: TM2M
      const fsp: TFs
      const UPLOADS_DIR: string
      const UPLOADS_SETTINGS_TABLE: string
      const func: TFunc
   }
}