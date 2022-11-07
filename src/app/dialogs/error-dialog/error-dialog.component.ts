import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { AppComponent } from "src/app/app.component";

export interface DialogData {
  errorCode: string;
  errorMessage: string;
}

@Component({
  selector: "app-error-dialog",
  templateUrl: "./error-dialog.component.html",
  styleUrls: ["./error-dialog.component.css"],
})
export class ErrorDialogComponent implements OnInit {
  constructor(public dialogRef: MatDialogRef<AppComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onOkClick(): void {
    this.dialogRef.close();
  }
  ngOnInit(): void {}
}
