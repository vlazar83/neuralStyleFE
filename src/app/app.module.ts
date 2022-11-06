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
import { DragDirective } from './directives/drag.directive';

// Note we need a separate function as it's required
// by the AOT compiler.
export function playerFactory() {
  return player;
}
@NgModule({
  declarations: [AppComponent, DragDirective],
  imports: [
    BrowserModule,
    HttpClientModule,
    MatIconModule,
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
  providers: [MatSnackBar],
  bootstrap: [AppComponent],
})
export class AppModule {}
