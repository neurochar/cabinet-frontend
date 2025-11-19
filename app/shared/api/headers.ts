export function GetDefaultHeaders() {
    const headers = new Headers({
        'X-Check': 'true',
    });

    try {
        const event = useRequestEvent();
        if (event) {
            const cfIP = getRequestHeader(event, 'cf-connecting-ip');
            const xff = getRequestHeader(event, 'x-forwarded-for');
            const socketIP = event?.node.req.socket.remoteAddress || '';
            const clientIP = cfIP?.trim() || xff?.split(',')[0]?.trim() || socketIP;

            headers.set('X-Real-IP', clientIP || '');
            headers.set('X-Forwarded-For', clientIP || '');

            headers.set('X-Forwarded-Proto', getRequestProtocol(event) || 'http');
            headers.set('X-Forwarded-Host', getRequestHeader(event, 'host') || '');
        }

        let currentURL = '';

        if (import.meta.client) {
            currentURL = window.location.href;
        } else if (event) {
            const proto = getRequestProtocol(event) || 'http';
            const host = getRequestHeader(event, 'host') || '';
            const path = event.node.req.url || '/';
            currentURL = `${proto}://${host}${path}`;
        }

        if (currentURL) {
            const safeURL = currentURL.slice(0, 2048);
            headers.set('X-Referer', safeURL);
        }
    } catch (e) {
        console.log(e);
    }

    return headers;
}
