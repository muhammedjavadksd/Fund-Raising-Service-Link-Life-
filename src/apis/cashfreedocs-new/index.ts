import type * as types from './types';
import type { ConfigOptions, FetchResponse } from 'api/dist/core'
import Oas from 'oas';
import APICore from 'api/dist/core';
import definition from './openapi.json';

class SDK {
  spec: Oas;
  core: APICore;

  constructor() {
    this.spec = Oas.init(definition);
    //@ts-ignore
    this.core = new APICore(this.spec as Oas, 'cashfreedocs-new/2023-10-26 (api/6.1.2)');
  }

  /**
   * Optionally configure various options that the SDK allows.
   *
   * @param config Object of supported SDK options and toggles.
   * @param config.timeout Override the default `fetch` request timeout of 30 seconds. This number
   * should be represented in milliseconds.
   */
  config(config: ConfigOptions) {
    this.core.setConfig(config);
  }

  /**
   * If the API you're using requires authentication you can supply the required credentials
   * through this method and the library will magically determine how they should be used
   * within your API request.
   *
   * With the exception of OpenID and MutualTLS, it supports all forms of authentication
   * supported by the OpenAPI specification.
   *
   * @example <caption>HTTP Basic auth</caption>
   * sdk.auth('username', 'password');
   *
   * @example <caption>Bearer tokens (HTTP or OAuth 2)</caption>
   * sdk.auth('myBearerToken');
   *
   * @example <caption>API Keys</caption>
   * sdk.auth('myApiKey');
   *
   * @see {@link https://spec.openapis.org/oas/v3.0.3#fixed-fields-22}
   * @see {@link https://spec.openapis.org/oas/v3.1.0#fixed-fields-22}
   * @param values Your auth credentials for the API; can specify up to two strings or numbers.
   */
  auth(...values: string[] | number[]) {
    this.core.setAuth(...values);
    return this;
  }

  /**
   * If the API you're using offers alternate server URLs, and server variables, you can tell
   * the SDK which one to use with this method. To use it you can supply either one of the
   * server URLs that are contained within the OpenAPI definition (along with any server
   * variables), or you can pass it a fully qualified URL to use (that may or may not exist
   * within the OpenAPI definition).
   *
   * @example <caption>Server URL with server variables</caption>
   * sdk.server('https://{region}.api.example.com/{basePath}', {
   *   name: 'eu',
   *   basePath: 'v14',
   * });
   *
   * @example <caption>Fully qualified server URL</caption>
   * sdk.server('https://eu.api.example.com/v14');
   *
   * @param url Server URL
   * @param variables An object of variables to replace into the server URL.
   */
  server(url: string, variables = {}) {
    this.core.setServer(url, variables);
  }

  /**
   * Use this API to generate the token from client id and secret
   *
   * @summary Generate Bearer Token
   * @throws FetchError<401, types.GenerateBearerTokenResponse401> Unauthorized Error
   */
  generateBearerToken(metadata?: types.GenerateBearerTokenMetadataParam): Promise<FetchResponse<200, types.GenerateBearerTokenResponse200>> {
    return this.core.fetch('/payout/v1/authorize', 'post', metadata);
  }

  /**
   * Use this API to verify the bearer token generated. If the token does not
   * exist/invalid/expired, the response 'Token is not valid' is returned. Regenerate token
   * in case of token expiry to make API calls (use /payout/v1/authorize for this).
   *
   * @summary Verify the bearer token generated
   * @throws FetchError<403, types.VerifyTokenResponse403> Forbidden Error
   */
  verifyToken(metadata?: types.VerifyTokenMetadataParam): Promise<FetchResponse<200, types.VerifyTokenResponse200>> {
    return this.core.fetch('/payout/v1/verifyToken', 'post', metadata);
  }

  /**
   * Use this API to add a beneficiary to your Cashfree account by providing the bank account
   * number, IFSC, and other required details. Before you request a transfer, ensure the
   * account has been successfully added as a beneficiary.
   *
   * @summary Add a beneficiary for making transfers to it.
   * @throws FetchError<403, types.AddBeneficiaryResponse403> Forbidden Error
   * @throws FetchError<409, types.AddBeneficiaryResponse409> Resource Conflict Error
   * @throws FetchError<412, types.AddBeneficiaryResponse412> Precondition Failed Error
   * @throws FetchError<422, types.AddBeneficiaryResponse422> Unprocessable Entity
   */
  addBeneficiary(body: types.AddBeneficiaryBodyParam, metadata?: types.AddBeneficiaryMetadataParam): Promise<FetchResponse<200, types.AddBeneficiaryResponse200>> {
    return this.core.fetch('/payout/v1/addBeneficiary', 'post', body, metadata);
  }

