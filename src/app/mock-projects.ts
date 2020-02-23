import { Project } from './models/project';
import { dataTable } from '../assets/dataTable.js';
import { DATA } from './models/DATA';

/* export const PROJECTS: Project[] = [
    {id: 2, cost_code: '020000', name: 'Existing Conditions', sub_items: [
        {cost_code: '022100', name:'Surveys'},
        {cost_code: '024100', name:'Interior Demolition'},
        {cost_code: '025000', name:'Site Remediation'},
        {cost_code: '025500', name:'Remediation Soil Stabilization'},
    ]},
    {id: 4, cost_code: '040000', name: 'Masonry', sub_items: [
        {cost_code: '042000', name: 'Unit Masonry'},
        {cost_code: '042113', name: 'Brick and Mortar'},
        {cost_code: '042200', name: 'Concrete Unit Masonry'},
        {cost_code: '044000', name: 'Stone Assemblies'},
        {cost_code: '044200', name: 'Exterior Cladding - Veneer'},
        {cost_code: '045700', name: 'Masonry Fireplaces'},
    ]}
] */

export const PROJECTS: DATA[] = dataTable.map(function(element) {
    return element; 
});

