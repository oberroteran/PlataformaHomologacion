import { SessionStorageService } from './../../shared/services/storage/storage-service';
import { BrokerEmissionComponent } from './components/emission/broker-emission.component';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';

// Modules
import { BrokerRoutingModule } from './broker-routing.module';
import { SharedComponentsModule } from '../../shared/modules/shared-components.module';
import { ModalModules } from '../../shared/components/modal/modal.module';
import { ConfirmModule } from '../../shared/components/confirm/confirm.module';
import { RecaptchaModule } from 'ng-recaptcha';

// Components
import { BrokerComponent } from './broker.component';
import { LoginComponent } from './components/login/login.component';
import { NavMenuComponent } from './components/navmenu/navmenu.component';
import { HistorialComponent } from './components/historial/historial.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { FileUploadComponent } from './shared/fileupload/fileupload.component';
import { SalePanelComponent } from './components/salepanel/salepanel.component';
import { Step01Component } from './components/step01/step01.component';
import { Step02Component } from './components/step02/step02.component';
import { Step03Component } from './components/step03/step03.component';
import { Step04Component } from './components/step04/step04.component';
import { Step05Component } from './components/step05/step05.component';
import { ResultadoComponent } from './components/resultado/resultado.component';
import { ReportsalescfComponent } from './components/reports/reportsalescf/reportsalescf.component';
import { ReportsalescvComponent } from './components/reports/reportsalescv/reportsalescv.component';
import { ReportsalesproComponent } from './components/reports/reportsalespro/reportsalespro.component';
import { ReportcomisscvComponent } from './components/reports/reportcomisscv/reportcomisscv.component';
import { ReportcomissproComponent } from './components/reports/reportcomisspro/reportcomisspro.component';
import { ReportsalescertificateComponent } from './components/reports/reportcertif/reportcertif.component';
import { FlowtypeComponent } from '../../shared/components/common/flowtype/flowtype.component';
import { PayrollComponent } from './components/payroll/payroll.component';
import { PayrollAddComponent } from './components/payroll-add/payroll-add.component';
import { CommissLotComponent } from './components/commission-lot/commissionlot.component';
import { CommissionLotAddComponent } from './components/commission-lot-add/commissionlot-add.component';
import { StateComponent } from './components/state/state.component';
import { UbigeoComponent } from '../../shared/components/common/ubigeo/ubigeo.component';
import { StatesalesComponent } from '../../shared/components/common/statesales/statesales.component';
import { ChannelpointComponent } from '../../shared/components/common/channelpoint/channelpoint.component';
import { ChannelsalesComponent } from '../../shared/components/common/channelsales/channelsales.component';
import { UsoComponent } from '../../shared/components/common/uso/uso.component';
import { PaymenttypeComponent } from '../../shared/components/common/paymenttype/paymenttype.component';
import { SalesmodeComponent } from '../../shared/components/common/salesmode/salesmode.component';
import { BankComponent } from '../../shared/components/common/bank/bank.component';
import { CurrencytypeComponent } from '../../shared/components/common/currencytype/currencytype.component';
import { TitleStepComponent } from './components/title-step/title-step.component';
import { BackStepComponent } from './components/back-step/back-step.component';
import { ResVaucherComponent } from './components/res-vaucher/res-vaucher.component';
import { PayrollResultadoVisaComponent } from './components/payroll-resultado-visa/payroll-resultado-visa.component';
import { ResPagoEfectivoComponent } from './components/res-cupon/res-cupon.component';
import { RetrievePasswordComponent } from './components/retrieve-password/retrieve-password.component';
import { MigaPanComponent } from './components/retrieve-password/miga-pan/miga-pan.component';
import { RetrieveSendComponent } from './components/retrieve-send/retrieve-send.component';
import { RenewPasswordComponent } from './components/renew-password/renew-password.component';
import { OverlayComponent } from './components/overlay/overlay.component';
import { VisaResultComponent } from './components/visa-result/visa-result.component';
import { TerminosCondicionesComponent } from './components/terminos-condiciones/terminos-condiciones.component';
import { PrePayrollListComponent } from './components/prepayroll/prepayroll-list/prepayroll-list.component';
import { PrePayrollAddComponent } from './components/prepayroll/prepayroll-add/prepayroll-add.component';
import { PrePayrollResultadoVisaComponent } from './components/prepayroll/prepayroll-resultado-visa/prepayroll-resultado-visa.component';

