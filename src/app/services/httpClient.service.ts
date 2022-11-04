import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { firstValueFrom, Observable, throwError } from "rxjs";
import { catchError, retry } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { FetchTokenBody, FetchTokenResponseBody } from "../models/interfaces";
import { FETCH_TOKEN_BASIC_AUTH_HEADER_VALUE } from "src/environments/secret/secret";

@Injectable({
  providedIn: "root",
})
export class HttpClientService {
  constructor(private http: HttpClient) {}

  token: string = "";

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

  /** POST: add a new hero to the database */
  fetchToken() {
    const request$ = this.http.post<FetchTokenResponseBody>(
      environment.tokenUrl,
      this.fetchTokenBody,
      this.httpOptions
    );

    firstValueFrom(request$)
      .catch((err) => {
        console.log(err);
      })
      .then((result) => {
        this.token = result!.access_token;
      });
  }
}
