import { Component, OnInit } from '@angular/core';
import {DataService} from '../../../services/data.service';
import { DATA } from '../../../models/DATA';
import {Observable} from 'rxjs';
@Component({
  selector: 'app-resource-header',
  templateUrl: './resource-header.component.html',
  styleUrls: ['./resource-header.component.css']
})
export class ResourceHeaderComponent implements OnInit {
  theservice;
  constructor(private service:DataService) {
    this.theservice = service;
   }

  ngOnInit(): void {
  }

}
