export class QuotationRisk {
    /**Id de tipo de riesgo */
    public RiskTypeId: string;
    /**Id de tipo de producto */
    public ProductTypeId: string;
    /**Tasa propuesta por riesgo y producto */
    public ProposedRate: number;
    /**Prima mínima propuesta por producto */
    public ProposedPremium: number;
}