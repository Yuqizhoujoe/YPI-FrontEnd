import { Component, OnInit } from '@angular/core';
import {range} from 'rxjs';
import {newArray} from '@angular/compiler/src/util';
import {dataTable} from '../../../../assets/dataTable.js';
import {AppService} from './app.service';

@Component({
  selector: 'app-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {


  // Variables
  projectData;
  projects;
  selected;
  deleteSelected;
  show;
  dataChecked;
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
  submitProject;
  setPage;

  // Getter Method
  getProjects;



  constructor(appService: AppService) {
    // variables initialazation
    this.projectData = appService.projectData;
    this.projects = appService.projects
    this.show = appService.show;
    this.selected = appService.selected;
    this.deleteSelected = appService.deleteSelected;
    this.dataChecked = appService.dataChecked;
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
    this.submitProject = appService.submitProject;
    this.setPage = appService.setPage;

    // getter initialazations
    this.getProjects = appService.getProjects;
  }
  ngOnInit(): void {
  }


}
