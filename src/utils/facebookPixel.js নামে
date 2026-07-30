const PIXEL_ID = "1752243212464508";

let initialized = false;

export function initFacebookPixel() {
  if (typeof window === "undefined") return;

  if (initialized) return;

  if (window.fbq) {
    initialized = true;
    return;
  }

  (function (f, b, e, v, n, t, s) {
    if (f.fbq) return;

    n = f.fbq = function () {
      if (n.callMethod) {
        n.callMethod.apply(n, arguments);
      } else {
        n.queue.push(arguments);
      }
    };

    if (!f._fbq) f._fbq = n;

    n.push = n;
    n.loaded = true;
    n.version = "2.0";
    n.queue = [];

    t = b.createElement(e);
    t.async = true;
    t.src = v;

    s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s);
  })(
    window,
    document,
    "script",
    "https://connect.facebook.net/en_US/fbevents.js"
  );

  window.fbq("init", PIXEL_ID);

  initialized = true;
}

export function trackPageView() {
  if (typeof window === "undefined") return;

  if (!window.fbq) return;

  window.fbq("track", "PageView");
}

export function trackViewContent(product) {
  if (!window.fbq || !product) return;

  window.fbq("track", "ViewContent", {
    content_ids: [product.id],
    content_name: product.name,
    content_type: "product",
    value:
      Number(product.offerPrice || product.price || 0),
    currency: "BDT",
  });
}

export function trackAddToCart(product) {
  if (!window.fbq || !product) return;

  window.fbq("track", "AddToCart", {
    content_ids: [product.id],
    content_name: product.name,
    content_type: "product",
    value:
      Number(product.offerPrice || product.price || 0),
    currency: "BDT",
  });
}

export function trackInitiateCheckout(total, items = []) {
  if (!window.fbq) return;

  window.fbq("track", "InitiateCheckout", {
    value: Number(total || 0),
    currency: "BDT",
    num_items: items.length,
    content_ids: items.map((item) => item.id),
    content_type: "product",
  });
}

export function trackPurchase(order) {
  if (!window.fbq || !order) return;

  window.fbq("track", "Purchase", {
    value: Number(order.total || 0),
    currency: "BDT",
    content_ids: (order.items || []).map(
      (item) => item.id
    ),
    num_items: (order.items || []).length,
    content_type: "product",
  });
}
