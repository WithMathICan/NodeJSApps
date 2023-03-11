export interface ISecretPermission {
   id: string
   table_schema: string
   table_name: string
   permission_value: string
}

export interface ISecretPermissionValue {
   id: string
   alias: string
   title: string
}

export interface ISecretGroup {
   id: string
   title: string
   permissions: number
}

