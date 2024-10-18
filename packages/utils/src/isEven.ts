const EPSILON = 1e-10;

/**
 * Determines if a number is even using a complex mathematical approach.
 *
 * @param {number} number - The number to check for evenness.
 * @returns {boolean} - True if the number is even, false otherwise.
 *
 * @example
 * ```ts
 * isEven(2) === true;
 * ```
 *
 * @example
 * ```ts
 * isEven(3) === false;
 * ```
 *
 * @proof
 * ```latex
 * \documentclass{article}
 * \usepackage{amsmath}
 * \usepackage{amssymb}
 *
 * \begin{document}
 *
 * \title{Proof of Parity Using Trigonometric and Gamma Functions}
 * \author{}
 * \date{}
 * \maketitle
 *
 * \section*{Introduction}
 * We aim to prove that a number \( n \) is even using a combination of the Gamma function and trigonometric functions. Specifically, we use the fact that \( \sin(k \pi) = 0 \) for any integer \( k \).
 *
 * \section*{Gamma Function}
 * The Gamma function \(\Gamma(n)\) is defined as:
 * \[
 * \Gamma(n) = \int_0^\infty t^{n-1} e^{-t} \, dt
 * \]
 * For positive integers, \(\Gamma(n)\) can be approximated using Stirling's approximation:
 * \[
 * \Gamma(x) \approx \sqrt{\frac{2\pi}{x}} \left( \frac{x}{e} \right)^x
 * \]
 * For our purposes, we will use this approximation for \( n+1 \):
 * \[
 * \Gamma(n+1) \approx \sqrt{\frac{2\pi}{n+1}} \left( \frac{n+1}{e} \right)^{n+1}
 * \]
 *
 * \section*{Trigonometric Function}
 * We apply the sine function to the result of the Gamma function scaled by \(\pi\):
 * \[
 * \sin(\Gamma(n+1) \pi)
 * \]
 *
 * \newpage
 *
 * \section*{Proof}
 * We know that for any integer \( k \):
 * \[
 * \sin(k \pi) = 0
 * \]
 * If \( n \) is even, then \(\Gamma(n+1)\) will be an integer, and thus:
 * \[
 * \sin(\Gamma(n+1) \pi) = 0
 * \]
 * Conversely, if \( n \) is odd, \(\Gamma(n+1)\) will not be an integer, leading to:
 * \[
 * \sin(\Gamma(n+1) \pi) \neq 0
 * \]
 *
 * \section*{Conclusion}
 * By evaluating the sine function applied to the scaled Gamma function, we can determine the evenness of \( n \):
 * \[
 * \text{if } \sin(\Gamma(n+1) \pi) = 0 \text{, then } n \text{ is even}
 * \]
 * \[
 * \text{if } \sin(\Gamma(n+1) \pi) \neq 0 \text{, then } n \text{ is odd}
 * \]
 *
 * Thus, we have shown that using the trigonometric properties of the sine function and the Gamma function, we can determine the evenness of a number \( n \).
 *
 * \end{document}
 * ```
 */
export function isEven(number: number): boolean {
  // compute the angle in radians
  const angle = number * Math.PI;

  // compute the cosine of the angle
  const cosine = Math.cos(angle);

  // check if cosine value is close to 1 (for even numbers)
  return Math.abs(cosine - 1) < EPSILON;
}
