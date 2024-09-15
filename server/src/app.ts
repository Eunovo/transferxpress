import express, { Express, Response, Request, NextFunction } from "express";
import { transformId, validate } from "./utils.js";
import { ValidationError } from "fastest-validator";
import { ErrorCode } from "./error_codes.js";
import {
  LoginRequestBody,
  RegisterRequestBody,
  ReportTransactionRequestBody,
  ReportReason,
  PayinRequestBody,
  PayoutRequestBody,
  PaymentKind,
  TransferAmountUpdateRequestBody,
  CreateSavingsPlan,
  EnableAutoFundRequestBody
} from "./types.js";
import { Users } from "./features/users.js";
import { TBDexError, TBDexService } from "./features/tbdex.js";
import { User } from "./models.js";
import { logger } from "./logger.js";
import { ServerError } from "./error.js";
import { AutoFunder } from "./features/autofund.js";

export interface AppConfig {
  port: number
}

export default function(config: AppConfig, users: Users, tbdex: TBDexService, autoFunder: AutoFunder) {
  const app: Express = express();

  app.use(express.json());
  
  // Log Requests
  app.use((req, res, next) => {
    logger.info({ url: req.url });
    next();
  });

  app.get('/health', (_, res) => {
    res.send('OK');
  });

  const v = (res: Response) => (errors: ValidationError[]) => {
    res.status(400).json({ code: ErrorCode.VALIDATION_ERROR, data: errors });
  }

  app.post('/email-status', (req, res, next) => {
    const body = validate<{ email: string }>(req.body ?? {},  { email: { type: "email" } }, v(res));
    if (body == null) return;
    users.getEmailStatus(body.email)
      .then(result => res.json(result))
      .catch(err => next(err));
  });

  app.post('/register', (req, res, next) => {
    const body = validate<RegisterRequestBody>(req.body, {
      email: { type: "email" },
      password: { type: "string", min: 8 },
      firstname: { type: "string" },
      lastname: { type: "string" },
      country: { type: "string" },
      phoneNumber: { type: "string" }
    }, v(res));
    if (body == null) return;
    users.register(body)
      .then(() => res.send('OK'))
      .catch(err => next(err));
  });

  app.post('/login', (req, res, next) => {
    const body = validate<LoginRequestBody>(req.body, {
      email: { type: "email" },
      password: { type: "string", min: 8 }
    }, v(res));
    if (body == null) return;
    users.login(body.email, body.password)
      .then(result => {
        if (result) {
          res.json({ token: result });
        } else {
          res.status(401).send('Unauthorized');
        }
      })
      .catch(err => next(err));
  });

  type AuthenticatedRequest = Request & { user: User };
  type MaybeAuthenticatedRequest = Request & { user?: User };

  const authenticate = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;
    if (!token) {
      res.status(401).send('Unauthorized');
      return;
    }
    
    users.authenticate(token)
      .then((user) => {
        if (user) {
          req.user = user;
          next();
        } else {
          res.status(401).send('Unauthorized');
        }
      })
      .catch(err => next(err));
  };

  // @ts-ignore
  app.get('/profile', authenticate, (req: AuthenticatedRequest, res) => {
    res.json({
      id: req.user.id,
      email: req.user.email,
      firstname: req.user.firstname,
      lastname: req.user.lastname,
      country: req.user.country,
      phoneNumber: req.user.phoneNumber,
      createdAt: req.user.createdAt,
      lastUpdatedAt: req.user.lastUpdatedAt
    });
  });

  // @ts-ignore
  app.get('/wallets', authenticate, (req: AuthenticatedRequest, res, next) => {
    users.getWallets(req.user.id)
      .then(result => res.json(result))
      .catch(err => next(err));
  });

  // @ts-ignore
  app.get('/transactions', authenticate, (req: AuthenticatedRequest, res, next) => {
    users.getTransactions(req.user.id)
      .then(result => res.json(result))
      .catch(err => next(err));
  });

  // @ts-ignore
  app.post('/transactions/:id/report', authenticate, (req: AuthenticatedRequest, res, next) => {
    const body = validate<ReportTransactionRequestBody>(req.body, {
      reason: { type: "string", enum: Object.values(ReportReason) },
      other: { type: "string", optional: true }
    }, v(res));
    if (body == null) return;
    const transactionId = transformId(req.params.id);
    if (transactionId == null) {
      res.status(404).send("Invalid transaction id");
      return;
    }
    users.reportTransaction(req.user.id, transactionId, body)
      .then(() => res.send('OK'))
      .catch(err => next(err));
  });

  // @ts-ignore
  app.get('/market-data', authenticate, (_req, res, next) => {
    tbdex.getMarketData()
      .then(result => res.json(result))
      .catch((err) => next(err));
  });

  // @ts-ignore
  app.get('/cards', authenticate, (req: AuthenticatedRequest, res, next) => {
    users.getSavedCards(req.user.id)
      .then(result => res.json(result))
      .catch(err => next(err));
  });

  // @ts-ignore
  app.get('/beneficiaries', authenticate, (req: AuthenticatedRequest, res, next) => {
    users.getBeneficiaries(req.user.id)
      .then(result => res.json(result))
      .catch(err => next(err));
  });

  // @ts-ignore
  app.get('/transfers', authenticate, (req: AuthenticatedRequest, res, next) => {
    users.getTransfers(req.user.id)
      .then(result => res.json(result))
      .catch(err => next(err));
  });

  // @ts-ignore
  app.get('/transfers/:id', authenticate, (req: AuthenticatedRequest, res, next) => {
    const transferId = transformId(req.params.id);
    if (transferId == null) {
      res.status(404).send("Invalid transfer id");
      return;
    }
    users.getTransfer(transferId, req.user.id)
      .then(result => res.json(result))
      .catch(err => next(err));
  });

  // @ts-ignore
  app.post('/transfers/start/:payinCurrencyCode/:payoutCurrencyCode', authenticate, (req: AuthenticatedRequest, res, next) => {
    const payinCurrencyCode = req.params.payinCurrencyCode;
    const payoutCurrencyCode = req.params.payoutCurrencyCode;
    users.startTransfer(req.user.id, payinCurrencyCode, payoutCurrencyCode)
      .then(result => res.json(result))
      .catch(err => next(err));
  });

  // @ts-ignore
  app.post('/transfers/:id/payin', authenticate, (req: AuthenticatedRequest, res, next) => {
    const transferId = transformId(req.params.id);
    if (transferId == null) {
      res.status(404).send("Invalid transfer id");
      return;
    }
    const body = validate<PayinRequestBody>(req.body, {
      kind: { type: "string", enum: Object.values(PaymentKind) },
      walletId: { type: "number", optional: true },
      cardId: { type: "number", optional: true },
      cardNumber: { type: "string", optional: true },
      cardHolderName: { type: "string", optional: true },
      expiryMonth: { type: "number", optional: true },
      expiryYear: { type: "number", optional: true },
      cvv: { type: "string", optional: true },
      saveCard: { type: "boolean", optional: true },
      accountNumber: { type: "string", optional: true },
      routingNumber: { type: "string", optional: true },
      bankCode: { type: "string", optional: true },
      sortCode: { type: "string", optional: true },
      BSB: { type: "string", optional: true },
      IBAN: { type: "string", optional: true },
      CLABE: { type: "string", optional: true },
      address: { type: "string", optional: true }
    }, v(res));
    if (body == null) return;
    users.saveTransferPayinData(req.user.id, transferId, body)
      .then(result => res.json(result))
      .catch(err => next(err));
  });

  // @ts-ignore
  app.post('/transfers/:id/payout', authenticate, (req: AuthenticatedRequest, res, next) => {
    const transferId = transformId(req.params.id);
    if (transferId == null) {
      res.status(404).send("Invalid transfer id");
      return;
    }
    const body = validate<PayoutRequestBody>(req.body, {
      kind: { type: "string", enum: Object.values(PaymentKind) },
      walletId: { type: "number", optional: true },
      accountNumber: { type: "string", optional: true },
      routingNumber: { type: "string", optional: true },
      bankCode: { type: "string", optional: true },
      sortCode: { type: "string", optional: true },
      BSB: { type: "string", optional: true },
      IBAN: { type: "string", optional: true },
      CLABE: { type: "string", optional: true },
      address: { type: "string", optional: true }
    }, v(res));
    if (body == null) return;
    users.saveTransferPayoutData(req.user.id, transferId, body)
      .then(result => res.json(result))
      .catch(err => next(err));
  });

  // @ts-ignore
  app.post('/transfers/:id/amount', authenticate, (req: AuthenticatedRequest, res, next) => {
    const transferId = transformId(req.params.id);
    if (transferId == null) {
      res.status(404).send("Invalid transfer id");
      return;
    }
    const body = validate<TransferAmountUpdateRequestBody>(req.body, {
      amount: { type: "string" },
      narration: { type: "string", optional: true }
    }, v(res));
    if (body == null) return;
    users.saveTransferAmount(req.user, transferId, body)
      .then((result) => res.json(result))
      .catch(err => next(err));
  });

  // @ts-ignore
  app.post('/transfers/:id/confirm', authenticate, (req: AuthenticatedRequest, res, next) => {
    const transferId = transformId(req.params.id);
    if (transferId == null) {
      res.status(404).send("Invalid transfer id");
      return;
    }
    users.confirmTransfer(req.user, transferId)
      .then(() => res.send('OK'))
      .catch(err => next(err));
  });

  // @ts-ignore
  app.post('/transfers/:id/cancel', authenticate, (req: AuthenticatedRequest, res, next) => {
    const transferId = transformId(req.params.id);
    if (transferId == null) {
      res.status(404).send("Invalid transfer id");
      return;
    }
    users.cancelTransfer(req.user.id, transferId)
      .then(() => res.send('OK'))
      .catch(err => next(err));
  });

  // @ts-ignore
  app.get('/transfers/:id/status', authenticate, (req: AuthenticatedRequest, res, next) => {
    const transferId = transformId(req.params.id);
    if (transferId == null) {
      res.status(404).send("Invalid transfer id");
      return;
    }
    users.getTransferStatus(req.user, transferId)
      .then(result => res.json(result))
      .catch(err => next(err));
  });

  // @ts-ignore
  app.post('/transfers/:id/save-beneficiary', authenticate, (req: AuthenticatedRequest, res, next) => {
    const transferId = transformId(req.params.id);
    if (transferId == null) {
      res.status(404).send("Invalid transfer id");
      return;
    }
    users.saveBeneficiary(req.user.id, transferId)
      .then(() => res.send('OK'))
      .catch(err => next(err));
  });

  // @ts-ignore
  app.get('/savings-plans', authenticate, (req: AuthenticatedRequest, res, next) => {
    users.getAllSavingsPlans(req.user.id)
      .then(result => res.json(result))
      .catch(err => next(err))
  });

  // @ts-ignore
  app.get('/savings-plans/:id', authenticate, (req: AuthenticatedRequest, res, next) => {
    const savingsPlanId = transformId(req.params.id);
    if (savingsPlanId == null) {
      res.status(404).send("Invalid savings plan id");
      return;
    }
    users.getSavingsPlanById(req.user.id, savingsPlanId)
      .then(result => res.json(result))
      .catch(err => next(err))
  });

  // @ts-ignore
  app.post('/savings-plans', authenticate, (req: AuthenticatedRequest, res, next) => {
    const body = validate<CreateSavingsPlan>(req.body, {
      name: { type: "string" },
      currencyCode: { type: "string" },
      durationInMonths: { type: "number" }
    }, v(res));
    if (body == null) return;
    users.createSavingsPlan(req.user.id, body)
      .then((result) => res.json(result))
      .catch(err => next(err));
  });

  // @ts-ignore
  app.post('/savings-plans/:id/auto-fund/enable', authenticate, (req: AuthenticatedRequest, res, next) => {
    const savingsPlanId = transformId(req.params.id);
    if (savingsPlanId == null) {
      res.status(404).send("Invalid savings plan id");
      return;
    }
    const body = validate<EnableAutoFundRequestBody>(req.body, {
      walletId: { type: "string" },
      amount: { type: "string" }
    }, v(res));
    if (body == null) return;
    users.enableAutoFund(req.user.id, savingsPlanId, body)
      .then(() => res.send('OK'))
      .catch(err => next(err));
  });

  // @ts-ignore
  app.post('/savings-plans/:id/rollover', authenticate, (req: AuthenticatedRequest, res, next) => {
    const savingsPlanId = transformId(req.params.id);
    if (savingsPlanId == null) {
      res.status(404).send("Invalid savings plan id");
      return;
    }
    users.rolloverSavingsPlan(req.user.id, savingsPlanId)
      .then(() => res.send('OK'))
      .catch(err => next(err));
  });

  //@ts-ignore
  app.post('/auto-fund', authenticate, (req: AuthenticatedRequest, res, next) => {
    autoFunder.run()
      .then(() => res.send('OK'))
      .catch(err => next(err))
  });

  // Log Requests
  app.use((req: MaybeAuthenticatedRequest, res) => {
    logger.info({ url: req.url, userId: req.user?.id, statusCode: res.statusCode });
  });

  // Error handler
  app.use((err: Error, req: MaybeAuthenticatedRequest, res: Response, _next: NextFunction) => {
    if (err instanceof ServerError) {
      logger.error({ ...err.data, url: req.url, userId: req.user?.id });
      if (err.data.code === ErrorCode.NOT_FOUND) {
        res.status(404).json(err.data);
        return;
      }
      res.status(400).json(err.data);
      return;
    }
    if (err instanceof TBDexError) {
      logger.error({ err, url: req.url, userId: req.user?.id });
      res.status(500).send("An unexpected error occurred with an upstream provider");
      return;
    }
    logger.error({ err, url: req.url, userId: req.user?.id });
    res.status(500).send("An unexpected error occurred");
  });

  app.listen(config.port, () => {
    logger.info(`Server is running on port ${config.port}`);
  });

  return {
    app
  }
}
