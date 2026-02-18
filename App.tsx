
import React, { useState, useMemo, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Cell, ReferenceLine
} from 'recharts';
import { 
  LayoutDashboard, Table as TableIcon, TrendingUp, Users, 
  Award, Package, CheckCircle2, AlertTriangle, Info, FileSpreadsheet,
  Calendar, DollarSign, Target, Settings, Sparkles, ArrowUpRight, ArrowDownRight,
  ChevronRight, BrainCircuit, Lightbulb, Zap, ShieldAlert, Upload, FileText, Database,
  ArrowRight, Search
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

// --- DADOS INICIAIS (MOCK) ---
const OCR_SUMMARY = {
  data: "18/02/2026",
  periodo: "01/02/26 a 17/02/26",
  totalBruto: 8470.55,
  totalDescontos: 2925.87,
  totalLiquido: 5544.68,
  totalCusto: 3351.96,
  totalMargem: 2192.72,
  margemPercent: 39.5,
  clientes: 104,
  ticketMedio: 53.31,
};

const SELLERS = [
  { id: "4", name: "ELIAS ANDRADE DE SOUZA", bruto: 70.56, liquido: 32.90, descontos: 37.66, atendimentos: 1, ticket: 32.90, margem: 116.45, ranking: 6 },
  { id: "26", name: "LUAN LUIZ MICHELS", bruto: 2933.18, liquido: 1773.81, descontos: 1159.37, atendimentos: 30, ticket: 59.13, margem: 64.50, ranking: 1 },
  { id: "33", name: "LUIZ IVALESIO DE PRA", bruto: 2337.33, liquido: 1818.29, descontos: 519.04, atendimentos: 24, ticket: 75.76, margem: 70.78, ranking: 2 },
  { id: "36", name: "ISABELI ANACLETO MACIEL", bruto: 701.29, liquido: 545.25, descontos: 156.04, atendimentos: 12, ticket: 45.44, margem: 44.35, ranking: 5 },
  { id: "41", name: "GABRIELA VIANA JOELS", bruto: 1160.11, liquido: 662.59, descontos: 497.52, atendimentos: 22, ticket: 30.12, margem: 70.86, ranking: 4 },
  { id: "42", name: "LUANA JOAQUIM PEREIRA", bruto: 1268.08, liquido: 711.84, descontos: 556.24, atendimentos: 15, ticket: 47.46, margem: 66.24, ranking: 3 },
];

const CAMPAIGN_ITEMS = [
  { sku: "102030", desc: "DORALGINA 30CPS", qtde: 45, valor: 900.00, comissao: 2, total: 90 },
  { sku: "445566", desc: "VITAMINA C 1G", qtde: 32, valor: 1200.00, comissao: 5, total: 160 },
  { sku: "778899", desc: "OMEGA 3 1000MG", qtde: 18, valor: 1800.00, comissao: 12, total: 216 },
];

const STORE_BENCHMARK = {
  ticket: OCR_SUMMARY.ticketMedio,
  margem: OCR_SUMMARY.margemPercent,
  descontoPercent: (OCR_SUMMARY.totalDescontos / OCR_SUMMARY.totalBruto) * 100,
};

const PROJECTION_CALC = () => {
  const diasAbertosMes = 24;
  const diasAbertosDecorridos = 14;
  const realizado = OCR_SUMMARY.totalLiquido;
  const projecao = (realizado / diasAbertosDecorridos) * diasAbertosMes;
  return { projecao, diasAbertosMes, diasAbertosDecorridos, diasRestantes: diasAbertosMes - diasAbertosDecorridos };
};

const PROJ = PROJECTION_CALC();

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50">
      <nav className="w-full md:w-64 bg-slate-900 text-slate-300 flex-shrink-0 sticky top-0 h-auto md:h-screen z-10">
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-emerald-500/20">F</div>
          <div>
            <h1 className="text-white font-bold leading-none tracking-tight">FarmaBI</h1>
            <p className="text-[10px] text-slate-500 font-medium mt-1 uppercase tracking-widest">v3.5 Data Master</p>
          </div>
        </div>
        
        <div className="p-4 space-y-1">
          <TabButton active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon={<LayoutDashboard size={18} />} label="Performance" />
          <TabButton active={activeTab === 'import'} onClick={() => setActiveTab('import')} icon={<Upload size={18} />} label="Importar Excel" />
          <TabButton active={activeTab === 'ranking'} onClick={() => setActiveTab('ranking')} icon={<Award size={18} />} label="Ranking e Metas" />
          <TabButton active={activeTab === 'advisor'} onClick={() => setActiveTab('advisor')} icon={<Sparkles size={18} />} label="Consultor AI" />
          <TabButton active={activeTab === 'campaigns'} onClick={() => setActiveTab('campaigns')} icon={<Target size={18} />} label="Campanhas" />
        </div>

        <div className="absolute bottom-6 left-6 right-6">
          <div className="bg-slate-800/50 backdrop-blur rounded-xl p-4 flex items-center gap-3 border border-slate-700/50">
             <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-xs font-bold border border-emerald-500/30">SF</div>
             <div>
               <p className="text-xs font-semibold text-white">SAGRADA FAMILIA</p>
               <p className="text-[10px] text-slate-500">Gestão Ativa</p>
             </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow p-4 md:p-8 overflow-y-auto">
        <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              {activeTab === 'import' ? 'Central de Importação' : activeTab === 'advisor' ? 'Consultoria AI' : 'Painel FarmaBI'}
            </h2>
            <p className="text-slate-500 font-medium">{OCR_SUMMARY.periodo}</p>
          </div>
          <div className="flex flex-wrap gap-2">
             <div className="flex items-center gap-2 bg-white text-slate-600 px-4 py-2.5 rounded-xl border border-slate-200 shadow-sm text-sm font-semibold">
               <Calendar size={16} className="text-emerald-500" /> {PROJ.diasAbertosDecorridos}/{PROJ.diasAbertosMes} Dias Úteis
             </div>
          </div>
        </header>

        {activeTab === 'dashboard' && <DashboardView />}
        {activeTab === 'import' && <ImportView />}
        {activeTab === 'ranking' && <RankingView />}
        {activeTab === 'advisor' && <AIAdvisorView />}
        {activeTab === 'campaigns' && <CampaignView />}
      </main>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: any) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group ${active ? 'bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}>
      <span className={`${active ? 'text-white' : 'text-slate-500 group-hover:text-emerald-400'}`}>{icon}</span>
      <span className="text-sm">{label}</span>
      {active && <ChevronRight size={14} className="ml-auto opacity-50" />}
    </button>
  );
}

