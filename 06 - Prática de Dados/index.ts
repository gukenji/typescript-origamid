import { PaymentSummary, Cursos, StatusSummary } from "./types";

async function fetchData<Cursos>(): Promise<Cursos> {
  const response = await fetch("https://api.origamid.dev/json/transacoes.json");
  const data = await response.json();
  return data;
}

function somaTotal(data: Cursos[]): number {
  var sum: number = 0;
  data.forEach((curso) => {
    !isNaN(parseFloat(curso["Valor (R$)"]))
      ? (sum += parseFloat(curso["Valor (R$)"]))
      : (sum += 0);
  });
  return sum;
}

function generatePaymentSummary(data: Cursos[]): PaymentSummary[] {
  //The Map object holds key-value pairs and remembers the original insertion order of the keys. Any value (both objects and primitive values) may be used as either a key or a value.
  const transactionMap = new Map<string, number>();

  data.forEach((curso) => {
    const forma_pagamento = curso["Forma de Pagamento"];
    const valor = parseFloat(curso["Valor (R$)"]) || 0;

    if (transactionMap.has(forma_pagamento)) {
      // Update the total if the transaction already exists
      transactionMap.set(
        forma_pagamento,
        // ! -> That's the non-null assertion operator. It is a way to tell the compiler "this expression cannot be null or undefined here, so don't complain about the possibility of it being null or undefined." Sometimes the type checker is unable to make that determination itself.
        transactionMap.get(forma_pagamento)! + valor
      );
    } else {
      // Create a new entry if the transaction doesn't exist
      transactionMap.set(forma_pagamento, valor);
    }
  });
  // Convert the Map to an array of Transaction objects
  const transactions: PaymentSummary[] = [];
  transactionMap.forEach((total, payment_type) => {
    transactions.push({ payment_type, total });
  });
  console.log(transactions);
  return transactions;
}

function generateStatusSummary(data: Cursos[]): StatusSummary[] {
  //The Map object holds key-value pairs and remembers the original insertion order of the keys. Any value (both objects and primitive values) may be used as either a key or a value.
  const transactionMap = new Map<string, number>();

  data.forEach((curso) => {
    const status = curso["Status"];
    const valor = parseFloat(curso["Valor (R$)"]) || 0;

    if (transactionMap.has(status)) {
      transactionMap.set(status, transactionMap.get(status)! + valor);
    } else {
      transactionMap.set(status, valor);
    }
  });
  const transactions: StatusSummary[] = [];
  transactionMap.forEach((total, status_type) => {
    transactions.push({ status_type, total });
  });
  return transactions;
}

// function generateSummary<T>(arr: Cursos[], key: string): T[] {
//   const transactionTypeMap = new Map<string, number>();

//   arr.forEach((obj) => {
//     const valor = parseFloat(obj["Valor (R$)"]) || 0;

//     if (transactionTypeMap.has(key)) {
//       // Update the total if the transaction already exists
//       transactionTypeMap.set(
//         key,
//         // ! -> That's the non-null assertion operator. It is a way to tell the compiler "this expression cannot be null or undefined here, so don't complain about the possibility of it being null or undefined." Sometimes the type checker is unable to make that determination itself.
//         transactionTypeMap.get(key)! + valor
//       );
//     } else {
//       // Create a new entry if the transaction doesn't exist
//       transactionTypeMap.set(key, valor);
//     }
//   });
//   // Convert the Map to an array of Transaction objects
//   const summary: T[] = [];
//   transactionTypeMap.forEach((total, transaction) => {
//     summary.push({ transaction, total });
//   });

//   return transactions;
// }

async function main() {
  const data: Cursos[] = await fetchData();
  // Exercicio 3.1
  const total: number = somaTotal(data);
  console.log(`Total: ${total}`);
  printTotal(total);
  // Exercicio 3.2
  const payments_summary: PaymentSummary[] = generatePaymentSummary(data);
  payments_summary.forEach((payment) => {
    console.log(`Forma de pagamento: ${payment.payment_type}
    Total : ${payment.total}`);
  });

  // Exercicio 3.3
  const status_summary: StatusSummary[] = generateStatusSummary(data);
  status_summary.forEach((payment) => {
    console.log(`Status: ${payment.status_type}
    Total: ${payment.total}`);
  });
}

function printTotal(total: number) {
  const totalElement = document.getElementById("total");
  totalElement instanceof HTMLElement
    ? (totalElement.innerHTML = `R$ ${total}`)
    : null;
}
main();
