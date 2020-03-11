import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { DATA } from '../../../models/DATA';
import { DataService } from '../../../services/data.service';
import { NgbdSortableHeader, SortEvent } from '../../../directives/sortable.directive';
import { Observable } from 'rxjs';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-resource-table',
  templateUrl: './resource-table.component.html',
  styleUrls: ['./resource-table.component.css'],
  providers: [DataService, DecimalPipe]
})
export class ResourceTableComponent implements OnInit {
  dataList:any;
  total: Observable<number>;
  theservice:any;
  statusRow:boolean = false;
  statusCol:boolean = false;
  statusColTitle:boolean = false;
  rowContent:any;
  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

  constructor(private service:DataService) {
    //console.log('dataList');
    //console.log(this.dataList);
    this.dataList = service.datas$;
    console.log(service.datas$);
    this.total = service.total$;

    this.theservice = service;
   }

  ngOnInit(): void {
  }

  callLog():void{
    console.log(this.dataList + "hyhhh");
  }

  onSort({column, direction}: SortEvent) {
    // resetting other headers
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    this.service.sortColumn = column;
    this.service.sortDirection = direction;
  }

  showRow(){
    this.statusCol = false;
    this.statusColTitle = false;
    if (!this.statusRow) {
      this.statusRow = true;
    }else
    if (this.statusRow) {
      this.statusRow = false;
    }

  }
  addRow(a:any,b:any){
    this.rowContent = {cost_Code: b,resourceName: a};
    this.theservice.addResource(this.rowContent);
    console.log(this.rowContent);
    this.statusRow = false;
  }

  removeResource(a:number){

    this.theservice.removeResource(a);

    console.log(a);
    var removeIndex = this.dataList.source.value.map(function(item) { return item.resourceId; }).indexOf(a);
    // remove object
    console.log(removeIndex);
    this.dataList.source.value.splice(removeIndex, 1);
    // this.dataList.source.value.splice(a, 1);
    console.log(this.dataList.source.value);
    //  this.dataList.source.value.filter(Boolean);
  }

  showCol(){
    this.statusRow = false;
    if (!this.statusCol) {
      this.statusCol = true;
      this.statusColTitle = true;
    }else
    if (this.statusCol) {
      this.statusCol = false;
      this.statusColTitle = false;
    }
  }

  addCol(a:any){
    this.theservice.addColData(a);
    console.log(a);
    this.statusCol = false;
  }



  importCSV(){

  }

}
