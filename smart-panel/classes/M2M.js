/* eslint-disable camelcase */
'use strict'

// export class M2MConnectingTable{
//    /**
//     * @param {string} schema
//     * @param {string} table
//     * @param {string} this_column_name
//     * @param {string} foreign_column_name
//     */
//    constructor(schema, table, this_column_name, foreign_column_name){
//       this.schema = schema
//       this.table = table
//       this.this_column_name = this_column_name
//       this.foreign_column_name = foreign_column_name
//    }
// }

// export class M2M{
//    /**
//     * @param {string} foreign_schema
//     * @param {string} foreign_table
//     * @param {string} foreign_title_column
//     * @param {M2MConnectingTable} connecting_table
//     */
//    constructor(foreign_schema, foreign_table, foreign_title_column, connecting_table, isTree = false){
//       this.foreign_schema = foreign_schema
//       this.foreign_table = foreign_table
//       this.foreign_title_column = foreign_title_column
//       this.connecting_table = connecting_table
//       // this.isTree = isTree
//    }
// }

class M2M {
   /**
    * @param {string} table
    * @param {string} title_column
    * @param {string} connecting_table
    */
   constructor(table, title_column, connecting_table) {
      this.table = table
      this.title_column = title_column
      this.connecting_table = connecting_table
   }
}

module.exports = { M2M }
