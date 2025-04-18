const CURRENCY_FORMATTER = new Intl.NumberFormat('en-US', {
  currency: 'USD',
  style: 'currency',
  minimumFractionDigits: 0,
})

export function formatCurrency(amount: string | number) {
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount

  // Convert from cents (integer) to dollars (float)
  const amountInDollars = numericAmount / 100

  return CURRENCY_FORMATTER.format(amountInDollars)
}
