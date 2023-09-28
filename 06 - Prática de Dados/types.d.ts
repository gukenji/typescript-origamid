export interface PaymentSummary {
  payment_type: string;
  total: number;
}

export interface StatusSummary {
  status_type: string;
  total: number;
}

export interface Cursos {
  "Cliente Novo": string;
  Email: string;
  "Forma de Pagamento": string;
  "Valor (R$)": string;
  Status: string;
  ID: number;
  Data: string;
  Nome: string;
}
