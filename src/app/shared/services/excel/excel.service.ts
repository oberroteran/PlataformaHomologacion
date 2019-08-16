import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet application/vnd.ms-excel;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable()
export class ExcelService {

  constructor(private datePipe: DatePipe) { }

  public exportReportSalesCF(json: any[], excelFileName: string): void {
    const ws = XLSX.utils.json_to_sheet([
      {
        A: 'Nro. Póliza', B: 'Prima', C: 'DNI/CE', D: 'Inico Vigencia', E: 'Fin Vigencia', F: 'Contratante',
        G: 'Placa', H: 'Modalidad', I: 'Estado', J: 'Uso'
      }
    ], { header: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'], skipHeader: true });

    const listados = [];
    for (let i = 0; i < json.length; i++) {
      const object = {
        A: json[i].npolicy,
        B: json[i].npremium,
        C: json[i].ndocuments,
        D: this.datePipe.transform(json[i].dstartdate, 'dd/MM/yyyy'),
        E: this.datePipe.transform(json[i].dexpirdat, 'dd/MM/yyyy'),
        F: json[i].snamecomplete,
        G: json[i].sregist,
        H: json[i].ssalemode,
        I: json[i].sstatuS_POL_DES,
        J: json[i].suso,
      };

      listados.push(object);
    }
    XLSX.utils.sheet_add_json(ws, listados, { skipHeader: true, origin: 'A2', });

    const workbook: XLSX.WorkBook = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', bookSST: false, type: 'array' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  public exportReportSalesCV(json: any[], excelFileName: string): void {
    const ws = XLSX.utils.json_to_sheet([
      {
        A: 'Nro. Póliza', B: 'Prima', C: 'DNI/CE', D: 'Inico Vigencia', E: 'Fin Vigencia', F: 'Contratante',
        G: 'Placa', H: 'Modalidad', I: 'Estado', J: 'Uso'
      }
    ], { header: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'], skipHeader: true });

    const listados = [];
    for (let i = 0; i < json.length; i++) {
      const object = {
        A: json[i].npolicy,
        B: json[i].npremium,
        C: json[i].ndocuments,
        D: this.datePipe.transform(json[i].dstartdate, 'dd/MM/yyyy'),
        E: this.datePipe.transform(json[i].dexpirdat, 'dd/MM/yyyy'),
        F: json[i].snamecomplete,
        G: json[i].sregist,
        H: json[i].ssalemode,
        I: json[i].sstatuS_POL_DES,
        J: json[i].suso,
      };

      listados.push(object);
    }
    XLSX.utils.sheet_add_json(ws, listados, { skipHeader: true, origin: 'A2' });

    const workbook: XLSX.WorkBook = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', bookSST: false, type: 'array' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  public exportReportCertificate(json: any[], excelFileName: string): void {
    const ws = XLSX.utils.json_to_sheet([
      {
        A: 'Nro. Póliza', B: 'Prima', C: 'DNI/CE', D: 'Inico Vigencia', E: 'Fin Vigencia', F: 'Contratante',
        G: 'Placa', H: 'Modalidad', I: 'Uso', J: 'Punto de Venta', K: 'Tipo Ingreso', L: 'Estado Compra',
        M: 'Estado Venta', N: 'Nro Planilla',
        O: 'Estado Planilla', P: 'Departamento', Q: 'Provincia', R: 'Distrito'
      }
    ], { header: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R'], skipHeader: true });

    const listados = [];
    for (let i = 0; i < json.length; i++) {
      const object = {
        A: json[i].npolicy,
        B: json[i].npremium,
        C: json[i].ndocuments,
        D: this.datePipe.transform(json[i].dstartdate, 'dd/MM/yyyy'),
        E: this.datePipe.transform(json[i].dexpirdat, 'dd/MM/yyyy'),
        F: json[i].snamecomplete,
        G: json[i].sregist,
        H: json[i].ssalemode,
        I: json[i].suso,
        J: json[i].spointname,
        K: json[i].sinputtype,
        L: json[i].stateoperation,
        M: json[i].sstatuS_POL_DES,
        N: json[i].nidpayroll,
        O: json[i].statepayroll,
        P: json[i].sprovince,
        Q: json[i].slocat,
        R: json[i].smunicipality,
      };

      listados.push(object);
    }
    XLSX.utils.sheet_add_json(ws, listados, { skipHeader: true, origin: 'A2' });

    const workbook: XLSX.WorkBook = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', bookSST: false, type: 'array' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  public exportReportCampaign(json: any[], excelFileName: string): void {
    const ws = XLSX.utils.json_to_sheet([
      { A: 'Nro. de Campaña', B: 'Nro. Personas', C: 'Descripción', D: 'Canal de Venta', E: 'Fecha Inicio', F: 'Fecha Fin', G: 'Estado' }
    ], { header: ['A', 'B', 'C', 'D', 'E', 'F', 'G'], skipHeader: true });

    const listados = [];
    for (let i = 0; i < json.length; i++) {
      const object = {
        A: json[i].nidcampaign,
        B: json[i].ncountperson,
        C: json[i].sdescript,
        D: json[i].schanneldes,
        E: this.datePipe.transform(json[i].dstartdate, 'dd/MM/yyyy'),
        F: this.datePipe.transform(json[i].dexpirdate, 'dd/MM/yyyy'),
        G: json[i].sstatedes
      };
      listados.push(object);
    }
    XLSX.utils.sheet_add_json(ws, listados, { skipHeader: true, origin: 'A2' });

    const workbook: XLSX.WorkBook = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', bookSST: false, type: 'array' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  public exportReportPayroll(json: any[], excelFileName: string): void {
    const ws = XLSX.utils.json_to_sheet([
      { A: 'Nro. de Planilla', B: 'Nro. SOATS	', C: 'Fecha', D: 'Medio de Pago', E: 'Precio', F: 'Estado' }
    ], { header: ['A', 'B', 'C', 'D', 'E', 'F'], skipHeader: true });

    const listados = [];
    for (let i = 0; i < json.length; i++) {
      const object = {
        A: json[i].splanilla,
        B: json[i].nquantity,
        C: json[i].sregister,
        D: json[i].stype,
        E: json[i].namounttotal,
        F: json[i].sdescription
      };
      listados.push(object);
    }
    XLSX.utils.sheet_add_json(ws, listados, { skipHeader: true, origin: 'A2' });

    const workbook: XLSX.WorkBook = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', bookSST: false, type: 'array' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  public exportReportDetailPayroll(json: any[], excelFileName: string): void {
    const ws = XLSX.utils.json_to_sheet([
      {
        A: 'Nro. Póliza', B: 'Certificado', C: 'Proforma', D: 'Fecha de emisión', E: 'Placa', F: 'Contratante',
        G: 'Inicio de vigencia', H: 'Fin de vigencia', I: 'Importe', J: 'Uso', K: 'Clase', L: 'Tipo de emisión',
        M: 'Punto de Venta'
      }
    ], { header: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N'], skipHeader: true });

    const listados = [];
    for (let i = 0; i < json.length; i++) {
      const object = {
        A: json[i].npolicy,
        B: json[i].ncertif,
        C: json[i].nreceipt,
        D: this.datePipe.transform(json[i].ddateorigi, 'dd/MM/yyyy'),
        E: json[i].sregist,
        F: json[i].snamecomplete,
        G: this.datePipe.transform(json[i].dstartdate, 'dd/MM/yyyy'),
        H: this.datePipe.transform(json[i].dexpirdat, 'dd/MM/yyyy'),
        I: json[i].npremium,
        J: json[i].suso,
        K: json[i].sclase,
        L: json[i].ssalemode,
        M: json[i].spointname
      };
      listados.push(object);
    }

    XLSX.utils.sheet_add_json(ws, listados, { skipHeader: true, origin: 'A2' });

    const workbook: XLSX.WorkBook = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', bookSST: false, type: 'array' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }


  public exportReportPrePayroll(json: any[], excelFileName: string): void {
    const ws = XLSX.utils.json_to_sheet([
      { A: 'Nro. Pre Planilla', B: 'Nro. Especies	', C: 'Fecha', D: 'Medio de Pago', E: 'Precio', F: 'Estado' }
    ], { header: ['A', 'B', 'C', 'D', 'E', 'F'], skipHeader: true });

    const listados = [];
    for (let i = 0; i < json.length; i++) {
      const object = {
        A: json[i].nropreplanilla,
        B: json[i].cantidad,
        C: json[i].fecregistro,
        D: json[i].tipopago,
        E: json[i].montototal,
        F: json[i].descripcionestado
      };
      listados.push(object);
    }
    XLSX.utils.sheet_add_json(ws, listados, { skipHeader: true, origin: 'A2' });

    const workbook: XLSX.WorkBook = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', bookSST: false, type: 'array' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  public exportReportPrePayrollGeneral(cab: any = {}, detail: any[], paymentdetail: any[], excelFileName: string): void {
    const ws = XLSX.utils.json_to_sheet([
      { A: 'Nro. Pre Planilla', B: 'Nro. Especies', C: 'Fecha', D: 'Medio de Pago', E: 'Precio', F: 'Estado' }
    ], { header: ['A', 'B', 'C', 'D', 'E', 'F'], skipHeader: true });

    const listados = [];
    if (cab.id > 0) {
      const object = {
        A: cab.id,
        B: cab.cantidad,
        C: cab.dRegister,
        D: cab.tipoPago,
        E: cab.monto,
        F: cab.descripcionEstado
      };
      listados.push(object);
    }
    XLSX.utils.sheet_add_json(ws, listados, { skipHeader: true, origin: 'A2' });
    const wsd = XLSX.utils.json_to_sheet([
      { A: 'Especie', B: 'Placa', C: 'Monto' }
    ], { header: ['A', 'B'], skipHeader: true });

    const listadosd = [];
    for (let i = 0; i < detail.length; i++) {
      const object = {
        A: detail[i].policy,
        B: detail[i].regist,
        C: detail[i].amount
      };
      listadosd.push(object);
    }
    XLSX.utils.sheet_add_json(wsd, listadosd, { skipHeader: true, origin: 'A2' });

    const wsp = XLSX.utils.json_to_sheet([
      { A: 'Nro. Operación', B: 'Fecha Operación', C: 'Monto', D: 'Banco', E: 'Referencia' }
    ], { header: ['A', 'B', 'C', 'D', 'E'], skipHeader: true });

    const listadosp = [];
    for (let i = 0; i < paymentdetail.length; i++) {
      const object = {
        A: paymentdetail[i].operationNumber,
        B: paymentdetail[i].operationDate,
        C: paymentdetail[i].amount,
        D: paymentdetail[i].nbankText,
        E: paymentdetail[i].reference
      };
      listadosp.push(object);
    }
    XLSX.utils.sheet_add_json(wsp, listadosp, { skipHeader: true, origin: 'A2' });

    const workbook: XLSX.WorkBook = {
      Sheets: {
        'Planilla': ws,
        'Certificado': wsd,
        'Medios de Pago': wsp
      },
      SheetNames: [
        'Planilla', 'Certificado', 'Medios de Pago'
      ]
    };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', bookSST: false, type: 'array' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  public exportReportSalesPRO(json: any[], excelFileName: string): void {
    const ws = XLSX.utils.json_to_sheet([
      {
        A: 'Nro. Póliza', B: 'Prima', C: 'DNI/CE', D: 'Inico Vigencia', E: 'Fin Vigencia', F: 'Contratante',
        G: 'Placa', H: 'Modalidad', I: 'Estado', J: 'Uso'
      }
    ], { header: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'], skipHeader: true });

    const listados = [];
    for (let i = 0; i < json.length; i++) {
      const object = {
        A: json[i].npolicy,
        B: json[i].npremium,
        C: json[i].ndocuments,
        D: this.datePipe.transform(json[i].dstartdate, 'dd/MM/yyyy'),
        E: this.datePipe.transform(json[i].dexpirdat, 'dd/MM/yyyy'),
        F: json[i].snamecomplete,
        G: json[i].sregist,
        H: json[i].ssalemode,
        I: json[i].sstatuS_POL_DES,
        J: json[i].suso,
      };

      listados.push(object);
    }
    XLSX.utils.sheet_add_json(ws, listados, { skipHeader: true, origin: 'A2' });

    const workbook: XLSX.WorkBook = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', bookSST: false, type: 'array' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  public exportReportComissCV(json: any[], excelFileName: string): void {
    const ws = XLSX.utils.json_to_sheet([
      {
        A: 'Nro. Póliza', B: 'Prima', C: 'DNI/CE', D: 'Inico Vigencia', E: 'Fin Vigencia', F: 'Contratante',
        G: 'Placa', H: 'Modalidad', I: 'Estado'
      }
    ], { header: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'], skipHeader: true });

    const listados = [];
    for (let i = 0; i < json.length; i++) {
      const object = {
        A: json[i].npolicy,
        B: json[i].npremium,
        C: json[i].ndocuments,
        D: this.datePipe.transform(json[i].dstartdate, 'dd/MM/yyyy'),
        E: this.datePipe.transform(json[i].dexpirdat, 'dd/MM/yyyy'),
        F: json[i].snamecomplete,
        G: json[i].sregist,
        H: json[i].ssalemode,
        I: json[i].sstatuS_POL_DES
      };

      listados.push(object);
    }
    XLSX.utils.sheet_add_json(ws, listados, { skipHeader: true, origin: 'A2' });
    const workbook: XLSX.WorkBook = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', bookSST: false, type: 'array' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  public exportReportComissPRO(json: any[], excelFileName: string): void {
    const ws = XLSX.utils.json_to_sheet([
      {
        A: 'Nro. Póliza', B: 'Prima', C: 'DNI/CE', D: 'Inico Vigencia', E: 'Fin Vigencia', F: 'Contratante',
        G: 'Placa', H: 'Modalidad', I: 'Estado'
      }
    ], { header: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'], skipHeader: true });

    const listados = [];
    for (let i = 0; i < json.length; i++) {
      const object = {
        A: json[i].npolicy,
        B: json[i].npremium,
        C: json[i].ndocuments,
        D: this.datePipe.transform(json[i].dstartdate, 'dd/MM/yyyy'),
        E: this.datePipe.transform(json[i].dexpirdat, 'dd/MM/yyyy'),
        F: json[i].snamecomplete,
        G: json[i].sregist,
        H: json[i].ssalemode,
        I: json[i].sstatuS_POL_DES,
      };

      listados.push(object);
    }
    XLSX.utils.sheet_add_json(ws, listados, { skipHeader: true, origin: 'A2' });
    const workbook: XLSX.WorkBook = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', bookSST: false, type: 'array' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  public exportHistorial(json: any[], excelFileName: string): void {
    const ws = XLSX.utils.json_to_sheet([
      {
        A: 'Procedencia', B: 'Nro. Póliza', C: 'Prima', D: 'DNI/CE', E: 'Inico Vigencia', F: 'Fin Vigencia',
        G: 'Contratante', H: 'Placa', I: 'Modalidad', J: 'Campaña', K: 'Estado'
      }
    ], { header: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'], skipHeader: true });

    const listados = [];
    for (let i = 0; i < json.length; i++) {
      const object = {
        A: json[i].ssource,
        B: json[i].npolicy,
        C: json[i].npremium,
        D: json[i].ndocuments,
        E: this.datePipe.transform(json[i].dstartdate, 'dd/MM/yyyy'),
        F: this.datePipe.transform(json[i].dexpirdat, 'dd/MM/yyyy'),
        G: json[i].snamecomplete,
        H: json[i].sregist,
        I: json[i].ssalemode,
        J: json[i].scampaigsdes,
        K: json[i].sstatuS_POL_DES,
      };

      listados.push(object);
    }
    XLSX.utils.sheet_add_json(ws, listados, { skipHeader: true, origin: 'A2' });
    const workbook: XLSX.WorkBook = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', bookSST: false, type: 'array' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  public exportHistorialDetail(json: any[], excelFileName: string): void {
    const ws = XLSX.utils.json_to_sheet([
      {
        A: 'Fecha de Venta', B: 'Punto de Venta', C: 'Contratante', D: 'Nro. Documento', E: 'EMail',
        F: 'Teléfono', G: 'Dirección', H: 'Ubigeo', I: 'Inicio Vigencia', J: 'Fin Vigencia', K: 'Prima',
        L: 'Placa', M: 'Año', N: 'Asientos',
        O: 'Uso', P: 'Clase', Q: 'Marca', R: 'Modelo', S: 'Serie', T: 'Dirección Entrega', U: 'Ubigeo Entrega',
        V: 'Tipo Pago', W: 'Turno Entrega', X: 'Fecha Entrega', Y: 'Modalidad', Z: 'Factura'
      }
    ], { header: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'], skipHeader: true });

    const listados = [];
    for (let i = 0; i < json.length; i++) {
      const object = {
        A: this.datePipe.transform(json[i].dissuedat, 'dd/MM/yyyy'),
        B: json[i].spointname,
        C: json[i].snamecomplete,
        D: json[i].ndocuments,
        E: json[i].sE_MAIL,
        F: json[i].sphone,
        G: json[i].sstreet,
        H: json[i].ubigeo,
        I: this.datePipe.transform(json[i].dstartdate, 'dd/MM/yyyy'),
        J: this.datePipe.transform(json[i].dexpirdat, 'dd/MM/yyyy'),
        K: json[i].npremium,
        L: json[i].sregist,
        M: json[i].nyear,
        N: json[i].nseatcount,
        O: json[i].suso,
        P: json[i].sclase,
        Q: json[i].svehbrand,
        R: json[i].svehmodel,
        S: json[i].schassis,
        T: json[i].sdireccionentrega,
        U: json[i].ubigeoentrega,
        V: json[i].tipopago,
        W: json[i].horarioentrega,
        X: json[i].dfechaentrega,
        Y: json[i].ssalemode,
        Z: json[i].factura,
      };

      listados.push(object);
    }
    XLSX.utils.sheet_add_json(ws, listados, { skipHeader: true, origin: 'A2' });
    const workbook: XLSX.WorkBook = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', bookSST: false, type: 'array' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }


  public exportReportCommissionLot(json: any[], excelFileName: string): void {
    const ws = XLSX.utils.json_to_sheet([
      { A: 'Ramo', B: 'Nro. de Lote', C: 'Nro. Comisiones	', D: 'Fecha', E: 'Monto Comisión', F: 'Estado' }
    ], { header: ['A', 'B', 'C', 'D', 'E', 'F'], skipHeader: true });

    const listados = [];
    for (let i = 0; i < json.length; i++) {
      const object = {
        A: json[i].sbranch,
        B: json[i].sidcomlot,
        C: json[i].nquantity,
        D: json[i].sregister,
        E: json[i].namounttotal,
        F: json[i].sdescription
      };
      listados.push(object);
    }
    XLSX.utils.sheet_add_json(ws, listados, { skipHeader: true, origin: 'A2' });
    const workbook: XLSX.WorkBook = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', bookSST: false, type: 'array' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  private wrapAndCenterCell(cell: XLSX.CellObject) {
    const wrapAndCenterCellStyle = { alignment: { wrapText: true, vertical: 'center', horizontal: 'center' } };
    this.setCellStyle(cell, wrapAndCenterCellStyle);
  }

  private setCellStyle(cell: XLSX.CellObject, style: {}) {
    cell.s = style;
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: 'application/octet-stream' });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }
}
