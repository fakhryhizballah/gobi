function generateUniqueId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
async function sha256(text) {
    const buf = await crypto.subtle.digest(
        "SHA-256",
        new TextEncoder().encode(text)
    );
    return Array.from(new Uint8Array(buf))
        .map(b => b.toString(16).padStart(2, "0"))
        .join("");
}
async function trackVisitor(host, visitorId) {
    // fetch('https://count.spairum.my.id/api/track/unique', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify({ host, visitorId })
    // })

}
let getHostname = new URL(window.location);
console.log(getHostname.hostname);
console.log(getHostname.pathname);

async function getVisitorId() {
    const visitorIdKey = getHostname.hostname;
    let data = await sha256(visitorIdKey)
    console.log(data);
    let visitorId = localStorage.getItem(data);
    if (!visitorId) {
        visitorId = generateUniqueId();
        localStorage.setItem(data, visitorId);
    }
    return visitorId;
}
(getVisitorId());



// console.log(hashedVisitorId);