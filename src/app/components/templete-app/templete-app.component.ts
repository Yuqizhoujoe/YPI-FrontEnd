import { Component, OnInit } from '@angular/core';
import { FormulaService } from '../../services/formula.service';

@Component({
  selector: 'app-templete-app',
  templateUrl: './templete-app.component.html',
  styleUrls: ['./templete-app.component.css']
})
export class TempleteAppComponent implements OnInit {
  name = false;
  cost_code = false;
  editable = false;
  item_id = false;
  table_name: string[] = [];

  constructor(private formulaService:FormulaService) { }

  ngOnInit(): void {
  }

  toggleTable() {
    if (this.name) {
      if (this.table_name.indexOf('NAME') == -1) {
        this.table_name.push('NAME');
      }
    } 

    if (this.cost_code) {
      if (this.table_name.indexOf('COST_CODE') == -1) {
        this.table_name.push('COST_CODE');
      }
    }  

    if (this.editable) {
      if (this.table_name.indexOf('EDITABLE') == -1) {
        this.table_name.push('EDITABLE');
      }
    } 

    if (this.item_id) {
      if (this.table_name.indexOf('ITEM_ID') == -1) {
        this.table_name.push('ITEM_ID');
      }
    }

  }

  updateTable() {
    this.formulaService.updateTable(this.table_name);
  }

}
