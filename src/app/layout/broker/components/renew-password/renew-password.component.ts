import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PasswordService } from '../../services/password/password.service';
import { SessionToken } from '../../../client/shared/models/session-token.model';

@Component({
  selector: 'app-renew-password',
  templateUrl: './renew-password.component.html',
  styleUrls: ['./renew-password.component.css']
})
export class RenewPasswordComponent implements OnInit {
  @ViewChild('modalWindow', { static: true }) modalWindow;

  tokenID = '';
  userName = '';

  tokenMessage = '';
  message = '';
  model: any = {};
  loading = false;
  redirect = false;
  error = '';
  inputForm: FormGroup;
  documents = [];

  visibleInput = false;
  visibleMessage = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private passwordService: PasswordService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.initComponent();
  }

  initComponent() {
    this.inputForm = this.formBuilder.group({
      newpwd: ['', [Validators.required]],
      checkpwd: ['', [Validators.required]]
    });

    const token: string = this.route.snapshot.queryParams['token'];

    this.loading = true;

    setTimeout(() => {
      this.passwordService.getTokenInfo(token).subscribe(
        result => {
          this.closeLoading();
          this.visibleInput = result.success;
          this.visibleMessage = !result.success;
          this.tokenMessage = result.message;
          this.tokenID = token;
          if (result.success) {
            this.userName = result.userName;
          }
        },
        error => {
          this.closeLoading();
          console.log('Error Retrieve: ', error);
        }
      );
    }, 500);
  }

  onRenew() {
    this.loading = true;

    const model = {
      idRetrieve: this.tokenID,
      newpwd: this.inputForm.get('newpwd').value,
      checkpwd: this.inputForm.get('checkpwd').value
    };

    this.passwordService.renewPassword(model).subscribe(
      result => {
        this.redirect = result.success;
        this.message = result.success
          ? 'Contraseña actualizada correctamente.'
          : result.message;
        this.modalWindow.show();
        this.closeLoading();
      },
      error => {
        this.message = 'Tuvimos un inconveniente realizando tu petición';
        this.modalWindow.show();
        this.closeLoading();
      }
    );
  }

  closeLoading() {
    setTimeout(() => {
      this.loading = false;
    }, 101);
  }

  closeMessage() {
    this.modalWindow.hide();

    if (this.redirect === true) {
      setTimeout(() => {
        this.router.navigate(['broker/login']);
      }, 250);
    }
  }
}
