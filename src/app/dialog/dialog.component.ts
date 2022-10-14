import { Component, Input, OnInit } from '@angular/core';
import { MatDialogConfig ,MatDialogRef,MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Employee } from '../employee';
import { EmployeeService } from '../employee.service';
import { Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {
  @Input() emp: Employee;
  @Input() editable: boolean = false;
  empdata: Employee[] = []
  deleteID: any;
  constructor(public empservice: EmployeeService,  @Inject(MAT_DIALOG_DATA) public data: any,private fb: FormBuilder,
  public dialogRef: MatDialogRef<DialogComponent>) { 
  }
  editEmpFormGroup: FormGroup;
  ngOnInit(): void {
    // console.log("####",this.data);

    this.editEmpFormGroup = this.fb.group({
      id: [this.data.id, Validators.required],
      firstName: [this.data.firstName, Validators.required],
      lastName: [this.data.lastName, Validators.required],
      position: [this.data.position, [Validators.required]],
      directReports: [this.data.directReports, [Validators.required]],
      compensation: [this.data.compensation, Validators.required],
    });
    // console.log("??????",this.editEmpFormGroup);

    this.empservice.getAll().subscribe((data: any=[])=>{
      this.empdata = data;
      // console.log("DATA", data)
    })
      // console.log("==>",document.getElementById("okbtn"))

  }

  onDelete(){
    this.deleteID =  this.empdata;
    this.dialogRef.close({data:this.data});
    // console.log("deleteIDDDD",this.deleteID["id"])
    // console.log("empdata", this.empdata)
  }
  
  onSave(){
    // console.log("values",this.editEmpFormGroup.value);
    this.dialogRef.close({data:this.editEmpFormGroup.value});

  }

}
