import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PasswordService } from '../../services/password/password.service';

@Component({
  selector: 'app-retrieve-password',
  templateUrl: './retrieve-password.component.html',
  styleUrls: ['./retrieve-password.component.css']
})
export class RetrievePasswordComponent implements OnInit {
  @ViewChild('modalRetrieve', { static: true }) modalRetrieve;

  message = '';
  model: any = {};
  loading = false;
  redirect = false;
  error = '';
  retrieveForm: FormGroup;
  documents = [];

  constructor(
    // private route: ActivatedRoute,
    private router: Router,
    private passwordService: PasswordService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.initComponent();
  }

  initComponent() {
    this.retrieveForm = this.formBuilder.group({
      tipdoc: ['', [Validators.required]],
      numdoc: ['', [Validators.required]]
    });

    this.loading = true;

    this.passwordService.tiposDocumentos().subscribe(
      result => {
        this.loading = false;
        this.documents = result;
      },
      error => {
        this.loading = false;

        console.log('Error recuperando los tipos de documento: ', error);
      }
    );
  }

  onRetrieve() {
    this.loading = true;
    this.model.tipdoc = this.retrieveForm.get('tipdoc').value;
    this.model.numdoc = this.retrieveForm.get('numdoc').value;

    this.passwordService.retrieve(this.model).subscribe(
      result => {
        if (!result.success) {
          this.loading = false;
          this.message = result.message;
          this.modalRetrieve.show();
        } else {
          setTimeout(() => {
            sessionStorage.setItem('tipdoc', this.model.tipdoc);
            sessionStorage.setItem('numdoc', this.model.numdoc);
            sessionStorage.setItem('email', result.email);

            this.loading = false;
            this.router.navigate(['broker/retrieve-send']);
          }, 1000);
        }
      },
      error => {
        console.log('Error Retrieve: ', error);

        this.message = 'Tuvimos un inconveniente realizando tu petición';
        this.modalRetrieve.show();

        setTimeout(() => {
          this.loading = false;
        }, 101);
        // this.loading = false;
      }
    );
  }

  closeMessage() {
    this.modalRetrieve.hide();
  }

  soloNumeros(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    const inputChar = String.fromCharCode(event.charCode);

    if (!pattern.test(inputChar)) { // invalid character, prevent input
      event.preventDefault();
    }
  }
}
