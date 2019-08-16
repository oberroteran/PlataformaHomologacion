import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AppConfig } from '../../../../app.config';
import { AuthenticationService } from '../../services/authentication.service';
import { RecaptchaComponent } from 'ng-recaptcha';
import { environment } from '../../../../../environments/environment';
import { SidebarService } from '../../../../shared/services/sidebar/sidebar.service';

@Component({
    selector: 'app-login',
    templateUrl: 'login.component.html',
    styleUrls: ['login.component.css']
})

export class LoginComponent implements OnInit {
    model: any = {};
    loading = false;
    error = '';
    menuTotal = null;
    productSoat = 0;
    productSctr = 0;
    returnUrl: string;
    siteKey = AppConfig.CAPTCHA_KEY;
    bCaptchaValid = false;
    loginForm: FormGroup;
    @ViewChild('captchaRef', { static: true }) recaptcha: RecaptchaComponent;

    constructor(private sidebarService: SidebarService,
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private formBuilder: FormBuilder,
        private appConfig: AppConfig) {

    }

    ngOnInit() {
        this.initComponent();
    }

    initComponent() {
        this.registerTracking();
        this.crearFormulario();
        // Restablecer el estado de inicio
        this.authenticationService.logout();
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        // localStorage.clear();
    }

    registerTracking() {
        this.appConfig.pixelEvent('virtualEvent', 'SOAT Digital - Home', 'Clic en botón', 'Soy un Corredor de Negocios');
    }

    crearFormulario() {
        this.loginForm = this.formBuilder.group({
            usuario: ['', [Validators.required]],
            clave: ['', [Validators.required]]
        });
    }

    setDatos() {
        this.model.username = this.loginForm.get('usuario').value;
        this.model.password = this.loginForm.get('clave').value;
    }

    onLogin() {
        this.loading = true;
        this.setDatos();
        this.authenticationService.login(this.model.username, this.model.password)
            .subscribe(
                result => {
                    // console.log(result);
                    if (result === true) {
                        this.sidebarService.close();
                        this.menuTotal = JSON.parse(localStorage.getItem("currentUser"))["menu"];
                        this.menuTotal.forEach(element => {
                            if (element.nidproduct == "1") {
                                this.productSoat++;
                            }
                            if (element.nidproduct == "2") {
                                this.productSctr++;
                            }
                        });
                        if (this.productSoat > 0 && this.productSctr > 0) {
                            console.log("1")
                            this.router.navigate(["broker/home"]);
                        }
                        if (this.productSoat > 0 && this.productSctr == 0) {
                            console.log("2")
                            this.router.navigate(["broker/salepanel"]);
                        }
                        if (this.productSoat == 0 && this.productSctr > 0) {
                            console.log("3")
                            this.router.navigate(["broker/panel"]);
                        }
                        // this.router.navigate(['broker/salepanel']);
                        this.appConfig.registerPageInitial('0');
                        this.appConfig.registerPageSecond('1');
                    } else {
                        this.error = 'Usuario o clave incorrectos.';
                        this.loading = false;
                    }
                },
                error => {
                    this.error = 'Usuario o clave incorrectos.';
                    this.loading = false;
                    console.log(<any>error);

                });
    }

    RequestSignUp(e: any) {
        e.preventDefault();
        if (environment.production) {
            this.recaptcha.execute();
        } else {
            this.onLogin();
        }
    }

    validateCaptcha(response: string) {
        if (response.length > 0) {
            this.bCaptchaValid = true;
        }
    }

    resolved(token: string) {
        if (token === null) {
            this.bCaptchaValid = true;
            this.loginForm.enable();
        } else {
            if (this.loginForm) {
                this.bCaptchaValid = true;
                this.recaptcha.reset();
                this.onLogin();
            }
        }
    }

}
