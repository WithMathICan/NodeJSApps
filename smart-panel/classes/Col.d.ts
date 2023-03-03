import { Fk } from "./Fk";
import { M2M } from "./M2M";

export type TColType = 'number' | 'varchar' | 'date' | 'fk' | 'm2m' | 'id' | 'file';

export interface IDbCol{
   table_catalog: string, 
   table_schema: string, 
   table_name: string, 
   column_name: string,
   is_identity: 'YES' | 'NO'
   is_nullable: 'YES' | 'NO'
   data_type: 'bigint' | 'character varying' | 'ARRAY'
   ordinal_position: number
   udt_name: string
   column_default: any
}

export class Col{
   table_catalog: string
   table_schema: string
   table_name: string
   column_name: string
   is_primary_key: boolean
   is_nullable: boolean
   ordinal_position: number
   column_default: any
   data_type: TColType
   is_array: boolean
   fk: Fk
   m2m: M2M

   constructor(col_data: IDbCol)
}