  /**
   * Use this API to get the details of a particular beneficiary in your account.
   *
   * @summary Get Beneficiary details by id
   * @throws FetchError<403, types.GetBeneficiaryResponse403> Forbidden Error
   * @throws FetchError<404, types.GetBeneficiaryResponse404> Resource Not Found
   */
  getBeneficiary(metadata: types.GetBeneficiaryMetadataParam): Promise<FetchResponse<200, types.GetBeneficiaryResponse200>> {
    return this.core.fetch('/payout/v1/getBeneficiary/{beneId}', 'get', metadata);
  }

  /**
   * Use this API to get the beneficiary ID by providing the bank account number and ifsc.
   *
   * @summary Get Beneficiary ID by bank account and ifsc
   * @throws FetchError<403, types.GetBeneficiaryIdResponse403> Forbidden Error
   * @throws FetchError<404, types.GetBeneficiaryIdResponse404> Resource Not Found
   */
  getBeneficiaryID(metadata: types.GetBeneficiaryIdMetadataParam): Promise<FetchResponse<200, types.GetBeneficiaryIdResponse200>> {
    return this.core.fetch('/payout/v1/getBeneId', 'get', metadata);
  }

  /**
   * Use this API to remove an existing beneficiary from a list of added beneficiaries.
   *
   * @summary Remove Beneficiary
   * @throws FetchError<403, types.RemoveBeneficiaryResponse403> Forbidden Error
   */
  removeBeneficiary(body: types.RemoveBeneficiaryBodyParam, metadata?: types.RemoveBeneficiaryMetadataParam): Promise<FetchResponse<200, types.RemoveBeneficiaryResponse200>> {
    return this.core.fetch('/payout/v1/removeBeneficiary', 'post', body, metadata);
  }

  /**
   * Use this API to fetch the transaction history for a particular beneficiary and for a
   * desired period of time.
   *
   * @summary Get Beneficiary History
   * @throws FetchError<403, types.BeneHistoryResponse403> Forbidden Error
   * @throws FetchError<422, types.BeneHistoryResponse422> Unprocessable Entity
   */
  beneHistory(metadata: types.BeneHistoryMetadataParam): Promise<FetchResponse<200, types.BeneHistoryResponse200>> {
    return this.core.fetch('/payout/v1/beneHistory', 'get', metadata);
  }

  /**
   * Use this API to get the ledger balance and available balance of your account. Available
   * balance is ledger balance minus the sum of all pending transfers (transfers triggered
   * and processing or pending now).
   *
   * @summary Get Balance
   * @throws FetchError<403, types.GetBalanceResponse403> Forbidden Error
   */
  getBalance(metadata?: types.GetBalanceMetadataParam): Promise<FetchResponse<200, types.GetBalanceResponse200>> {
    return this.core.fetch('/payout/v1/getBalance', 'get', metadata);
  }

  /**
   * Use this API to get the ledger balance and available balance of your account. Available
   * balance is ledger balance minus the sum of all pending transfers (transfers triggered
   * and processing or pending now).
   *
   * @summary Get Balance V1.2
   * @throws FetchError<403, types.GetBalanceV12Response403> Forbidden Error
   * @throws FetchError<422, types.GetBalanceV12Response422> Unprocessable Entity
   */
  getBalance_v12(metadata?: types.GetBalanceV12MetadataParam): Promise<FetchResponse<200, types.GetBalanceV12Response200>> {
    return this.core.fetch('/payout/v1.2/getBalance', 'get', metadata);
  }

  /**
   * Use this API to request a self withdrawal at Cashfree. Self withdrawal is allowed a
   * maximum of 3 times a day. The API response will either result in an ERROR or SUCCESS
   * response. The status of the withdrawal request is available on the dashboard.
   *
   * @summary Self Withdrawal
   * @throws FetchError<403, types.SelfWithdrawalResponse403> Forbidden Error
   */
  selfWithdrawal(body: types.SelfWithdrawalBodyParam, metadata?: types.SelfWithdrawalMetadataParam): Promise<FetchResponse<200, types.SelfWithdrawalResponse200>> {
    return this.core.fetch('/payout/v1/selfWithdrawal', 'post', body, metadata);
  }

