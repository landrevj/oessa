// https://www.reddit.com/r/typescript/comments/hr19a2/cool_helper_type_that_will_allow_you_to/
type Primitive = string | number | bigint | boolean | null | undefined;
export type Replaced<T, TReplace, TWith, TKeep = Primitive> = T extends
  | TReplace
  | TKeep
  ? T extends TReplace
    ? TWith | Exclude<T, TReplace>
    : T
  : {
      [P in keyof T]: Replaced<T[P], TReplace, TWith, TKeep>;
    };

export type SerializedDates<T> = Replaced<T, Date, string>;
