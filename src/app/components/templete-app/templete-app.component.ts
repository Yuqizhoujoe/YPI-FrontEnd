import { Component, OnInit, OnChanges, AfterContentInit } from '@angular/core';
import { FormulaService } from '../../services/formula.service';
import { FormGroup, FormControl, CheckboxRequiredValidator, Form} from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import { FormArray } from '@angular/forms';

// observable
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';

// model 
import { Template } from '../../models/template';
import { TemplateDataArray }  from '../../models/TemplateDataArr';
import { projectResource }  from '../../models/projectResource';

@Component({
  selector: 'app-templete-app',
  templateUrl: './templete-app.component.html',
  styleUrls: ['./templete-app.component.css']
})
export class TempleteAppComponent implements OnInit {
    /////////////////////////////////////////////
  // private fields 
  /////////////////////////////////////////////

  // projectId
  private projectId: number;
  // template data
  private template = new BehaviorSubject<Template[]>([]);
  // projectResource
  private projectResource: projectResource[] = [];

  /////////////////////////////////////////////
  // public fields 
  /////////////////////////////////////////////
  
  // template data array
  public templateDataArray: TemplateDataArray;
  // Toggle Table Colname 
  public cost_code = true;
  public table_name: string[] = [];
  public types: any = ['Number', 'Text', 'Formula'];

  // Formula Form Control
  showFormulaField: boolean = false;
  indexOfFormulaToShow: number[] = [];

  // Select Option ngValue
  formula: string = 'Formula';
  text: string = 'Text';
  number: string = 'Number';

  // Form
  public dynamicForm: FormGroup;
  public fg: FormArray;

  // Submit
  submitted = false;

  // Validation
  invalid: boolean;

  constructor(private formulaService:FormulaService, private fb: FormBuilder) { 
    // get the project Id
    this.getProjectId();
    console.log("this projectId");
    console.log(this.projectId);
  }

  ngOnInit(): void {
    // create the form and get the template data
    this.getTemplateData(this.projectId);
  }

  /////////////////////////////////////////////
  // get 
  /////////////////////////////////////////////

  // get project Id
  getProjectId(){
    this.projectId = this.formulaService._projectId;
  }

  // get template data
  getTemplateData(id:number) {
    this.formulaService._template(id).subscribe(data => {
      this.template.next(data);
      this.template.subscribe(d => {
        if (d.length !== 0) {
          this.createDynamicFormWithData(d);
        } else {
          this.createDynamicFormWithoutData();
        }
        d.map(data => {
          this.setTheTemplateDataArray(data);
        });
      });
    });
  }

  /////////////////////////////////////////////
  // set  
  /////////////////////////////////////////////

  setTheTemplateDataArray(data: Template) {
    this.templateDataArray.templateNumber.push(data.templateName);
    this.templateDataArray.templateType.push(data.templateType);
    this.templateDataArray.templateFormula.push(data.templateFormula);
  }

  /////////////////////////////////////////////
  // create form group 
  /////////////////////////////////////////////

  // create Form Group With Data
  createFormGroupWithData(data: Template, index: number): FormGroup {
    console.log("createFormGroupWithData");
    console.log(data.templateFormula);
    if (data.templateFormula !== null) {
      console.log("formula is not null");
      // set boolean variable showFormulaField to true - display formula field
      this.showFormulaField = true;
      this.indexOfFormulaToShow.push(index);
      return this.fb.group({ 
        templateName: this.fb.control(data.templateName, [Validators.required]),
        templateType: this.fb.control(data.templateType, [Validators.required]),
        templateFormula: this.fb.control(data.templateFormula, [Validators.required])
      })
    } else {
      console.log("formula is null");
      return this.fb.group({
        templateName: this.fb.control(data.templateName, [Validators.required]),
        templateType: this.fb.control(data.templateType, [Validators.required])
      }) 
    }
  }

  // create Form Group Without Data
  createFormGroupWithoutData(): FormGroup {
    console.log("createFormGroupWithoutData");
    return this.fb.group({
      templateName: this.fb.control('', [Validators.required]),
      templateType: this.fb.control('Number', [Validators.required])
    });
  } 

