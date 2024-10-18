const url = "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json";

const width = 1000;
const height = 600;
const tooltip = d3.select("#tooltip");

const svg = d3.select("#tree-map")
    .attr("width", width)
    .attr("height", height);

const color = d3.scaleOrdinal(d3.schemeCategory10);

d3.json(url).then(data => {
    const root = d3.hierarchy(data)
        .eachBefore(d => d.data.id = (d.parent ? d.parent.data.id + "." : "") + d.data.name)
        .sum(d => d.value)
        .sort((a, b) => b.value - a.value);

    d3.treemap()
        .size([width, height])
        .paddingInner(1)(root);

    const cell = svg.selectAll("g")
        .data(root.leaves())
        .enter().append("g")
        .attr("transform", d => `translate(${d.x0},${d.y0})`);

    cell.append("rect")
        .attr("class", "tile")
        .attr("id", d => d.data.id)
        .attr("width", d => d.x1 - d.x0)
        .attr("height", d => d.y1 - d.y0)
        .attr("data-name", d => d.data.name)
        .attr("data-category", d => d.data.category)
        .attr("data-value", d => d.data.value)
        .attr("fill", d => color(d.data.category))
        .on("mouseover", (event, d) => {
            tooltip.style("display", "block")
                .style("opacity", 1)
                .html(`Name: ${d.data.name}<br>Category: ${d.data.category}<br>Value: ${d.data.value}`)
                .attr("data-value", d.data.value)
                .style("left", `${event.pageX + 10}px`)
                .style("top", `${event.pageY - 20}px`);
        })
        .on("mouseout", () => tooltip.style("display", "none"));

    cell.append("text")
        .attr("class", "tile-text")
        .selectAll("tspan")
        .data(d => d.data.name.split(/(?=[A-Z][^A-Z])/g))
        .enter().append("tspan")
        .attr("x", 4)
        .attr("y", (d, i) => 13 + i * 10)
        .text(d => d);

    const legend = d3.select("#legend");

    const categories = root.leaves().map(nodes => nodes.data.category)
        .filter((category, index, self) => self.indexOf(category) === index);

    const legendItems = legend.selectAll(".legend-item")
        .data(categories)
        .enter().append("div")
        .attr("class", "legend-item");

    legendItems.append("span")
        .style("background-color", d => color(d))
        .style("display", "inline-block")
        .style("width", "20px")
        .style("height", "20px")
        .style("margin-right", "5px");

    legendItems.append("span")
        .text(d => d);
});
