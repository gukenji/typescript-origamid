async function fetchData() {
    const response = await fetch("https://api.origamid.dev/json/transacoes.json");
    const data = await response.json();
    return data;
}
function somaTotal(data) {
    var sum = 0;
    data.forEach((curso) => {
        !isNaN(parseFloat(curso["Valor (R$)"]))
            ? (sum += parseFloat(curso["Valor (R$)"]))
            : (sum += 0);
    });
    return sum;
}
function generatePaymentSummary(data) {
    const transactionMap = new Map();
    data.forEach((curso) => {
        const forma_pagamento = curso["Forma de Pagamento"];
        const valor = parseFloat(curso["Valor (R$)"]) || 0;
        if (transactionMap.has(forma_pagamento)) {
            transactionMap.set(forma_pagamento, transactionMap.get(forma_pagamento) + valor);
        }
        else {
            transactionMap.set(forma_pagamento, valor);
        }
    });
    const transactions = [];
    transactionMap.forEach((total, payment_type) => {
        transactions.push({ payment_type, total });
    });
    console.log(transactions);
    return transactions;
}
function generateStatusSummary(data) {
    const transactionMap = new Map();
    data.forEach((curso) => {
        const status = curso["Status"];
        const valor = parseFloat(curso["Valor (R$)"]) || 0;
        if (transactionMap.has(status)) {
            transactionMap.set(status, transactionMap.get(status) + valor);
        }
        else {
            transactionMap.set(status, valor);
        }
    });
    const transactions = [];
    transactionMap.forEach((total, status_type) => {
        transactions.push({ status_type, total });
    });
    return transactions;
}
async function main() {
    const data = await fetchData();
    const total = somaTotal(data);
    console.log(`Total: ${total}`);
    printTotal(total);
    const payments_summary = generatePaymentSummary(data);
    payments_summary.forEach((payment) => {
        console.log(`Forma de pagamento: ${payment.payment_type}
    Total : ${payment.total}`);
    });
    const status_summary = generateStatusSummary(data);
    status_summary.forEach((payment) => {
        console.log(`Status: ${payment.status_type}
    Total: ${payment.total}`);
    });
}
function printTotal(total) {
    const totalElement = document.getElementById("total");
    totalElement instanceof HTMLElement
        ? (totalElement.innerHTML = `R$ ${total}`)
        : null;
}
main();
export {};
//# sourceMappingURL=index.js.map