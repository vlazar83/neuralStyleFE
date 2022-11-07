/* "Barrel" of Http Interceptors */
import { HTTP_INTERCEPTORS } from "@angular/common/http";

import { HttpErrorInterceptor } from "./httpErrorInterceptor";

/** Http interceptor providers in outside-in order */
export const HttpInterceptorProviders = [{ provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true }];
