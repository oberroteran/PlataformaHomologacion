import { AuthorizedRate } from './authorized-rate';

export class QuotationStatusChange { //Datos de evaluación de cotización
    public QuotationNumber:string //Número de cotización

    public Status:string;   //nuevo estado de cotización
    public Reason:string;   //Motivo de cambio de estado
    public Comment:string;  //Comentario sobre el cambio de estado

    public User:number; //Usuario

    public saludAuthorizedRateList:AuthorizedRate[];    //lista de inserciones de tasa autorizada para realizar
    public pensionAuthorizedRateList:AuthorizedRate[];  //lista de inserciones de tasa autorizada para realizar

}