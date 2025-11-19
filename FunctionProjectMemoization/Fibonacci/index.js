var bigInt = require("big-integer");

const fibonacciCache = new Map();
const MAX_CACHE_SIZE = 10000;

fibonacciCache.set(0, bigInt.zero);
fibonacciCache.set(1, bigInt.one);

/**
 * Calcula Fibonacci con memoización
 * @param {number} n - Posición en la secuencia
 * @returns {bigInt} - Valor de Fibonacci
 */
function calculateFibonacci(n) {
    if (fibonacciCache.has(n)) {
        return fibonacciCache.get(n);
    }

    let startN = 0;
    for (let i = n - 1; i >= 0; i--) {
        if (fibonacciCache.has(i)) {
            startN = i;
            break;
        }
    }

    let nth_1 = fibonacciCache.get(startN);
    let nth_2 = startN > 0 ? fibonacciCache.get(startN - 1) : bigInt.zero;
    let answer = nth_1;

    for (let i = startN; i < n; i++) {
        answer = nth_2.add(nth_1);
        nth_2 = nth_1;
        nth_1 = answer;
        
        fibonacciCache.set(i + 1, answer);

        
        if (fibonacciCache.size > MAX_CACHE_SIZE) {
            fibonacciCache.clear();
            fibonacciCache.set(0, bigInt.zero);
            fibonacciCache.set(1, bigInt.one);
        }

    }

    return answer;
}

/**
 * Calcula múltiples valores de Fibonacci en paralelo
 * @param {Array<number>} numbers - Array de posiciones a calcular
 * @returns {Promise<Array>} - Array de resultados
 */
async function calculateMultiple(numbers) {
    const sorted = [...numbers].sort((a, b) => a - b);
    const results = sorted.map(n => ({
        nth: n,
        value: calculateFibonacci(n).toString()
    }));

    return results;
}

module.exports = async function (context, req) {
    context.log('Fibonacci function with memoization processed a request.');

    try {
        const nth = req.body.nth;
        const batch = req.body.batch; 

        if (batch && Array.isArray(batch)) {
            const invalidValues = batch.filter(n => n < 0);
            if (invalidValues.length > 0) {
                context.res = {
                    status: 400,
                    body: { error: 'All values must be greater than or equal to 0' }
                };
                return;
            }

            const results = await calculateMultiple(batch);
            
            context.res = {
                body: {
                    results: results,
                    cacheSize: fibonacciCache.size,
                    message: `Calculated ${results.length} Fibonacci numbers`
                }
            };
        } else if (nth !== undefined) {
            if (nth < 0) {
                context.res = {
                    status: 400,
                    body: { error: 'nth must be greater than or equal to 0' }
                };
                return;
            }

            const answer = calculateFibonacci(nth);
            
            context.res = {
                body: {
                    nth: nth,
                    value: answer.toString(),
                    cacheSize: fibonacciCache.size,
                    fromCache: fibonacciCache.has(nth) && nth > 1
                }
            };
        } else {
            context.res = {
                status: 400,
                body: { 
                    error: 'Please provide either "nth" or "batch" in the request body',
                    examples: {
                        single: { nth: 10 },
                        batch: { batch: [5, 10, 15, 20] }
                    }
                }
            };
        }
    } catch (error) {
        context.log.error('Error processing request:', error);
        context.res = {
            status: 500,
            body: { error: error.message || 'Internal server error' }
        };
    }
}