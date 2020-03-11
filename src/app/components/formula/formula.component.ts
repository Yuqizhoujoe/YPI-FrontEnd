import { Component, OnInit, OnChanges, AfterViewChecked } from '@angular/core';
import { Project } from '../../models/project';
import { FormulaService } from '../../services/formula.service';
import { FormGroup, FormControl, CheckboxRequiredValidator, Form, FormArray} from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import { platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { ResourceLoader } from '@angular/compiler';
import { DATA } from '../../models/DATA';
import { ProjectService } from '../../services/project.service';
import { TABLE_COL_NAMES } from '../../mock-table';

@Component({
  selector: 'app-formula',
  templateUrl: './formula.component.html',
  styleUrls: ['./formula.component.css']
})
export class FormulaComponent implements OnInit {
  // resource array 
  resources: any[];
  // default resource array
  defaultResources: any[];
  // project
  project = {
    projectName: '',
    resource: []
  };

  // set table_name array
  table_col_names: string[];
  // boolean to display Cost Code
  display_cost_code: boolean = true;
  
  // data from template page
  template_data: any[] = [];
  // type array
  type = [];
  // formula content
  formula_content = [];
  // 
  field_name = [];
  // length of the number array
  number_length: number = 0;
  // length of the text array
  text_length: number = 0;
  // length of formula
  formula_length: number = 0;
  // show template page
  showTemplate: boolean = false;
  // number 2d array 
  number = [[]];
  // text 2d array
  text = [[]];
  // formula 2d array
  formula = [[]];
  // temp 2d array
  temp_number = [[]];
  temp_text = [[]];
  temp_formula = [[]];

  // Reactive Form
  // Form Group
  public dynamicFormulaForm: FormGroup;
  // Form Array
  public formArrayForFormula: FormArray;
  public formArrayForTemplate: FormArray;

  // 
  formulaPageSubmit: boolean = false;

  /* 
    data: {
      project_name: 
      number:  
      text: 
      formula: 
    }
  */
  data: any;
  
  // constructor 
  // inject formulaService and formbuilder
  constructor(private formulaService:FormulaService, private fb: FormBuilder) {
  }

  // init - life cycle hook
  ngOnInit() {
    // get project items
    this.getResources();
    // display default project items
    this.displayDefaultResources();
    // get table name
    this.getTableColNames();
    // if we got the data then create dynamic form with name and cost_code form control 
    if (this.project.resource.length !== 0) {
      this.createaDynamicFormAtFirst();
    }
    // get the field data from template page 
    this.getTemplateData();

  }

  /////////////////////////////////////////////
  // retrieve data 
  /////////////////////////////////////////////

  // get resources for each project 
  getResources(){
    this.formulaService.getResources().subscribe(resources=>this.resources=resources);
    this.defaultResources = this.resources[0];
    console.log("get the projects: ");
    console.log(this.resources);
    console.log("default project: ");
    console.log(this.defaultResources);
  }

  // get fields from template
  getTemplateData(){
    // get the template_data
    this.formulaService.sendFieldToFormulaPage().subscribe(templateData=>this.template_data=templateData);
    if (this.template_data.length !== 0) {
      // fill null to number, text, and formula array
      this.fillNull();
      this.project['showTemplate'] = true;
      // loop through template_data
      this.template_data.map(elem => {
        // get the table col names 
        this.table_col_names.push(elem['fieldInput']);
        // check if table colname is duplicate
        this.checkTableCol();
        // get the data type
        this.type.push(elem['type']);
        // get the formula string
        if (elem['formula'] !== undefined) {
          this.formula_content.push(elem['formula']);
        }
        // get the number of number type
        if (elem['type'] === 0) {
          this.number_length += 1;
        } 
        // get the number of text type
        if (elem['type'] === 1) {
          this.text_length += 1;
        } 
        // get the number of formula type
        if (elem['type'] === 2) {
          this.formula_length += 1;
        }
      });
      // if get data from template, then display the columns
      this.showTemplate = true;
      // if get the template data successfully 
      // create another dynamic form with new data
      this.createDynamicFormAfterTemplate();
    }  
  }


  // get table colnames data
  getTableColNames() {
    this.formulaService.getTableColNames().subscribe(colnames=>this.table_col_names=colnames);
    // check the column name of table
    this.checkTableCol();
    console.log(this.table_col_names);
  }

  checkTableCol(){
    // display col cost_code 
    if (this.table_col_names.indexOf('COST_CODE') == -1) {
      this.display_cost_code = false;
    }
    // make sure the colnames are not duplicate
    this.table_col_names = [...new Set(this.table_col_names)];
  }


  /////////////////////////////////////////////
  // create reactive form
  /////////////////////////////////////////////

  // create form group 
  createaDynamicFormAtFirst(){
    // create form group - dynamicFormulaForm
    this.dynamicFormulaForm = this.fb.group({
      // create form array - formArrayForFormula
      formArrayForFormula: this.fb.array([]),
    });
 
    this.formArrayForFormula = this.dynamicFormulaForm.get('formArrayForFormula') as FormArray;

    // loop through project's resources
    this.project.resource.map(project => {
      // create form control for project_name
      let project_name = this.fb.control({value: project.name, disabled: true});
      // create form control for project_cost_code
      let project_cost_code = this.fb.control({value: project.codeNumber, disabled: true});
      // create form group for project_name and project_cost_code form controls
      let form_group = this.fb.group({
        name: project_name,
        cost_code: project_cost_code
      })
      // push the form group into form array - formArrayForFormula 
      this.formArrayForFormula.push(form_group);
    });
    
  }

  // create form group after get data from template
  createDynamicFormAfterTemplate(){
    // fill null to number, text, formula array
    this.fillNull();
    // create form group
    this.dynamicFormulaForm = this.fb.group({
      // create form array
      formArrayForFormula: this.fb.array([]),
    });
    this.formArrayForFormula = this.dynamicFormulaForm.get('formArrayForFormula') as FormArray;
    // loop through project's resources
    this.project.resource.map(resource => {
      let project_name = this.fb.control({value: resource.name, disabled: true});
      let project_cost_code = this.fb.control({value: resource.codeNumber, disabled: true});
      // create template data form array
      let form_array = this.fb.array([]);
      // loop through template_data
      this.template_data.map(templateData=>{
        let col_formula;
        if (templateData['type'] === 2) {
          // make form control disabled if data type is formula
          col_formula = this.fb.control({value:'', disabled:true});
        } else {
          // create form control
          col_formula = this.fb.control({value:''});
        }
        // push to template data form array
        form_array.push(col_formula);
      });
      this.formArrayForTemplate = form_array;
      // create form group
      let form_group = this.fb.group({
        name: project_name,
        cost_code: project_cost_code,
        template_data_array: this.formArrayForTemplate
      });
      this.formArrayForFormula.push(form_group);
    });
  }

  /////////////////////////////////////////////
  // display data
  /////////////////////////////////////////////

  // display default project 
  displayDefaultResources(){
    // set the project's projectName to Default Projects 
    this.project.projectName = 'Default Projects';
    // set the project data to defaultResources
    this.project.resource = this.defaultResources;
  }

  // switch different projects
  switchProject(event:any){
    // loop through resources
    for (let i = 0; i < this.resources.length; i++) {
      if (this.resources[i]['projectName'] === event.target.value) {
        this.project.projectName = this.resources[i]['projectName'];
        this.project.resource = this.resources[i]['data'];
      }
    }
    console.log(this.project);
    // if choose nothing, display default project items
    if (event.target.value === '') {
      // display default resources
      this.displayDefaultResources();
    } else {
      if (this.template_data.length === 0) {
        // if have no data from template
        this.table_col_names = ['NAME', 'COST_CODE'];
        // create dynamic form with name and cost_code form control 
        this.createaDynamicFormAtFirst();
      } else {
        // if get the data from template page and get the project data from project page 
        if (this.project['showTemplate'] === true && this.project.resource.length !== 0) {
          // map each field and push each field's fieldInput into table as col name
          this.template_data.map(templateData => {
            this.table_col_names.push(templateData['fieldInput']);
            // check whether table'name is repeated
            this.checkTableCol();
          });
          // decide to show the addition col obtained from template page
          this.showTemplate = true;
          // create dynamic form if the fields data exists
          this.createDynamicFormAfterTemplate();
        } else {
            this.table_col_names = ['NAME', 'COST_CODE'];
            this.createaDynamicFormAtFirst();
        }
      }
    }
    
  }
  
  // formula calculation when click
  formulaCalculation(i: number){
    let mathOperator = '';
    this.formula_content.map(val => {
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
    for (let j = 0; j < this.number[i].length; j++) {
      string = string + this.number[i][j] + ' ';
    }
    string = string.replace(' ', mathOperator);
    result = eval(string); 

    // try to get the position of field_formula in the row
    let field_formula_position = 0;
    for (let i = 0; i < this.type.length; i++) {
      if (this.type[i] == 2) {
        field_formula_position = i;
      }
    }
    if (result !== 0) {
      this.formula[i][field_formula_position] = 0;
      this.formula[i][field_formula_position] = result;
    }
  }

  // fill dummy data into field_number, field_text, and field_formula 2 layers array
  fillNull(){
    // fill null to number array
    for (let j = 0; j < this.project.resource.length; j++) {
      this.number[j] = new Array(this.number_length).fill(null);
    }
    // fill null to text array
    for (let j = 0; j < this.project.resource.length; j++) {
      this.text[j] = new Array(this.text_length).fill(null);
    }
    // fill null to formula array
    for (let j = 0; j < this.project.resource.length; j++) {
      this.formula[j] = new Array(this.formula_length).fill(null);
    }
    console.log("run rill dummy to field array");
  }

  // submit
  submit() {
    this.formulaPageSubmit = true;
    this.data = [{}];
    this.temp_number = this.number;
    this.temp_text = this.text;
    this.temp_formula = this.formula;
    for (let i = 0; i < this.project.resource.length; i++) {
      this.data[i] = {
        project_name: this.project.projectName,
        number: this.number[i].map((val) => {return parseInt(val)}), 
        text: this.text[i].filter((val)=>{
          return val !== null;
        }), 
        formula: this.formula[i].filter((val)=>{
          return val !== null;
        })}
    }
    alert(JSON.stringify(this.data));
  }


}