  /**
   * Use this API to request an internal transfer at Cashfree. The internal transfer API is
   * useful for multiple Payouts accounts. The API response will either result in an ERROR or
   * SUCCESS response.
   *
   * @summary Internal Transfer
   * @throws FetchError<403, types.InternalTransferResponse403> Forbidden Error
   * @throws FetchError<404, types.InternalTransferResponse404> Resource Not Found
   * @throws FetchError<422, types.InternalTransferResponse422> Unprocessable Entity
   */
  internalTransfer(body: types.InternalTransferBodyParam, metadata?: types.InternalTransferMetadataParam): Promise<FetchResponse<200, types.InternalTransferResponse200>> {
    return this.core.fetch('/payout/v1/internalTransfer', 'post', body, metadata);
  }

  /**
   * Use this API to request an internal transfer. It is useful for accounts with multiple
   * fund sources. You need to provide either the rechargeAccount or paymentInstrumentId and
   * toPaymentInstrumentId along with the amount.
   *
   * @summary Internal Transfer V1.2
   * @throws FetchError<422, types.InternalTransferV12Response422> Unprocessable Entity
   */
  internalTransfer_v12(body: types.InternalTransferV12BodyParam, metadata?: types.InternalTransferV12MetadataParam): Promise<FetchResponse<200, types.InternalTransferV12Response200>> {
    return this.core.fetch('/payout/v1.2/internalTransfer', 'post', body, metadata);
  }

  /**
   * Use this API to initiate an amount transfer request at Cashfree by providing beneficiary
   * id, amount, and transfer id. This is a sync transfer request.
   *
   * @summary Standard Transfer Sync
   * @throws FetchError<403, types.RequestTransferResponse403> Forbidden Error
   */
  requestTransfer(body: types.RequestTransferBodyParam, metadata?: types.RequestTransferMetadataParam): Promise<FetchResponse<200, types.RequestTransferResponse200>> {
    return this.core.fetch('/payout/v1/requestTransfer', 'post', body, metadata);
  }

  /**
   * Use this API to initiate an amount transfer request at Cashfree by providing beneficiary
   * id, amount, and transfer id. This is an async transfer request.
   *
   * @summary Standard Transfer Async
   * @throws FetchError<403, types.RequestAsyncTransferResponse403> Forbidden Error
   * @throws FetchError<422, types.RequestAsyncTransferResponse422> Unprocessable Entity
   */
  requestAsyncTransfer(body: types.RequestAsyncTransferBodyParam, metadata?: types.RequestAsyncTransferMetadataParam): Promise<FetchResponse<200, types.RequestAsyncTransferResponse200>> {
    return this.core.fetch('/payout/v1/requestAsyncTransfer', 'post', body, metadata);
  }

  /**
   * Use this API to initiate amount transfers directly to the beneficiary account via a bank
   * transfer or UPI. You can add the beneficiary details in the same API request.
   *
   * @summary Direct Transfer
   * @throws FetchError<403, types.DirectTransferResponse403> Forbidden Error
   */
  directTransfer(body: types.DirectTransferBodyParam, metadata?: types.DirectTransferMetadataParam): Promise<FetchResponse<200, types.DirectTransferResponse200>> {
    return this.core.fetch('/payout/v1/directTransfer', 'post', body, metadata);
  }

  /**
   * Use these details to get details of a particular transfer. You can pass referenceId or
   * transferId to fetch the details.
   *
   * @summary Get Transfer Status
   * @throws FetchError<403, types.GetTransferStatusResponse403> Forbidden Error
   * @throws FetchError<404, types.GetTransferStatusResponse404> Resource Not Found
   */
  getTransferStatus(metadata?: types.GetTransferStatusMetadataParam): Promise<FetchResponse<200, types.GetTransferStatusResponse200>> {
    return this.core.fetch('/payout/v1/getTransferStatus', 'get', metadata);
  }

