export class CommissionLot {

  constructor(
    // Parametros de entrada
    public PDATEBEGIN: string,
    public PDATEEND: string,
    public NIDCOMMLOTLIST: string,
    public P_NIDPAYROLL: number,
    public P_NIDCOMMLOT: number,
    public P_NSTATE: number,
    public P_NPOLICY: number,
    public P_NBRANCH: number,

    // Parametros de salida
    public NQUANTITY: number,
    public nid_commlot: number,
    public nidstate: number,
    public sregister: string,
    public namounttotal: number,/*NAMOUNTTOTAL*/
    public namountneto: number,/*NAMOUNTTOTAL*/
    public namountigv: number,/*NAMOUNTTOTAL*/
    public sidcomlot: string,
    public sdescription: string,
    public sbranch: string,
    public ROWNUMBER: number,
    public NRECORD_COUNT: number,
    // Paginacion
    public NPAGE: number,
    public NRECORDPAGE: number,
    public selected: boolean
  ) { }
}
