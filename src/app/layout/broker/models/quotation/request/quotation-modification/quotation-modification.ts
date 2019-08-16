import { QuotationBroker } from './quotation-broker';
import { QuotationRisk } from './quotation-risk';

/**Datos de recotización */
export class QuotationModification {
    /**Número de cotización */
    public Number: string;
    /**Rama de producto */
    public Branch: string;
    /**Usuario */
    public User: string;
    /**Comentario de recotización */
    public StatusChangeComment: string;
    /**Lista de riesgos y detalles */
    public RiskList: QuotationRisk[];
    /**Lista de brokers */
    public BrokerList: QuotationBroker[];
}