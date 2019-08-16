import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { GlobalEventsManager } from '../../../shared/services/gobal-events-manager';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private router: Router,
                private globalEventsManager: GlobalEventsManager) { }

    canActivate() {
        if (localStorage.getItem('currentUser')) {
            // Iniciar sesión así que devuelve verdadero
            this.globalEventsManager.showNavBar.emit(true);
            return true;
        }

        // No ha iniciado sesión así que se redirije a la página de inicio de sesión
        this.router.navigate(['/login']);
        this.globalEventsManager.hideNavBar.emit(true);
        return false;
    }
}
