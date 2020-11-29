import isString from "lodash.isstring";
import isObject from "lodash.isobject";

/**
 * Merge strings into single string with conditional inclusion. Useful for className strings
 *
 * merge('foo', 'bar') => 'foo bar';
 * merge('foo', {'bar': false}) => 'foo';
 */
export function merge(...args: Array<string | { [prop: string]: boolean | undefined } | undefined>) {
  const out = args.reduce((arr: string[], arg = "") => {
    // multiple classes
    if (isString(arg)) {
      const clean = arg.split(" ").filter((val) => val !== "");
      return [...arr, ...clean];
    }

    // toggle classes => only append if evaluates to true
    if (isObject(arg)) {
      const keys = Object.keys(arg);
      const clean = keys.filter((key) => {
        return arg[key];
      });
      return [...arr, ...clean];
    }

    return arr;
  }, []);

  return out.join(" ");
}
