export function calculateMonsterPrice(monsterCount: number): number {
  // 1er monstre : gratuit
  if (monsterCount === 0) return 0

  // 2ème monstre : 10 coins
  if (monsterCount === 1) return 10

  // 3ème monstre : 20 coins
  if (monsterCount === 2) return 20

  // 4ème monstre : 100 coins
  if (monsterCount === 3) return 100

  // 5ème monstre et plus : +100 coins à chaque fois (200, 300, 400, etc.)
  return (monsterCount - 3) * 100 + 100
}

export function getMonsterPriceLabel(monsterCount: number): string {
  const price = calculateMonsterPrice(monsterCount)

  if (price === 0) {
    return "Gratuit"
  }

  return `${price} pièces`
}
