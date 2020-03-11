import { Injectable } from '@angular/core';
import { dataTable } from '../../assets/dataTable';
import {newArray} from '@angular/compiler/src/util';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  projectData = [];
  dataChecked = [];
  selected = [];
  deleteSelected = [];
  show = [];
  tableKeys = [];
  projectCollection = [];
  projects = [{projectName: 'project1', data: []},
    {projectName: 'project2', data: []},
    {projectName: 'project3', data: []},
    {projectName: 'korera', data: []}];
  checked: boolean;
  checkAll: boolean;
  uncheckAll: boolean;

  page: number;
  totalPage: number;
  itemPerPage = 10;
  projectName;
  constructor(private http: HttpClient) {
  this.dataSetUp();
  }

  getProjectData()  {return this.projectData; }
  getShow() {return this.show; }
  getSelected() {return this.selected; }
  getDeleteSelected() {return this.deleteSelected; }
  getTotalPage() {return this.totalPage; }
  getProjects(){return this.projects; }

  /*
  * Change page table
  * */
  setPage(page) {
    this.page = page;
    this.uncheckAll = false;
    this.checkAll = false;

    }
  /* Set Up data to display table
  separate items into smaller page
  */
  private dataSetUp() {
    dataTable.sort((a: any, b: any) => {
      return a.code - b.code;
    });

    console.log(dataTable);

    let count = 0;
    let tempTable = [];
    this.page = 0;
    // Transfer data from dataTable to projectData
    for (const data of dataTable) {
      // put data into page
      if (count < this.itemPerPage) {
        tempTable.push(data);
        count += 1;
      }
      // create a page of one table
      if (count === this.itemPerPage) {
        this.projectData.push(tempTable);
        this.totalPage += 1;
        tempTable = [];
        count = 0;
      }
    }

    // Last page (if there are any data)
    if (tempTable.length > 0) {
      this.projectData.push(tempTable);
      this.totalPage += 1;
    }

    // initialize checkmark
    this.dataChecked = newArray(dataTable.length);
    this.dataChecked.fill(false);
    //console.log(this.dataChecked);

    // get table keys
    this.tableKeys = Object.keys(dataTable[0]);
    const tempKey = this.tableKeys[0];
    this.tableKeys[0] = this.tableKeys[1];
    this.tableKeys[1] = tempKey;
    //this.tableKeys[2] = 'extra1';
    //this.tableKeys[3] = 'extra2';
    //console.log(this.tableKeys);

    // get projectCollection
    for(const project of this.projects){
      //this.projectNameCollection.push(project.projectName);
      this.projectCollection.push(project.projectName);
    }
    //console.log(this.projectNameCollection);
  }

  /*
  * put data selected into a temp table or remove them when unchecked
  * before data were exported to show table
  * */
  changeMade(event, data) {
    const dataIndex = this.page * this.itemPerPage + this.projectData[this.page].indexOf(data);
    if (event.target.checked) {
      this.uncheckAll = false;
      this.selected.push(data);
      this.dataChecked[dataIndex] = true;
    } else {
      this.selected.splice(this.selected.indexOf(data), 1);
      this.dataChecked[dataIndex] = false;
    }
    // logging test
    //console.log(dataIndex);
    //console.log(this.dataChecked);
  }

  /*
  * put data selected into temp table or remove them when unchecked
  * before data were deleted from show table
  * */
  changeMadeToDelete(event, data) {
    if (event.target.checked) {
      this.deleteSelected.push(data);
    } else {
      this.deleteSelected.splice(this.deleteSelected.indexOf(data), 1);
    }
  }

  /*
  * export data from selected table to show table
  * */
  transferToShow() {
    for (const data of this.selected) {
      if (!this.show.includes(data)) {
        this.show.push(data);
      }
    }
  this.selected = [];
    this.show.sort((a, b) => {
      return a.code - b.code;
    });
  }

  /*
  * delete data from show table based on selected item to delete
  * */
  deleteFromShow() {
    for (const data of this.deleteSelected) {
      if (this.show.includes(data)) {
        this.show.splice(this.show.indexOf(data), 1);
      }
    }

    this.deleteSelected = [];
  }

  /*
  * trigger all the checkbox when 'select all' is marked
  * put data into selected items
  * */
  selectAll(event) {

      this.checkAll = true;
      this.uncheckAll = false;
      let dataIndex;
      for (const data of this.projectData[this.page]) {
        dataIndex = this.page * this.itemPerPage + this.projectData[this.page].indexOf(data);
        //put data in selected and mark the checkbox
        if (event.target.checked) {
        if (!this.selected.includes(data)){
          this.selected.push(data);
          this.dataChecked[dataIndex] = true;
        }
        // remove from selected and remove checkbox mark
        // not necessary functionallity of select all ( can be handled by unselect all)
          /*
        else {
          if (this.selected.includes(data)) {
            this.selected.splice(this.selected.indexOf(data), 1);
            this.dataChecked[dataIndex] = false;
          }
        }
        */
      }
    }
      //console.log(this.dataChecked);
  }

  /*
  * remove all check mark from checkbox when 'clear selection' is marked
  * remove data of the page from the selected list;
  * */
  unselectAll(event) {

    if(event.target.checked) {
      this.checkAll = false;
      this.uncheckAll = true;

      let dataIndex;
      for (const data of this.projectData[this.page]) {
        dataIndex = this.page * this.itemPerPage + this.projectData[this.page].indexOf(data);
        if (event.target.checked) {
          if (this.selected.includes(data)) {
            this.selected.splice(this.selected.indexOf(data), 1);
            this.dataChecked[dataIndex] = false;
          }
        }
      }

    }
  }

  switchProject(event){
    this.show = [];
    this.selected = [];
    this.deleteSelected = [];
    this.checkAll = false;
    this.uncheckAll = false;
    this.dataChecked.fill(false);
    this.page = 0;
    this.projectName = event.target.value;
    for(const project of this.projects){
      if (project.projectName === this.projectName) {
        this.show = [...project.data];
        break;
      }
    }
    //console.log('switch Project: ' + this.projectName);

  }

  submitProject(){
    for(const project of this.projects){
      if (project.projectName === this.projectName){
        project.data = [...this.show];
        this.http.post
      }
    }

    //console.log(this.projects);
  }

  filterSearch(){
    let input = document.getElementById('userInput');
    let filter = input['value'];
    this.projectCollection = [];
    for(const project of this.projects) {
      if (filter === '') {
        this.projectCollection.push(project.projectName);
      }
      else{
        if(project.projectName.includes(filter)){
          this.projectCollection.push(project.projectName);
        }
      }
    }
    //console.log(filter);
  }


  switchProjectName(pName){
    this.show = [];
    this.selected = [];
    this.deleteSelected = [];
    this.checkAll = false;
    this.uncheckAll = false;
    this.dataChecked.fill(false);

    this.projectName = pName;
    for(const project of this.projects){
      if (project.projectName === this.projectName) {
        this.show = [...project.data];
        break;
      }
    }
  }

}
