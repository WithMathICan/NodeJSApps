import {createCRUD, slugify} from 'common'
import { createCols } from './lib/sp-functions'
import { FSpModel, FCreateSpModel } from './domain/models/sp-model'
import { FQuery } from 'common/types'


type TCreateCrud  = typeof createCRUD
type TCreateCols = typeof createCols
type TSlugify = typeof slugify

export global {
   namespace sp{
      const createCRUD: TCreateCrud
      const PG_DATABASE: string
      const createCols: TCreateCols
      const models: Record<string, FSpModel>
      const createSpModel: FCreateSpModel
      const slugify: TSlugify
      const poolQuery: FQuery
   }
}