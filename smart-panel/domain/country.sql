CREATE table country.country(
    id SERIAL,
    title VARCHAR(250) NOT NULL UNIQUE,
    code VARCHAR(10) NOT NULL UNIQUE,
    "population" INTEGER NOT NULL DEFAULT 10,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (id)
);

CREATE TABLE country.region(
    id SERIAL,
    title VARCHAR(250) NOT NULL,
    code VARCHAR(25),
    "population" INTEGER NOT NULL DEFAULT 10,
    country_id INTEGER NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (id),
    CONSTRAINT fk_region_country_id FOREIGN KEY (country_id) REFERENCES country.country(id) ON DELETE NO ACTION
);

CREATE TABLE country.city(
    id SERIAL,
    title VARCHAR(250) NOT NULL,
    code VARCHAR(25),
    "population" INTEGER NOT NULL DEFAULT 10,
    country_id INTEGER NOT NULL,
    region_id INTEGER NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (id),
    CONSTRAINT fk_city_country_id FOREIGN KEY (country_id) REFERENCES country.country(id) ON DELETE NO ACTION,
    CONSTRAINT fk_city_region_id FOREIGN KEY (region_id) REFERENCES country.region(id) ON DELETE NO ACTION
);

CREATE TABLE country.tags(
    id SERIAL,
    title VARCHAR(50) NOT NULL,
    alias VARCHAR(50) NOT NULL,
    PRIMARY KEY(id)
);
-- ALTER TABLE country.tags ADD CONSTRAINT country_tags_unique_alias UNIQUE (alias);
CREATE UNIQUE INDEX country_tags_unique_alias ON country.tags(alias);

CREATE TABLE country.city___tags(
    city_id INTEGER,
    tag_alias VARCHAR(50),
    PRIMARY KEY (city_id, tag_alias)
)

