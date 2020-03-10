import { Injectable, OnInit, AfterContentInit, Output } from '@angular/core';
import { PROJECTS } from '../mock-projects';
import { Project } from '../models/project';
import { Observable, of, Subject } from 'rxjs';
import { SubProject } from '../models/sub_projects';
import { TABLE } from '../mock-table';
import { DATA } from '../models/DATA';
import { ProjectService } from '../services/project.service';


@Injectable({
  providedIn: 'root'
})
export class FormulaService {

  // formula page
  projects: any[];
  defaultProjects: any[];
  sub_projects: SubProject[];
  TABLES = TABLE;
  table: string[];
  
  // template page
  fields: Object[] = [];

  constructor(private projectService: ProjectService) { 
  }

  // get the data from template page
  getFieldFromTempleate(fieldGroup) {
    this.fields.push(fieldGroup);
    console.log("get the fields from template page");
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
 
  getDefaultProjects(): Observable<any[]>{
    this.defaultProjects = PROJECTS.slice(0,7);
    return of(this.defaultProjects);
  }

  /* getSubProject(project:Project | number): Observable<SubProject[]> {
    const id = typeof project === 'number' ? project : project.id;
    this.projects.filter((projectToFind) => {
      if (projectToFind.id === id) {
        this.sub_projects = projectToFind.sub_items;
      }
    });
    return of(this.sub_projects);
  } */

  //

  getTable(): Observable<any> {
    this.table = this.TABLES;
    return of(this.table);
  }

  updateTable(table: string[]) {
    this.TABLES = table;
    console.log(this.TABLES);
  }
  
}
