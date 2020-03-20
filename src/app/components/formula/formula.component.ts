import {AfterViewChecked, Component, OnChanges, OnInit} from '@angular/core';
// model
import {Project} from '../../models/project';
import {projectResource} from '../../models/projectResource';
import {Template} from '../../models/template';
import { TemplateResource } from '../../models/TemplateResource';
// service
import {FormulaService} from '../../services/formula.service';
import {ProjectService} from '../../services/project.service';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {BehaviorSubject} from 'rxjs';

@Component({
  selector: 'app-formula',
  templateUrl: './formula.component.html',
  styleUrls: ['./formula.component.css']
})
export class FormulaComponent implements OnInit, OnChanges, AfterViewChecked {
  ///////////////////////////////////////////////
  // private fields
  /////////////////////////////////////////////

  private source: any;
  private resources: projectResource[] = [];
  private defaultResources = new BehaviorSubject<projectResource[]>([]);
  // tslint:disable-next-line:variable-name
  private template_data: Template[] = [];
  // project_resources
  private project_resources: projectResource[];
  // templateResource
  private template_resources: TemplateResource[];

  ///////////////////////////////////////////////
  // Public Field
  /////////////////////////////////////////////

  /* Project */

  public project_name: Project[] = [];
  public projectId: number; 

  /* data from template page */

  // number 2d array
  Number$ = [[]];
  // length of the number array
  Number$Len: number = 0;
  // text 2d array
  Text$ = [[]];
  // length of the text array
  Text$Len: number = 0;
  // formula 2d array
  Formula$ = [[]];
  // length of formula
  Formula$Len: number = 0;
  // table colnames
  table_col_names: string[] = [];
  // boolean to display Cost Code
  display_cost_code: boolean = true;
  // type array
  type = [];
  // formula content
  formula_content: string;  
  // show template page
  displayTemplate: boolean = false;

  ///////////////////////////////////////////////
  // Submit
  /////////////////////////////////////////////

  formulaPageSubmit: boolean = false;
  data: TemplateResource[] = [];

  ///////////////////////////////////////////////
  // Form
  /////////////////////////////////////////////

  // Form Group
  public dynamicFormulaForm: FormGroup;
  // Form Array
  public formArrayForFormula: FormArray;
  public formArrayForTemplate: FormArray;

  ///////////////////////////////////////////////
  // Constructor
  /////////////////////////////////////////////

  // inject formulaService and formbuilder
  constructor(private formulaService: FormulaService, private fb: FormBuilder, private projectService: ProjectService) {
    // get the projectNames from projectService
    for (let projectNames of projectService.projects) {
      this.project_name.push(projectNames);
    }
  }

  ///////////////////////////////////////////////
  // life cycle hook
  /////////////////////////////////////////////

  ngOnInit() {
    // get the default data
    this.getDefaultResources();
    // get the field data from template page
    // this.getTemplateData();
  }

  ngOnChanges() {
  }

  ngAfterViewChecked() {
  }

  ///////////////////////////////////////////////
  // Sort
  /////////////////////////////////////////////

  sort(o1: TemplateResource, o2: TemplateResource) {
    return o1.resourceId - o2.resourceId;
  }

  ///////////////////////////////////////////////
  // set data 
  /////////////////////////////////////////////

  setProjectResource(pr: projectResource[]) {
    this.project_resources = pr;
  }

  setTableColnames() {

  }

  setTemplate(template: Template[]) {
    if (template !== null) {
      // swap the position between Formula and other
      // make the Formula to be the last item in the array
      let lastItem;
      for (let i = 0; i < template.length; i++) {
        if (template[i].templateName === 'Formula') {
          if (i === template.length - 1) {
            break;
          } else {
            lastItem = template[template.length - 1];
            template[template.length - 1] = template[i];
            template[i] = lastItem;
          }
        }
      }
      // loop through template_data
      template.map(data => {
        // get the TemplateName
        this.table_col_names.push(data.templateName);
        // check if colnames are duplicate
        this.checkTableCol();
        // get the TemplateType
        this.type.push(data.templateType);
        // get the TemplateFormula
        if (data.templateFormula !== null) {
          this.formula_content = data.templateFormula;
        }
        // get the number of number type
        if (data.templateType === 'Number') {
          this.Number$Len += 1;
        }
        // get the number of text type
        if (data.templateType === 'Type') {
          this.Text$Len += 1;
        }
      });
      // display tempalte data
      this.displayTemplate = true;
      // create form group
      this.createDynamicFormWithTemplateData(template);
    }
  }

