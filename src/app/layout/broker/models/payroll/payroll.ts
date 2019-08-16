export class Payroll {

    constructor(
      // Parametros de entrada
      public PDATEBEGIN: string,
      public PDATEEND: string,
      public P_NIDPAYROLL: number,
      public P_NSTATE: number,
      public P_NID_NCHANNELTYPE: string,
      // Parametros de salida
      public namounttotal: number,/*NAMOUNTTOTAL*/
      public NQUANTITY: number,
      public nidpayroll: number,
      public nidstate: number,
      public splanilla: string,
      public sregister: string,
      public stype: string,
      public sdescription: string,
      public ROWNUMBER: number,
      public NRECORD_COUNT: number,
      // Paginacion
      public NPAGE: number,
      public NRECORDPAGE: number,
      public selected: boolean
    ) {}
}
