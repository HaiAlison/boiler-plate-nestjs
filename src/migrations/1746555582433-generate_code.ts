import { MigrationInterface, QueryRunner } from 'typeorm';

export class GenerateCode1746555582433 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
    
CREATE TABLE IF NOT EXISTS public.code_sequence
(
    id serial NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    deleted_at timestamp with time zone,
    code character varying COLLATE pg_catalog."default" NOT NULL,
    table_name character varying COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT "PK_801f8f98dddf35888ad8f2eda50" PRIMARY KEY (id),
    CONSTRAINT "UQ_379cade254749a491772f6d8aad" UNIQUE (code)
)
    `);
    await queryRunner.query(`
        -- FUNCTION: public.generate_code(text, integer, text)

-- DROP FUNCTION IF EXISTS public.generate_code(text, integer, text);

CREATE OR REPLACE FUNCTION public.generate_code(
\tprefix text,
\tnum_digits integer,
\ttablename text)
    RETURNS text
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
    new_code TEXT;
    max_value TEXT;
BEGIN

    -- Lock the table in exclusive mode
    LOCK TABLE code_sequence IN EXCLUSIVE MODE;
    
    -- Calculate the maximum value based on the number of digits
    max_value := RPAD('9', num_digits, '9');

    -- Find the current maximum code for the given tenant_id
    SELECT COALESCE(MAX(SUBSTRING(code FROM LENGTH(prefix) + 1)::INTEGER), 0) INTO new_code FROM code_sequence WHERE  code LIKE prefix || '%' and table_name = tablename;

    -- If the current maximum value is equal to or exceeds the calculated maximum value, reset the sequence for the specific tenant
    IF CAST(new_code AS INTEGER) >= CAST(max_value AS INTEGER) THEN
        SELECT SETVAL(pg_get_serial_sequence('code_sequence', 'id'), 1, false);
        new_code := prefix || LPAD(CAST(nextval(pg_get_serial_sequence('code_sequence', 'id'))::INTEGER + 1 AS TEXT), num_digits, '0');
    ELSE
        -- Increment the current maximum value and generate the code for the specific tenant
        new_code := prefix || LPAD((CAST(new_code AS INTEGER) + 1)::TEXT, num_digits, '0');
    END IF;
    INSERT INTO code_sequence (code, table_name) VALUES (new_code, tablename);

    RETURN new_code;
END;
$BODY$;

ALTER FUNCTION public.generate_code(text, integer, text)
    OWNER TO postgres;
`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
