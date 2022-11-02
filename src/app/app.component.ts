import { Component, ViewChild } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { MatStep, MatStepper } from "@angular/material/stepper";
import { AnimationItem } from "lottie-web";
import { AnimationOptions } from "ngx-lottie";
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  title = "neuralStyleFE";
  stylefile: File | undefined;
  contentfile: File | undefined;

  firstFormGroup = this._formBuilder.group({
    firstCtrl: ["", Validators.required],
  });
  secondFormGroup = this._formBuilder.group({
    secondCtrl: ["", Validators.required],
  });
  thirdFormGroup = this._formBuilder.group({
    thirdCtrl: [""],
  });
  isLinear = false;

  private animationItem!: AnimationItem;

  options: AnimationOptions = {
    path: "/assets/lf30_editor_k6rbt75z.json",
  };

  animationCreated(animationItem: AnimationItem): void {
    console.log(animationItem);
    this.animationItem = animationItem;
    this.animationItem.autoplay = false;
    //this.animationItem.loop = false;
  }

  stop(): void {
    // this.ngZone.runOutsideAngular(() => {
    //   this.animationItem.stop();
    // });
  }

  play(): void {
    console.log(this.animationItem.segmentPos);
    this.animationItem.goToAndPlay(0);
    //this.animationItem.play();
    //this.animationItem.resetSegments(true);
  }

  onLoopComplete() {
    this.animationItem.stop();
    console.log(this.animationItem);
  }

  constructor(private _formBuilder: FormBuilder) {}

  onSelectStyleFile(event: { addedFiles: any }) {
    console.log(event);
    this.stylefile = event.addedFiles[0];
  }

  onRemoveStyleFile(event: File) {
    console.log(event);
    this.stylefile = undefined;
    //this.files.splice(this.files.indexOf(event), 1);
  }

  onSelectContentFile(event: { addedFiles: any }) {
    console.log(event);
    this.contentfile = event.addedFiles[0];
    //this.files.push(...event.addedFiles);
  }

  onRemoveContentFile(event: File) {
    console.log(event);
    this.contentfile = undefined;
    //this.files.splice(this.files.indexOf(event), 1);
  }

  startProcessing() {}

  @ViewChild("stepper") stepper!: MatStepper;

  nextClicked() {
    this.stepper.selected!.completed = true;
    this.stepper.next();
  }

  @ViewChild("firstStep") firstStep!: MatStep;
  @ViewChild("secondStep") secondStep!: MatStep;
  @ViewChild("thirdStep") thirdStep!: MatStep;
  @ViewChild("fourthStep") fourthStep!: MatStep;

  resetClicked() {
    console.log("sdfdsfds");
    this.firstStep.reset();
    this.secondStep.reset();
    this.thirdStep.reset();
    this.animationItem.stop();
    this.stepper.reset();
  }
}