//Kuntur Components 20190812
import { AgencyFormComponent } from './components/maintenance/agency/agency-form/agency-form.component'
import { HomeComponent } from './components/home/home.component';
import { ContractorLocationIndexComponent } from './components/maintenance/contractor-location/contractor-location-index/contractor-location-index.component';
import { ContractorLocationFormComponent } from './components/maintenance/contractor-location/contractor-location-form/contractor-location-form.component';
import { ContractorLocationContactComponent } from './components/maintenance/contractor-location/contractor-location-contact/contractor-location-contact.component';
import { ContractorViewComponent } from './components/maintenance/contractor-location/contractor-view/contractor-view.component';
import { PolicyFormComponent } from './components/policy/policy-form/policy-form.component';
import { PanelComponent } from './components/panel/panel.component';
import { NavmenusctrComponent } from './components/navmenusctr/navmenusctr.component';
import { PolicyIndexComponent } from './components/policy/policy-index/policy-index.component'
import { PolicyMovementDetailsComponent } from './components/policy/policy-movement-details/policy-movement-details.component'
import { PolicyMovementProofComponent } from './components/policy/policy-movement-proof/policy-movement-proof.component';
import { AddContractingComponent } from './components/add-contracting/add-contracting.component';
import { AddTelephoneComponent } from './modal/add-telephone/add-telephone.component';
import { AddEmailComponent } from './modal/add-email/add-email.component';
import { AddAddressComponent } from './modal/add-address/add-address.component';
import { AddContactComponent } from './modal/add-contact/add-contact.component';
import { ActivitiesComponent } from './components/maintenance/activities/activities.component';
import { AgencyIndexComponent } from './components/maintenance/agency/agency-index/agency-index.component';
import { BrokerSearchBynameComponent } from './components/maintenance/agency/broker-search-byname/broker-search-byname.component';
import { ProductComponent } from './components/product/product/product.component';
import { SearchContractingComponent } from './modal/search-contracting/search-contracting.component';
import { SearchBrokerComponent } from './modal/search-broker/search-broker.component';
import { ValErrorComponent } from './modal/val-error/val-error.component';
import { ProcessViewerComponent } from './components/policy/process-viewer/process-viewer.component';
import { AddCiiuComponent } from './modal/add-ciiu/add-ciiu.component';
import { QuotationTrackingComponent } from './components/quote/quotation-tracking/quotation-tracking.component';
import { QuotationEvaluationComponent } from './components/quote/quotation-evaluation/quotation-evaluation.component';
import { ContractorStateComponent } from './components/reports/state-report/contractor-state/contractor-state.component';
import { CreditQualificationRecordComponent } from './components/reports/state-report/credit-qualification-record/credit-qualification-record.component';
import { PolicyTransactionsComponent } from './components/policy/policy-transactions/policy-transactions.component';
import { FilePickerComponent } from './modal/file-picker/file-picker.component';
import { PolicyDocumentsComponent } from './components/policy/policy-documents/policy-documents.component';
import { QuotationComponent } from './components/quote/quotation/quotation.component';
import { RequestStatusComponent } from './components/quote/request-status/request-status.component';
import { RequestQuotationComponent } from './components/quote/request-quotation/request-quotation.component';
import { QuotationRequestComponent } from './components/quote/quotation-request/quotation-request.component';
import { TransactionReportComponent } from './components/reports/transaction-report/transaction-report.component';
import { InsuredReportComponent } from './components/reports/insured-report/insured-report.component';
import { StateReportComponent } from './components/reports/state-report/state-report.component';
import { AnulMovComponent } from './modal/anul-mov/anul-mov.component';
import { ngfModule } from 'angular-file';
import { NgSelectModule } from '@ng-select/ng-select';

