// export class M2MConnectingTable{
//    schema: string
//    table: string
//    this_column_name: string
//    foreign_column_name: string
// }

// export class M2M{
//    foreign_schema: string
//    foreign_table: string
//    foreign_title_column: string
//    isTree: boolean
//    // connecting_table: M2MConnectingTable

//    constructor(foreign_schema: string, foreign_table: string, foreign_title_column: string, isTree = false)
// }

export class M2M {
   table: string
   title_column: string
   connecting_table: string
   
   constructor(table: string, title_column: string, connecting_table: string)
}