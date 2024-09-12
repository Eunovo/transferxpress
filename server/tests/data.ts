import { Close } from "@tbdex/http-client"
import { PaymentKind, TransactionStatus } from "../src/types.js"
import { Transaction } from "../src/models.js"

export const DIDs = [
  `{"uri":"did:jwk:eyJjcnYiOiJFZDI1NTE5Iiwia3R5IjoiT0tQIiwieCI6Ijh1Tlp4UkRMVG5nWUdNNTJlUXY4aERySkxLS0xFOHgxOWZCM19taHBZZTQiLCJraWQiOiJmLU8xWDgzR0dPZlg3T0VLc3pmdHhPeWJ1WGwwY3h3SzdmS3dqelNHejZNIiwiYWxnIjoiRWREU0EifQ","document":{"@context":["https://www.w3.org/ns/did/v1"],"id":"did:jwk:eyJjcnYiOiJFZDI1NTE5Iiwia3R5IjoiT0tQIiwieCI6Ijh1Tlp4UkRMVG5nWUdNNTJlUXY4aERySkxLS0xFOHgxOWZCM19taHBZZTQiLCJraWQiOiJmLU8xWDgzR0dPZlg3T0VLc3pmdHhPeWJ1WGwwY3h3SzdmS3dqelNHejZNIiwiYWxnIjoiRWREU0EifQ","verificationMethod":[{"id":"did:jwk:eyJjcnYiOiJFZDI1NTE5Iiwia3R5IjoiT0tQIiwieCI6Ijh1Tlp4UkRMVG5nWUdNNTJlUXY4aERySkxLS0xFOHgxOWZCM19taHBZZTQiLCJraWQiOiJmLU8xWDgzR0dPZlg3T0VLc3pmdHhPeWJ1WGwwY3h3SzdmS3dqelNHejZNIiwiYWxnIjoiRWREU0EifQ#0","type":"JsonWebKey","controller":"did:jwk:eyJjcnYiOiJFZDI1NTE5Iiwia3R5IjoiT0tQIiwieCI6Ijh1Tlp4UkRMVG5nWUdNNTJlUXY4aERySkxLS0xFOHgxOWZCM19taHBZZTQiLCJraWQiOiJmLU8xWDgzR0dPZlg3T0VLc3pmdHhPeWJ1WGwwY3h3SzdmS3dqelNHejZNIiwiYWxnIjoiRWREU0EifQ","publicKeyJwk":{"crv":"Ed25519","kty":"OKP","x":"8uNZxRDLTngYGM52eQv8hDrJLKKLE8x19fB3_mhpYe4","kid":"f-O1X83GGOfX7OEKszftxOybuXl0cxwK7fKwjzSGz6M","alg":"EdDSA"}}],"authentication":["did:jwk:eyJjcnYiOiJFZDI1NTE5Iiwia3R5IjoiT0tQIiwieCI6Ijh1Tlp4UkRMVG5nWUdNNTJlUXY4aERySkxLS0xFOHgxOWZCM19taHBZZTQiLCJraWQiOiJmLU8xWDgzR0dPZlg3T0VLc3pmdHhPeWJ1WGwwY3h3SzdmS3dqelNHejZNIiwiYWxnIjoiRWREU0EifQ#0"],"assertionMethod":["did:jwk:eyJjcnYiOiJFZDI1NTE5Iiwia3R5IjoiT0tQIiwieCI6Ijh1Tlp4UkRMVG5nWUdNNTJlUXY4aERySkxLS0xFOHgxOWZCM19taHBZZTQiLCJraWQiOiJmLU8xWDgzR0dPZlg3T0VLc3pmdHhPeWJ1WGwwY3h3SzdmS3dqelNHejZNIiwiYWxnIjoiRWREU0EifQ#0"],"capabilityInvocation":["did:jwk:eyJjcnYiOiJFZDI1NTE5Iiwia3R5IjoiT0tQIiwieCI6Ijh1Tlp4UkRMVG5nWUdNNTJlUXY4aERySkxLS0xFOHgxOWZCM19taHBZZTQiLCJraWQiOiJmLU8xWDgzR0dPZlg3T0VLc3pmdHhPeWJ1WGwwY3h3SzdmS3dqelNHejZNIiwiYWxnIjoiRWREU0EifQ#0"],"capabilityDelegation":["did:jwk:eyJjcnYiOiJFZDI1NTE5Iiwia3R5IjoiT0tQIiwieCI6Ijh1Tlp4UkRMVG5nWUdNNTJlUXY4aERySkxLS0xFOHgxOWZCM19taHBZZTQiLCJraWQiOiJmLU8xWDgzR0dPZlg3T0VLc3pmdHhPeWJ1WGwwY3h3SzdmS3dqelNHejZNIiwiYWxnIjoiRWREU0EifQ#0"],"keyAgreement":["did:jwk:eyJjcnYiOiJFZDI1NTE5Iiwia3R5IjoiT0tQIiwieCI6Ijh1Tlp4UkRMVG5nWUdNNTJlUXY4aERySkxLS0xFOHgxOWZCM19taHBZZTQiLCJraWQiOiJmLU8xWDgzR0dPZlg3T0VLc3pmdHhPeWJ1WGwwY3h3SzdmS3dqelNHejZNIiwiYWxnIjoiRWREU0EifQ#0"]},"metadata":{},"privateKeys":[{"crv":"Ed25519","d":"w4xt6g9f6epQCrmKx-jSeSPWFqrhJBQ8YRyYNmDTvCY","kty":"OKP","x":"8uNZxRDLTngYGM52eQv8hDrJLKKLE8x19fB3_mhpYe4","kid":"f-O1X83GGOfX7OEKszftxOybuXl0cxwK7fKwjzSGz6M","alg":"EdDSA"}]}`,
]

