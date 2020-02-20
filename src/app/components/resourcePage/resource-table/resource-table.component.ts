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
  dataList:Observable<DATA[]>;
  total: Observable<number>;
  theservice:any;
  statusRow:boolean = false;
  statusCol:boolean = false;
  rowContent:any;
  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;
  
  constructor(private service:DataService) {
    this.dataList= service.datas$;
    this.total = service.total$;
    this.theservice = service;
   }
   
  ngOnInit(): void {
  }

  callLog():void{
    console.log(this.dataList);
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
    if (!this.statusRow) {
      this.statusRow = true;
    }else 
    if (this.statusRow) {
      this.statusRow = false;
    }
    
  }
  addRow(a:any,b:any){
    this.rowContent = {codeNumber: b,name: a};
    this.theservice.addData(this.rowContent);
    console.log(this.rowContent);
    this.statusRow = false;
  }

  showCol(){
    this.statusRow = false;
    if (!this.statusCol) {
      this.statusCol = true;
    }else 
    if (this.statusCol) {
      this.statusCol = false;
    }
  }
  
  addCol(){
    this.statusCol = false;
  }

  importCSV(){

  }

}
