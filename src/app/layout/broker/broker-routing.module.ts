import { BrokerEmissionComponent } from './components/emission/broker-emission.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BrokerComponent } from './broker.component';
import { LoginComponent } from './components/login';

import { SalePanelComponent } from './components/salepanel/salepanel.component';
import { Step01Component } from './components/step01/step01.component';
import { Step02Component } from './components/step02/step02.component';
import { Step03Component } from './components/step03/step03.component';
import { Step04Component } from './components/step04/step04.component';
import { Step05Component } from './components/step05/step05.component';
import { ResultadoComponent } from './components/resultado/resultado.component';
import { ResVaucherComponent } from './components/res-vaucher/res-vaucher.component';

import { HistorialComponent } from './components/historial';
import { ReportsalesproComponent } from './components/reports/reportsalespro/reportsalespro.component';
import { ReportsalescfComponent } from './components/reports/reportsalescf/reportsalescf.component';
import { ReportsalescvComponent } from './components/reports/reportsalescv/reportsalescv.component';
import { ReportcomissproComponent } from './components/reports/reportcomisspro/reportcomisspro.component';
import { ReportcomisscvComponent } from './components/reports/reportcomisscv/reportcomisscv.component';
import { PayrollComponent } from './components/payroll/payroll.component';
import { PayrollAddComponent } from './components/payroll-add/payroll-add.component';
import { PayrollResultadoVisaComponent } from './components/payroll-resultado-visa/payroll-resultado-visa.component';
import { CommissLotComponent } from './components/commission-lot/commissionlot.component';
import { CommissionLotAddComponent } from './components/commission-lot-add/commissionlot-add.component';
import { ResPagoEfectivoComponent } from './components/res-cupon/res-cupon.component';
import { RetrievePasswordComponent } from './components/retrieve-password/retrieve-password.component';
import { RetrieveSendComponent } from './components/retrieve-send/retrieve-send.component';
import { RenewPasswordComponent } from './components/renew-password/renew-password.component';
import { PrePayrollListComponent } from './components/prepayroll/prepayroll-list/prepayroll-list.component';
import { PrePayrollAddComponent } from './components/prepayroll/prepayroll-add/prepayroll-add.component';

import { CampaignListComponent } from './components/campaign/campaign-list/campaign-list.component';
import { CampaignAddComponent } from './components/campaign/campaign-add/campaign-add.component';

import { PrePayrollResultadoVisaComponent } from './components/prepayroll/prepayroll-resultado-visa/prepayroll-resultado-visa.component';
import { ReportsalescertificateComponent } from './components/reports/reportcertif/reportcertif.component';

// KUNTUR 20190812
import { QuotationComponent } from "./components/quote/quotation/quotation.component";
import { RequestStatusComponent } from "./components/quote/request-status/request-status.component";
import { RequestQuotationComponent } from "./components/quote/request-quotation/request-quotation.component";
import { QuotationRequestComponent } from "./components/quote/quotation-request/quotation-request.component";
import { TransactionReportComponent } from "./components/reports/transaction-report/transaction-report.component";
import { InsuredReportComponent } from "./components/reports/insured-report/insured-report.component";
import { StateReportComponent } from "./components/reports/state-report/state-report.component";
import { PanelComponent } from "./components/panel/panel.component";
import { HomeComponent } from './components/home/home.component';
import { ContractorLocationIndexComponent } from './components/maintenance/contractor-location/contractor-location-index/contractor-location-index.component';
import { PolicyFormComponent } from './components/policy/policy-form/policy-form.component';
import { AddContractingComponent } from './components/add-contracting/add-contracting.component';
import { PolicyIndexComponent } from './components/policy/policy-index/policy-index.component'
import { PolicyMovementProofComponent } from './components/policy/policy-movement-proof/policy-movement-proof.component'
import { ActivitiesComponent } from './components/maintenance/activities/activities.component'
import { AgencyIndexComponent } from './components/maintenance/agency/agency-index/agency-index.component'
import { AgencyFormComponent } from './components/maintenance/agency/agency-form/agency-form.component'
import { ProductComponent } from './components/product/product/product.component'
import { QuotationEvaluationComponent } from './components/quote/quotation-evaluation/quotation-evaluation.component';
import { ContractorStateComponent } from './components/reports/state-report/contractor-state/contractor-state.component'
import { PolicyTransactionsComponent } from './components/policy/policy-transactions/policy-transactions.component';
import { ProcessViewerComponent } from './components/policy/process-viewer/process-viewer.component';
import { TestComponent } from './components/maintenance/test/test.component';
import { PolicyEvaluationComponent } from './components/policy/policy-evaluation/policy-evaluation.component';
import { PolicyRequestComponent } from './components/policy/policy-request/policy-request.component';