  /**
   * Use this API to create multiple transfers to multiple beneficiaries. This API accepts an
   * array of transfer objects under the batch field.
   *
   * @summary Batch Transfer
   * @throws FetchError<403, types.RequestBatchTransferResponse403> Forbidden Error
   * @throws FetchError<409, types.RequestBatchTransferResponse409> Resource Conflict Error
   * @throws FetchError<422, types.RequestBatchTransferResponse422> Unprocessable Entity
   */
  requestBatchTransfer(body: types.RequestBatchTransferBodyParam, metadata?: types.RequestBatchTransferMetadataParam): Promise<FetchResponse<200, types.RequestBatchTransferResponse200>> {
    return this.core.fetch('/payout/v1/requestBatchTransfer', 'post', body, metadata);
  }

  /**
   * Use this API to get the status of the Batch Transfer.
   *
   * @summary Get Batch Transfer Status
   * @throws FetchError<403, types.GetBatchTransferStatusResponse403> Forbidden Error
   * @throws FetchError<404, types.GetBatchTransferStatusResponse404> Resource Not Found
   */
  getBatchTransferStatus(metadata?: types.GetBatchTransferStatusMetadataParam): Promise<FetchResponse<200, types.GetBatchTransferStatusResponse200>> {
    return this.core.fetch('/payout/v1/getBatchTransferStatus', 'get', metadata);
  }

  /**
   * Use this API to transfer money to beneficiary cards. Provide details such as beneficiary
   * name, card type, network type, and transfer ID.
   *
   * @summary CardPay
   * @throws FetchError<400, types.CardpayResponse400> Bad Request Error
   * @throws FetchError<403, types.CardpayResponse403> Forbidden Error
   * @throws FetchError<412, types.CardpayResponse412> Precondition Failed Error
   * @throws FetchError<422, types.CardpayResponse422> Unprocessable Entity
   */
  cardpay(body: types.CardpayBodyParam, metadata?: types.CardpayMetadataParam): Promise<FetchResponse<200, types.CardpayResponse200> | FetchResponse<201, types.CardpayResponse201>> {
    return this.core.fetch('/payout/v1/cardpay', 'post', body, metadata);
  }

  /**
   * Use this API to send requests for loan disbursement to the beneficiary. The service
   * charges are pooled for the respective party and disbursed at the end of day.
   * Disbursement amount = (Amount - total service charges).
   *
   * @summary Lend
   * @throws FetchError<400, types.LendResponse400> Bad Request Error
   * @throws FetchError<403, types.LendResponse403> Forbidden Error
   * @throws FetchError<422, types.LendResponse422> Unprocessable Entity
   */
  lend(body: types.LendBodyParam, metadata?: types.LendMetadataParam): Promise<FetchResponse<200, types.LendResponse200> | FetchResponse<201, types.LendResponse201>> {
    return this.core.fetch('/payout/v1/lend', 'post', body, metadata);
  }

  /**
   * Use this API to initiate an amount transfer request at Cashfree by providing beneficiary
   * id, amount, and transfer id. This is a sync transfer request.
   *
   * @summary Standard Transfer Sync v1.2
   * @throws FetchError<403, types.RequestTransferV12Response403> Forbidden Error
   */
  requestTransfer_v12(body: types.RequestTransferV12BodyParam, metadata?: types.RequestTransferV12MetadataParam): Promise<FetchResponse<200, types.RequestTransferV12Response200>> {
    return this.core.fetch('/payout/v1.2/requestTransfer', 'post', body, metadata);
  }

  /**
   * Use this API to initiate an amount transfer request at Cashfree by providing beneficiary
   * id, amount, and transfer id. This is an async transfer request.
   *
   * @summary Standard Transfer Async v1.2
   * @throws FetchError<403, types.RequestAsyncTransferV12Response403> Forbidden Error
   */
  requestAsyncTransfer_v12(body: types.RequestAsyncTransferV12BodyParam, metadata?: types.RequestAsyncTransferV12MetadataParam): Promise<FetchResponse<200, types.RequestAsyncTransferV12Response200>> {
    return this.core.fetch('/payout/v1.2/requestAsyncTransfer', 'post', body, metadata);
  }

  /**
   * Use this API to initiate amount transfers directly to the beneficiary account via a bank
   * transfer or UPI. You can add the beneficiary details in the same API request.
   *
   * @summary Direct Transfer V1.2
   * @throws FetchError<403, types.DirectTransferV12Response403> Forbidden Error
   */
  directTransfer_v12(body: types.DirectTransferV12BodyParam, metadata?: types.DirectTransferV12MetadataParam): Promise<FetchResponse<200, types.DirectTransferV12Response200>> {
    return this.core.fetch('/payout/v1.2/directTransfer', 'post', body, metadata);
  }

