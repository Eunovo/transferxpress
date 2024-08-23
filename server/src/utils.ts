import Validator, { AsyncCheckFunction, SyncCheckFunction, ValidationSchema, ValidationError } from "fastest-validator";
import { Logger } from "pino";
import { ID, PaymentDetails, PaymentKind } from "./types.js";
import { JsonSchema } from "@tbdex/http-client";

export type InsertData<T> = Omit<T, 'id'>;

const cachedValidators: Map<string, SyncCheckFunction | AsyncCheckFunction> = new Map();
// @ts-ignore
const validator = new Validator();
export function validate<T>(data: unknown, schema: ValidationSchema, errorCallback: (errors: ValidationError[]) => void): T | null {
  const key = JSON.stringify(schema);
  let check = cachedValidators.get(key);
  if (!check) {
    check = validator.compile(schema);
    if (!check) {
      throw new Error("Failed to compile schema");
    }
    cachedValidators.set(key, check);
  }
  const result = check(data);
  if (Array.isArray(result) && result.length > 0) {
    errorCallback(result);
    return  null;
  }

  return data as T;
}

export function transformId(id: string): ID | null {
  const transformed = parseInt(id);
  if (isNaN(transformed)) return null;
  return transformed;
}

export function isPaymentKind(value: string): value is PaymentKind {
  return Object.values(PaymentKind).includes(value as PaymentKind);
}

/**
 * Warn if condition evaluates to true
 */
export function softAssert(logger: Logger, condition: boolean, message: string) {
  if (condition) {
    logger.warn(message);
  }
}

export function extractRequiredPaymentDetails(schema: JsonSchema): Array<keyof PaymentDetails> {
  if (typeof schema == "boolean") return [];
  if (!("properties" in schema)) return [];
  return Object.keys(schema.properties).map((key) => key as keyof PaymentDetails);
}
