export function formatPrice(amount: number): string {
  return (
    amount.toLocaleString('ru-RU', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }) + ' ₽'
  )
}