export const PARSED_DIDs = [
  JSON.parse(DIDs[0])
]

export const CREDENTIALS = [
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJFZERTQSIsImtpZCI6ImRpZDpkaHQ6Ymg4bWU2OGZzZGI2eHV5eTNkc2g0YWFuY3pleGdhM2szbTdmazRpZTZoajVqeTZpbnE1eSMwIn0.eyJ2YyI6eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSIsImh0dHBzOi8vdzNpZC5vcmcvdmMvc3RhdHVzLWxpc3QvMjAyMS92MSJdLCJ0eXBlIjpbIlZlcmlmaWFibGVDcmVkZW50aWFsIiwiS25vd25DdXN0b21lckNyZWRlbnRpYWwiXSwiaWQiOiJ1cm46dXVpZDozZTUyMDI5Zi1kYTIxLTQ1ZTEtOTM1My0xMmE5NWJkNDE1ZjIiLCJpc3N1ZXIiOiJkaWQ6ZGh0OmJoOG1lNjhmc2RiNnh1eXkzZHNoNGFhbmN6ZXhnYTNrM203Zms0aWU2aGo1ank2aW5xNXkiLCJpc3N1YW5jZURhdGUiOiIyMDI0LTA4LTIxVDA4OjI0OjIyWiIsImNyZWRlbnRpYWxTdWJqZWN0Ijp7ImlkIjoiZGlkOmp3azpleUpqY25ZaU9pSkZaREkxTlRFNUlpd2lhM1I1SWpvaVQwdFFJaXdpZUNJNklqaDFUbHA0VWtSTVZHNW5XVWROTlRKbFVYWTRhRVJ5U2t4TFMweEZPSGd4T1daQ00xOXRhSEJaWlRRaUxDSnJhV1FpT2lKbUxVOHhXRGd6UjBkUFpsZzNUMFZMYzNwbWRIaFBlV0oxV0d3d1kzaDNTemRtUzNkcWVsTkhlalpOSWl3aVlXeG5Jam9pUldSRVUwRWlmUSIsIm5hbWUiOiJub3ZvIiwiY291bnRyeU9mUmVzaWRlbmNlIjoiTmlnZXJpYSJ9LCJleHBpcmF0aW9uRGF0ZSI6IjIwMjYtMDUtMTlUMDg6MDI6MDRaIiwiY3JlZGVudGlhbFNjaGVtYSI6eyJpZCI6Imh0dHBzOi8vc2NoZW1hLm9yZy9QRkkiLCJ0eXBlIjoiSnNvblNjaGVtYSJ9fSwibmJmIjoxNzI0MjI4NjYyLCJqdGkiOiJ1cm46dXVpZDozZTUyMDI5Zi1kYTIxLTQ1ZTEtOTM1My0xMmE5NWJkNDE1ZjIiLCJpc3MiOiJkaWQ6ZGh0OmJoOG1lNjhmc2RiNnh1eXkzZHNoNGFhbmN6ZXhnYTNrM203Zms0aWU2aGo1ank2aW5xNXkiLCJzdWIiOiJkaWQ6andrOmV5SmpjbllpT2lKRlpESTFOVEU1SWl3aWEzUjVJam9pVDB0UUlpd2llQ0k2SWpoMVRscDRVa1JNVkc1bldVZE5OVEpsVVhZNGFFUnlTa3hMUzB4Rk9IZ3hPV1pDTTE5dGFIQlpaVFFpTENKcmFXUWlPaUptTFU4eFdEZ3pSMGRQWmxnM1QwVkxjM3BtZEhoUGVXSjFXR3d3WTNoM1N6ZG1TM2RxZWxOSGVqWk5JaXdpWVd4bklqb2lSV1JFVTBFaWZRIiwiaWF0IjoxNzI0MjI4NjYyLCJleHAiOjE3NzkxNzc3MjR9.5G6IAjRoRx7Z2gvfZfv1x5q0-itYORi7vZ2S1y7zY0vrATpCGH1xFRPLcaU89TVUbWHcpBg4aS9SS_gX_M8GAw"
]

export const PFIs = [
  {
    "id": 1,
    "name": "AquaFinance Capital",
    "did": "did:dht:3fkz5ssfxbriwks3iy5nwys3q5kyx64ettp9wfn1yfekfkiguj1y",
    "rating": 4.5,
  },
  {
    "id": 2,
    "name": "Flowback Financial",
    "did": "did:dht:zkp5gbsqgzn69b3y5dtt5nnpjtdq6sxyukpzo68npsf79bmtb9zy",
  }
]

