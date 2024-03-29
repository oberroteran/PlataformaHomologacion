import { Component, OnInit, Input } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { PolicyService } from '../../../services/policy/policy.service';
import { PolicyDocumentsComponent } from '../policy-documents/policy-documents.component'
import { ActivatedRoute, Route, Router } from '@angular/router';
import { PolicyemitService } from '../../../services/policy/policyemit.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-policy-movement-details',
  templateUrl: './policy-movement-details.component.html',
  styleUrls: ['./policy-movement-details.component.css']
})
export class PolicyMovementDetailsComponent implements OnInit {
  @Input() public reference: any;
  @Input() public itemTransaccionList: any;
  @Input() public cotizacionID: any;

  InputsPolicy: any = [];
  policyMovementList: any = [];
  flagAnular: boolean = false;

  listToShow: any[] = [];
  public currentPage = 1; //página actual
  public rotate = true; //
  public maxSize = 10; // cantidad de paginas que se mostrarán en el paginado
  public itemsPerPage = 6; // limite de items por página
  public totalItems = 0; //total de items encontrados

  constructor(
    private policyService: PolicyService,
    private modalService: NgbModal,
    private router: Router,
    private policyemit: PolicyemitService
  ) { }

  ngOnInit() {
    // console.log(this.itemTransaccionList)
    this.itemTransaccionList.forEach(item => {
      if (item.NRO_COTIZACION == this.cotizacionID) {
        this.InputsPolicy.P_PRODUCTO = item.NOMBRE_PRODUCT;
        this.InputsPolicy.P_POLIZA = item.POLIZA;
        this.InputsPolicy.P_CONTRATANTE = item.NOMBRE_CONTRATANTE;
        this.InputsPolicy.P_SEDE = item.SEDE;

      }
    });

    this.getPolicyMovement(this.cotizacionID);
  }
  getPolicyMovement(cotizacionID: any) {
    // console.log(cotizacionID)
    let data: any = {};
    data.P_NID_COTIZACION = cotizacionID;
    this.policyService.getPolicyMovementsTransList(data).subscribe(
      res => {
        console.log(res)
        this.policyMovementList = res.C_TABLE;
        let num = 0;

        this.totalItems = this.policyMovementList.length;
        this.listToShow = this.policyMovementList.slice(((this.currentPage - 1) * this.itemsPerPage), (this.currentPage * this.itemsPerPage) - 1);

        this.policyMovementList.forEach(item => {
          if (item.COD_TRANSAC == 7) {
            this.flagAnular = true;
          }
          if (item.MOV_ANULADO == 0) {
            num++;
          }
        });

        if (num == 0) {
          this.flagAnular = true;
        }
      },
      err => {
        console.log(err);
      }
    );
  }

  pageChanged(currentPage) {
    this.currentPage = currentPage;
    this.listToShow = this.policyMovementList.slice(((this.currentPage - 1) * this.itemsPerPage), (this.currentPage * this.itemsPerPage) - 1);
  }

  anularMov(nroMov: any) {
    // console.log(nroMov)
    let myFormData: FormData = new FormData()
    let renovacion: any = {};
    renovacion.P_NID_COTIZACION = this.cotizacionID // nro cotizacion
    renovacion.P_DEFFECDATE = null; //Fecha Inicio
    renovacion.P_DEXPIRDAT = null; // Fecha Fin //this.datePipe.transform(this.polizaEmitCab.bsValueFin, "dd/MM/yyyy") // Fecha hasta
    renovacion.P_NUSERCODE = JSON.parse(localStorage.getItem("currentUser"))["id"] // Fecha hasta
    renovacion.P_NTYPE_TRANSAC = 6; // tipo de movimiento
    renovacion.P_NID_PROC = "" // codigo de proceso (Validar trama)
    renovacion.P_FACT_MES_VENCIDO = null // Facturacion Vencida
    renovacion.P_SFLAG_FAC_ANT = null // Facturacion Anticipada
    renovacion.P_SCOLTIMRE = null // Tipo de renovacion
    renovacion.P_NPAYFREQ = null // Frecuencia Pago
    renovacion.P_NMOV_ANUL = nroMov // Movimiento de anulacion
    renovacion.P_NNULLCODE = 0 // Motivo anulacion
    renovacion.P_SCOMMENT = "" // Frecuencia Pago

    myFormData.append("objeto", JSON.stringify(renovacion));

    Swal.fire({
      title: "Información",
      text: "¿Deseas anular este movimiento?",
      type: "question",
      showCancelButton: true,
      confirmButtonText: 'Anular',
      allowOutsideClick: false,
      cancelButtonText: 'Cancelar'
    })
      .then((result) => {
        if (result.value) {
          // this.loading = true;
          this.policyemit.transactionPolicy(myFormData).subscribe(
            res => {
              console.log(res);
              //this.erroresList = res.C_TABLE;
              // this.loading = false;
              if (res.P_COD_ERR == 0) {
                this.getPolicyMovement(this.cotizacionID);
                Swal.fire({
                  title: "Información",
                  text: "Se ha anulado correctamente el movimiento, con el N° de constancia " + res.P_NCONSTANCIA,
                  type: "success",
                  confirmButtonText: 'OK',
                  allowOutsideClick: false,
                }).then((result) => {
                  if (result.value) {
                    this.router.navigate(['/broker/policy-transactions']);
                  }
                });
              } else {
                Swal.fire({
                  title: "Información",
                  text: res.P_MESSAGE,
                  type: "error",
                  confirmButtonText: 'OK',
                  allowOutsideClick: false,
                })
              }
            },
            err => {
              // this.loading = false;
              console.log(err);
            }
          );
        }
      });
  }
  // openModal(mov: number, policy: string) {
  openModal() {
    let modalRef: NgbModalRef;
    modalRef = this.modalService.open(PolicyDocumentsComponent, { size: 'lg', backdropClass: 'light-blue-backdrop', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.reference = modalRef;
    //modalRef.componentInstance.itemTransaccionList = this.policyList[mov];
    //modalRef.componentInstance.policy = policy;
  }

}
