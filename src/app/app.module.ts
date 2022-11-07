import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { NgxDropzoneModule } from "ngx-dropzone";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatStepperModule } from "@angular/material/stepper";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { LottieModule } from "ngx-lottie";
import player from "lottie-web";
import { MatIconModule } from "@angular/material/icon";
import { NgImageSliderModule } from "ng-image-slider";
import { MatSnackBar } from "@angular/material/snack-bar";
import { OverlayModule } from "@angular/cdk/overlay";
import { HttpClientModule } from "@angular/common/http";
import { DragDirective } from "./directives/drag.directive";
import { HttpInterceptorProviders } from "./httpClient/services/httpInterceptors";
import { ErrorDialogComponent } from "./dialogs/error-dialog/error-dialog.component";
import { MatDialogModule } from "@angular/material/dialog";
import { MatSelectModule } from "@angular/material/select";
// Note we need a separate function as it's required
// by the AOT compiler.
export function playerFactory() {
  return player;
}
@NgModule({
  declarations: [AppComponent, DragDirective, ErrorDialogComponent],
  imports: [
    BrowserModule,
    MatDialogModule,
    HttpClientModule,
    MatIconModule,
    MatSelectModule,
    OverlayModule,
    NgImageSliderModule,
    NgxDropzoneModule,
    BrowserAnimationsModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    LottieModule.forRoot({ player: playerFactory }),
  ],
  providers: [MatSnackBar, HttpInterceptorProviders],
  bootstrap: [AppComponent],
})
export class AppModule {}