  /////////////////////////////////////////////
  // get data
  /////////////////////////////////////////////

  // get resources for each project
  getDefaultResources() {
    this.reset();
    this.source = this.formulaService._default.source;
    this.source.subscribe(data => {
      this.defaultResources.next(data);
      this.defaultResources.subscribe(data => {
        // set the project_resources
        this.setProjectResource(data);
        // get the colnames
        this.getTableColNames(data);
        // create form group
        this.createaDynamicFormWithoutTemplateData(data);
      });
    });
  }

  // get the resources by projectId
  getResourcesByProjectId(projectId: number) {
    this.reset();
    // get the resources
    this.formulaService._resource(projectId).source.subscribe(data => {
      this.resources = data;
    });
    // get the templates
    this.formulaService._template(projectId).source.subscribe(data => {
      this.template_data = data;
    });
    this.formulaService._templateResourceByProjectId(projectId).subscribe(data => {
      this.template_resources = data;
      console.log(this.template_resources);
    });
    // get the resources
    setTimeout(() => {
      // set the project_resource
      this.setProjectResource(this.resources);
      if (this.template_data.length === null) {
        // get the colnames
        this.getTableColNames(this.resources);
        // create form group
        this.createaDynamicFormWithoutTemplateData(this.resources);
      } else {
        // get the colnames
        this.getTableColNames(this.resources);
        // set the template
        this.setTemplate(this.template_data);
        // fill the templateResources into form
        // loop the project_resources
        console.log("project_resources");
        console.log(this.project_resources);
        for (let i = 0; i < this.project_resources.length; i++) {
          let templateResourceByResourceId: TemplateResource[] = [];
          this.template_resources.map(data => {
            if (data.resourceId === this.project_resources[i].resource.resourceId) {
              templateResourceByResourceId.push(data);
            }
          });
          // sort the templateResource
          templateResourceByResourceId.sort(this.sort);
          this.fillValue(templateResourceByResourceId, i);
        }           
      }
    }, 2000);
  }


  // get table colnames data
  getTableColNames(data: projectResource[]) {
    // reset the colnames of table
    this.table_col_names = [];
    for (let key of Object.keys(data[0].resource)) {
      if (key !== 'resourceId') {
        this.table_col_names.push(key);
      }
    }
    // check the column name of table
    this.checkTableCol();
  }

  checkTableCol() {
    /* // display col cost_code
    if (this.table_col_names.indexOf('COST_CODE') == -1) {
      this.display_cost_code = false;
    } */
    this.table_col_names.filter(colname => {
      return this.formulaService._getToggleTable.indexOf(colname) === -1;
    });
    // make sure the colnames are not duplicate
    this.table_col_names = [...new Set(this.table_col_names)];
  }

  /////////////////////////////////////////////
  // create reactive form
  /////////////////////////////////////////////

  // create form group
  createaDynamicFormWithoutTemplateData(data: projectResource[]) {
    this.displayTemplate = false;
    if (data !== null) {
      // create form array
      let FormBuilderArray = this.fb.array([]);
      // loop through project's resources
      data.map(project_resource => {
        // create form control for project_name
        let project_name = this.fb.control({value: project_resource.resource.resourceName, disabled: true});
        // create form control for project_cost_code
        let project_cost_code = this.fb.control({value: project_resource.resource.cost_Code, disabled: true});
        // create form group for project_name and project_cost_code form controls
        let form_group = this.fb.group({
          name: project_name,
          cost_code: project_cost_code
        });
        // push the form group into form array - formArrayForFormula
        FormBuilderArray.push(form_group);
      });

      // create form group - dynamicFormulaForm
      this.dynamicFormulaForm = this.fb.group({
        // create form array - formArrayForFormula
        formArrayForFormula: FormBuilderArray
      });

      this.formArrayForFormula = this.dynamicFormulaForm.get('formArrayForFormula') as FormArray;
    }
  }

