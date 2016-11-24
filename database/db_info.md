
# Table template

CREATE TABLE public.templates
(
  type character varying(256) NOT NULL,
  subtype character varying(256) NOT NULL,
  structure jsonb,
  CONSTRAINT templates_pkey PRIMARY KEY (type, subtype)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE public.templates
  OWNER TO admin;

# Table Data

CREATE SEQUENCE data_id_seq;
ALTER TABLE public.data_id_seq
  OWNER TO admin;

CREATE TABLE public.data
(
  id integer NOT NULL DEFAULT nextval('data_id_seq'::regclass),
  type character varying(256) NOT NULL,
  subtype character varying(256) NOT NULL,
  data jsonb,
  CONSTRAINT data_pkey PRIMARY KEY (id)
);

ALTER TABLE public.data
  OWNER TO admin;

# Write tables

insert into
  public.templates
values
  (
    'interview',
    'submlk',
    '{"fields": ["mlk", "supermlk"]}'::jsonb
  ),
  (
    'book',
    'science fiction',
    '{"fields": ["mlk", "supermlk"]}'::jsonb
  ),
  (
    'memories',
    'economics',
    '{"fields": ["mlk", "supermlk"]}'::jsonb
  )



insert into public.data (type, subtype, data) values ('Interview','submlk','{"hello": ["mlk", "supermlk"]}')

# Read tables

select * from public.templates where type='mlk';

select * from public.data where type='mlk';

[9.15. JSON Functions and Operators](https://www.postgresql.org/docs/9.5/static/functions-json.html)

select * from templates where structure #>> '{hello,0}' = 'mlk';
select * from templates where structure->'hello' ?| array['supermlk','mlk']
