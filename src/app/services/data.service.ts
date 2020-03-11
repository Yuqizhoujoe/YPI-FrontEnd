import { Injectable, PipeTransform } from '@angular/core';
import {BehaviorSubject, Observable, of, Subject} from 'rxjs';
import { HttpClient } from '@angular/common/http';


import {DATA} from '../models/DATA';


import {DecimalPipe} from '@angular/common';
import {debounceTime, delay, switchMap, tap} from 'rxjs/operators';
import {SortDirection} from '../directives/sortable.directive';


interface SearchResult {
  datas: DATA[];
  total: number;
}
interface State {
  page: number;
  pageSize: number;
  searchTerm: string;
  sortColumn: string;
  sortDirection: SortDirection;
}

function compare(v1, v2) {
  return v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
}

function sort(datas: DATA[], column: string, direction: string): DATA[] {
  if (direction === '') {
    return datas;
  } else {
    return [...datas].sort((a, b) => {
      const res = compare(a[column], b[column]);
      return direction === 'asc' ? res : -res;
    });
  }
}

function matches(data: DATA, term: string, pipe: PipeTransform) {

  return data.resourceName.toLowerCase().includes(term.toLowerCase())
    || pipe.transform(data.resourceName).includes(term)
    || pipe.transform(data.cost_Code).includes(term);

}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _datas$ = new BehaviorSubject<DATA[]>([]);
  private _total$ = new BehaviorSubject<number>(0);

  private _newData;


  private _state: State = {
    page: 1,
    pageSize: 12,
    searchTerm: '',
    sortColumn: '',
    sortDirection: ''
  };
  constructor(private pipe: DecimalPipe,private http: HttpClient) {
    this.http.get<DATA[]>('http://localhost:8080/YPI_Backend_war/resources').subscribe(data => {
      this._newData = data;
      console.log(this._newData);
   
    this._search$.pipe(
      tap(() => this._loading$.next(false)),
      debounceTime(100),
      switchMap(() => this._search()),
      delay(100),
      tap(() => this._loading$.next(false))
    ).subscribe(result => {
      this._datas$.next(result.datas);
      this._total$.next(result.total);
      console.log(result);
    });

    this._search$.next();

   
})
  }

  get datas$():Observable<DATA[]> { return this._datas$.asObservable(); }
  get total$() { return this._total$.asObservable(); }
  get loading$() { return this._loading$.asObservable(); }
  get page() { return this._state.page; }
  get pageSize() { return this._state.pageSize; }
  get searchTerm() { return this._state.searchTerm; }

  set page(page: number) { this._set({page}); }
  set pageSize(pageSize: number) { this._set({pageSize}); }
  set searchTerm(searchTerm: string) { this._set({searchTerm}); }
  set sortColumn(sortColumn: string) { this._set({sortColumn}); }
  set sortDirection(sortDirection: SortDirection) { this._set({sortDirection}); }

  private _set(patch: Partial<State>) {
    Object.assign(this._state, patch);
    this._search$.next();
  }

  private _search(): Observable<SearchResult> {
    const {sortColumn, sortDirection, pageSize, page, searchTerm} = this._state;

    // 1. sort
    let datas = sort(this._newData, sortColumn, sortDirection);

    // 2. filter
    datas = datas.filter(data => matches(data , searchTerm, this.pipe));
    const total = datas.length;
    console.log(total);

    // 3. paginate
    datas = datas.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
    return of({datas, total});
  }

  getData(){
    return(this._newData);

  }

  deleteData(a:number){
    this._newData.splice(a, 1);


    return(this._newData.filter(Boolean));
  }

  addData(a){
    this._newData.push(a);
    let newResource;
    const headers = { 'Authorization': 'Bearer my-token', 'My-Custom-Header': 'foobar' }
    const body = { resourceName: a.resourceName,cost_Code:a.cost_Code  }
    this.http.post<any>('http://localhost:8080/YPI_Backend_war/addResource', body, { headers }).subscribe(data => {
    newResource = data.id;
    console.log(newResource);
    });
    // return(this._newData.filter(Boolean));
  }

  addColData(a){
    console.log(a);
    // this._newData.map(obj=> ({ ...obj, a: '' }));
    this._newData.forEach(function (element) {
      element[`${a}`] = "false";
    });
    console.log(this._newData);
  }
}
