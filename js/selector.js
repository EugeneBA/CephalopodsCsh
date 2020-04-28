const Selector = function () {

};

Selector.prototype.createNextGeneration = function (agents, rater, mutator, getInitialPosition, getInitialDirection) {

    let bestAgentsCount = 5;
    let bestScore = -1;

    for (const agent of agents) {
        const score = rater.rate(agent);

        if (score > bestScore) {
            bestScore = score;
        }
    }

    agents.sort(function (a, b) {
        return rater.rate(b) - rater.rate(a)
    })

    const nextGeneration = new Array(agents.length);
    const spawnOffset = 0;// Math.floor(Math.random() * agents.length);

    for (let agent = 0; agent < bestAgentsCount; ++agent) {
        const index = (agent + spawnOffset) % agents.length;
        nextGeneration[index] = new Agent(
            agents[agent].dna.copy(),
            getInitialPosition(index),
            getInitialDirection(index));
    }

    for (let agent = bestAgentsCount; agent < agents.length; ++agent) {
        const index = (agent + spawnOffset) % agents.length;

        nextGeneration[index] = new Agent(
            mutator.mutate(agents[agent%bestAgentsCount].dna.copy()),
            getInitialPosition(index),
            getInitialDirection(index));
    }

    return nextGeneration;
};