  /**
   * Use these details to get details of a particular transfer. You can pass referenceId or
   * transferId to fetch the details.
   *
   * @summary Get Transfer Status V1.2
   * @throws FetchError<403, types.GetTransferStatusV12Response403> Forbidden Error
   * @throws FetchError<404, types.GetTransferStatusV12Response404> Resource Not Found
   */
  getTransferStatus_v12(metadata?: types.GetTransferStatusV12MetadataParam): Promise<FetchResponse<200, types.GetTransferStatusV12Response200>> {
    return this.core.fetch('/payout/v1.2/getTransferStatus', 'get', metadata);
  }

  /**
   * Use this API to create transfers to multiple beneficiaries. This API accepts an array of
   * transfer objects under the batch field.
   *
   * @summary Batch Transfer V1.2
   * @throws FetchError<403, types.RequestBatchTransferV12Response403> Forbidden Error
   * @throws FetchError<409, types.RequestBatchTransferV12Response409> Resource Conflict Error
   * @throws FetchError<422, types.RequestBatchTransferV12Response422> Unprocessable Entity
   */
  requestBatchTransfer_v12(body: types.RequestBatchTransferV12BodyParam, metadata?: types.RequestBatchTransferV12MetadataParam): Promise<FetchResponse<200, types.RequestBatchTransferV12Response200>> {
    return this.core.fetch('/payout/v1.2/requestBatchTransfer', 'post', body, metadata);
  }

  /**
   * Use this API to get the status of the Batch Transfer.
   *
   * @summary Get Batch Transfer Status V1.2
   * @throws FetchError<403, types.GetBatchTransferStatusV12Response403> Forbidden Error
   * @throws FetchError<404, types.GetBatchTransferStatusV12Response404> Resource Not Found
   */
  getBatchTransferStatus_v12(metadata: types.GetBatchTransferStatusV12MetadataParam): Promise<FetchResponse<200, types.GetBatchTransferStatusV12Response200>> {
    return this.core.fetch('/payout/v1.2/getBatchTransferStatus', 'get', metadata);
  }

  /**
   * Use this API to get the list of incidents on banks (Resolved, Unresolved, All) for a
   * given time range.
   *
   * @summary Get Incidents
   * @throws FetchError<403, types.GetIncidentsResponse403> Forbidden Error
   * @throws FetchError<422, types.GetIncidentsResponse422> Unprocessable Entity
   */
  getIncidents(metadata?: types.GetIncidentsMetadataParam): Promise<FetchResponse<200, types.GetIncidentsResponse200>> {
    return this.core.fetch('/payout/v1/incidents', 'get', metadata);
  }

  /**
   * Use this API to create a Cashgram.
   *
   * @summary Create Cashgram
   * @throws FetchError<409, types.CreateCashgramResponse409> Resource Conflict Error
   */
  createCashgram(body: types.CreateCashgramBodyParam, metadata?: types.CreateCashgramMetadataParam): Promise<FetchResponse<200, types.CreateCashgramResponse200>> {
    return this.core.fetch('/payout/v1/createCashgram', 'post', body, metadata);
  }

  /**
   * Use this API to get the status of the Cashgram created.
   *
   * @summary Get Cashgram Status
   * @throws FetchError<404, types.GetCashgramStatusResponse404> Resource Not Found
   */
  getCashgramStatus(metadata: types.GetCashgramStatusMetadataParam): Promise<FetchResponse<200, types.GetCashgramStatusResponse200>> {
    return this.core.fetch('/payout/v1/getCashgramStatus', 'get', metadata);
  }

  /**
   * Use this API to deactivate a Cashgram.
   *
   * @summary Deactivate Cashgram
   * @throws FetchError<404, types.DeactivateCashgramResponse404> Resource Not Found
   */
  deactivateCashgram(body: types.DeactivateCashgramBodyParam, metadata?: types.DeactivateCashgramMetadataParam): Promise<FetchResponse<200, types.DeactivateCashgramResponse200>> {
    return this.core.fetch('/payout/v1/deactivateCashgram', 'post', body, metadata);
  }
}

const createSDK = (() => { return new SDK(); })()
  ;

export default createSDK;