const broutes: Routes = [
    {
        path: '',
        component: BrokerComponent,
        children: [
            { path: 'login', component: LoginComponent },
            { path: 'salepanel', component: SalePanelComponent },
            { path: 'step01', component: Step01Component },
            { path: 'step02', component: Step02Component },
            { path: 'step03', component: Step03Component },
            { path: 'step04', component: Step04Component },
            { path: 'step05', component: Step05Component },
            { path: 'stepAll', component: BrokerEmissionComponent },
            { path: 'resultado/:key', component: ResultadoComponent },
            { path: 'rescupon', component: ResPagoEfectivoComponent },
            { path: 'resvaucher', component: ResVaucherComponent },
            { path: 'historial', component: HistorialComponent },
            { path: 'payroll', component: PayrollComponent },
            {
                path: 'payrolladd/:accion/:id/:nidstate',
                component: PayrollAddComponent
            },
            { path: 'payrollvisa/:key', component: PayrollResultadoVisaComponent },
            { path: 'prepayroll', component: PrePayrollListComponent },
            { path: 'prepayrolladd/:accion/:id/:nidstate', component: PrePayrollAddComponent },
            {
                path: 'prepayrollvisa/:key',
                component: PrePayrollResultadoVisaComponent
            },
            { path: 'campaign', component: CampaignListComponent },
            { path: 'campaignadd/:accion/:id/:nidstate', component: CampaignAddComponent },

            { path: 'commissionlot', component: CommissLotComponent },
            { path: 'commissionlot-add/:accion/:id/:nidstate', component: CommissionLotAddComponent },
            { path: 'rptventascf', component: ReportsalescfComponent },
            { path: 'rptventascv', component: ReportsalescvComponent },
            { path: 'rptventaspro', component: ReportsalesproComponent },
            { path: 'rptcomisspro', component: ReportcomissproComponent },
            { path: 'rptcomisscv', component: ReportcomisscvComponent },
            { path: 'rptventascertif', component: ReportsalescertificateComponent },
            { path: 'retrieve', component: RetrievePasswordComponent },
            { path: 'retrieve-send', component: RetrieveSendComponent },
            { path: 'renew-password', component: RenewPasswordComponent },
            // KUNTUR 20190812
            { path: "quotation", component: QuotationComponent },
            { path: "quotation-request", component: QuotationRequestComponent },
            { path: "request-status", component: RequestStatusComponent },
            { path: "request-quotation", component: RequestQuotationComponent },
            { path: "transaction-report", component: TransactionReportComponent },
            { path: "insured-report", component: InsuredReportComponent },
            { path: "state-report", component: StateReportComponent },
            { path: "panel", component: PanelComponent },
            { path: 'home', component: HomeComponent },
            { path: 'contractor-location', component: ContractorLocationIndexComponent },
            { path: 'policy/emit', component: PolicyFormComponent }, //modo: emitir
            { path: 'policy/transaction/:mode', component: PolicyTransactionsComponent }, //modo: emitir, incluir, renovar
            { path: 'policy-transactions', component: PolicyIndexComponent },
            { path: 'policy-movement-proof', component: PolicyMovementProofComponent },
            { path: 'add-contracting', component: AddContractingComponent },
            { path: 'activities', component: ActivitiesComponent },
            { path: 'agency', component: AgencyIndexComponent },
            { path: 'agency-form', component: AgencyFormComponent },
            { path: 'quotation-evaluation', component: QuotationEvaluationComponent },
            { path: 'products', component: ProductComponent },
            { path: 'contractor-state', component: ContractorStateComponent },
            { path: 'process-viewer', component: ProcessViewerComponent },
            { path: 'policy-evaluation', component: PolicyEvaluationComponent },
            { path: "policy-request", component: PolicyRequestComponent },
            { path: 'test', component: TestComponent },
            { path: '**', redirectTo: 'login' }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(broutes)],
    declarations: [],
    exports: [RouterModule]
})
export class BrokerRoutingModule { }
