import { Injectable } from '@angular/core';
import { formatDate } from "@angular/common";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
const EXCEL_TYPE =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet application/vnd.ms-excel;charset=UTF-8";
const EXCEL_EXTENSION = ".xlsx";

@Injectable({
  providedIn: 'root'
})
export class ExcelService {

  constructor() { }

  public generateInsuredPolicyExcel(json: any[], excelFileName: string): void {
    const ws = XLSX.utils.json_to_sheet(
      [
        {
          A: "Producto",
          B: "Movimiento",
          C: "Inico Vigencia",
          D: "Fin Vigencia",
          E: "Nro Póliza",
          F: "Asegurado",
          G: "Contratante",
          H: "Sede",
          I: "Broker"
        }
      ],
      {
        header: ["A", "B", "C", "D", "E", "F", "G", "H", "I"],
        skipHeader: true
      }
    );

    const listados = [];
    for (let i = 0; i < json.length; i++) {
      const object = {
        A: json[i].Product,
        B: json[i].Movement,
        // C: this.datePipe.transform(json[i].StartDate, "dd/MM/yyyy"),
        // D: this.datePipe.transform(json[i].EndDate, "dd/MM/yyyy"),
        C: formatDate(json[i].StartDate, 'dd/MM/yyyy', "en-US"),
        D: formatDate(json[i].StartDate, 'dd/MM/yyyy', "en-US"),
        E: json[i].PolicyNumber,
        F: json[i].InsuredData,
        G: json[i].ContractorData,
        H: json[i].ContractorLocation,
        I: json[i].BrokerData
      };

      listados.push(object);
    }
    /* Write data starting at A2 */
    XLSX.utils.sheet_add_json(ws, listados, {
      skipHeader: true,
      origin: "A2"
    });

    // this.wrapAndCenterCell(worksheet.B2);
    const workbook: XLSX.WorkBook = {
      Sheets: { data: ws },
      SheetNames: ["data"]
    };
    // Use XLSXStyle instead of XLSX write function which property writes cell styles.
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: "xlsx",
      bookSST: false,
      type: "array"
    });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }
  public generatePolicyTransactionExcel(json: any[], excelFileName: string): void {
    const ws = XLSX.utils.json_to_sheet(
      [
        {
          A: "Producto",
          B: "Movimiento",
          C: "Nro Operación",
          D: "Nro Póliza",
          E: "Tipo Doc Contratante",
          F: "Nro Doc Contratante",
          G: "Contratante",
          H: "Tipo Doc Broker",
          I: "Nro Doc Broker",
          J: "Broker",
          K: "Nro Proforma",
          L: "Monto Prima Neta",
          M: "Fecha Transacción",
        }
      ],
      {
        header: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M"],
        skipHeader: true
      }
    );

    const listados = [];
    for (let i = 0; i < json.length; i++) {
      const object = {
        A: json[i].Product,
        B: json[i].Movement,
        C: json[i].OperationNumber,
        D: json[i].PolicyNumber,
        E: json[i].ContractorDocumentType,
        F: json[i].ContractorDocumentNumber,
        G: json[i].ContractorFullName,
        H: json[i].BrokerDocumentType,
        I: json[i].BrokerDocumentNumber,
        J: json[i].BrokerFullName,
        K: json[i].ProformaNumber,
        L: json[i].NetPremium,
        M: formatDate(json[i].TransactionDate, 'dd/MM/yyyy', "en-US"),
      };

      listados.push(object);
    }
    /* Write data starting at A2 */
    XLSX.utils.sheet_add_json(ws, listados, {
      skipHeader: true,
      origin: "A2"
    });

    // this.wrapAndCenterCell(worksheet.B2);
    const workbook: XLSX.WorkBook = {
      Sheets: { data: ws },
      SheetNames: ["data"]
    };
    // Use XLSXStyle instead of XLSX write function which property writes cell styles.
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: "xlsx",
      bookSST: false,
      type: "array"
    });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }
  /*Excel Errores*/
  public generateErroresExcel(json: any[], excelFileName: string): void {
    const ws = XLSX.utils.json_to_sheet(
      [
        {
          A: "Registro",
          B: "Descripción del error"
        }
      ],
      {
        header: ["A", "B"],
        skipHeader: true
      }
    );

    const listados = [];
    for (let i = 0; i < json.length; i++) {
      const object = {
        A: json[i].REGISTRO,
        B: json[i].DESCRIPCION
      };

      listados.push(object);
    }
    /* Write data starting at A2 */
    XLSX.utils.sheet_add_json(ws, listados, {
      skipHeader: true,
      origin: "A2"
    });

    // this.wrapAndCenterCell(worksheet.B2);
    const workbook: XLSX.WorkBook = {
      Sheets: { data: ws },
      SheetNames: ["data"]
    };
    // Use XLSXStyle instead of XLSX write function which property writes cell styles.
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: "xlsx",
      bookSST: false,
      type: "array"
    });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: "application/octet-stream"
    });
    FileSaver.saveAs(
      data,
      fileName + "_export_" + new Date().getTime() + EXCEL_EXTENSION
    );
  }
}
