export interface PostgresError {
  query: string;
  parameters: string[];
  driverError: {
    length: number;
    name: string;
    severity: string;
    code: string;
    detail: string;
    schema: string;
    table: string;
    constraint: string;
    file: string;
    line: string;
    routine: string;
  };
  length: number;
  severity: string;
  code: string;
  detail: string;
  schema: string;
  table: string;
  constraint: string;
  file: string;
  line: string;
  routine: string;
}
