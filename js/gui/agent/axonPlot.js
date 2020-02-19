const AxonPlot = function(axon, neuronPlots, cellRadius) {
    this.axon = axon;
    this.from = this.findNeuronPlot(axon.from, neuronPlots);
    this.to = this.findNeuronPlot(axon.to, neuronPlots);
    const dx = this.to.x - this.from.x;
    const dy = this.to.y - this.from.y;
    const dl = Math.sqrt(dx * dx + dy * dy);
    const dxn = dx / dl;
    const dyn = dy / dl;

    this.xStart = this.from.x + dxn * cellRadius;
    this.yStart = this.from.y + dyn * cellRadius;
    this.xEnd = this.to.x - dxn * cellRadius;
    this.yEnd = this.to.y - dyn * cellRadius;
    this.dashOffset = 0;

    this.applyOffset(dyn, -dxn);
};

AxonPlot.LINE_COLOR = "white";
AxonPlot.LINE_WIDTH = 3;
AxonPlot.DASH_STRIDE = 14;
AxonPlot.DASH = [
    AxonPlot.DASH_STRIDE * .5,
    AxonPlot.DASH_STRIDE * .5];
AxonPlot.OUTPUT_THRESHOLD = .01;
AxonPlot.ACTIVITY_THRESHOLD = .01;

AxonPlot.prepareContext = function(context) {
    context.strokeStyle = AxonPlot.LINE_COLOR;
    context.lineWidth = AxonPlot.LINE_WIDTH;
    context.setLineDash(AxonPlot.DASH);
};

AxonPlot.prototype.applyOffset = function(dx, dy) {
    if (this.axon.weight < 0) {
        dx = -dx;
        dy = -dy;
    }

    this.xStart += dx * AxonPlot.LINE_WIDTH * .5;
    this.yStart += dy * AxonPlot.LINE_WIDTH * .5;
    this.xEnd += dx * AxonPlot.LINE_WIDTH * .5;
    this.yEnd += dy * AxonPlot.LINE_WIDTH * .5;
};

AxonPlot.prototype.findNeuronPlot = function(neuron, neuronPlots) {
    for (const plot of neuronPlots) if (neuron === plot.neuron)
        return plot;

    return null;
};

AxonPlot.prototype.update = function(f) {

};

AxonPlot.prototype.draw = function(context, f) {
    if (this.axon.from.output < AxonPlot.OUTPUT_THRESHOLD)
        return;

    const effect = Math.abs(this.axon.to.activation - this.axon.to.activationPrevious);
    const activity = effect * this.axon.from.output * (Math.abs(this.axon.weight) / Axon.WEIGHT_MAX);

    if (activity < AxonPlot.ACTIVITY_THRESHOLD)
        return;

    context.lineDashOffset = this.dashOffset;
    context.globalAlpha = Math.min(1, activity);
    context.beginPath();
    context.moveTo(this.xStart, this.yStart);
    context.lineTo(this.xEnd, this.yEnd);
    context.stroke();

    this.dashOffset -= activity * Math.sign(this.axon.weight);
};