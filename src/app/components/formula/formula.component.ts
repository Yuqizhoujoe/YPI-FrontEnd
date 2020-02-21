import { Component, OnInit, OnChanges, AfterViewChecked } from '@angular/core';
import { Project } from '../../models/project';
import { SubProject } from '../../models/sub_projects';
import { FormulaService } from '../../services/formula.service';
import { FormGroup, FormControl, CheckboxRequiredValidator, Form, FormArray} from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import { platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { ResourceLoader } from '@angular/compiler';

@Component({
  selector: 'app-formula',
  templateUrl: './formula.component.html',
  styleUrls: ['./formula.component.css']
})
export class FormulaComponent implements OnInit {
  // set projects array 
  projects: Project[];
  projects_length: number;

  // set table_name array
  tables: string[];
  name: boolean = true;
  cost_code: boolean = true;
  
  // field from template page
  fields: any[] = [];
  field_type = [];
  field_formula_string = [];
  field_name = [];
  showField: boolean = false;
  field_number = [[]];
  field_text = [[]];
  field_formula = [[]];

  // form
  public dynamicFormulaForm: FormGroup;
  public formArrayForFormula: FormArray;
  public formArrayForTemplate: FormArray;

  formulaPageSubmit: boolean = false;
  data: any;

  constructor(private formulaService:FormulaService, private fb: FormBuilder) { }

  ngOnInit() {
    // get project items
    this.getProjectsAtFirst();

    // get table name
    this.getTable();

    // assign the dynamicFormulaForm as form group
    this.dynamicFormulaForm = this.fb.group({
      formArrayForFormula: this.fb.array([]),
    });

    // assign the formArrayForFormula as FormArray
    this.formArrayForFormula = this.dynamicFormulaForm.get('formArrayForFormula') as FormArray;

    // push project items' name and cost_code to formArrayForFormula
    this.projects.map(project => {
      let project_name = this.fb.control({value: project.name, disabled: true});
      let project_cost_code = this.fb.control({value: project.codeNumber, disabled: true});
      let form_group = this.fb.group({
        name: project_name,
        cost_code: project_cost_code
      })
      this.formArrayForFormula.push(form_group);
    });
    this.getFieldFromTemplate();
    /* after get field from template */
    console.log("form array for formula controls");
    console.log(this.formArrayForFormula.controls);
    
  }

  getProjectsAtFirst(){
    this.formulaService.getProjects().subscribe(projects=>{
      this.projects=projects.slice(0,5);
      this.projects_length = projects.length;
    });
    this.fillDummyToFieldArray();
  }

  getTable() {
    this.formulaService.getTable().subscribe(table=>this.tables=table);
    // check the column name of table
    this.checkTableCol();
  }

  checkTableCol(){
    if (this.tables.indexOf('NAME') == -1) {
      this.name = false;
    }

    if (this.tables.indexOf('COST_CODE') == -1) {
      this.cost_code = false;
    }

    this.tables = [...new Set(this.tables)];
  }

  // get fields from template
  getFieldFromTemplate(){
    this.formulaService.sendFieldToFormulaPage().subscribe(fields=>this.fields=fields);
    console.log("field data from template");
    console.log(this.fields);
    if (this.fields.length !== 0) {
      // if we get the fields, then we push the field.fieldInput, which will be the name of the table, into tables array
      this.fields.map(elem => {
        this.tables.push(elem['fieldInput']);
        // check the column name of table
        this.checkTableCol();
        // get the field type
        this.field_type.push(elem['type']);
        // get the formula
        if (elem['formula'] !== undefined) {
          this.field_formula_string.push(elem['formula']);
        }
        // get field input name 
        if (elem['type'] !== 2) {
          this.field_number.push(elem['fieldInput']);
        }
      });
      // if get data from template, then display the columns
      this.showField = true;  
      // recreate dynamicFormulaForm form group and formArrayForFormula form array
      this.dynamicFormulaForm = this.fb.group({
        formArrayForFormula: this.fb.array([]),
      });
      // assign this.formArrayForFormula to this.dynamicFormulaForm.get('formArrayForFormula') 
      this.formArrayForFormula = this.dynamicFormulaForm.get('formArrayForFormula') as FormArray;
      this.projects.map(project => {
        let project_name = this.fb.control({value: project.name, disabled: true});
        let project_cost_code = this.fb.control({value: project.codeNumber, disabled: true});
        let field_array = this.fb.array([]);
        this.fields.map(field=>{
          let field_inputs = this.fb.control({value:''});
          field_array.push(field_inputs);
        });
        this.formArrayForTemplate = field_array;
        let form_group = this.fb.group({
          name: project_name,
          cost_code: project_cost_code,
          field_arrays: this.formArrayForTemplate
        });
        this.formArrayForFormula.push(form_group);
      });
    }
  }

  formulaCalculation(i: number,a: number){
    let mathOperator = '';
    console.log(this.field_formula_string);
    this.field_formula_string.map(val => {
      let str = val.split(" ");
      console.log(val);
      for (let i = 0; i < str.length; i++) {
        console.log(str[i]);
        mathOperator += str[i];
      }
    });
    mathOperator = mathOperator.replace(/[a-zA-Z ]/g, "");
    let result = 0;
    let string = '';
    for (let j = 0; j < this.field_number[i].length; j++) {
      string = string + this.field_number[i][j] + ' '; 
    }
    string = string.replace(' ', mathOperator);
    result = eval(string);
    this.field_formula[i][a] = 0;
    this.field_formula[i][a] = result;
  }

  // fill dummy data into field_number, field_text, and field_formula 2 layers array
  fillDummyToFieldArray(){
    // field_number
    /* this.field_number = new Array(this.projects_length).fill(null); */
    for (let j = 0; j < this.projects_length; j++) {
      this.field_number[j] = new Array(1).fill(null);
    }

    // field_text
/*     this.field_text = new Array(this.projects_length).fill(null); */
    for (let j = 0; j < this.projects_length; j++) {
      this.field_text[j] = new Array(1).fill(null);
    }

    // field_formula
/*     this.field_formula = new Array(this.projects_length).fill(null); */
    for (let j = 0; j < this.projects_length; j++) {
      this.field_formula[j] = new Array(1).fill(null);
    }

  }

  submit() {
    this.formulaPageSubmit = true;
    this.data = [{}];
    for (let i = 0; i < this.projects_length; i++) {
      this.data[i] = {field_number: this.field_number[i], field_text: this.field_text[i], field_formula: this.field_formula[i]}
    }
    console.log(this.data);
  }

  /* createFormGroupForFormula(name: string, cost_code: string){
    return this.fb.group({
      name: this.fb.control({value: name, disabled: true}),
      cost_code: this.fb.control({value: cost_code, disabled: true}),
      fields: this.fb.array([])
    });
  } */

  /* createFormGroupForTemplate() {
    this.field_name.map(name => {
      return this.fb.group({
        [name]:this.fb.control('')
      })
    }); 
  } */

  /* addformArrayForFormulaFieldList(){
    this.projects.map(project => {
      this.formArrayForFormula.push(this.createFormGroupForFormula(project.name, project.codeNumber));
    });
    console.log("initial form array");
    console.log(this.formArrayForFormula);
    console.log(this.formArrayForFormula.controls);
  } */

  /* addformArrayForTemplateFieldList(){
    for (let i = 0; i < this.formArrayForFormula.controls.length; i++) {
      this.formArrayForFormula.get('fields')
    }
  } */

    // save fields data to field_all object
  /* saveFieldsIntoObjectArray(){
    for (let i = 0; i < this.fields.length; i++) {
      for (let j = 1; j < this.field_all.length; j++) {
        this.field_all[j]['number'] = this.field_number[i][j]; 
        this.field_all[j]['text'] = this.field_text[i][j]; 
        this.field_all[j]['formula'] = this.field_formula[i][j]; 
      }
    } 
    console.log("save");
  } */

  /* getProjectsForPages(page:number) {
    if (page === 1) {
      this.formulaService.getProjects().subscribe(projects=>{
        this.projects=projects.slice(0,page*7);
      });
      this.field_all.map(field => {
        if (field['id'] === 1) {
            field['number'] = this.field_number;
            field['text'] = this.field_text;
            field['formula'] = this.field_formula;
        }
      });
    } else {
      this.formulaService.getProjects().subscribe(projects=>{
        this.projects=projects.slice(page*7,page*7+7);
        this.projects.map(project=>console.log(project.id));
      });
      this.field_all.map(field => {
        if (field['id'] === page && field['id'] !== 1) {
            field['number'] = this.field_number;
            field['text'] = this.field_text;
            field['formula'] = this.field_formula;
        }
      });
    }
    console.log(this.field_all);
  } */


  /* page(){
    this.formulaService.getProjects().subscribe(projects=>{
      this.projects_length=projects.length;
      this.projects.map(project=>console.log(project.id));
    });
    this.pages = Math.ceil((this.projects_length / 7)) -1;
    for (let i = 0; i < this.pages; i++) {
      this.pages_array.push(i+1);
    }
    for (let i = 0; i < this.pages; i++) {
      let obj = {};
      obj['id'] = i+1;
      obj['number'] = [[]];
      obj['text'] = [[]];
      obj['formula'] = [[]];
      this.field_all.push(obj);
    }
    delete this.field_all[0];
  } */


  /* getSubProject(project:Project){
    this.formulaService.getSubProject(project).subscribe(sub_projects=>{this.sub_projects=sub_projects});
    console.log("get sub_items");
  } 

  compareArray(project: Project){
    if (JSON.stringify(this.sub_projects)==JSON.stringify(project.sub_items)) {
      return true;
    } 
    return false;
  }
  */

  /* changeDisplayOfSubProject(){
    this.isDisplay = !this.isDisplay;
    console.log("display");
  } */


}
