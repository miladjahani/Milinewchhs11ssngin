/**
 * MILICONFIG - Cloudflare Worker Clean IP Reverse Proxy Relay
 * 
 * این ورکر به صورت رایگان روی کلودفلر قرار می‌گیرد و ترافیک فیلترشده در ایران را
 * از طریق آی‌پی‌های تمیز کلودفلر (Clean IPs) به سرور ریلوِی شما هدایت می‌کند.
 * 
 * راهنما:
 * ۱. در داشبورد Cloudflare یک Worker جدید بسازید.
 * ۲. این کد را درون آن کپی کرده و مقدار BACKEND_DOMAIN را با آدرس ریلوِی خود تغییر دهید.
 * ۳. در کلاینت (v2rayNG/Clash)، آدرس را یک آی‌پی تمیز کلودفلر و SNI/Host را آدرس ورکر بگذارید.
 */

const BACKEND_DOMAIN = "milinewc2-production.up.railway.app";

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const targetDomain = env.BACKEND_DOMAIN || BACKEND_DOMAIN;
    url.hostname = targetDomain;

    const upgradeHeader = request.headers.get("Upgrade");
    if (upgradeHeader && upgradeHeader.toLowerCase() === "websocket") {
      const proxyReq = new Request(url.toString(), {
        method: request.method,
        headers: request.headers,
        body: request.body,
        redirect: "manual"
      });
      return fetch(proxyReq);
    }

    const proxyReq = new Request(url.toString(), request);
    return fetch(proxyReq);
  }
};
