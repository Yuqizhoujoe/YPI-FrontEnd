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
  selected;
  deleteSelected;
  show;
  checked: boolean;
  checkAll: boolean;
  uncheckAll: boolean;

  page;
  itemPerPage = 20;


  // Functions
  changeMade;
  changeMadeToDelete;
  transferToShow;
  deleteFromShow;
  selectAll;
  unselectAll;
  submitProject;


  constructor(appService: AppService) {
    this.projectData = appService.projectData;
    this.show = appService.show;
    this.selected = appService.selected;
    this.deleteSelected = appService.deleteSelected;
    this.checkAll = appService.checkAll;
    this.uncheckAll = appService.uncheckAll;
    this.changeMade = appService.changeMade;
    this.changeMadeToDelete = appService.changeMadeToDelete;
    this.transferToShow = appService.transferToShow;
    this.deleteFromShow = appService.deleteFromShow;
    this.selectAll = appService.selectAll;
    this.unselectAll = appService.unselectAll;
  }
  ngOnInit(): void {
  }


}
