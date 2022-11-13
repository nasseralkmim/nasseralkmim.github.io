const tocId = "toc";
const tocNavId = "TableOfContents";
const actualContentClass = "articleBody";
let currentActiveLinkId = null;
let elemsToHide = [];
let linksById = {};

let headerObserver = null;

function observeHeadings() {
    // get all links inside selector with toc ID
    const links = document.querySelectorAll(`#${tocId} a`);
    // get all ids
    const headings = document.querySelectorAll(`.${actualContentClass} h1,h2,h3,h4`);

    // use header name (id) as key for the links
    for (const link of links) {
        linksById[link.getAttribute("href")] = link;
    }

    // get the lists in the toc entries
    for (const elem of document.querySelectorAll(`#${tocId} ul`)) {
        // only hide the subheadings, if parent is tocID, its the main heading...
        if (elem.parentElement.id !== tocNavId) {
            elemsToHide.push(elem);
        }
    }

    headerObserver = new IntersectionObserver(
        // list of changes that intersect/not
        (entries) => {
            for (const entry of entries) {
                // get current heading on the screen
                if (entry.isIntersecting && linksById[`#${entry.target.id}`]) {
                    currentActiveLinkId = `#${entry.target.id}`;
                    break;
                }
            }
            // make only the current heading "active"
            if (currentActiveLinkId) {
                for (const link of links) {
                    link.classList.remove("active");
                }
                linksById[currentActiveLinkId].classList.add("active");
                // console.log(linksById[currentActiveLinkId]);
                hideHeadings();
            }
        },
        {
            // 10% of element must be visible
            threshold: 0.1,
            root: document.querySelector(`.${actualContentClass}`),
        }
    );

    // observe headings one at a time
    // run the intersect object function
    for (const heading of headings) {
        headerObserver.observe(heading);
    }

    console.log(currentActiveLinkId);
    hideHeadings();
}

function hideHeadings() {
    for (const elem of elemsToHide) {
        elem.classList.add("hidden");
    }
    if (!currentActiveLinkId) {
        return;
    }
    for (
        // loop over links
        let elem = linksById[currentActiveLinkId]; // initialization
        // if link is main heading, keep it active
        (elem = elem.parentElement); // condition
        // it should be different than tocid...
        elem.id !== tocId            // final expression, evaluated at end of each loop
    ) {
        elem.classList.remove("hidden");
    }
    for (const elem of linksById[currentActiveLinkId].parentElement.children) {
        console.log(linksById[currentActiveLinkId].parentElement);
        console.log(elem);
        elem.classList.remove("hidden");
    }
}

function showHeadings() {
    for (const elem of elemsToHide) {
        elem.classList.remove("hidden");
    }
}

function setUpObserver() {
    if (document.documentElement.clientWidth >= (750 + 350 + 25)) {
        if (headerObserver === null) {
            observeHeadings();
        }
    } else {
        if (headerObserver !== null) {
            headerObserver.disconnect();
            headerObserver = null;
            showHeadings();
        }
    }
}

window.addEventListener("load", (event) => {
    if ("IntersectionObserver" in window) {
        setUpObserver();
        window.addEventListener("resize", setUpObserver);
    }
});

window.addEventListener("unload", (event) => {
    headerObserver.disconnect();
});
