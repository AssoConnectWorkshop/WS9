create table if not exists association_types (
  id bigint generated always as identity primary key,
  label text not null,
  created_at timestamptz not null default now()
);

insert into association_types (label) values ('Sport'), ('Culture');
