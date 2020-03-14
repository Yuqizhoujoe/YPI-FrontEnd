import { Injectable, OnInit, AfterContentInit, Output } from '@angular/core';
// model
import { Project } from '../models/project';
import { projectResource } from '../models/projectResource';
// observable
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { TABLE_COL_NAMES } from '../mock-table';
import { DATA } from '../models/DATA';
import { ProjectService } from '../services/project.service';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class FormulaService {

  // resources for each project
  private resources: projectResource[];
  // default resources from project1
  private defaultResources = new BehaviorSubject<projectResource[]>([]);
  // project resources
  private project_resources: projectResource[];
  // table colnames
  private table_col_names = TABLE_COL_NAMES;
  // 
  private tableColNames: string[];
  // template data
  template_data: Object[] = [];

  constructor(private projectService: ProjectService, private http: HttpClient) { 
  }

  /////////////////////////////////////////////
  // set data 
  /////////////////////////////////////////////

  setProjectResource(pr: projectResource[]) {
    this.project_resources = pr;
  }

  /////////////////////////////////////////////
  // get data 
  /////////////////////////////////////////////

  // default resources 
   get _default(): Observable<projectResource[]> {
     // get the default resources from project 1
    this.http.get<any[]>('http://localhost:8080/YPI_BackEnd_war/project/1/projectResource').subscribe(data => {
      this.defaultResources.next(data);
    });
    return this.defaultResources.asObservable();
  }

  // get resources by projectId
  _resource(projectId: number): Observable<projectResource[]> {
    this.http.get<any[]>(`http://localhost:8080/YPI_BackEnd_war/project/${projectId}/projectResource`).subscribe(data => {
      this.resources = data;
    });
    return of(this.resources);
  } 

  // template data
  _template(): Observable<any[]> { return of(this.template_data); }

  // get the data from template page
  getTemplateData(fieldGroup) {
    this.template_data.push(fieldGroup); 
  }

  // update table colnames
  updateTable(table: string[]) {
    this.table_col_names = table;
    console.log(this.table_col_names);
  }
  
}
