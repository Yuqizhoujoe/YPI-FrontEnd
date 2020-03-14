import { Component, OnInit } from '@angular/core';
import {range} from 'rxjs';
import {newArray} from '@angular/compiler/src/util';
import {dataTable} from '../../../../assets/dataTable.js';
import {ProjectService} from '../../../services/project.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  {


  // Variables
  projectData;
  projects;
  selected;
  deleteSelected;
  show;
  dataChecked;
  tableKeys;
  projectCollection;

  checked: boolean;
  checkAll: boolean;
  uncheckAll: boolean;

  page;
  totalPage;
  itemPerPage;
  projectName;

  // Functions
  changeMade;
  changeMadeToDelete;
  transferToShow;
  deleteFromShow;
  selectAll;
  unselectAll;
  switchProject;
  // submitProject;
  setPage;
  filterSearch;

  // Getter Method
  getProjects;

  //temp
  switchProjectName;


  constructor(appService: ProjectService, private http: HttpClient, ) {
    // array initialazation
    this.projectData = appService.projectData;
    this.projects = appService.projects
    this.show = appService.show;
    this.selected = appService.selected;
    this.deleteSelected = appService.deleteSelected;
    this.dataChecked = appService.dataChecked;
    this.tableKeys = appService.tableKeys;
    this.projectCollection = appService.projectCollection;

    // variables
    this.checkAll = appService.checkAll;
    this.uncheckAll = appService.uncheckAll;
    this.page = appService.page;
    this.totalPage = appService.projectName;
    this.itemPerPage = appService.itemPerPage

    // function initialazation
    this.changeMade = appService.changeMade;
    this.changeMadeToDelete = appService.changeMadeToDelete;
    this.transferToShow = appService.transferToShow;
    this.deleteFromShow = appService.deleteFromShow;
    this.selectAll = appService.selectAll;
    this.unselectAll = appService.unselectAll;
    this.switchProject = appService.switchProject;
    this.setPage = appService.setPage;
    this.filterSearch = appService.filterSearch;

    // getter initialazations
    this.getProjects = appService.getProjects;

    //temp
    this.switchProjectName = appService.switchProjectName;
  }

  // submit
submit(): void {
  for(const project of this.projects){
    if (project.projectName === this.projectName){
      project.data = [...this.show];
      // post project data to DB - projectResource 
      let newProjectResources;
      // create body
      const body = project.data;
      // http post projectResources
      this.http.post<any>(`http://localhost:8080/YPI_BackEnd_war/project/${project.projectId}/resources`, body).subscribe(data => {
        console.log("post data from project page");
        console.log(data);
        });
      }
    }
  }


}
