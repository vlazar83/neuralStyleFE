import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { MatStep, MatStepper } from "@angular/material/stepper";
import { AnimationItem } from "lottie-web";
import { AnimationOptions } from "ngx-lottie";
import { readdirSync } from "fs";
import { MatSnackBar } from "@angular/material/snack-bar";
import { painting_names } from "../assets/paintings/painting_names";
import { HttpClientService } from "./httpClient/services/httpClient.service";
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
  title = "neuralStyleFE";
  stylefile: File | undefined;
  stylefileStatus: boolean = false;
  contentfile: File | undefined;
  contentfileStatus: boolean = false;
  processingStatus: boolean = false;
  imageObject: Array<object> = [];

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

  token: string = "";

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
    // this.animationItem.goToAndPlay(0);
    this.animationItem.play();
    this.startProcessing();
  }

  onLoopComplete() {
    this.animationItem.stop();
    console.log(this.animationItem);
  }

  constructor(
    private _formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    private _httpClientService: HttpClientService
  ) {}

  ngOnInit(): void {
    this.fillArray();
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  onSelectStyleFile(event: { addedFiles: any }) {
    this.stylefileStatus = false;
    console.log(event);
    this.stylefile = event.addedFiles[0];
    if (event.addedFiles[0] != undefined) this.stylefileStatus = true;
  }

  onRemoveStyleFile(event: File) {
    console.log(event);
    this.stylefile = undefined;
    this.stylefileStatus = false;
    //this.files.splice(this.files.indexOf(event), 1);
  }

  onSelectContentFile(event: { addedFiles: any }) {
    this.contentfileStatus = false;
    this.processingStatus = false;
    console.log(event);
    this.contentfile = event.addedFiles[0];
    if (event.addedFiles[0] != undefined) {
      this.contentfileStatus = true;
      this.processingStatus = true;
    }
  }

  onRemoveContentFile(event: File) {
    console.log(event);
    this.contentfile = undefined;
    this.contentfileStatus = false;
  }

  async startProcessing() {
    this.processingStatus = false;
    this.token = await this._httpClientService.fetchToken()!;
    console.log("Fetched token: " + this.token);
  }

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

    this.stylefile = undefined;
    this.contentfile = undefined;
    this.stylefileStatus = false;
    this.contentfileStatus = false;
  }

  fillArray() {
    for (let i = 1; i <= 100; i++) {
      console.log("Block statement execution no." + i);
      this.imageObject.push({
        image: "assets/paintings/top-" + i + ".jpg",
        thumbImage: "assets/paintings/top-" + i + ".jpg",
      });
    }
  }

  imageClicked(i: number) {
    console.log("clicked:" + i);
    this.openSnackBar("Selected painting: " + painting_names.data[i], "OK");
    this.stylefileStatus = true;
  }
}