function DashboardView() {
  const chartData = SELLERS.map(s => ({ name: s.id, valor: s.liquido }));
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Venda Líquida" value={`R$ ${OCR_SUMMARY.totalLiquido.toLocaleString('pt-BR')}`} trend="+12.5%" trendUp subtitle="Acumulado Mês" icon={<DollarSign size={20} />} />
        <KPICard title="Projeção Final" value={`R$ ${PROJ.projecao.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}`} subtitle="Meta sem Domingos" icon={<TrendingUp size={20} />} highlight />
        <KPICard title="Margem Média" value={`${OCR_SUMMARY.margemPercent.toFixed(1)}%`} subtitle="Lucro Operacional" icon={<Award size={20} />} color="amber" />
        <KPICard title="Ticket Médio" value={`R$ ${OCR_SUMMARY.ticketMedio}`} subtitle="Média Loja" icon={<Users size={20} />} color="blue" />
      </div>
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
            <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
            <Bar dataKey="valor" radius={[6, 6, 0, 0]} fill="#10b981" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function ImportView() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  const simulateUpload = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setShowSummary(true);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna de Uploads */}
        <div className="lg:col-span-1 space-y-4">
          <UploadCard 
            title="Relatório A: Vendas" 
            desc="Suba o arquivo diário de vendas por funcionário." 
            onUpload={simulateUpload} 
            icon={<Users className="text-blue-500" />}
            columns={['Data', 'Funcionário', 'Bruto', 'Desconto', 'Líquido', 'CMV', 'Cupons']}
          />
          <UploadCard 
            title="Relatório B: Produtos" 
            desc="Suba o arquivo de vendas por item (Campanhas)." 
            onUpload={simulateUpload}
            icon={<Package className="text-amber-500" />}
            columns={['SKU', 'Descrição', 'Qtde', 'Valor', 'Data', 'Vendedor']}
          />
          <UploadCard 
            title="Relatório C: Catálogo" 
            desc="Atualize o catálogo de metas e comissões." 
            onUpload={simulateUpload}
            icon={<Settings className="text-slate-500" />}
            columns={['SKU', 'Comissão Fixa', 'Meta', 'Ativo']}
          />
        </div>

        {/* Resumo Dinâmico Pós-Importação */}
        <div className="lg:col-span-2">
          {isProcessing ? (
            <div className="bg-white rounded-3xl border-2 border-dashed border-slate-200 h-full flex flex-col items-center justify-center p-12 text-center">
              <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <h3 className="text-xl font-bold text-slate-800">Processando Inteligência...</h3>
              <p className="text-slate-500">Mapeando colunas e consolidando fechamento diário.</p>
            </div>
          ) : showSummary ? (
            <div className="bg-white rounded-3xl shadow-xl border border-emerald-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4">
              <div className="bg-emerald-600 p-6 text-white flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-black uppercase">Resumo da Importação de Hoje</h3>
                  <p className="text-emerald-100 text-sm">Dados processados para {OCR_SUMMARY.data}</p>
                </div>
                <CheckCircle2 size={32} />
              </div>
              <div className="p-8 space-y-8">
                {/* Bloco de 10 linhas conforme solicitado */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <h4 className="text-xs font-black uppercase text-slate-400 tracking-widest border-b pb-2">Status Financeiro</h4>
                    <SummaryLine label="Realizado Mês até Hoje" value={`R$ ${OCR_SUMMARY.totalLiquido.toLocaleString('pt-BR')}`} />
                    <SummaryLine label="Ranking Atual" value="1º: Luan Luiz / 2º: Luiz I." />
                    <SummaryLine label="Projeção (S/ Domingos)" value={`R$ ${PROJ.projecao.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}`} bold />
                    <SummaryLine label="Dias Úteis Decorridos" value={`${PROJ.diasAbertosDecorridos} de ${PROJ.diasAbertosMes}`} />
                  </div>
                  <div className="space-y-3">
                    <h4 className="text-xs font-black uppercase text-rose-400 tracking-widest border-b pb-2">Alertas de Auditoria</h4>
                    <SummaryLine label="Desconto Médio" value="Acima do normal (34%)" color="text-rose-600" />
                    <SummaryLine label="Ticket Médio" value="Queda de 4% vs Ontem" color="text-amber-600" />
                    <SummaryLine label="CMV" value="Subindo (Impacto na Margem)" color="text-rose-600" />
                    <SummaryLine label="Atendimentos" value="Estável (+2%)" color="text-emerald-600" />
                  </div>
                </div>

                {/* Top 15 Campanhas */}
                <div>
                  <h4 className="text-xs font-black uppercase text-slate-400 tracking-widest border-b pb-2 mb-4">Top 15 Itens de Campanha (Processados)</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="text-[10px] text-slate-400 font-bold">
                          <th className="pb-2">SKU</th>
                          <th className="pb-2">DESCRIÇÃO</th>
                          <th className="pb-2 text-center">QTDE</th>
                          <th className="pb-2 text-right">COMISSÃO FIXA</th>
                          <th className="pb-2 text-right">SUBTOTAL</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {CAMPAIGN_ITEMS.map((item, i) => (
                          <tr key={i} className="text-sm">
                            <td className="py-3 font-mono text-xs">{item.sku}</td>
                            <td className="py-3 font-bold text-slate-700">{item.desc}</td>
                            <td className="py-3 text-center">{item.qtde}</td>
                            <td className="py-3 text-right">R$ {item.comissao},00</td>
                            <td className="py-3 text-right font-black text-emerald-600">R$ {item.total},00</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-100 rounded-3xl h-full flex flex-col items-center justify-center p-12 text-center text-slate-400">
              <FileSpreadsheet size={64} className="mb-4 opacity-20" />
              <p className="font-bold">Aguardando envio dos relatórios...</p>
              <p className="text-xs">Clique nos botões ao lado para simular o upload diário.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function UploadCard({ title, desc, onUpload, icon, columns }: any) {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 group hover:border-emerald-300 transition-all">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 bg-slate-50 rounded-2xl group-hover:bg-emerald-50 transition-colors">
          {icon}
        </div>
        <div>
          <h4 className="font-bold text-slate-800 leading-none">{title}</h4>
          <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-tighter">Excel / CSV / TXT</p>
        </div>
      </div>
      <p className="text-xs text-slate-500 mb-6 leading-relaxed">{desc}</p>
      
      <div className="mb-6 p-3 bg-slate-50 rounded-xl border border-slate-100">
        <p className="text-[9px] font-black text-slate-400 uppercase mb-2">Colunas Detectadas</p>
        <div className="flex flex-wrap gap-1">
          {columns.map((c: string) => (
            <span key={c} className="px-2 py-0.5 bg-white border border-slate-200 rounded-md text-[9px] font-bold text-slate-600">{c}</span>
          ))}
        </div>
      </div>

      <button 
        onClick={onUpload}
        className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-3 rounded-xl text-xs font-black hover:bg-emerald-600 transition-all shadow-lg shadow-slate-900/10"
      >
        <Upload size={14} /> SUBIR ARQUIVO
      </button>
    </div>
  );
}

function SummaryLine({ label, value, color = "text-slate-700", bold = false }: any) {
  return (
    <div className="flex items-center justify-between py-1 text-sm">
      <span className="text-slate-500">{label}</span>
      <span className={`${color} ${bold ? 'font-black' : 'font-bold'}`}>{value}</span>
    </div>
  );
}

function KPICard({ title, value, subtitle, icon, highlight = false, trend, trendUp, color = 'emerald' }: any) {
  const colorMaps = {
    emerald: 'text-emerald-500 bg-emerald-50',
    amber: 'text-amber-500 bg-amber-50',
    blue: 'text-blue-500 bg-blue-50',
    rose: 'text-rose-500 bg-rose-50'
  };
  return (
    <div className={`p-6 rounded-3xl shadow-sm border border-slate-200 transition-all ${highlight ? 'bg-slate-900 text-white border-slate-800' : 'bg-white text-slate-800'}`}>
      <div className="flex justify-between items-start mb-6">
        <div className={`p-3 rounded-2xl ${highlight ? 'bg-emerald-500 text-white' : colorMaps[color as keyof typeof colorMaps]}`}>{icon}</div>
        {trend && <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${trendUp ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>{trend}</span>}
      </div>
      <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{title}</h4>
      <p className="text-2xl font-black mt-1">{value}</p>
      <p className="text-[10px] font-medium mt-2 text-slate-400">{subtitle}</p>
    </div>
  );
}

function RankingView() { return <div className="p-8 bg-white rounded-3xl border border-slate-200">Visão de ranking e metas.</div>; }
function AIAdvisorView() { return <div className="p-8 bg-white rounded-3xl border border-slate-200">Consultoria estratégica AI.</div>; }
function CampaignView() { return <div className="p-8 bg-white rounded-3xl border border-slate-200">Relatório de itens de campanha.</div>; }
