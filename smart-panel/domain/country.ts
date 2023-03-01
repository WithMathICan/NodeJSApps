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
}

