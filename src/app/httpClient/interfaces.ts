export interface FetchTokenBody {
  audience: string;
  grant_type: string;
}

export interface FetchTokenResponseBody {
  access_token: string;
  expires_in: string;
  token_type: string;
}

export interface TransferImagesResponseBody {
  fileUrl: string;
  type: "transferBody";
}

export interface TransferImagesErrorResponseBody {
  errorCode: string;
  errorMessage: string;
  type: "transferErrorBody";
}
