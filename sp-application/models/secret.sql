CREATE TABLE secret.permission_value(
   id SERIAL PRIMARY KEY,
   alias VARCHAR(50) UNIQUE NOT NULL,
   title VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE secret.permission(
   id SERIAL PRIMARY KEY,
   table_schema VARCHAR(50) NOT NULL,
   table_name VARCHAR(50) NOT NULL,
   permission_value VARCHAR(50) NOT NULL,
   UNIQUE(table_schema, table_name, permission_value),
   CONSTRAINT fk_secret_permisiions_id FOREIGN KEY (permission_value) REFERENCES secret.permission_value(alias) ON DELETE NO ACTION
);

CREATE TABLE secret.group(
   id SERIAl PRIMARY KEY,
   title VARCHAR(50) UNIQUE,
   permissions INTEGER[]
);

CREATE TABLE country.permission___group(
   permission_id INTEGER,
   group_id VARCHAR(50),
   PRIMARY KEY (permission_id, group_id)
);
