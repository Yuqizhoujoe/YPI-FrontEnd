import { Component, OnInit, OnChanges, AfterContentInit } from '@angular/core';
import { FormulaService } from '../../services/formula.service';
import { FormGroup, FormControl, CheckboxRequiredValidator, Form} from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import { FormArray } from '@angular/forms';

@Component({
  selector: 'app-templete-app',
  templateUrl: './templete-app.component.html',
  styleUrls: ['./templete-app.component.css']
})
export class TempleteAppComponent implements OnInit {
  // for table 
  cost_code = false;
  table_name: string[] = ['NAME'];
  types: any = ['Number', 'Text', 'Formula'];

  // for formula field
  selected_number: string = "Number";
  number: number = 0;
  text: number = 1;
  formula: number = 2;
  showFormulaField: boolean = false;
  indexOfFormulaToShow: number[] = [];

  // for dynamic form reactive form 
  public dynamicForm: FormGroup;
  public fg: FormArray;

  // for submit
  submitted = false;
  invalid: boolean;

  constructor(private formulaService:FormulaService, private fb: FormBuilder) { 
   }

  ngOnInit(): void {
    /* initiate the form structure */
    this.dynamicForm = this.fb.group({
      fieldGroup: this.fb.array([
      ])
    });
    this.fg = this.dynamicForm.get('fieldGroup') as FormArray;
    this.addFgFieldListAtFirst(); 
  }

  // field list group
  createFieldList(): FormGroup {
    return this.fb.group({
      fieldInput: this.fb.control('', [Validators.required]),
      type: this.fb.control('', [Validators.required])
    });
  } 

  // create formula field
  createFormulaField(index): FormGroup {
    this.fg.controls[index].controls.formula = this.fb.control('', [Validators.required]);
    return this.fg.controls[index].controls.formula;
  }

  // add field at the first
  addFgFieldListAtFirst(){

    let array = this.fb.array([])
    if (array.controls.length < 3) {
      for (let i = 0; i < 3; i++) {
        array.push(this.createFieldList());
      }
    }
    this.dynamicForm = this.fb.group({
      'fieldGroup':array
    })

    this.fg = this.dynamicForm.get('fieldGroup') as FormArray;
  }

  // add field when click 
  addFgFieldList(){
    if (this.fg.controls.length >= 3) {
      this.fg.push(this.createFieldList());
    }    
  }


  // remove field when click
  removeFieldGroup(i): void {
    (this.dynamicForm.get('fieldGroup') as FormArray).removeAt(i);
  }

  // get validity
  getFieldInputValidity(i) {
    /* let validity = (this.dynamicForm.get('fieldGroup') as FormArray).controls[i].controls.fieldInput.invalid;
    if (validity) {
      this.invalid = true;
    } else {
      this.invalid = false;
    } */
    return (this.dynamicForm.get('fieldGroup') as FormArray).controls[i].controls.fieldInput.invalid;
  }

  getTypeValidity(i) {
    return (this.dynamicForm.get('fieldGroup') as FormArray).controls[i].controls.type.invalid;
  }

  getFormulaValidity(i) {
    this.fg.controls[i].value.formula = this.fg.controls[i].controls.formula.value;
    return (this.dynamicForm.get('fieldGroup') as FormArray).controls[i].controls.formula.invalid;
  }

  // pop up the formula field 
  popUpFormula(value:any, index:any){

    if (value[3] === '2') {
      this.createFormulaField(index);
      this.showFormulaField = true;
      this.indexOfFormulaToShow.push(index);
      console.log(this.indexOfFormulaToShow + "\nif match");
    } else {
      this.indexOfFormulaToShow = this.indexOfFormulaToShow.filter(elem => {
        return elem !== index;
      })
      console.log(this.indexOfFormulaToShow + "\nif not match");
    }

  }

  // submit 
  onSubmit(){
    this.submitted = true;

    // stop here if form is invaild
    if (this.dynamicForm.invalid) {
      return;
    }

    // formula service get submitted data
    let fieldGroupLength = this.dynamicForm.value.fieldGroup.length;
    for (let i = 0; i < fieldGroupLength; i++) {
      let objectValue = this.dynamicForm.value.fieldGroup[i];
      this.formulaService.getFieldFromTempleate(objectValue);
    }
  }

  toggleTable() { 
    if (!this.cost_code) {
      if (this.table_name.indexOf('COST_CODE') == -1) {
        this.table_name.push('COST_CODE');
      }
    } else {
      this.table_name = this.table_name.filter(value => {
        return value !== 'COST_CODE';
      });
    }
  } 

  updateTable() {
    this.formulaService.updateTable(this.table_name);
  }

  // form - quantity survey
  

  

}
