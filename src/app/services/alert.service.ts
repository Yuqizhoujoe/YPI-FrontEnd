import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Observable, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AlertService {
    private subject = new Subject<any>();
    private keepAfterNavigationChange = false;

    constructor(private router: Router) {
        // clear alert message on route change
        router.events.subscribe(event => {
            if (event instanceof NavigationStart) {
                if (this.keepAfterNavigationChange) {
                    // only keep for a single location change
                    this.keepAfterNavigationChange = false;
                } else {
                    // cleair alert
                    this.subject.next();
                }
            }
        });
    }
    // if the user auth. is successful(message)
    success(message: string, keepAfterNavigationChange = true) {
        this.keepAfterNavigationChange = keepAfterNavigationChange;
        this.subject.next({ type: 'success', text: message });
    }
    // if theres an error retrieving user(message)
    error(message: string, keepAfterNavigationChange = false) {
        this.keepAfterNavigationChange = keepAfterNavigationChange;
        this.subject.next({ type: 'error', text: message });
    }
    // retrieve the message
    getMessage(): Observable<any> {
        return this.subject.asObservable();
    }
}