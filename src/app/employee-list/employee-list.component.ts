import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {catchError, map, reduce} from 'rxjs/operators';

import {Employee} from '../employee';
import {EmployeeService} from '../employee.service';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {

  employees: Employee[] = [];
  errorMessage: string;

  constructor(private employeeService: EmployeeService) {
  }

  ngOnInit(): void {
    this.getAllEmployees();
  }

  getAllEmployees() {
    this.employeeService.getAll()
      .pipe(
        reduce((emps, e: Employee) => emps.concat(e), []),
        map(emps => this.employees = emps),
        catchError(this.handleError.bind(this))
      ).subscribe((response) => {
        // console.log(response);
        this.getEmpDetails(this.employees);
      });
  }

  getEmpDetails(employees){
    employees.forEach((emp:Employee)=>{
      if(emp.directReports){
        emp.directReports.forEach((dirRepList: any) => {
         var empcount =  employees.filter((el)=>
          el.id == dirRepList
          );
          if(empcount.length>0)
          {
            if(emp.reports==null) emp.reports=[];
            emp.reports.push(empcount[0])
          } 
          // console.log("directRepoCount",this.directRepoCount)
        })
      }
      else
        emp.reports=[];
    })
    // console.log("EMPss",this.employees)
  }

  private handleError(e: Error | any): string {
    console.error(e);
    return this.errorMessage = e.message || 'Unable to retrieve employees';
  }

  outDeleteEventHandle(response) {
    // console.log("out",response.data);
    this.employeeService.remove(response.data).subscribe((response) => {
      // console.log(response);
      this.getAllEmployees();
    });
  }
  
  outEditEventHandler(response) {
    // console.log("outedit",response.data);
    this.employeeService.save(response.data).subscribe((response) => {
      // console.log(response);
      this.getAllEmployees();
    });
  }
}
