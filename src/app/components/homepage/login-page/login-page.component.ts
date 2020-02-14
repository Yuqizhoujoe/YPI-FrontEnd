import { Component, OnInit } from '@angular/core';
import { FormsModule }   from '@angular/forms';
@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css'],
  exportAs: 'ngModel'
})
export class LoginPageComponent implements OnInit {
  showExtended: boolean = true;
  enableAdd: boolean = false;
  showUserForm: boolean = false;
  constructor() { }

  ngOnInit(): void {
  }
  addUser(name:string,email:string){
    if(!name || !email ){
      alert("FIELDS ARE INCOMPLETE");
    }else{
     console.log(name,email);
        }
      
    }
  

}
