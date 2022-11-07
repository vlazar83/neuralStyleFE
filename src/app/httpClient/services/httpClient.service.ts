import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { firstValueFrom } from "rxjs";
import { environment } from "src/environments/environment";
import {
  FetchTokenBody,
  FetchTokenResponseBody,
  TransferImagesErrorResponseBody,
  TransferImagesResponseBody,
} from "../interfaces";
import { FETCH_TOKEN_BASIC_AUTH_HEADER_VALUE } from "src/environments/secret/secret";

@Injectable({
  providedIn: "root",
})
export class HttpClientService {
  constructor(private http: HttpClient) {}

  async fetchToken(): Promise<string> {
    var token = "";
    var httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: "Basic " + FETCH_TOKEN_BASIC_AUTH_HEADER_VALUE,
      }),
    };

    var fetchTokenBody: FetchTokenBody = {
      audience: "https://neuralStyle/transfer",
      grant_type: "client_credentials",
    };

    const request$ = this.http.post<FetchTokenResponseBody>(environment.tokenUrl, fetchTokenBody, httpOptions);

    await firstValueFrom(request$)
      .catch((err) => {
        console.log(err);
      })
      .then((result) => {
        token = result!.access_token;
      });

    return token;
  }

  async sendImages(
    styleFile: File,
    contentFile: File,
    iterCount: string
  ): Promise<TransferImagesResponseBody | TransferImagesErrorResponseBody> {
    var token = await this.fetchToken()!;
    var httpOptions = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + token,
      }),
    };

    let result: TransferImagesResponseBody | TransferImagesErrorResponseBody;
    let formData = new FormData();
    formData.append("files", styleFile);
    formData.append("files", contentFile);
    const upload$ = this.http.post<TransferImagesResponseBody>(
      environment.backendUrl + "?num_iterations=" + iterCount,
      formData,
      httpOptions
    );

    await firstValueFrom(upload$)
      .catch((err) => {
        console.log(err);
        result = {
          errorCode: err.status,
          errorMessage: err.statusText,
          type: "transferErrorBody",
        } as TransferImagesErrorResponseBody;
      })
      .then((res) => {
        console.log(res);
        if (result === undefined) {
          result = { fileUrl: res!.fileUrl, type: "transferBody" } as TransferImagesResponseBody;
        }
      });

    return result!;
  }
}