  // create Formula Control
  createFormulaContol(index): FormGroup {
    this.fg = this.dynamicForm.get('template') as FormArray; 
    this.fg.controls[index]['controls'].templateFormula = this.fb.control('', [Validators.required]);
    return this.fg.controls[index]['controls'].templateFormula;
  } 

  // create Dynamic Form
  createDynamicFormWithoutData(){
    let array = this.fb.array([]);
    if (array.controls.length < 3) {
      for (let i = 0; i < 3; i++) {
        array.push(this.createFormGroupWithoutData());
      }
    }
    this.dynamicForm = this.fb.group({
      'template':array
    });
    this.fg = this.dynamicForm.get('template') as FormArray;
  }

  // create Dynamic Form With Data
  createDynamicFormWithData(data: Template[]) {
    let array = this.fb.array([]);
    for (let i = 0; i < data.length; i++) {
      array.push(this.createFormGroupWithData(data[i],i));
    }
    this.dynamicForm = this.fb.group({
      'template': array
    });
    this.fg = this.dynamicForm.get('template') as FormArray;
    console.log(this.fg);
  }

  // add Form Group 
  addFormGroup(){
    this.fg.push(this.createFormGroupWithoutData());    
  }

  // remove Form Group
  removeFormGroup(i): void {
    (this.dynamicForm.get('template') as FormArray).removeAt(i);
  }

  /////////////////////////////////////////////
  // Validation 
  /////////////////////////////////////////////

  getFieldInputValidity(i) {
    return (this.dynamicForm.get('template') as FormArray).controls[i]['controls'].templateName.invalid;
  } 

  getTypeValidity(i) {
    return (this.dynamicForm.get('template') as FormArray).controls[i]['controls'].templateType.invalid;
  }

  getFormulaValidity(i) {
    return (this.dynamicForm.get('template') as FormArray).controls[i]['controls'].templateFormula.invalid;
  } 

  /////////////////////////////////////////////
  // Display 
  /////////////////////////////////////////////

  // display the formula 
  popUpFormula(value:any, index:any){
    if (value.indexOf(this.formula) !== -1) {
      // use createFormulaField function to add formula form control into fg fieldGroup form group object 
      this.createFormulaContol(index);
      // set boolean variable showFormulaField to true - display formula field
      this.showFormulaField = true;
      // the indexOfFormulaToShow array push this index
      this.indexOfFormulaToShow.push(index);
    } else {
      // indexOfFormulaToShow filter out the index
      this.indexOfFormulaToShow = this.indexOfFormulaToShow.filter(elem => {
        return elem !== index;
      })
    }
  }

  /////////////////////////////////////////////
  // Submit 
  /////////////////////////////////////////////

  // submit 
  onSubmit(){
    this.submitted = true;
    // stop here if form is invaild
    if (this.dynamicForm.invalid) {
      return;
    }

    // formula service get submitted data
    let fieldGroupLength = this.dynamicForm.value.template.length;
    console.log(fieldGroupLength);
    console.log(this.dynamicForm.value);
    for (let i = 0; i < fieldGroupLength; i++) {
      let objectValue = this.dynamicForm.value.template[i];
      let formulaValue = this.fg.controls[i]['controls'].templateFormula;
      console.log(objectValue);
      console.log(formulaValue);
      if (formulaValue === undefined) {
        this.formulaService._postTemplate(this.projectId, objectValue);
      }
      if (formulaValue !== undefined) {
        objectValue['templateFormula'] = formulaValue.value
        this.formulaService._postTemplate(this.projectId, objectValue);
      }
    }
  }

  /////////////////////////////////////////////
  // Table 
  /////////////////////////////////////////////
  
  _table() {
    console.log(this.cost_code); 
    if (!this.cost_code) {
      this.table_name.push('costCode');
    }
    this.formulaService._setToggleTable(this.table_name);
  } 


}
