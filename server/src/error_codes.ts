export enum ErrorCode {
  UNEXPECTED_ERROR = "UNEXPECTED_ERROR",

  /**  */
  VALIDATION_ERROR = "VALIDATION_ERROR",
  NOT_FOUND = "NOT_FOUND",
  FORBIDDEN = "FORBIDDEN",

  /** Email provided is not a valid email */
  INVALID_EMAIL = "INVALID_EMAIL",
  /** Provided email already exisits */
  DUPLICATE_EMAIL = "DUPLICATE_EMAIL",

  /** No transfer route between selected currency pair */
  ROUTE_NOT_FOUND = "ROUTE_NOT_FOUND",
  /** The Payment method selected is not supported. Choose from list of supported methods. */
  UNSUPPORTED_METHOD = "UNSUPPORTED_METHOD",
  /** The wallet currency does not match payin or payout currency */
  WALLET_CURRENCY_MISMATCH = "WALLET_CURRENCY_MISMATCH",
  /** The wallet does not have sufficient funds to complete this transaction */
  WALLET_INSUFFICIENT_BALANCE = "WALLET_INSUFFICIENT_BALANCE",
  /** This operation is not valid on the current transfer state  */
  INVALID_STATE = "INVALID_STATE",
  /** The transfer cannot continue because its data does not match the provider's specification */
  VERIFICATION_FAILED = "VERIFICATION_FAILED",
  /** The Quote prepared for this offer has expired */
  OFFER_EXPIRED = "OFFER_EXPIRED",
  /** Transfer has progressed too far to cancel, provider rejected our close message */
  IN_PROGRESS = "IN_PROGRESS",

  /** The transfer beneficiary already exists */
  DUPLICATE_BENEFICIARY = "DUPLICATE_BENEFICIARY",

  /** The specified wallet was not found */
  WALLET_NOT_FOUND = "WALLET_NOT_FOUND",
}
