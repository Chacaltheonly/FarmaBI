
export interface SellerPerformance {
  id: string;
  name: string;
  bruto: number;
  liquido: number;
  descontos: number;
  custo: number;
  margem: number;
  margemPercent: number;
  clientes: number;
  ticketMedio: number;
  comissaoCampanha: number;
  ranking: number;
}

export interface CampaignItem {
  sku: string;
  descricao: string;
  comissao: number;
  meta: number;
  ativo: boolean;
}

export interface DashboardMetrics {
  totalVendas: number;
  totalCusto: number;
  totalDesconto: number;
  totalMargem: number;
  projecaoMes: number;
  diasUteisRestantes: number;
  diasUteisPassados: number;
}
