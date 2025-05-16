/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AggregateFunctionBuilder,
  AggregateFunctionNode,
  type Expression,
  ExpressionWrapper,
  type ExtractTypeFromStringReference,
  type FunctionModule,
  FunctionNode,
  type Selectable,
  type StringReference,
  TableNode,
} from 'kysely';

// https://github.com/kysely-org/kysely/blob/master/src/query-builder/function-module.ts

const parseTable = (from: string): TableNode => {
  const SCHEMA_SEPARATOR = '.';

  if (from.includes(SCHEMA_SEPARATOR)) {
    const [schema, table] = from
      .split(SCHEMA_SEPARATOR)
      .map((str) => str.trim());

    return TableNode.createWithSchema(schema, table);
  } else {
    return TableNode.create(from);
  }
};

type IJsonAgg = {
  <DB, TB extends keyof DB, T extends (TB & string) | Expression<unknown>>(
    table: T,
  ): AggregateFunctionBuilder<
    DB,
    TB,
    T extends TB
      ? Selectable<DB[T]>[]
      : T extends Expression<infer O>
        ? O[]
        : never
  >;

  <DB, TB extends keyof DB, RE extends StringReference<DB, TB>>(
    column: RE,
  ): AggregateFunctionBuilder<
    DB,
    TB,
    ExtractTypeFromStringReference<DB, TB, RE>[] | null
  >;
};

export const jsonbAgg: IJsonAgg = (
  table: string | Expression<unknown>,
): any => {
  return new AggregateFunctionBuilder({
    aggregateFunctionNode: AggregateFunctionNode.create('jsonb_agg', [
      typeof table === 'string' ? parseTable(table) : table.toOperationNode(),
    ]),
  });
};

type IToJsonb = {
  <DB, TB extends keyof DB, T extends (TB & string) | Expression<unknown>>(
    fn: FunctionModule<DB, TB>,
    table: T,
  ): ExpressionWrapper<
    DB,
    TB,
    T extends TB ? Selectable<DB[T]> : T extends Expression<infer O> ? O : never
  >;
};

export const toJsonb: IToJsonb = <DB, TB extends keyof DB>(
  _fn: FunctionModule<DB, TB>,
  table: string | Expression<unknown>,
): any => {
  return new ExpressionWrapper(
    FunctionNode.create('to_jsonb', [
      typeof table === 'string' ? parseTable(table) : table.toOperationNode(),
    ]),
  );
};
