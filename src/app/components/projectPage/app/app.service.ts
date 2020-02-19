import { Injectable } from '@angular/core';
import { dataTable } from '../../../../assets/dataTable';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  projectData = [];
  selected = [];
  deleteSelected = [];
  show = [];
  checked: boolean;
  checkAll: boolean;
  uncheckAll: boolean;
  constructor() {
    for (const data of dataTable) {
      this.projectData.push(data);
    }

    this.projectData.sort((a: any, b: any) => {
      return a.code - b.code;
    });
  }

  getProjectData()  {return this.projectData;}
  getShow() {return this.show;}
  getSelected() {return this.selected;}
  getDeleteSelected() {return this.deleteSelected;}
  changeMade(event, data) {
    if (event.target.checked) {
      this.uncheckAll = false;
      this.selected.push(data);
    } else {
      this.selected.splice(this.selected.indexOf(data), 1);
    }
  }

  changeMadeToDelete(event, data) {
    if (event.target.checked) {
      this.deleteSelected.push(data);
    } else {
      this.deleteSelected.splice(this.deleteSelected.indexOf(data), 1);
    }
  }

  transferToShow() {
    for (const data of this.selected) {
      if (!this.show.includes(data)) {
        this.show.push(data);
      }
    }

    this.show.sort((a, b) => {
      return a.code - b.code;
    });
  }

  deleteFromShow() {
    for (const data of this.deleteSelected) {
      if (this.show.includes(data)) {
        this.show.splice(this.show.indexOf(data), 1);
      }
    }
  }

  selectAll(event) {
    if(event.target.checked) {
      this.checkAll = true;
      this.uncheckAll = false;

      for(const data of this.projectData){
        if (!this.selected.includes(data)){
          this.selected.push(data);
        }
      }
    }
  }

  unselectAll(event) {

    if(event.target.checked) {
      this.checkAll = true;
      this.checkAll = false;
      this.uncheckAll = true;
      this.selected = [];
    }
  }
}
