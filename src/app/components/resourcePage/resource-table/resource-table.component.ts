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


}