//Kuntur Directives 20190812
import { OnlyNumberDirective } from './Directives/only-number-directive';
import { OnlyTextNumberDirective } from './Directives/only-text-number-directive';
import { OnlyTextSpaceDirective } from './Directives/only-text-space-directive';
import { LegalNameDirective } from './Directives/legal-name-directive';
import { FloatDirective } from './Directives/float-directive';
import { UppercaseDirective } from './Directives/uppercase-directive';
import { DateDirective } from './Directives/date-directive';

//Kuntur Pipes 20190812
import { TypeDocumentPipe } from './pipes/type-document.pipe';
import { NameContractorPipe } from './pipes/name-contractor.pipe';
import { MilesPipe } from './pipes/miles.pipe';
import { FileNamePipe } from './pipes/file-name.pipe';
import { FilterPipe } from './pipes/filter.pipe';

// Services
import { AuthGuard } from './guards/auth.guard';
import { BrokerHttpInterceptor } from './guards/broker-http-interceptor';
import { AuthenticationService } from './services/authentication.service';
import { UserService } from './services/user.service';
import { HistorialService } from './services/historial/historial.service';
import { AppConfig } from '../../app.config';
import { GlobalEventsManager } from '../../shared/services/gobal-events-manager';
import { VehiculoService } from './services/vehiculo/vehiculo.service';
import { ApiService } from '../../shared/services/api.service';
import { ExcelService } from '../../shared/services/excel/excel.service';
import { ReportSalesPROService } from './services/reportsalespro/reportsalespro.service';
import { Step03Service } from './services/step03/step03.service';
import { Step04Service } from './services/step04/step04.service';
import { Step05Service } from './services/step05/step05.service';
import {
    BsDatepickerModule,
    PaginationModule,
    ModalModule
} from 'ngx-bootstrap';
import { ConfigService } from '../../shared/services/general/config.service';
import { UbigeoService } from '../../shared/services/ubigeo/ubigeo.service';
import { UsoService } from '../../shared/services/uso/uso.service';
import { SalesModeService } from '../../shared/services/salesmode/salesmode.service';
import { FileUploadService } from './services/fileupload/fileupload.service';
import { PaymentTypeService } from '../../shared/services/paymenttype/paymenttype.service';
import { StateSalesService } from '../../shared/services/statesales/statesales.service';
import { ChannelSalesService } from '../../shared/services/channelsales/channelsales.service';
import { ChannelPointService } from '../../shared/services/channelpoint/channelpoint.service';
import { ReportSalesCFService } from './services/reportsalescf/reportsalescf.service';
import { ReportSalesCVService } from './services/reportsalescv/reportsalescv.service';
import { ReportComissCVService } from './services/reportcomisscv/reportcomisscv.service';
import { ReportComissPROService } from './services/reportcomisspro/reportcomisspro.service';
import { ReportSalesCertificateService } from './services/reportsalescertificate/reportcertificate.service';
import { FlowTypeService } from '../../shared/services/flowtype/flowtype.service';
import { UtilityService } from '../../shared/services/general/utility.service';
import { ValidatorService } from '../../shared/services/general/validator.service';
import { PapelService } from './services/papel/papel.service';
import { PayrollService } from './services/payroll/payroll.service';
import { StateService } from './services/state/state.service';
import { ClienteService } from '../client/shared/services/cliente.service';
import { VisaService } from '../../shared/services/pago/visa.service';
import { EmisionService } from '../client/shared/services/emision.service';
import { BankService } from '../../shared/services/bank/bank.service';
import { CurrencyTypeService } from '../../shared/services/currencytype/currencytype.service';
import { AccountBankService } from '../../shared/services/accountbank/accountbank.service';
import { PagoEfectivoService } from '../../shared/services/pago/pago-efectivo.service';
import { ConfirmService } from '../../shared/components/confirm/confirm.service';
import { PasswordService } from './services/password/password.service';
import { PrepayrollService } from './services/prepayroll/prepayroll.service';
import { SidebarService } from '../../shared/services/sidebar/sidebar.service';
import { CommissionLotService } from './services/commisslot/comissionlot.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CampaignListComponent } from './components/campaign/campaign-list/campaign-list.component';
import { CampaignAddComponent } from './components/campaign/campaign-add/campaign-add.component';
import { CampaignService } from './services/campaign/campaign.service';
import { DeliveryService } from './services/delivery/delivery.service';
import { PrettyNumberPipe } from './pipes/pretty-number.pipe';
import { TestComponent } from './components/maintenance/test/test.component';
import { PolicyRequestComponent } from './components/policy/policy-request/policy-request.component';
import { PolicyEvaluationComponent } from './components/policy/policy-evaluation/policy-evaluation.component';

