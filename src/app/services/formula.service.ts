import { Injectable, OnInit, AfterContentInit, Output } from '@angular/core';
import { Project } from '../models/project';
import { Observable, of, Subject } from 'rxjs';
import { TABLE_COL_NAMES } from '../mock-table';
import { DATA } from '../models/DATA';
import { ProjectService } from '../services/project.service';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class FormulaService {

  // formula page
  resources: any[];
  defaultResources: any[];
  table_col_names = TABLE_COL_NAMES;
  tableColNames: string[];
  
  // template page
  template_obj: Object[] = [];

  constructor(private projectService: ProjectService, private http: HttpClient) { 
  }

  // get the data from template page
  getFieldFromTempleate(fieldGroup) {
    this.template_obj.push(fieldGroup);
    /* let newResource;
    const headers = { 'Authorization': 'Bearer my-token', 'My-Custom-Header': 'foobar' }
    const body = { resourceName: fieldGroup.resourceName,cost_Code:a.cost_Code  }
    this.http.post<any>('http://localhost:8080/YPI_Backend_war/addResource', body, { headers }).subscribe(data => {
    newResource = data.id;
    console.log(newResource);
    }); */ 
  }

  // send the data from template page to formula page
  sendFieldToFormulaPage(): Observable<Object[]>{
    console.log("send the fields to formula page");
    return of(this.template_obj);
  }

  // get the project data from project page
  getResources(): Observable<any[]>{
    this.resources = this.projectService.projects;
    return of(this.resources);
  }
 
  getDefaultResources(): Observable<any[]>{/* 
    this.http.get<DATA[]>('http://localhost:8080/YPI_Backend_war/resources').subscribe(data => this.defaultProjects = data.slice(0,7));
    console.log("this.defaultProjects" + this.defaultProjects); */
    this.defaultResources = this.projectService.projects.slice(1,10);
    return of(this.defaultResources);
  }

  getTableColNames(): Observable<any> {
    this.tableColNames = this.table_col_names;
    return of(this.tableColNames);
  }

  updateTable(table: string[]) {
    this.table_col_names = table;
    console.log(this.table_col_names);
  }
  
}
