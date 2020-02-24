import { Component, OnInit, OnChanges, AfterViewChecked } from '@angular/core';
import { Project } from '../../models/project';
import { SubProject } from '../../models/sub_projects';
import { FormulaService } from '../../services/formula.service';
import { FormGroup, FormControl, CheckboxRequiredValidator, Form, FormArray} from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import { platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { ResourceLoader } from '@angular/compiler';
import { DATA } from '../../models/DATA';
import { ProjectService } from '../../services/project.service';
import { TABLE } from '../../mock-table';

@Component({
  selector: 'app-formula',
  templateUrl: './formula.component.html',
  styleUrls: ['./formula.component.css']
})
export class FormulaComponent implements OnInit {
  // set projects array 
  projects: any[];
  defaultProjects: any[];
  project = {
    projectName: '',
    data: []
  };

  // set table_name array
  tables: string[];
  display_cost_code: boolean = true;
  
  // field from template page
  fields: any[] = [];
  field_type = [];
  field_formula_string = [];
  field_name = [];
  field_number_length: number = 0;
  field_text_length: number = 0;
  field_formula_length: number = 0;
  showField: boolean = false;
  field_number = [[]];
  field_text = [[]];
  field_formula = [[]];
  temp_field_number = [[]];
  temp_field_text = [[]];
  temp_field_formula = [[]];

  // form
  public dynamicFormulaForm: FormGroup;
  public formArrayForFormula: FormArray;
  public formArrayForTemplate: FormArray;

  formulaPageSubmit: boolean = false;
  data: any;

  constructor(private formulaService:FormulaService, private fb: FormBuilder) { 
  }

  ngOnInit() {
    // get default project items
    this.getDefaultProjects();
    // display default project items
    this.showDefaultProjects();
    // get table name
    this.getTable();
    // get project items
    this.getProjectsAtFirst();
    // if we got the data then create dynamic form with name and cost_code form control 
    if (this.project.data.length !== 0) {
      this.createaDynamicFormAtFirst();
    }
    // get the field data from template page 
    this.getFieldFromTemplate();

  }

  // show project name in drop down
  switchProject(event:any){
    // if the event.target.value match one of the projectName, then display the data under the projectName
    for (let i = 0; i < this.projects.length; i++) {
      if (this.projects[i]['projectName'] === event.target.value) {
        this.project.projectName = this.projects[i]['projectName'];
        this.project.data = this.projects[i]['data'];
      }
    }
    console.log(this.project);
    // if choose nothing, display default project items
    if (event.target.value === '') {
      this.showField = false;
      this.showDefaultProjects();
      this.tables = ['NAME', 'COST_CODE'];
      this.createaDynamicFormAtFirst();
    } else {
      if (this.fields.length === 0) {
        // if have no data from template
        this.tables = ['NAME', 'COST_CODE'];
        // create dynamic form with name and cost_code form control 
        this.createaDynamicFormAtFirst();
      } else {
        // if get the data from template page and get the project data from project page 
        if (this.project['showField'] === true && this.project.data.length !== 0) {
          // map each field and push each field's fieldInput into table as col name
          this.fields.map(field => {
            this.tables.push(field['fieldInput']);
            // check whether table'name is repeated
            this.checkTableCol();
          });
          // decide to show the addition col obtained from template page
          this.showField = true;
          // create dynamic form if the fields data exists
          this.createDynamicFormAfterTemplate();
        } else {
            this.tables = ['NAME', 'COST_CODE'];
            this.createaDynamicFormAtFirst();
        }
      }
    }

    /* if (this.project.projectName !== 'Default Projects' 
      && this.project.data.length !== 0) {
        this.getTable();
        console.log(this.tables);
        this.showField = true;
    } */
    // if have not get the data from template page, then create dynamic form with name and cost_code form control
    // if already got the data from template page, then recreate dynamic form with new form control field_array
    /* if (this.fields.length === 0) {
      this.clearTableSwitchProject();
      this.createaDynamicFormAtFirst();
    } else if (this.fields.length !== 0){
      console.log(this.fields);
      this.createDynamicFormAfterTemplate();
    } */
    
  }

  // get projects from project page
  getProjectsAtFirst(){
    this.formulaService.getProjects().subscribe(projects=>this.projects=projects);
    console.log("get the data from formular Service");
  }

  // get default projects to display at the formula page
  getDefaultProjects(){
    this.formulaService.getDefaultProjects().subscribe(defaultProjects=>this.defaultProjects=defaultProjects);
    console.log(`new page\nget the default data from formular Service`);
  }

  createaDynamicFormAtFirst(){
    // assign the dynamicFormulaForm as form group
    this.dynamicFormulaForm = this.fb.group({
      formArrayForFormula: this.fb.array([]),
    });

    // assign the formArrayForFormula as FormArray
    this.formArrayForFormula = this.dynamicFormulaForm.get('formArrayForFormula') as FormArray;

    // create form control and form group 
    this.project.data.map(project => {
      let project_name = this.fb.control({value: project.name, disabled: true});
      let project_cost_code = this.fb.control({value: project.codeNumber, disabled: true});
      let form_group = this.fb.group({
        name: project_name,
        cost_code: project_cost_code
      })
      // push the form group into form array
      this.formArrayForFormula.push(form_group);
    });
    
  }

  // display default project 
  showDefaultProjects(){
    this.project.projectName = 'Default Projects';
    this.project.data = this.defaultProjects;
  } 

  getTable() {
    this.formulaService.getTable().subscribe(table=>this.tables=table);
    // check the column name of table
    this.checkTableCol();
    console.log(this.tables);
  }

  checkTableCol(){
    if (this.tables.indexOf('COST_CODE') == -1) {
      this.display_cost_code = false;
    }
    this.tables = [...new Set(this.tables)];
  }

  // get fields from template
  getFieldFromTemplate(){
    this.formulaService.sendFieldToFormulaPage().subscribe(fields=>this.fields=fields);
    if (this.fields.length !== 0) {
      this.fillDummyToFieldArray();
      // when get the data from template page, fill null into the table
      this.project['showField'] = true;
      // if we get the fields, then we push the field.fieldInput, which will be the name of the table, into tables array
      this.fields.map(elem => {
        this.tables.push(elem['fieldInput']);
        // check table
        this.checkTableCol();
        // get the field type
        this.field_type.push(elem['type']);
        // get the formula
        if (elem['formula'] !== undefined) {
          this.field_formula_string.push(elem['formula']);
        }
        // get the number of field_number
        if (elem['type'] === 0) {
          this.field_number_length += 1;
        } 
        // get the number of field_type
        if (elem['type'] === 1) {
          this.field_text_length += 1;
        } 
        // get the number of field_formula
        if (elem['type'] === 2) {
          this.field_formula_length += 1;
        }
      });
      // if get data from template, then display the columns
      this.showField = true;
      // if get the field data successfully 
      // recreate dynamic form with new form control field_array
      this.createDynamicFormAfterTemplate();
    }  
  }

  // create dynamic form after get data from template
  createDynamicFormAfterTemplate(){
    this.fillDummyToFieldArray();
    // recreate dynamicFormulaForm form group and formArrayForFormula form array
    this.dynamicFormulaForm = this.fb.group({
      formArrayForFormula: this.fb.array([]),
    });
    // assign this.formArrayForFormula to this.dynamicFormulaForm.get('formArrayForFormula') 
    this.formArrayForFormula = this.dynamicFormulaForm.get('formArrayForFormula') as FormArray;
    // map each element of data array inside the project
    this.project.data.map(project => {
      // declare project_name variable to a form builder control
      let project_name = this.fb.control({value: project.name, disabled: true});
      // declare project_cost variable to a form builder control
      let project_cost_code = this.fb.control({value: project.codeNumber, disabled: true});
      // declare field_array variable to a form builder array
      let field_array = this.fb.array([]);
      // map each element of fields
      this.fields.map(field=>{
        let field_inputs;
        if (field['type'] === 2) {
          field_inputs = this.fb.control({value:'', disabled:true});
        } else {
          // store each element of fields to form builder control 
          field_inputs = this.fb.control({value:''});
        }
        // push each form builder control to field array
        field_array.push(field_inputs);
      });
      // assign field_array, which contains form builder controls, to formArrayForTemplate 
      this.formArrayForTemplate = field_array;
      // build up a new form group to store project_name form control, project_cost_code form control, and formArrayForTemplate form array
      let form_group = this.fb.group({
        name: project_name,
        cost_code: project_cost_code,
        field_arrays: this.formArrayForTemplate
      });
      // push form group to formArrayForFormula
      this.formArrayForFormula.push(form_group);
    });
  }

  // formula calculation when click
  formulaCalculation(i: number){
    let mathOperator = '';
    this.field_formula_string.map(val => {
      let str = val.split(" ");
      for (let i = 0; i < str.length; i++) {
        mathOperator += str[i];
      }
    });
    // get the arithmetic operator from the string by using regular expression
    mathOperator = mathOperator.replace(/[a-zA-Z ]/g, ""); 

    // try to do the math calculation for all the field_numbers in each row  
    let result = 0;
    let string = '';
    for (let j = 0; j < this.field_number[i].length; j++) {
      string = string + this.field_number[i][j] + ' '; 
    }
    string = string.replace(' ', mathOperator);
    result = eval(string); 

    // try to get the position of field_formula in the row
    let field_formula_position = 0;
    for (let i = 0; i < this.field_type.length; i++) {
      if (this.field_type[i] == 2) {
        field_formula_position = i;
      }
    }
    if (result !== 0) {
      this.field_formula[i][field_formula_position] = 0;
      this.field_formula[i][field_formula_position] = result;
    }
  }

  // fill dummy data into field_number, field_text, and field_formula 2 layers array
  fillDummyToFieldArray(){
    // field_number
   /*  this.field_number = new Array(this.project_length).fill(null); */
    for (let j = 0; j < this.project.data.length; j++) {
      this.field_number[j] = new Array(this.field_number_length).fill(null);
    }
    // field_text
    /* this.field_text = new Array(this.project_length).fill(null); */
    for (let j = 0; j < this.project.data.length; j++) {
      this.field_text[j] = new Array(this.field_text_length).fill(null);
    }
    // field_formula
    /* this.field_formula = new Array(this.projects_length).fill(null); */
    for (let j = 0; j < this.project.data.length; j++) {
      this.field_formula[j] = new Array(this.field_formula_length).fill(null);
    }
    console.log("run rill dummy to field array");
  }

  submit() {
    this.formulaPageSubmit = true;
    this.data = [{}];
    for (let i = 0; i < this.project.data.length; i++) {
      this.data[i] = {
        project_name: this.project.projectName,
        field_number: this.field_number[i].map((val) => {return parseInt(val)}), 
        field_text: this.field_text[i], 
        field_formula: this.field_formula[i].filter((val)=>{
          return val !== null;
        })}
    }
    alert(JSON.stringify(this.data));
  }

  /* // assign field data to temporary field data
  temporaryFieldData(){
    for (let i = 0; i < this.project.data.length; i++) {
      for (let j =0; j < this.fields.length; j++) {
        this.temporary_field_number[i][j] = this.field_number[i][j];
        this.temporary_field_text[i][j] = this.field_text[i][j];
        this.temporary_field_formula[i][j] = this.field_formula[i][j];
      }
    }
  }

  // assign temporary field data back to field data
  fillFieldDataFromTemporary(){
    for (let i = 0; i < this.project.data.length; i++) {
      this.field_number[i] = this.temporary_field_number[i];
      this.field_text[i] = this.temporary_field_text[i];
      this.field_formula[i] = this.temporary_field_formula[i];
    }
    console.log(this.temporary_field_number);
  } */


  /* // clear the table
  clearTableSwitchProject(){
    this.tables = TABLE;
  } */

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
