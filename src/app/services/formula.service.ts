import { Injectable, OnInit, AfterContentInit, Output } from '@angular/core';

// model
import { Project } from '../models/project';
import { projectResource } from '../models/projectResource';
import { Template } from '../models/template';
import { DATA } from '../models/DATA';
import { TemplateResource } from '../models/TemplateResource';

// local file
import { TABLE_COL_NAMES } from '../mock-table';

// observable
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';

import { ProjectService } from '../services/project.service';
import { HttpClient } from '@angular/common/http';
import { TemplateParseResult } from '@angular/compiler';


@Injectable({
  providedIn: 'root'
})
export class FormulaService {

    /////////////////////////////////////////////
  // private fields for data
  /////////////////////////////////////////////

  // resources for each project
  private resources = new BehaviorSubject<projectResource[]>([]);
  // default resources from project1
  private defaultResources = new BehaviorSubject<projectResource[]>([]);
  // template from template DB
  private template = new BehaviorSubject<Template[]>([]);

  /////////////////////////////////////////////
  // public fields for data
  /////////////////////////////////////////////
  // templateResource by projectId
  public templateResource = new BehaviorSubject<TemplateResource[]>([]);
  public defaultTableColname: string[] = [];
  public template_resource: TemplateResource[] = [];
  public toggleTableColname: string[] = [];
  get _projectId(): number {
    let projectId;
    this.resources.subscribe(data => {
      projectId = data[0].project.projectId;
    });
    return projectId;
  }


  constructor(private projectService: ProjectService, private http: HttpClient) { 
  }

  /////////////////////////////////////////////
  // get project_resource data 
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
      this.resources.next(data);
    });
    return this.resources.asObservable();
  } 

  /////////////////////////////////////////////
  // get template_resource data 
  /////////////////////////////////////////////

  _templateResourceByProjectId(projectId: number): Observable<TemplateResource[]> {
    this.http.get<any[]>(`http://localhost:8080/YPI_BackEnd_war/templateResources/project/${projectId}`).subscribe(data => {
      this.templateResource.next(data);
    });
    return this.templateResource.asObservable();
  }

    /////////////////////////////////////////////
  // get table data 
  /////////////////////////////////////////////

  // get the default table colnames from local .ts file
  get _defaultTableColname() {
    this.defaultTableColname = TABLE_COL_NAMES;
    return this.defaultTableColname;
  }


  // get the template data from DB
  _template(projectId:number): Observable<Template[]> {
    this.http.get<any[]>(`http://localhost:8080/YPI_BackEnd_war/templates/${projectId}`).subscribe(data => {
      this.template.next(data);
    });
    return this.template.asObservable();
  }

  _setToggleTable(table: string[]) {
     this.toggleTableColname = table;
  }

  get _getToggleTable() {
    return this.toggleTableColname;
  }

  /////////////////////////////////////////////
  // post template data 
  /////////////////////////////////////////////
  
  _postTemplate(projectId:number, templates: Template[]) {
    const body = templates;
    this.http.post<any[]>(`http://localhost:8080/YPI_BackEnd_war/addTemplate/${projectId}`, body).subscribe(data => {
      console.log("post data from template page");
      console.log(data);
    })
  }
  

  
}
