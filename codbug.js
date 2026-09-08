// Bug 1: The Leaky Closure Accumulator (Shared State Leak)
// Observed Symptom: Two independent user session counters are mysteriously
//  incrementing each other's counts instead of maintaining separate counts.

// Broken Code Snippet:

// 🚨 BUGGY CODE: Shared state leak


// function createSessionCounter() {
//     let globalCount = 0;
//     return function() {
//         globalCount += 1;
//         return `Session hits: ${globalCount}`;
//     };
// }

// const sessionA = createSessionCounter();
// const sessionB = createSessionCounter();

// console.log(sessionA()); // "Session hits: 1"
// console.log(sessionA()); // "Session hits: 2" ❌ Expected sessionB to start at 1!

// console.log(sessionB()); // "Session hits: 1"
// console.log(sessionB());
// // Student Debugging Task: Refactor createSessionCounter so that every created counter instance encapsulates its own private state in a closure without mutating or referencing any global variables.



// Bug 2: The Mutant Cart Array (Impure In-Place Mutation)
// Observed Symptom: Applying a promotional discount to a shopping cart inadvertently 
// mutates the original database records in memory, causing corrupted price displays elsewhere.

// Broken Code Snippet:

// 🚨 BUGGY CODE: Impure mutation of original objects
// const dbCart = [
//     { id: 1, name: "Laptop", price: 50000 },
//     { id: 2, name: "Mouse", price: 1500 }
// ];

// function applyStoreDiscount(cart, discountRate) {
//     cart.map(item => {
//         return {
//             ...item,
//         }
//         item.price = item.price * (1 - discountRate); // 🚨 Mutates original object reference!
//     });
//     return cart;
// }

// const discountedCart = applyStoreDiscount(dbCart, 0.10);

// console.log(dbCart[0].price);
// // Output: 45000 ❌ Bug: Original dbCart[0].price was changed! It should remain 50000.



// // Student Debugging Task: Rewrite applyStoreDiscount to be a pure function that returns a brand-new array containing fresh copies of each item object (using object spread syntax {...item}), leaving the original dbCart completely untouched.




// Bug 3: The Broken Curried API Builder (Arity / Invocation Mismatch)
// Observed Symptom: Calling the API endpoint builder fails with a runtime error:
//  'TypeError: buildUrl(...) is not a function'.

// Broken Code Snippet:

// // 🚨 BUGGY CODE: Currying vs Multi-argument invocation mismatch
// const buildUrl = (domain) => (route) => (id) =>
//     `https://${domain}/${route}/${id}`;

// // A developer tries to pass two arguments in the first call:
// const fetchUser = buildUrl("api.github.com", "users"); // ❌ Throws TypeError when called next!

// console.log(fetchUser(42));
// Expected: "https://api.github.com/users/42" 

// code :

// const buildUrl = (domain, route) => (id) =>
//     `https://${domain}/${route}/${id}`;

// const fetchUser = buildUrl("api.github.com", "users");

// console.log(fetchUser(42));
// Student Debugging Task: Explain why the above invocation failed based on currying 
// mechanics, and show both the correct curried call syntax and how to refactor buildUrl
//  if multi-argument partial application is desired.




// Bug 4: The Pipeline Type Mismatch (NaN Calculation Error)
// Observed Symptom: The e-commerce checkout calculation pipeline produces NaN instead
//  of a formatted currency string.

// Broken Code Snippet:

// 🚨 BUGGY CODE: Type mismatch & order of execution bug
const pipe = (...fns) => (val) => fns.reduce((acc, fn) => fn(acc), val);

const addShipping = (price) => price + 50;
const formatCurrency = (price) => `₹${price.toFixed(2)}`; // 🚨 Expects a number, returns a string!
const applyTax = (price) => price * 1.18;                  // 🚨 Expects a number, fails on strings!

// Pipeline assembly
const calculateTotal = pipe(
    addShipping,
     applyTax, 
    formatCurrency // ⚠️ Formats into a string too early in the chain!
         // Multiplies string by 1.18 -> results in NaN!
);

console.log(calculateTotal(500)); // Output: NaN ❌ Expected: "₹649.00" 



// Student Debugging Task: Diagnose the data flow type transitions through pipe.
//  Re-order the functions in the pipeline assembly so that mathematical calculations 
// execute before string formatting.