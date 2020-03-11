import { Injectable, OnInit, AfterContentInit, Output } from '@angular/core';
import { Project } from '../models/project';
import { Observable, of, Subject } from 'rxjs';
import { TABLE } from '../mock-table';
import { DATA } from '../models/DATA';
import { ProjectService } from '../services/project.service';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class FormulaService {

  // formula page
  projects: any[];
  defaultProjects: DATA[];
  TABLES = TABLE;
  table: string[];
  
  // template page
  fields: Object[] = [];

  constructor(private projectService: ProjectService, private http: HttpClient) { 
  }

  // get the data from template page
  getFieldFromTempleate(fieldGroup) {
    this.fields.push(fieldGroup);
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
    return of(this.fields);
  }

  // get the project data from project page
  getProjects(): Observable<any[]>{
    this.projects = this.projectService.projects;
    return of(this.projects);
  }
 
  getDefaultProjects(): Observable<DATA[]>{
    this.http.get<DATA[]>('http://localhost:8080/YPI_Backend_war/resources').subscribe(data => this.defaultProjects = data.slice(0,7));
    console.log("this.defaultProjects" + this.defaultProjects);
    return of(this.defaultProjects);
  }

  getTable(): Observable<any> {
    this.table = this.TABLES;
    return of(this.table);
  }

  updateTable(table: string[]) {
    this.TABLES = table;
    console.log(this.TABLES);
  }
  
}