export const OFFERINGs = [
  {
    "metadata": {
      "from": "did:dht:3fkz5ssfxbriwks3iy5nwys3q5kyx64ettp9wfn1yfekfkiguj1y",
      "protocol": "1.0",
      "kind": "offering",
      "id": "offering_01j5ntkh70egbb43nzbs4be2wq",
      "createdAt": "2024-08-19T17:22:53.793Z"
    },
    "data": {
      "description": "Exchange your Ghanaian Cedis for USDC",
      "payoutUnitsPerPayinUnit": "0.10",
      "payout": {
        "currencyCode": "USDC",
        "methods": [
          {
            "kind": "USDC_WALLET_ADDRESS",
            "estimatedSettlementTime": 43200,
            "requiredPaymentDetails": {
              "$schema": "http://json-schema.org/draft-07/schema#",
              "title": "USDC Required Payment Details",
              "type": "object",
              "required": [
                "address"
              ],
              "additionalProperties": false,
              "properties": {
                "address": {
                  "title": "USDC Wallet Address",
                  "description": "Wallet address to pay out USDC to",
                  "type": "string"
                }
              }
            }
          }
        ]
      },
      "payin": {
        "currencyCode": "GHS",
        "methods": [
          {
            "kind": "GHS_BANK_TRANSFER",
            "requiredPaymentDetails": {}
          }
        ]
      },
      "requiredClaims": {
        "id": "3f78edc1-9f75-478b-a0d8-c9ee2550d366",
        "format": {
          "jwt_vc": {
            "alg": [
              "ES256K",
              "EdDSA"
            ]
          }
        },
        "input_descriptors": [
          {
            "id": "73b86039-d07e-4f9a-9f3d-a8f7a8ec1635",
            "constraints": {
              "fields": [
                {
                  "path": [
                    "$.type[*]"
                  ],
                  "filter": {
                    "type": "string",
                    "const": "KnownCustomerCredential"
                  }
                },
                {
                  "path": [
                    "$.issuer"
                  ],
                  "filter": {
                    "type": "string",
                    "const": "did:dht:bh8me68fsdb6xuyy3dsh4aanczexga3k3m7fk4ie6hj5jy6inq5y"
                  }
                }
              ]
            }
          }
        ]
      }
    },
    "signature": "eyJhbGciOiJFZERTQSIsImtpZCI6ImRpZDpkaHQ6M2ZrejVzc2Z4YnJpd2tzM2l5NW53eXMzcTVreXg2NGV0dHA5d2ZuMXlmZWtma2lndWoxeSMwIn0..aZhzTRTTs-o1c0hYU8HsN05hkzhLXdFRX-zYTJecAIjkiuOudn-d0JUX_pTXt3Jr1uJ4fr1QWDB27UQEmA5mBA"
  },
  {
    "metadata": {
      "from": "did:dht:3fkz5ssfxbriwks3iy5nwys3q5kyx64ettp9wfn1yfekfkiguj1y",
      "protocol": "1.0",
      "kind": "offering",
      "id": "offering_01j5ntkh7aeqsb9rvp52zhfcj7",
      "createdAt": "2024-08-19T17:22:53.803Z"
    },
    "data": {
      "description": "Exchange your Nigerian Naira for Kenyan Shilling",
      "payoutUnitsPerPayinUnit": "0.30",
      "payout": {
        "currencyCode": "KES",
        "methods": [
          {
            "kind": "KES_BANK_TRANSFER",
            "estimatedSettlementTime": 86400,
            "requiredPaymentDetails": {
              "$schema": "http://json-schema.org/draft-07/schema#",
              "title": "KES Required Payment Details",
              "type": "object",
              "required": [
                "accountNumber"
              ],
              "additionalProperties": false,
              "properties": {
                "accountNumber": {
                  "title": "KES Bank Account Number",
                  "description": "Bank account number to pay out KES to",
                  "type": "string"
                }
              }
            }
          }
        ]
      },
      "payin": {
        "currencyCode": "NGN",
        "methods": [
          {
            "kind": "NGN_BANK_TRANSFER",
            "requiredPaymentDetails": {}
          }
        ]
      },
      "requiredClaims": {
        "id": "3f78edc1-9f75-478b-a0d8-c9ee2550d366",
        "format": {
          "jwt_vc": {
            "alg": [
              "ES256K",
              "EdDSA"
            ]
          }
        },
        "input_descriptors": [
          {
            "id": "73b86039-d07e-4f9a-9f3d-a8f7a8ec1635",
            "constraints": {
              "fields": [
                {
                  "path": [
                    "$.type[*]"
                  ],
                  "filter": {
                    "type": "string",
                    "const": "KnownCustomerCredential"
                  }
                },
                {
                  "path": [
                    "$.issuer"
                  ],
                  "filter": {
                    "type": "string",
                    "const": "did:dht:bh8me68fsdb6xuyy3dsh4aanczexga3k3m7fk4ie6hj5jy6inq5y"
                  }
                }
              ]
            }
          }
        ]
      }
    },
    "signature": "eyJhbGciOiJFZERTQSIsImtpZCI6ImRpZDpkaHQ6M2ZrejVzc2Z4YnJpd2tzM2l5NW53eXMzcTVreXg2NGV0dHA5d2ZuMXlmZWtma2lndWoxeSMwIn0..p_BmoQPNtBeNJkB2ds5jtMUXCfgwVtdNTTyqI-X-c_IDX4BiXzV78Q-VO0jtEjRsdqIFekHG8XVwZWR9QowSDQ"
  },
  {
    "metadata": {
      "from": "did:dht:3fkz5ssfxbriwks3iy5nwys3q5kyx64ettp9wfn1yfekfkiguj1y",
      "protocol": "1.0",
      "kind": "offering",
      "id": "offering_01j5ntkh7depzrj90r61ecnts0",
      "createdAt": "2024-08-19T17:22:53.805Z"
    },
    "data": {
      "description": "Exchange your Kenyan Shilling for US Dollars",
      "payoutUnitsPerPayinUnit": "0.007",
      "payout": {
        "currencyCode": "USD",
        "methods": [
          {
            "kind": "USD_BANK_TRANSFER",
            "estimatedSettlementTime": 43200,
            "requiredPaymentDetails": {
              "$schema": "http://json-schema.org/draft-07/schema#",
              "title": "USD Required Payment Details",
              "type": "object",
              "required": [
                "accountNumber",
                "routingNumber"
              ],
              "additionalProperties": false,
              "properties": {
                "accountNumber": {
                  "title": "USD Bank Account Number",
                  "description": "Bank account number to pay out USD to",
                  "type": "string"
                },
                "routingNumber": {
                  "title": "USD Bank Routing Number",
                  "description": "Bank routing number for the USD account",
                  "type": "string"
                }
              }
            }
          }
        ]
      },
      "payin": {
        "currencyCode": "KES",
        "methods": [
          {
            "kind": "KES_BANK_TRANSFER",
            "requiredPaymentDetails": {}
          }
        ]
      },
      "requiredClaims": {
        "id": "3f78edc1-9f75-478b-a0d8-c9ee2550d366",
        "format": {
          "jwt_vc": {
            "alg": [
              "ES256K",
              "EdDSA"
            ]
          }
        },
        "input_descriptors": [
          {
            "id": "73b86039-d07e-4f9a-9f3d-a8f7a8ec1635",
            "constraints": {
              "fields": [
                {
                  "path": [
                    "$.type[*]"
                  ],
                  "filter": {
                    "type": "string",
                    "const": "KnownCustomerCredential"
                  }
                },
                {
                  "path": [
                    "$.issuer"
                  ],
                  "filter": {
                    "type": "string",
                    "const": "did:dht:bh8me68fsdb6xuyy3dsh4aanczexga3k3m7fk4ie6hj5jy6inq5y"
                  }
                }
              ]
            }
          }
        ]
      }
    },
    "signature": "eyJhbGciOiJFZERTQSIsImtpZCI6ImRpZDpkaHQ6M2ZrejVzc2Z4YnJpd2tzM2l5NW53eXMzcTVreXg2NGV0dHA5d2ZuMXlmZWtma2lndWoxeSMwIn0..kunhKpRxictraOUMQY8weCtXUlnQec7gLn5Y13lGhOGdLVfeIcZMC6VsFwC81PGHCLmxX17nV_7pWwh_3pK9Ag"
  },
  {
    "metadata": {
      "from": "did:dht:3fkz5ssfxbriwks3iy5nwys3q5kyx64ettp9wfn1yfekfkiguj1y",
      "protocol": "1.0",
      "kind": "offering",
      "id": "offering_01j5ntkh7efhp80x3pn66qhb45",
      "createdAt": "2024-08-19T17:22:53.806Z"
    },
    "data": {
      "description": "Exchange your US Dollars for Kenyan Shilling",
      "payoutUnitsPerPayinUnit": "140.00",
      "payout": {
        "currencyCode": "KES",
        "methods": [
          {
            "kind": "KES_BANK_TRANSFER",
            "estimatedSettlementTime": 43200,
            "requiredPaymentDetails": {
              "$schema": "http://json-schema.org/draft-07/schema#",
              "title": "KES Required Payment Details",
              "type": "object",
              "required": [
                "accountNumber"
              ],
              "additionalProperties": false,
              "properties": {
                "accountNumber": {
                  "title": "KES Bank Account Number",
                  "description": "Bank account number to pay out KES to",
                  "type": "string"
                }
              }
            }
          }
        ]
      },
      "payin": {
        "currencyCode": "USD",
        "methods": [
          {
            "kind": "USD_BANK_TRANSFER",
            "requiredPaymentDetails": {
              "$schema": "http://json-schema.org/draft-07/schema#",
              "title": "USD Required Payment Details",
              "type": "object",
              "required": [
                "accountNumber",
                "routingNumber"
              ],
              "additionalProperties": false,
              "properties": {
                "accountNumber": {
                  "title": "USD Bank Account Number",
                  "description": "Bank account number to pay in USD",
                  "type": "string"
                },
                "routingNumber": {
                  "title": "USD Bank Routing Number",
                  "description": "Bank routing number for the USD account",
                  "type": "string"
                }
              }
            }
          }
        ]
      },
      "requiredClaims": {
        "id": "3f78edc1-9f75-478b-a0d8-c9ee2550d366",
        "format": {
          "jwt_vc": {
            "alg": [
              "ES256K",
              "EdDSA"
            ]
          }
        },
        "input_descriptors": [
          {
            "id": "73b86039-d07e-4f9a-9f3d-a8f7a8ec1635",
            "constraints": {
              "fields": [
                {
                  "path": [
                    "$.type[*]"
                  ],
                  "filter": {
                    "type": "string",
                    "const": "KnownCustomerCredential"
                  }
                },
                {
                  "path": [
                    "$.issuer"
                  ],
                  "filter": {
                    "type": "string",
                    "const": "did:dht:bh8me68fsdb6xuyy3dsh4aanczexga3k3m7fk4ie6hj5jy6inq5y"
                  }
                }
              ]
            }
          }
        ]
      }
    },
    "signature": "eyJhbGciOiJFZERTQSIsImtpZCI6ImRpZDpkaHQ6M2ZrejVzc2Z4YnJpd2tzM2l5NW53eXMzcTVreXg2NGV0dHA5d2ZuMXlmZWtma2lndWoxeSMwIn0..93uMemTavku61NeaL0FDMEbJBZptIM3b2rqy4EuJO_TBMt_wveQdi4NDC1tNor63yYMExp4GWaXIJ-9GtdyNDQ"
  },
  // -------------------------
  {
    "metadata": {
      "from": "did:dht:zkp5gbsqgzn69b3y5dtt5nnpjtdq6sxyukpzo68npsf79bmtb9zy",
      "protocol": "1.0",
      "kind": "offering",
      "id": "offering_01j5ntkh77ek085m5nnytgkffr",
      "createdAt": "2024-08-19T17:22:53.799Z"
    },
    "data": {
      "description": "Exchange your US Dollars for Euros",
      "payoutUnitsPerPayinUnit": "0.85",
      "payout": {
        "currencyCode": "EUR",
        "methods": [
          {
            "kind": "EUR_BANK_TRANSFER",
            "estimatedSettlementTime": 43200,
            "requiredPaymentDetails": {
              "$schema": "http://json-schema.org/draft-07/schema#",
              "title": "EUR Required Payment Details",
              "type": "object",
              "required": [
                "accountNumber",
                "IBAN"
              ],
              "additionalProperties": false,
              "properties": {
                "accountNumber": {
                  "title": "EUR Bank Account Number",
                  "description": "Bank account number to pay out EUR to",
                  "type": "string"
                },
                "IBAN": {
                  "title": "EUR IBAN",
                  "description": "International Bank Account Number for the EUR account",
                  "type": "string"
                }
              }
            }
          }
        ]
      },
      "payin": {
        "currencyCode": "USD",
        "methods": [
          {
            "kind": "USD_BANK_TRANSFER",
            "requiredPaymentDetails": {
              "$schema": "http://json-schema.org/draft-07/schema#",
              "title": "USD Required Payment Details",
              "type": "object",
              "required": [
                "accountNumber",
                "routingNumber"
              ],
              "additionalProperties": false,
              "properties": {
                "accountNumber": {
                  "title": "USD Bank Account Number",
                  "description": "Bank account number to pay in USD",
                  "type": "string"
                },
                "routingNumber": {
                  "title": "USD Bank Routing Number",
                  "description": "Bank routing number for the USD account",
                  "type": "string"
                }
              }
            }
          }
        ]
      },
      "requiredClaims": {
        "id": "3f78edc1-9f75-478b-a0d8-c9ee2550d366",
        "format": {
          "jwt_vc": {
            "alg": [
              "ES256K",
              "EdDSA"
            ]
          }
        },
        "input_descriptors": [
          {
            "id": "73b86039-d07e-4f9a-9f3d-a8f7a8ec1635",
            "constraints": {
              "fields": [
                {
                  "path": [
                    "$.type[*]"
                  ],
                  "filter": {
                    "type": "string",
                    "const": "KnownCustomerCredential"
                  }
                },
                {
                  "path": [
                    "$.issuer"
                  ],
                  "filter": {
                    "type": "string",
                    "const": "did:dht:bh8me68fsdb6xuyy3dsh4aanczexga3k3m7fk4ie6hj5jy6inq5y"
                  }
                }
              ]
            }
          }
        ]
      }
    },
    "signature": "eyJhbGciOiJFZERTQSIsImtpZCI6ImRpZDpkaHQ6emtwNWdic3Fnem42OWIzeTVkdHQ1bm5wanRkcTZzeHl1a3B6bzY4bnBzZjc5Ym10Yjl6eSMwIn0..DQJ3OdxEVm6rwf_G3r4MuN45xWfL-Y0jGkbqUwNsA3yCiZFT-8gQKqypxrpY705wcsKCH80qlU3bVyOEDFOHDQ"
  },
  {
    "metadata": {
      "from": "did:dht:zkp5gbsqgzn69b3y5dtt5nnpjtdq6sxyukpzo68npsf79bmtb9zy",
      "protocol": "1.0",
      "kind": "offering",
      "id": "offering_01j5ntkh7cep6v3cqng6vcw699",
      "createdAt": "2024-08-19T17:22:53.804Z"
    },
    "data": {
      "description": "Exchange your Euros for US Dollars",
      "payoutUnitsPerPayinUnit": "1.17",
      "payout": {
        "currencyCode": "USD",
        "methods": [
          {
            "kind": "USD_BANK_TRANSFER",
            "estimatedSettlementTime": 43200,
            "requiredPaymentDetails": {
              "$schema": "http://json-schema.org/draft-07/schema#",
              "title": "USD Required Payment Details",
              "type": "object",
              "required": [
                "accountNumber",
                "routingNumber"
              ],
              "additionalProperties": false,
              "properties": {
                "accountNumber": {
                  "title": "USD Bank Account Number",
                  "description": "Bank account number to pay out USD to",
                  "type": "string"
                },
                "routingNumber": {
                  "title": "USD Bank Routing Number",
                  "description": "Bank routing number for the USD account",
                  "type": "string"
                }
              }
            }
          }
        ]
      },
      "payin": {
        "currencyCode": "EUR",
        "methods": [
          {
            "kind": "EUR_BANK_TRANSFER",
            "requiredPaymentDetails": {
              "$schema": "http://json-schema.org/draft-07/schema#",
              "title": "EUR Required Payment Details",
              "type": "object",
              "required": [
                "accountNumber",
                "IBAN"
              ],
              "additionalProperties": false,
              "properties": {
                "accountNumber": {
                  "title": "EUR Bank Account Number",
                  "description": "Bank account number to pay in EUR",
                  "type": "string"
                },
                "IBAN": {
                  "title": "EUR IBAN",
                  "description": "International Bank Account Number for the EUR account",
                  "type": "string"
                }
              }
            }
          }
        ]
      },
      "requiredClaims": {
        "id": "3f78edc1-9f75-478b-a0d8-c9ee2550d366",
        "format": {
          "jwt_vc": {
            "alg": [
              "ES256K",
              "EdDSA"
            ]
          }
        },
        "input_descriptors": [
          {
            "id": "73b86039-d07e-4f9a-9f3d-a8f7a8ec1635",
            "constraints": {
              "fields": [
                {
                  "path": [
                    "$.type[*]"
                  ],
                  "filter": {
                    "type": "string",
                    "const": "KnownCustomerCredential"
                  }
                },
                {
                  "path": [
                    "$.issuer"
                  ],
                  "filter": {
                    "type": "string",
                    "const": "did:dht:bh8me68fsdb6xuyy3dsh4aanczexga3k3m7fk4ie6hj5jy6inq5y"
                  }
                }
              ]
            }
          }
        ]
      }
    },
    "signature": "eyJhbGciOiJFZERTQSIsImtpZCI6ImRpZDpkaHQ6emtwNWdic3Fnem42OWIzeTVkdHQ1bm5wanRkcTZzeHl1a3B6bzY4bnBzZjc5Ym10Yjl6eSMwIn0..n6nsnxfuc1WxrJQkOgBJwO0qtPiklSGGaVEQgOoNZ0OknAbA9jsuIWB6ImTjn6-TDodQOZ-347eXYmf4hbOLBA"
  },
  {
    "metadata": {
      "from": "did:dht:zkp5gbsqgzn69b3y5dtt5nnpjtdq6sxyukpzo68npsf79bmtb9zy",
      "protocol": "1.0",
      "kind": "offering",
      "id": "offering_01j5ntkh7depzrj90r6b9c2rdp",
      "createdAt": "2024-08-19T17:22:53.805Z"
    },
    "data": {
      "description": "Exchange your US Dollars for British Pounds",
      "payoutUnitsPerPayinUnit": "0.75",
      "payout": {
        "currencyCode": "GBP",
        "methods": [
          {
            "kind": "GBP_BANK_TRANSFER",
            "estimatedSettlementTime": 43200,
            "requiredPaymentDetails": {
              "$schema": "http://json-schema.org/draft-07/schema#",
              "title": "GBP Required Payment Details",
              "type": "object",
              "required": [
                "accountNumber",
                "sortCode"
              ],
              "additionalProperties": false,
              "properties": {
                "accountNumber": {
                  "title": "GBP Bank Account Number",
                  "description": "Bank account number to pay out GBP to",
                  "type": "string"
                },
                "sortCode": {
                  "title": "GBP Sort Code",
                  "description": "Bank sort code for the GBP account",
                  "type": "string"
                }
              }
            }
          }
        ]
      },
      "payin": {
        "currencyCode": "USD",
        "methods": [
          {
            "kind": "USD_BANK_TRANSFER",
            "requiredPaymentDetails": {
              "$schema": "http://json-schema.org/draft-07/schema#",
              "title": "USD Required Payment Details",
              "type": "object",
              "required": [
                "accountNumber",
                "routingNumber"
              ],
              "additionalProperties": false,
              "properties": {
                "accountNumber": {
                  "title": "USD Bank Account Number",
                  "description": "Bank account number to pay in USD",
                  "type": "string"
                },
                "routingNumber": {
                  "title": "USD Bank Routing Number",
                  "description": "Bank routing number for the USD account",
                  "type": "string"
                }
              }
            }
          }
        ]
      },
      "requiredClaims": {
        "id": "3f78edc1-9f75-478b-a0d8-c9ee2550d366",
        "format": {
          "jwt_vc": {
            "alg": [
              "ES256K",
              "EdDSA"
            ]
          }
        },
        "input_descriptors": [
          {
            "id": "73b86039-d07e-4f9a-9f3d-a8f7a8ec1635",
            "constraints": {
              "fields": [
                {
                  "path": [
                    "$.type[*]"
                  ],
                  "filter": {
                    "type": "string",
                    "const": "KnownCustomerCredential"
                  }
                },
                {
                  "path": [
                    "$.issuer"
                  ],
                  "filter": {
                    "type": "string",
                    "const": "did:dht:bh8me68fsdb6xuyy3dsh4aanczexga3k3m7fk4ie6hj5jy6inq5y"
                  }
                }
              ]
            }
          }
        ]
      }
    },
    "signature": "eyJhbGciOiJFZERTQSIsImtpZCI6ImRpZDpkaHQ6emtwNWdic3Fnem42OWIzeTVkdHQ1bm5wanRkcTZzeHl1a3B6bzY4bnBzZjc5Ym10Yjl6eSMwIn0..qAHXF0_s0FyvUhZGbQ1XLVyrzUC7KXZD-VL9e7KVycQAlo-qhri7MDjuTq4DgX7T0i6H8ewUpWg-Mx9uRCcfCw"
  },
  {
    "metadata": {
      "from": "did:dht:zkp5gbsqgzn69b3y5dtt5nnpjtdq6sxyukpzo68npsf79bmtb9zy",
      "protocol": "1.0",
      "kind": "offering",
      "id": "offering_01j5ntkh7ff7a999ndekrcw4sh",
      "createdAt": "2024-08-19T17:22:53.807Z"
    },
    "data": {
      "description": "Exchange your US Dollars for Bitcoin",
      "payoutUnitsPerPayinUnit": "0.000033",
      "payout": {
        "currencyCode": "BTC",
        "methods": [
          {
            "kind": "BTC_WALLET_ADDRESS",
            "estimatedSettlementTime": 3600,
            "requiredPaymentDetails": {
              "$schema": "http://json-schema.org/draft-07/schema#",
              "title": "BTC Required Payment Details",
              "type": "object",
              "required": [
                "address"
              ],
              "additionalProperties": false,
              "properties": {
                "address": {
                  "title": "BTC Wallet Address",
                  "description": "Wallet address to pay out BTC to",
                  "type": "string"
                }
              }
            }
          }
        ]
      },
      "payin": {
        "currencyCode": "USD",
        "methods": [
          {
            "kind": "USD_BANK_TRANSFER",
            "requiredPaymentDetails": {
              "$schema": "http://json-schema.org/draft-07/schema#",
              "title": "USD Required Payment Details",
              "type": "object",
              "required": [
                "accountNumber",
                "routingNumber"
              ],
              "additionalProperties": false,
              "properties": {
                "accountNumber": {
                  "title": "USD Bank Account Number",
                  "description": "Bank account number to pay in USD",
                  "type": "string"
                },
                "routingNumber": {
                  "title": "USD Bank Routing Number",
                  "description": "Bank routing number for the USD account",
                  "type": "string"
                }
              }
            }
          }
        ]
      },
      "requiredClaims": {
        "id": "3f78edc1-9f75-478b-a0d8-c9ee2550d366",
        "format": {
          "jwt_vc": {
            "alg": [
              "ES256K",
              "EdDSA"
            ]
          }
        },
        "input_descriptors": [
          {
            "id": "73b86039-d07e-4f9a-9f3d-a8f7a8ec1635",
            "constraints": {
              "fields": [
                {
                  "path": [
                    "$.type[*]"
                  ],
                  "filter": {
                    "type": "string",
                    "const": "KnownCustomerCredential"
                  }
                },
                {
                  "path": [
                    "$.issuer"
                  ],
                  "filter": {
                    "type": "string",
                    "const": "did:dht:bh8me68fsdb6xuyy3dsh4aanczexga3k3m7fk4ie6hj5jy6inq5y"
                  }
                }
              ]
            }
          }
        ]
      }
    },
    "signature": "eyJhbGciOiJFZERTQSIsImtpZCI6ImRpZDpkaHQ6emtwNWdic3Fnem42OWIzeTVkdHQ1bm5wanRkcTZzeHl1a3B6bzY4bnBzZjc5Ym10Yjl6eSMwIn0..EwYK4bKuEReH3jrQkqO84TzaQDvG8CXeToVB03GeNiaqbNF1S6kUYadaBvU-L1U5_qRahZNBdxPNg-fI0U8SDw"
  },
  // ---------------------- generated offerings
  {
    "metadata": {
      "from": "did:dht:zkp5gbsqgzn69b3y5dtt5nnpjtdq6sxyukpzo68npsf79bmtb9zy",
      "protocol": "1.0",
      "kind": "offering",
      "id": "offering_btc_to_usd_01",
      "createdAt": "2024-08-20T10:15:30.123Z"
    },
    "data": {
      "description": "Exchange your Bitcoin for US Dollars",
      "payoutUnitsPerPayinUnit": "30000",
      "payin": {
        "currencyCode": "BTC",
        "methods": [
          {
            "kind": "BTC_WALLET_ADDRESS",
            "requiredPaymentDetails": {
              "$schema": "http://json-schema.org/draft-07/schema#",
              "title": "BTC Required Payment Details",
              "type": "object",
              "properties": {
                "address": {
                  "type": "string",
                  "description": "Bitcoin wallet address for receiving BTC"
                }
              },
              "required": ["address"]
            }
          }
        ]
      },
      "payout": {
        "currencyCode": "USD",
        "methods": [
          {
            "kind": "USD_BANK_TRANSFER",
            "estimatedSettlementTime": 86400,
            "requiredPaymentDetails": {
              "$schema": "http://json-schema.org/draft-07/schema#",
              "title": "USD Required Payment Details",
              "type": "object",
              "properties": {
                "accountNumber": {
                  "type": "string",
                  "description": "Bank account number for USD transfer"
                },
                "routingNumber": {
                  "type": "string",
                  "description": "Bank routing number for USD transfer"
                }
              },
              "required": ["accountNumber", "routingNumber"]
            }
          }
        ]
      },
      "requiredClaims": {
        "id": "btc_to_usd_claims_01",
        "format": {
          "jwt_vc": {
            "alg": ["ES256K", "EdDSA"]
          }
        },
        "input_descriptors": [
          {
            "id": "kyc_credential_btc_to_usd",
            "constraints": {
              "fields": [
                {
                  "path": ["$.type[*]"],
                  "filter": {
                    "type": "string",
                    "const": "KnownCustomerCredential"
                  }
                },
                {
                  "path": ["$.issuer"],
                  "filter": {
                    "type": "string",
                    "const": "did:dht:bh8me68fsdb6xuyy3dsh4aanczexga3k3m7fk4ie6hj5jy6inq5y"
                  }
                }
              ]
            }
          }
        ]
      }
    },
    "signature": "eyJhbGciOiJFZERTQSIsImtpZCI6ImRpZDpkaHQ6emtwNWdic3Fnem42OWIzeTVkdHQ1bm5wanRkcTZzeHl1a3B6bzY4bnBzZjc5Ym10Yjl6eSMwIn0..EXAMPLE_SIGNATURE"
  },
]

