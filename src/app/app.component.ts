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
import { MatDialog } from "@angular/material/dialog";
import { ErrorDialogComponent } from "./dialogs/error-dialog/error-dialog.component";
import {
  FetchTokenBody,
  FetchTokenResponseBody,
  TransferImagesErrorResponseBody,
  TransferImagesResponseBody,
} from "./httpClient/interfaces";
import { MatSelect } from "@angular/material/select";
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
  public modeselect = "iter5";
  resultImageUrl: string = "";

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
  openErrorDialog: boolean = false;
  processingStarted: boolean = false;
  errorResult!: TransferImagesErrorResponseBody;

  private animationItem!: AnimationItem;
  private animationItem2!: AnimationItem;

  constructor(
    private _formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    private _httpClientService: HttpClientService,
    public dialog: MatDialog
  ) {}

  openDialog(errorCode: string, errorMessage: string): void {
    const dialogRef = this.dialog.open(ErrorDialogComponent, {
      width: "500px",
      data: { errorCode: errorCode, errorMessage: errorMessage },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log("The dialog was closed");
    });
  }

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
      this.openSnackBar("Please drop image only");
    }
  }

  async imageClicked(i: number) {
    console.log("clicked:" + i);
    this.openSnackBar("Selected painting: " + painting_names.famous[i]);
    this.stylefileStatus = true;
    this.imageSelectedWithDrop = false;
    this.imageSelectedWithClick = true;
    i = i + 1;
    this.imageSelectedWithClickSrc = "./assets/paintings/large/famous/famous-" + i + ".JPG";

    const imageUrl = await fetch(this.imageSelectedWithClickSrc);
    const buffer = await imageUrl.arrayBuffer();
    i = i - 1;
    this.stylefile = new File([buffer], painting_names.famous[i][0] + ".JPG");
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

  @ViewChild("matSelectIter") matSelectIter!: MatSelect;

  async startProcessing() {
    this.processingStatus = false;
    console.log("Iter value : " + this.matSelectIter.value);
    var result = await this.callBackend(this.matSelectIter.value);
  }

  async callBackend(iterCount: string) {
    var interCountNum: number;
    if (iterCount === undefined || isNaN(Number(iterCount.slice(4)))) {
      interCountNum = 500;
    } else {
      interCountNum = Number(iterCount.slice(4)) * 100;
    }

    var result: TransferImagesResponseBody | TransferImagesErrorResponseBody = await this._httpClientService.sendImages(
      this.stylefile!,
      this.contentfile!,
      interCountNum.toString()
    );
    if (result.type === "transferBody") {
      console.log(result);
      this.resultImageUrl = result.fileUrl;
      this.processingStarted = true;
    } else if (result.type === "transferErrorBody") {
      this.openErrorDialog = true;
      this.errorResult = result;
    }
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

    this.resultImageUrl = "";
    this.openErrorDialog = false;
    this.processingStarted = false;
  }

  // utility
  fillArray() {
    for (let i = 1; i <= 17; i++) {
      this.imageObject.push({
        image: "assets/paintings/large/famous/famous-" + i + ".JPG",
        thumbImage: "assets/paintings/small/famous/famous-" + i + ".JPG",
      });
    }
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, undefined, {
      duration: 2000,
    });
  }

  // animation
  options: AnimationOptions = {
    path: "/assets/lf30_editor_k6rbt75z.json",
  };

  // animation
  options2: AnimationOptions = {
    path: "/assets/124009-cubes-loader-1.json",
  };

  animationCreated(animationItem: AnimationItem): void {
    this.animationItem = animationItem;
    this.animationItem.autoplay = false;
  }

  animation2Created(animationItem: AnimationItem): void {
    this.animationItem2 = animationItem;
    this.animationItem2.autoplay = false;
  }

  play(i: number): void {
    console.log(this.animationItem.segmentPos);
    if (i === 1) {
      this.animationItem.play();
      this.startProcessing();
    } else if (i === 2) {
      this.animationItem2.play();
    }
  }

  openErrorDialogIfNeeded() {
    if (this.openErrorDialog) {
      this.openDialog(this.errorResult.errorCode, this.errorResult.errorMessage);
      this.openErrorDialog = false;
    }
  }
}
