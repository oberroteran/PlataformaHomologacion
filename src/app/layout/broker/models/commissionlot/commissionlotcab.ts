export class CommissionLotCab {
  constructor(
    public NQUANTITY: number,
    public NID_COMMLOT: number,
    public NIDSTATE: number,
    public SREGISTER: string,
    public NAMOUNTTOTAL: number,
    public NAMOUNTIGV: number,
    public NAMOUNTNETO: number,
    public SIDCOMLOT: string,
    public SDESCRIPTION: string,
    public SSERIE: string,
    public SBILLNUM: string,
    public NTYPEDOC: number, // tipo de comprobante
    public NBRANCH: number,
    public SRUC: string,
    public SACCOUNT: string,
    public SCCI: string,
    public SCODCHANNEL: string,
    public fileattach: File[],
    public sobservacion: string, // validar
    public NOUTIDCOMMLOT: string,
    public NBANK: number,
    public NTYPEACCOUNT: number,
    public BDETRACCION: boolean,
    public LISTCOMMISSIONLOTDETAIL = [],
    public LISTCOMMISSIONLOTATTACH = []
  ) {}
}
