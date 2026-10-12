// Fills each channel card from its info.json (written by tools/make_flasher_site.py) and
// only then shows its flash button. A channel that has never been published stays without one.

const UNITS = ["B", "KB", "MB"];

function size(bytes) {
    let value = bytes;
    let unit = 0;
    while (value >= 1024 && unit < UNITS.length - 1) {
        value /= 1024;
        unit += 1;
    }
    return `${unit === 0 ? value : value.toFixed(1)} ${UNITS[unit]}`;
}

function fact(list, name, value) {
    if (!value) {
        return;
    }
    const dt = document.createElement("dt");
    dt.textContent = name;
    const dd = document.createElement("dd");
    dd.textContent = value;
    list.append(dt, dd);
}

function fileRow(table, file) {
    const row = table.insertRow();
    row.insertCell().textContent = file.name;
    row.insertCell().textContent = `0x${file.offset.toString(16)}`;
    row.insertCell().textContent = size(file.size);
    const hash = row.insertCell();
    hash.className = "hash";
    hash.textContent = file.sha256;
}

async function loadChannel(card) {
    const channel = card.dataset.channel;
    const status = card.querySelector(".status");
    let info;
    try {
        // no-cache: a build published a minute ago must not be hidden by an old info.json.
        const response = await fetch(`${channel}/info.json`, { cache: "no-cache" });
        if (response.status === 404) {
            status.textContent = "not published yet.";
            return;
        }
        if (!response.ok) {
            throw new Error(`http ${response.status}`);
        }
        info = await response.json();
    } catch (e) {
        status.textContent = `could not load this build (${e.message}). reload the page.`;
        status.classList.add("error");
        return;
    }

    const facts = card.querySelector(".facts");
    fact(facts, "version", info.version);
    fact(facts, "tag", info.tag);
    fact(facts, "commit", (info.commit || "").slice(0, 7));
    fact(facts, "built", (info.built || "").replace("T", " ").replace("Z", " UTC"));

    const table = card.querySelector(".files");
    for (const file of info.files || []) {
        fileRow(table, file);
    }
    card.querySelector("details").hidden = false;

    const button = card.querySelector("esp-web-install-button");
    // The built time keeps the browser from flashing a cached manifest of an older build.
    button.setAttribute("manifest", `${channel}/manifest.json?b=${encodeURIComponent(info.built)}`);
    button.hidden = false;
    status.hidden = true;
}

for (const card of document.querySelectorAll("[data-channel]")) {
    loadChannel(card);
}
