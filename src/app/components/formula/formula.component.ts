import { Component, OnInit, OnChanges, AfterViewChecked } from '@angular/core';
import { Project } from '../../models/project';
import { SubProject } from '../../models/sub_projects';
import { FormulaService } from '../../services/formula.service';

@Component({
  selector: 'app-formula',
  templateUrl: './formula.component.html',
  styleUrls: ['./formula.component.css']
})
export class FormulaComponent implements OnInit {
  projects: Project[];
  sub_projects: SubProject[];
  tables: string[];
  name: boolean = true;
  cost_code: boolean = true;
  editable: boolean = true;
  item_id: boolean = true;

  constructor(private formulaService:FormulaService) { }

  ngOnInit(): void {
    this.getProjects();
    this.getTable();
  }

  getProjects() {
    this.formulaService.getProjects().subscribe(projects=>this.projects=projects);
  }

  getSubProject(project:Project){
    this.formulaService.getSubProject(project).subscribe(sub_projects=>{this.sub_projects=sub_projects});
    console.log("get sub_items");
  }

  compareArray(project: Project){
    if (JSON.stringify(this.sub_projects)==JSON.stringify(project.sub_items)) {
      return true;
    } 
    return false;
  }

  getTable() {
    this.formulaService.getTable().subscribe(table=>this.tables=table);
    this.checkTableCol();
  }

  checkTableCol(){
    if (this.tables.indexOf('NAME') == -1) {
      this.name = false;
    }
    if (this.tables.indexOf('COST_CODE') == -1) {
      this.cost_code = false;
    }
    if (this.tables.indexOf('EDITABLE') == -1) {
      this.editable = false;
    }
    if (this.tables.indexOf('ITEM_ID') == -1) {
      this.item_id = false;
    }
  }
}