export const PFI_OFFERINGs = [
  { pfi: PFIs[0], offerings: OFFERINGs.slice(0, 4) },
  { pfi: PFIs[1], offerings: OFFERINGs.slice(4) }
]

export const CLOSEs = [
  {
    data: {
      success: true
    }
  },
  {
    data: {
      success: false
    }
  }
]

export const TRANSFERs = [
  {
    id: 1,
    userId: 1,
    payinCurrencyCode: "GHS",
    payoutCurrencyCode: "BTC",
    pfiId: 1,
    payinKind: PaymentKind.GHS_BANK_TRANSFER,
    payoutKind: PaymentKind.WALLET_ADDRESS,
    payinAmount: 100,
    payoutAmount: 0.000033,
    narration: "Exchange GHS for BTC",
    fee: 0,
    payoutWalletId: 1,
    status: TransactionStatus.PROCESSING,
    reference: "reference"
  },
  {
    id: 2,
    userId: 1,
    payinCurrencyCode: "BTC",
    payoutCurrencyCode: "GHS",
    pfiId: 1,
    payinKind: PaymentKind.WALLET_ADDRESS,
    payoutKind: PaymentKind.GHS_BANK_TRANSFER,
    payinAmount: 0.000033,
    payoutAmount: 100,
    narration: "Exchange BTC for GHS",
    fee: 0,
    payinWalletId: 1,
    payoutAccountNumber: "1234567890",
    status: TransactionStatus.PROCESSING,
    reference: "reference"
  },
  {
    id: 3,
    userId: 1,
    payinCurrencyCode: "GHS",
    payoutCurrencyCode: "BTC",
    pfiId: 1,
    payinKind: PaymentKind.GHS_BANK_TRANSFER,
    payoutKind: PaymentKind.WALLET_ADDRESS,
    payinAmount: 100,
    payoutAmount: 0.000033,
    narration: "Exchange GHS for BTC",
    fee: 0,
    payoutWalletId: 1,
    status: TransactionStatus.PROCESSING,
    reference: "reference"
  },
  {
    id: 4,
    userId: 1,
    payinCurrencyCode: "BTC",
    payoutCurrencyCode: "GHS",
    pfiId: 1,
    payinKind: PaymentKind.WALLET_ADDRESS,
    payoutKind: PaymentKind.GHS_BANK_TRANSFER,
    payinAmount: 0.000033,
    payoutAmount: 100,
    narration: "Exchange BTC for GHS",
    fee: 0,
    payinWalletId: 1,
    payoutAccountNumber: "1234567890",
    status: TransactionStatus.PROCESSING,
    reference: "reference"
  },
]


export const TRANSACTIONS: Transaction[] = [
  {
    id: 2,
    transferId: 2,
    narration: "Exchange BTC for GHS",
    type: 'DEBIT',
    walletId: 1,
    reference: "reference",
    currencyCode: "BTC",
    amount: 0.000033,
    userId: 1,
    createdAt: new Date(),
    lastUpdatedAt: new Date()
  },
  {
    id: 4,
    transferId: 4,
    narration: "Exchange BTC for GHS",
    type: 'DEBIT',
    walletId: 1,
    reference: "reference",
    currencyCode: "BTC",
    amount: 0.000033,
    userId: 1,
    createdAt: new Date(),
    lastUpdatedAt: new Date()
  }
];
