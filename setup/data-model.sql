-- create database
create database sample_app;

-- create custom type
create type gender as enum('m', 'f');

-- create table for orders
create table orders (
	order_id serial not null primary key,
	order_fullname character varying(40) not null,
	order_gender gender not null,
	order_contact character varying(16) not null,
	order_time timestamptz default current_timestamp
);

-- create emitter callback function
create or replace function emit_new_order()
	returns trigger
	language plpgsql
	as $$
		begin
			perform pg_notify('new_order', row_to_json(new)::text);
			return null;
		end;
	$$
;

-- create trigger
create trigger trg_new_order
after insert on "orders"
for each row execute procedure emit_new_order();

-- BONUS!
-- get today's orders
select
	order_id,
	order_fullname,
	order_gender,
	order_contact
from orders
where to_char(order_time, 'YYYY-MM-DD') = to_char(now(), 'YYYY-MM-DD');
