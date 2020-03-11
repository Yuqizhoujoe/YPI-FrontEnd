

import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import {  AuthenticationService } from '../../../services/authentication.service';
import {  AlertService } from '../../../services/alert.service';

import { FormsModule }   from '@angular/forms';
@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css'],
  exportAs: 'ngModel'
})
export class LoginPageComponent implements OnInit {
    loginForm: FormGroup;
    loading = false;
    submitted = false;
    in = false;
    returnUrl: string;
  constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private alertService: AlertService
  ) {
    // if (this.authenticationService.currentUserValue) {
      if (this.authenticationService.currentUserValue) {
      this.router.navigate(['/resourcesPage']);
        }
   }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
  });

  // get return url from route parameters or default to '/'
  this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

   // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }
  onSubmit(){
    this.submitted = true;

        // stop here if form is invalid
        if (this.loginForm.invalid) {

            return;

        }
        console.log(this.f.username.value);

        this.loading = true;
        console.log(this.f.username.value, this.f.password.value );
        this.authenticationService.login(this.f.username.value, this.f.password.value)
            .pipe(first())
            .subscribe(
                data => {
                    this.router.navigate(['/resourcesPage']);
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });

  }


}
