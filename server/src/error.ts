import { ApiError } from "./types.js";

export class ServerError extends Error {
  constructor(public data: ApiError) {
    super(`${data.code}: ${JSON.stringify(data.data)}`);
  }
}
