import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { MatStep, MatStepper } from "@angular/material/stepper";
import { AnimationItem } from "lottie-web";
import { AnimationOptions } from "ngx-lottie";
import { readdirSync } from "fs";
import { MatSnackBar } from "@angular/material/snack-bar";
import { painting_names } from "../assets/paintings/painting_names";
import { HttpClientService } from "./httpClient/services/httpClient.service";
import { FileHandle } from "./directives/drag.directive";
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
  files: FileHandle[] = [];
  imageSelectedWithClick = false;
  imageSelectedWithClickSrc = "";
  imageSelectedWithDrop = false;

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

  constructor(
    private _formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    private _httpClientService: HttpClientService
  ) {}

  ngOnInit(): void {
    this.fillArray();
  }

  filesDropped(files: FileHandle[]): void {
    if (files[0].file.type.match("image.*")) {
      this.files = files;
      this.imageSelectedWithClick = false;
      this.imageSelectedWithDrop = true;
      this._snackBar.dismiss();
      this.stylefile = files[0].file;
      this.stylefileStatus = true;
    } else {
      this.openSnackBar("Please drop image only", "OK");
    }
  }

  async imageClicked(i: number) {
    console.log("clicked:" + i);
    this.openSnackBar("Selected painting: " + painting_names.data[i], "OK");
    this.stylefileStatus = true;
    this.imageSelectedWithDrop = false;
    this.imageSelectedWithClick = true;
    i = i + 1;
    this.imageSelectedWithClickSrc = "./assets/paintings/large/top-" + i + ".JPG";

    const imageUrl = await fetch(this.imageSelectedWithClickSrc);
    const buffer = await imageUrl.arrayBuffer();

    this.stylefile = new File([buffer], "fileName");
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
    this._httpClientService.sendImages(this.stylefile!, this.contentfile!);
  }

  // stepper related codes
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

    this.imageSelectedWithClick = false;
    this.imageSelectedWithDrop = false;
    this.imageSelectedWithClickSrc = "";
  }

  // utility
  fillArray() {
    for (let i = 1; i <= 87; i++) {
      this.imageObject.push({
        image: "assets/paintings/large/top-" + i + ".JPG",
        thumbImage: "assets/paintings/small/top-" + i + ".JPG",
      });
    }
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  // animation
  options: AnimationOptions = {
    path: "/assets/lf30_editor_k6rbt75z.json",
  };

  animationCreated(animationItem: AnimationItem): void {
    this.animationItem = animationItem;
    this.animationItem.autoplay = false;
  }

  play(): void {
    console.log(this.animationItem.segmentPos);
    this.animationItem.play();
    this.startProcessing();
  }
}
