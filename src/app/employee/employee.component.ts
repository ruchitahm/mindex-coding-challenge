import {Component, EventEmitter, Input, Output} from '@angular/core';

import {Employee} from '../employee';

import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import { DialogComponent } from '../dialog/dialog.component';
import { EmployeeService } from '../employee.service';
import { from, Observable } from 'rxjs';
import { flatMap } from 'rxjs/operators';
import { BackendlessMockService } from '../backendless-mock.service';
import { EmployeeListComponent } from '../employee-list/employee-list.component';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent {
  @Input() employee: Employee;
  @Output() outDeleteEvent = new EventEmitter<any>();
  
  @Output() outEditEvent = new EventEmitter<any>();
  
  element: HTMLElement;
  submitted = false;
  deleteID: any;
  employees: Employee[] = [];
  constructor(public dialog: MatDialog, private empservice: EmployeeService, private empList: EmployeeListComponent) {
  }

  ngOnInit() {
    this.employees = this.empList.employees;
    // console.log("ionit",this.employees);
  }

  
  deleterow(employee) {
    const deletedialogConfig = new MatDialogConfig();
    deletedialogConfig.disableClose = true;
    deletedialogConfig.autoFocus = true;
    deletedialogConfig.data = employee;
    this.dialog.open(DialogComponent, deletedialogConfig).afterClosed().subscribe((response) => {
      // console.log("respone dialog",response.data);

      this.outDeleteEvent.emit(response);
    });

    //Hiding editrow part
    this.element = document.getElementById('editrow');
    // console.log("==>",document.getElementById("deleterow"))
    if (this.element.style.display === "none") {
      this.element.style.display = "block";
    } else {
      this.element.style.display = "none";
    }
    this.deleteID = this.employee.id;
    // console.log("deleteID",this.deleteID)

    this.empservice.remove(employee).subscribe((res) =>
      console.log("Result", res)
    )
  }

  editrow(employee) {
    const editdialogConfig = new MatDialogConfig();
    editdialogConfig.disableClose = true;
    editdialogConfig.autoFocus = true;
    editdialogConfig.data = employee;
    // console.log("onEDitClickData",editdialogConfig.data)
    this.dialog.open(DialogComponent, editdialogConfig).afterClosed().subscribe((response) => {
      // console.log("respone dialog",response);
      this.outEditEvent.emit(response);
    });

    //Hiding deleterow part
    this.element = document.getElementById('deleterow');
    if (this.element.style.display === "none") {
      this.element.style.display = "block";
    } else {
      this.element.style.display = "none";
    }
  }

}
