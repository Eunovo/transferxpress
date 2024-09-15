# TransferXpress
Send money anywhere in the world.

## Profitability
TransferXpress generates revenue through multiple channels:

1. Transfer Fees:
   - We charge competitive fees for money transfers.
   - Fees vary based on the transfer amount, currencies involved, and destination.
   - See [processing fee in code](https://github.com/Eunovo/transferxpress/blob/091d0a1496fe5211cf43a91b465be7c70048912c/server/src/features/users.ts#L645-L651).

2. Savings Feature:
   - Users can lock up funds in our savings plans.
   - We invest these funds and generate returns.
   - A portion of the investment returns contributes to our revenue.

3. Early Withdrawal Penalties:
   - Savings plans have a set duration (e.g., 6 months).
   - Users incur a penalty fee for withdrawing funds before maturity.
   - These penalty fees contribute to our revenue stream.
   - See [penalty fee in code](https://github.com/Eunovo/transferxpress/blob/091d0a1496fe5211cf43a91b465be7c70048912c/server/src/features/users.ts#L653-L665).

4. Avoiding FX losses:
   - We process all currency swap orders instantly to avoid losses caused by fufilling currency swap orders at a higher-than-agreed FX rate.

By diversifying our revenue streams, and avoiding FX losses, we maintain profitability while offering competitive rates and valuable services to our customers.


## Optionality
TransferXpress leverages optionality in selecting the best Payment Financial Institution (PFI) for each transfer, ensuring optimal service and cost-effectiveness for our customers. Here's how we select the best PFI:

1. Multiple PFI Options:
   - We maintain relationships with various PFIs to handle different currency pairs and transfer routes.
   - This gives us flexibility in routing transfers through the most efficient channels.

2. Dynamic PFI Selection:
   - For each transfer, we query multiple PFIs to get real-time quotes.
   - Our system compares these quotes based on factors such as:
     - Exchange rates
     - Transfer fees
     - Processing times
     - Historical reliability

3. Cost Optimization:
   - We select the PFI offering the best combination of exchange rate and fees.
   - This ensures our customers get the most value for their money.

4. Speed Consideration:
   - If multiple PFIs offer similar costs, we prioritize the one with faster processing times.

5. Reliability Factors:
   - We consider the historical performance and reliability of each PFI.
   - PFIs with higher success rates and fewer issues are preferred.

6. Automatic Fallback:
   - If the primary selected PFI encounters issues, our system automatically tries the next best option.
   - This ensures transfers are processed even if one PFI is experiencing difficulties.

7. Continuous Evaluation:
   - We regularly evaluate PFI performance and adjust our selection algorithms.
   - This allows us to adapt to changing market conditions and PFI performance over time.

By implementing this dynamic PFI selection process, we ensure that each transfer is optimized for cost, speed, and reliability, providing the best possible service to our customers while maintaining our competitive edge in the market.


## Customer Management
Upon registration, we:

- Create and store a unique DID for each user.
- Request a KCC Verifiable Credential for each user, using their registration details and their unique DID.
- See [in code](https://github.com/Eunovo/transferxpress/blob/091d0a1496fe5211cf43a91b465be7c70048912c/server/src/features/users.ts#L85-L90).

Only after we have stored the DID and KCC Verifiable Credential is the registration process complete.

During transfers, we simply retrieve the user's DID and KCC Verifiable Credential from our Database and provide it to the PFI. This approach ensures ease-of-use and faster transfers for the user. 

## Customer Satisfaction
Each PFI is assigned a **rating**, which we use to track their historical performance. We employ the following methods to evaluate PFI performance on transfers and adjust their ratings if necessary:

1. Order Settlement Time Monitoring:
   - Each Order is expected to complete under the time specified in the Offerring under the `estimatedSettlementTime` field.
   - If an Order fails to complete in time, we record this in our short-term cache.
   - If enough Orders are delayed in a short period of time as indicated by our short-term cache, we temporarily disable this PFI to preserve customer experience. 
   - See [handleTransferComplete in code](https://github.com/Eunovo/transferxpress/blob/091d0a1496fe5211cf43a91b465be7c70048912c/server/src/features/users.ts#L800-L811).

2. Transaction Reporting System:
   - We provide features to allow customers report issues with transfers.
   - We adjust the PFI rating based on the issue reported.
   - If enough transfers are reported in short period of time, we will temporarily disable the PFI to preserve customer experience.
   - If the PFI's rating falls low enough, we employ a more permanent ban on the PFI and require that a member of our team evaluate the PFI and manually restore it's status if necessary.
   - See [reportTransaction in code](https://github.com/Eunovo/transferxpress/blob/091d0a1496fe5211cf43a91b465be7c70048912c/server/src/features/users.ts#L145-L191)

By implementing this automatic PFI performance evaluation, we ensure that our customers always use the best PFIs for their transfers.
