import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {  AuthenticationService } from '../../../services/authentication.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  model = {
    left: true,
    right: false
  };
  routers;
  constructor(
    private route:ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService) { 
      this.route.paramMap.subscribe(params => {
        console.log(params);// (+) converts string 'id' to a number
 
        // In a real app: dispatch action to load the details here.
     });
    console.log(this.routers);
    }

  ngOnInit(): void {
  }
  
  onSignout(){
    this.authenticationService.logout();
    this.router.navigate(['/homePage']);
  }


}