//Kuntur Services 20190812


@NgModule({
    imports: [
        CommonModule,
        BrokerRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        SharedComponentsModule,
        PaginationModule.forRoot(),
        ModalModule,
        ConfirmModule,
        BsDatepickerModule.forRoot(),
        ModalModule.forRoot(),
        ModalModules,
        RecaptchaModule.forRoot(),
        NgbModule,
        ngfModule, // Kuntur 20190812
        NgSelectModule // Kuntur 20190812
    ],
    exports: [FormsModule],
    declarations: [
        BrokerComponent,
        LoginComponent,
        NavMenuComponent,
        HistorialComponent,
        SidebarComponent,
        FileUploadComponent,
        SalePanelComponent,
        Step01Component,
        Step02Component,
        Step03Component,
        Step04Component,
        Step05Component,
        BrokerEmissionComponent,
        ResultadoComponent,
        UbigeoComponent,
        ReportsalescvComponent,
        ReportsalescfComponent,
        ReportsalescvComponent,
        ReportsalesproComponent,
        ReportcomisscvComponent,
        ReportcomissproComponent,
        ReportsalescertificateComponent,
        FlowtypeComponent,
        UbigeoComponent,
        StatesalesComponent,
        ChannelpointComponent,
        ChannelsalesComponent,
        UsoComponent,
        PaymenttypeComponent,
        SalesmodeComponent,
        PayrollComponent,
        PayrollAddComponent,
        StateComponent,
        TitleStepComponent,
        BackStepComponent,
        BankComponent,
        CurrencytypeComponent,
        ResVaucherComponent,
        ResPagoEfectivoComponent,
        PayrollResultadoVisaComponent,
        RetrievePasswordComponent,
        MigaPanComponent,
        RetrieveSendComponent,
        RenewPasswordComponent,
        OverlayComponent,
        VisaResultComponent,
        TerminosCondicionesComponent,
        PrePayrollListComponent,
        PrePayrollAddComponent,
        PrePayrollResultadoVisaComponent,
        CommissLotComponent,
        CommissionLotAddComponent,
        CampaignListComponent,
        CampaignAddComponent,
        QuotationComponent, // Kuntur 20190812
        RequestStatusComponent, // Kuntur 20190812
        RequestQuotationComponent, // Kuntur 20190812
        QuotationRequestComponent, // Kuntur 20190812
        TransactionReportComponent, // Kuntur 20190812
        InsuredReportComponent, // Kuntur 20190812
        StateReportComponent, // Kuntur 20190812
        OnlyNumberDirective, // Kuntur 20190812
        OnlyTextNumberDirective, // Kuntur 20190812
        OnlyTextSpaceDirective, // Kuntur 20190812
        DateDirective, // Kuntur 20190812
        LegalNameDirective, // Kuntur 20190812
        FloatDirective, // Kuntur 20190812
        UppercaseDirective, // Kuntur 20190812
        HomeComponent, // Kuntur 20190812
        ContractorLocationIndexComponent, // Kuntur 20190812
        ContractorLocationFormComponent, // Kuntur 20190812
        ContractorViewComponent, // Kuntur 20190812
        PolicyFormComponent, // Kuntur 20190812
        PanelComponent, // Kuntur 20190812
        NavmenusctrComponent, // Kuntur 20190812
        PolicyIndexComponent, // Kuntur 20190812
        PolicyMovementDetailsComponent, // Kuntur 20190812
        PolicyMovementProofComponent, // Kuntur 20190812
        AddContractingComponent, // Kuntur 20190812
        AddTelephoneComponent, // Kuntur 20190812
        AddEmailComponent, // Kuntur 20190812
        AddAddressComponent, // Kuntur 20190812
        AddContactComponent, // Kuntur 20190812
        ActivitiesComponent, // Kuntur 20190812
        AgencyIndexComponent, // Kuntur 20190812
        AgencyFormComponent, // Kuntur 20190812
        ProductComponent, // Kuntur 20190812
        ContractorLocationContactComponent, // Kuntur 20190812
        BrokerSearchBynameComponent, // Kuntur 20190812
        QuotationTrackingComponent, // Kuntur 20190812
        QuotationEvaluationComponent, // Kuntur 20190812
        SearchContractingComponent, // Kuntur 20190812
        SearchBrokerComponent, // Kuntur 20190812
        ValErrorComponent, // Kuntur 20190812
        TypeDocumentPipe, // Kuntur 20190812
        NameContractorPipe, // Kuntur 20190812
        AddCiiuComponent, // Kuntur 20190812
        MilesPipe, // Kuntur 20190812
        FileNamePipe, // Kuntur 20190812
        FilterPipe, // Kuntur 20190812
        ValErrorComponent, // Kuntur 20190812
        PolicyDocumentsComponent, // Kuntur 20190812
        ContractorStateComponent, // Kuntur 20190812
        CreditQualificationRecordComponent, // Kuntur 20190812
        PolicyTransactionsComponent, // Kuntur 20190812
        FilePickerComponent, // Kuntur 20190812
        ProcessViewerComponent, // Kuntur 20190919
        PrettyNumberPipe, // Kuntur 20190919
        TestComponent, // Kuntur 20190919
        AnulMovComponent, PolicyRequestComponent, PolicyEvaluationComponent // Kuntur 20190812
    ],
    entryComponents: [
        ResVaucherComponent,
        PayrollResultadoVisaComponent,
        FilePickerComponent, // Kuntur 20190812
        CreditQualificationRecordComponent, // Kuntur 20190812
        ContractorViewComponent, // Kuntur 20190812
        ContractorLocationFormComponent, // Kuntur 20190812
        ContractorLocationContactComponent, // Kuntur 20190812
        PolicyMovementDetailsComponent, // Kuntur 20190812
        PolicyFormComponent, // Kuntur 20190812
        AddTelephoneComponent, // Kuntur 20190812
        AddEmailComponent, // Kuntur 20190812
        AddAddressComponent, // Kuntur 20190812
        AddContactComponent, // Kuntur 20190812
        AgencyFormComponent, // Kuntur 20190812
        BrokerSearchBynameComponent, // Kuntur 20190812
        QuotationTrackingComponent, // Kuntur 20190812
        SearchContractingComponent, // Kuntur 20190812
        SearchBrokerComponent, // Kuntur 20190812
        ValErrorComponent, // Kuntur 20190812
        PolicyDocumentsComponent, // Kuntur 20190812
        AddCiiuComponent, // Kuntur 20190812
        AnulMovComponent // Kuntur 20190919
    ],
    providers: [
        AppConfig,
        AuthGuard,
        AuthenticationService,
        UserService,
        GlobalEventsManager,
        HistorialService,
        UbigeoService,
        Step03Service,
        Step04Service,
        HistorialService,
        Step03Service,
        Step04Service,
        VehiculoService,
        ApiService,
        ExcelService,
        ReportSalesPROService,
        ReportSalesCFService,
        ReportSalesCVService,
        ReportComissCVService,
        ReportComissPROService,
        ReportSalesCertificateService,
        FlowTypeService,
        ConfigService,
        UbigeoService,
        UsoService,
        PaymentTypeService,
        StateSalesService,
        ChannelSalesService,
        ChannelPointService,
        UtilityService,
        ValidatorService,
        SalesModeService,
        PapelService,
        PayrollService,
        StateService,
        VisaService,
        BankService,
        CurrencyTypeService,
        AccountBankService,
        ClienteService,
        EmisionService,
        PagoEfectivoService,
        ConfirmService,
        PagoEfectivoService,
        PasswordService,
        DatePipe,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: BrokerHttpInterceptor,
            multi: true
        },
        PrepayrollService,
        SidebarService,
        Step05Service,
        CommissionLotService,
        CampaignService,
        FileUploadService,
    DeliveryService,
    SessionStorageService
    ]
})
export class BrokerModule { }