  // create form group after get data from template
  createDynamicFormWithTemplateData(template: Template[]) {
    console.log("createDynamicFormWithTemplateData");
    // fill Null
    this.fillNull();
    // create form array
    this.formArrayForFormula = this.fb.array([]);
    // create dynamic form group
    this.dynamicFormulaForm = this.fb.group({
      formArrayForFormula: this.formArrayForFormula
    });

    // loop through project's resources
    this.project_resources.map((project_resource) => {
      // resource name
      let project_name = this.fb.control({value: project_resource.resource.resourceName, disabled: true});
      // cost code
      let project_cost_code = this.fb.control({value: project_resource.resource.cost_Code, disabled: true});

      // create template data form array
      let templateDataArray = this.fb.array([]);
      // loop through template data
      template.map(data => {
        let col;
        if (data.templateType === 'Formula') {
          // TemplateFormula
          col = this.fb.control({value: '', disabled: true});
        } else {
          // TemplateName & TemplateType
          col = this.fb.control({value: ''});
        }
        // save into templateDataArray
        templateDataArray.push(col);
      });

      // create form group: ResourceName, CostCode, TemplateDataArray
      let form_group = this.fb.group({
        name: project_name,
        cost_code: project_cost_code,
        template_data_array: templateDataArray
      });
      // save into FormBuilderArray
      this.formArrayForFormula.push(form_group);
    });
  }

  /////////////////////////////////////////////
  // display data
  /////////////////////////////////////////////

  // switch different projects
  switchProject(event: any) {
    // switch within projects
    for (let data of this.project_name) {
      if (data.projectName === event.target.value) {
        this.getResourcesByProjectId(data.projectId);
      } else if (event.target.value === '') {
        this.getDefaultResources();
      }
    }
    /*     // if select none
        if (event.target.value === '') {
          this.getDefaultResources();
        }  */
  }

  // formula calculation when click
  formulaCalculation(i: number) {
    let mathOperator = '';
    let str = this.formula_content.split(' ');
    for (let i = 0; i < str.length; i++) {
      mathOperator += str[i];
    }
    // get the arithmetic operator from the string by using regular expression
    mathOperator = mathOperator.replace(/[a-zA-Z ]/g, '');

    // try to do the math calculation for all the field_numbers in each row
    let result = 0;
    let string = '';
    for (let j = 0; j < this.Number$[i].length; j++) {
      string = string + this.Number$[i][j] + ' ';
    }
    string = string.replace(' ', mathOperator);
    result = eval(string);

    // try to get the position of field_formula in the row
    let field_formula_position = 0;
    for (let i = 0; i < this.type.length; i++) {
      if (this.type[i] == 'Formula') {
        field_formula_position = i;
      }
    }
    if (result !== 0) {
      this.Formula$[i][field_formula_position] = 0;
      this.Formula$[i][field_formula_position] = result;
    }
  }

  // fill dummy data into field_number, field_text, and field_formula 2 layers array
  fillNull() {
    console.log("fill null");
    // fill null to number array
    for (let j = 0; j < this.project_resources.length; j++) {
      this.Number$[j] = new Array(this.Number$Len).fill(null);
    }
    // fill null to text array
    for (let j = 0; j < this.project_resources.length; j++) {
      this.Text$[j] = new Array(this.Text$Len).fill(null);
    }
    // fill null to formula array
    for (let j = 0; j < this.project_resources.length; j++) {
      this.Formula$[j] = new Array(1).fill(null);
    }
  }

  fillValue(template_resources: TemplateResource[], index: number) {
    console.log("fill value");
    console.log(template_resources);
    let templateResourceNumberArray = [];
    let templateResourceTextArray = [];
    template_resources.map(data => {
      // tmeplate type = number
      if (data.templateType === 'Number') {
        templateResourceNumberArray.push(data.templateResourceValue);
      }
      templateResourceTextArray.push(data.templateResourceText);
    });
    // Number
    this.Number$[index] = templateResourceNumberArray;
    for (let number of this.Number$[index]) {
    }
    // Text
    this.Text$[index] = templateResourceTextArray;
    // Formula
    this.formulaCalculation(index);
  }

  /////////////////////////////////////////////
  // reset data
  /////////////////////////////////////////////

  reset() {
    this.project_resources = new Array<projectResource>();
    this.type = [];
    this.formula_content = '';
  }

  // submit
  submit() {
    this.formulaPageSubmit = true;
    this.template_data.map(data => {

    })
  }


}
