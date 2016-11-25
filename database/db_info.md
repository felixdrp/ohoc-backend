
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
    'academia',
    'institution',
    '{
      "fields": [
        {
          "name": "name",
          "type": "text",
          "data": "City University"
        },
        {
          "name": "title",
          "type": "text",
          "data": "City University"
        },
        {
          "name": "work",
          "type": "text",
          "data": "Some info about City University"
        }
      ],
      "media": {
        "picture": [],
        "audio": [],
        "video": [],
        "text": []
      }
    }'::jsonb
  ),
  (
    'the bar',
    'place',
    '{"fields": ["mlk", "mlk2"]}'::jsonb
  ),
  (
    'civil service',
    'institution',
    '{"fields": ["mlk", "mlk2"]}'::jsonb
  ),
  (
    'solicitors and agents',
    'institution',
    '{"fields": ["mlk", "mlk2"]}'::jsonb
  ),
  (
    'policy formation',
    'campaign',
    '{"fields": ["mlk", "mlk2"]}'::jsonb
  ),
  (
    'policy formation',
    'committe',
    '{"fields": ["mlk", "mlk2"]}'::jsonb
  ),
  (
    'policy formation',
    'groups and associations',
    '{"fields": ["mlk", "mlk2"]}'::jsonb
  ),
  (
    'publications',
    'law report',
    '{"fields": ["mlk", "mlk2"]}'::jsonb
  ),
  (
    'publications',
    'magazine',
    '{"fields": ["mlk", "mlk2"]}'::jsonb
  ),
  (
    'publications',
    'textbook',
    '{"fields": ["mlk", "mlk2"]}'::jsonb
  ),
  (
    'publications',
    'treatise',
    '{"fields": ["mlk", "mlk2"]}'::jsonb
  ),
  (
    'publications',
    'EIPR',
    '{"fields": ["mlk", "mlk2"]}'::jsonb
  )


insert into public.data (type, subtype, data) values (
    'academia',
    'institution',
    '{
      "fields": [
        {
          "name": "name",
          "type": "text"
        },
        {
          "name": "title",
          "type": "text"
        },
        {
          "name": "surename",
          "type": "text"
        },
        {
          "name": "work",
          "type": "text"
        }
      ],
      "media": {
        "picture": [],
        "audio": [],
        "video": [],
        "text": [],
      }
    }'::jsonb
  )



# Read tables

select * from public.templates where type='mlk';

select * from public.data where type='mlk';

[9.15. JSON Functions and Operators](https://www.postgresql.org/docs/9.5/static/functions-json.html)

select * from templates where structure #>> '{hello,0}' = 'mlk';
select * from templates where structure->'hello' ?| array['supermlk','mlk']
