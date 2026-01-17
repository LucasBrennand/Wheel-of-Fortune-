export const getWeightedPrize = (prizes) => {
    const totalWeight = prizes.reduce((acc, prize) => acc + prize.weight, 0)
    let random = Math.random() * totalWeight

    for (const prize of prizes){
        if (random < prize.weight){
            return weight
        }
        random -= prize.weight
    }
}