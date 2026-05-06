// ─── Finance Calculation Service ────────────────────────────────────────
// Standard amortization formula for loan payment calculation.

export interface FinanceCalculationInput {
    vehiclePrice: number;
    downPayment: number;
    apr: number;          // Annual percentage rate (e.g., 3.99)
    termMonths: number;   // Loan term in months
}

export interface FinanceCalculationResult {
    monthlyPayment: number;
    totalPayable: number;
    totalInterest: number;
    principal: number;
}

/**
 * calculateMonthlyPayment
 *
 * Uses the standard amortization formula:
 *   M = P * [r(1+r)^n] / [(1+r)^n - 1]
 *
 * Where:
 *   P = loan principal (price - down payment)
 *   r = monthly interest rate (APR / 12 / 100)
 *   n = total number of monthly payments
 */
export function calculateMonthlyPayment(
    input: FinanceCalculationInput
): FinanceCalculationResult {
    const { vehiclePrice, downPayment, apr, termMonths } = input;

    if (vehiclePrice <= 0) throw new Error('Vehicle price must be positive.');
    if (downPayment < 0) throw new Error('Down payment cannot be negative.');
    if (downPayment >= vehiclePrice) throw new Error('Down payment must be less than vehicle price.');
    if (apr < 0) throw new Error('APR cannot be negative.');
    if (termMonths <= 0) throw new Error('Term must be at least 1 month.');

    const principal = vehiclePrice - downPayment;

    // Edge case: 0% APR (no interest)
    if (apr === 0) {
        const monthlyPayment = parseFloat((principal / termMonths).toFixed(2));
        return {
            monthlyPayment,
            totalPayable: parseFloat((principal + downPayment).toFixed(2)),
            totalInterest: 0,
            principal: parseFloat(principal.toFixed(2)),
        };
    }

    const monthlyRate = apr / 100 / 12;
    const n = termMonths;

    // Amortization formula: M = P * [r(1+r)^n] / [(1+r)^n - 1]
    const compounded = Math.pow(1 + monthlyRate, n);
    const monthlyPayment = parseFloat(
        (principal * (monthlyRate * compounded) / (compounded - 1)).toFixed(2)
    );

    const totalPayable = parseFloat((monthlyPayment * n + downPayment).toFixed(2));
    const totalInterest = parseFloat((totalPayable - vehiclePrice).toFixed(2));

    return {
        monthlyPayment,
        totalPayable,
        totalInterest,
        principal: parseFloat(principal.toFixed(2)),
    };
}

/**
 * getAvailableTerms
 *
 * Returns common financing term options.
 */
export function getAvailableTerms(): number[] {
    return [36, 48, 60, 72, 84];
}
