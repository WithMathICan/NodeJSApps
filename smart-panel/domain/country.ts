export interface country_country{
   id: number
   title: string
   code: string
   population: number
   created_at: Date
   updated_at: Date
}

export interface country_region{
   id: number
   title: string
   code: string
   population: number
   country_id: string
   created_at: Date
   updated_at: Date
}

export interface country_tags{
   id: number
   title: string
}

export interface country_city{
   id: number
   title: string
   code: string
   population: number
   country_id: string
   region_id: string
   created_at: Date
   updated_at: Date
   tags: number
   img: string
}

export interface country_uploads{
   id: number
   schema_name: string
   table_name: string
   files_dir: string
   img_size: number
}