export type { AddBeneficiaryBodyParam, AddBeneficiaryMetadataParam, AddBeneficiaryResponse200, AddBeneficiaryResponse403, AddBeneficiaryResponse409, AddBeneficiaryResponse412, AddBeneficiaryResponse422, BeneHistoryMetadataParam, BeneHistoryResponse200, BeneHistoryResponse403, BeneHistoryResponse422, CardpayBodyParam, CardpayMetadataParam, CardpayResponse200, CardpayResponse201, CardpayResponse400, CardpayResponse403, CardpayResponse412, CardpayResponse422, CreateCashgramBodyParam, CreateCashgramMetadataParam, CreateCashgramResponse200, CreateCashgramResponse409, DeactivateCashgramBodyParam, DeactivateCashgramMetadataParam, DeactivateCashgramResponse200, DeactivateCashgramResponse404, DirectTransferBodyParam, DirectTransferMetadataParam, DirectTransferResponse200, DirectTransferResponse403, DirectTransferV12BodyParam, DirectTransferV12MetadataParam, DirectTransferV12Response200, DirectTransferV12Response403, GenerateBearerTokenMetadataParam, GenerateBearerTokenResponse200, GenerateBearerTokenResponse401, GetBalanceMetadataParam, GetBalanceResponse200, GetBalanceResponse403, GetBalanceV12MetadataParam, GetBalanceV12Response200, GetBalanceV12Response403, GetBalanceV12Response422, GetBatchTransferStatusMetadataParam, GetBatchTransferStatusResponse200, GetBatchTransferStatusResponse403, GetBatchTransferStatusResponse404, GetBatchTransferStatusV12MetadataParam, GetBatchTransferStatusV12Response200, GetBatchTransferStatusV12Response403, GetBatchTransferStatusV12Response404, GetBeneficiaryIdMetadataParam, GetBeneficiaryIdResponse200, GetBeneficiaryIdResponse403, GetBeneficiaryIdResponse404, GetBeneficiaryMetadataParam, GetBeneficiaryResponse200, GetBeneficiaryResponse403, GetBeneficiaryResponse404, GetCashgramStatusMetadataParam, GetCashgramStatusResponse200, GetCashgramStatusResponse404, GetIncidentsMetadataParam, GetIncidentsResponse200, GetIncidentsResponse403, GetIncidentsResponse422, GetTransferStatusMetadataParam, GetTransferStatusResponse200, GetTransferStatusResponse403, GetTransferStatusResponse404, GetTransferStatusV12MetadataParam, GetTransferStatusV12Response200, GetTransferStatusV12Response403, GetTransferStatusV12Response404, InternalTransferBodyParam, InternalTransferMetadataParam, InternalTransferResponse200, InternalTransferResponse403, InternalTransferResponse404, InternalTransferResponse422, InternalTransferV12BodyParam, InternalTransferV12MetadataParam, InternalTransferV12Response200, InternalTransferV12Response422, LendBodyParam, LendMetadataParam, LendResponse200, LendResponse201, LendResponse400, LendResponse403, LendResponse422, RemoveBeneficiaryBodyParam, RemoveBeneficiaryMetadataParam, RemoveBeneficiaryResponse200, RemoveBeneficiaryResponse403, RequestAsyncTransferBodyParam, RequestAsyncTransferMetadataParam, RequestAsyncTransferResponse200, RequestAsyncTransferResponse403, RequestAsyncTransferResponse422, RequestAsyncTransferV12BodyParam, RequestAsyncTransferV12MetadataParam, RequestAsyncTransferV12Response200, RequestAsyncTransferV12Response403, RequestBatchTransferBodyParam, RequestBatchTransferMetadataParam, RequestBatchTransferResponse200, RequestBatchTransferResponse403, RequestBatchTransferResponse409, RequestBatchTransferResponse422, RequestBatchTransferV12BodyParam, RequestBatchTransferV12MetadataParam, RequestBatchTransferV12Response200, RequestBatchTransferV12Response403, RequestBatchTransferV12Response409, RequestBatchTransferV12Response422, RequestTransferBodyParam, RequestTransferMetadataParam, RequestTransferResponse200, RequestTransferResponse403, RequestTransferV12BodyParam, RequestTransferV12MetadataParam, RequestTransferV12Response200, RequestTransferV12Response403, SelfWithdrawalBodyParam, SelfWithdrawalMetadataParam, SelfWithdrawalResponse200, SelfWithdrawalResponse403, VerifyTokenMetadataParam, VerifyTokenResponse200, VerifyTokenResponse403 } from './types';
