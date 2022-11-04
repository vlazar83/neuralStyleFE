import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { firstValueFrom, Observable, throwError } from "rxjs";
import { catchError, retry } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { FetchTokenBody, FetchTokenResponseBody } from "../interfaces";
import { FETCH_TOKEN_BASIC_AUTH_HEADER_VALUE } from "src/environments/secret/secret";

@Injectable({
  providedIn: "root",
})
export class HttpClientService {
  constructor(private http: HttpClient) {}

  fetchTokenBody: FetchTokenBody = {
    audience: "https://neuralStyle/transfer",
    grant_type: "client_credentials",
  };

  httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: "Basic " + FETCH_TOKEN_BASIC_AUTH_HEADER_VALUE,
    }),
  };

  async fetchToken(): Promise<string> {
    var token = "";
    const request$ = this.http.post<FetchTokenResponseBody>(
      environment.tokenUrl,
      this.fetchTokenBody,
      this.httpOptions
    );

    await firstValueFrom(request$)
      .catch((err) => {
        console.log(err);
      })
      .then((result) => {
        token = result!.access_token;
      });

    return token;
  }
}
