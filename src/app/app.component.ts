import { Component } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";

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
  isLinear = false;

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
}
