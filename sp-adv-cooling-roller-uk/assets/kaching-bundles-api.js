Array.prototype.flat || (Array.prototype.flat = function(t = 1) {
  return t > 0 ? (
    // @ts-expect-error - Polyfill for older browsers
    this.reduce(
      (e, s) => e.concat(Array.isArray(s) ? s.flat(t - 1) : s),
      []
    )
  ) : (
    // @ts-expect-error - Polyfill for older browsers
    this.slice()
  );
});
Array.prototype.flatMap || (Array.prototype.flatMap = function(t, e) {
  return this.map(t, e).flat();
});
const Et = (t) => {
  const e = window.Shopify.currency;
  e && (t.currencyRate = Number(e.rate));
  const s = window.Shopify.country;
  s && (t.country = s);
  const n = window.Shopify.locale;
  n && (t.locale = n);
}, H = () => {
  try {
    const t = "kaching_local_storage_test";
    return localStorage.setItem(t, t), localStorage.removeItem(t), !0;
  } catch {
    return !1;
  }
}, b = H() ? window.localStorage : window.sessionStorage, k = () => new URLSearchParams(window.location.search).get("kaching");
let G;
const Gt = () => (G === void 0 && (G = k() === "off"), G);
let N;
const v = () => (N === void 0 && (N = k() === "debug"), N);
let A;
const _ = () => (A === void 0 && (A = k() === "dev"), A);
let O;
const W = () => (O === void 0 && (O = k() === "info"), O), Nt = async (t, e, s, n, o, a) => {
  try {
    const i = "kaching_visited_deal_blocks", u = b.getItem(i), l = u ? JSON.parse(u) : [];
    if (l.includes(e))
      return;
    l.push(e), b.setItem(i, JSON.stringify(l)), await fetch("https://bundles-stats.kachingappz.app/impressions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        shopDomain: t,
        dealBlockId: e,
        productId: s,
        abTestVariantId: n,
        dealBlockVersionId: o,
        sessionId: a
      }),
      keepalive: !0
    });
  } catch (i) {
    console.error(i);
  }
}, X = "https://storefront-events.kachingappz.app", Y = () => {
  if (v() || _())
    try {
      const t = localStorage.getItem("kaching_storefront_events_host");
      if (t) return t;
    } catch {
    }
  return X;
}, Z = 16e3, B = (t, e) => {
  const s = JSON.stringify(t), n = new Blob([s]).size;
  return n <= Z ? s : JSON.stringify(e(n));
}, T = async (t, e, s, { sampleRate: n = 1, keepalive: o = !0, once: a = !0 }) => {
  if (Math.random() > n)
    return;
  if (a) {
    if (e.sent.has(e.key))
      return;
    e.sent.add(e.key);
  }
  return await fetch(`${Y()}${t}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: B(s.full, s.truncated),
    keepalive: o
  });
}, tt = /* @__PURE__ */ new Set(), et = async (t, e = {}, s = {}) => {
  D("sendStorefrontEvent", { name: t, data: e });
  const n = window.location.href, o = window.Shopify.shop;
  return T(
    "/bundles/events",
    { key: t, sent: tt },
    {
      full: { event: { name: t, data: e, url: n, shop: o } },
      truncated: (a) => ({
        event: { name: t, data: { truncated: !0, size: a }, url: n, shop: o }
      })
    },
    s
  );
}, nt = /* @__PURE__ */ new Set(), At = async (t, e = {}, s = {}) => {
  D("sendStorefrontMetric", { name: t, data: e });
  const n = window.location.href, o = window.Shopify.shop;
  return T(
    "/bundles/metrics",
    { key: t, sent: nt },
    {
      full: { event: { name: t, data: e, url: n, shop: o } },
      truncated: (a) => ({
        event: { name: t, data: { truncated: !0, size: a }, url: n, shop: o }
      })
    },
    s
  );
}, st = /* @__PURE__ */ new Set(), z = async (t, e, s = {}) => {
  if (t === "Failed to fetch" || t && (t.includes(
    "Cannot define multiple custom elements with the same tag name"
  ) || t.includes(
    "Failed to execute 'define' on 'CustomElementRegistry'"
  ) || t.includes("CustomElementRegistry.define")))
    return;
  const n = window.location.href, o = window.Shopify.shop;
  return T(
    "/bundles/errors",
    { key: t, sent: st },
    {
      full: { error: { message: t, stack: e, url: n, shop: o } },
      truncated: (a) => ({
        error: { message: t, stack: `[truncated ${a} bytes]`, url: n, shop: o }
      })
    },
    { sampleRate: 0.1, ...s }
  );
}, Ot = (t) => t instanceof Error ? t.message : String(t), _t = () => {
  const t = ["kaching-bundles.js", "kaching-bundles-block.js"];
  window.addEventListener("error", async function(e) {
    const s = async (n) => {
      const { filename: o, message: a, error: i } = n;
      for (const u of t)
        if (o.includes(u)) {
          if (v() || K()) {
            D("Error", n);
            return;
          }
          await z(a, i.stack);
        }
    };
    try {
      await s(e);
    } catch (n) {
      console.error(n);
    }
  }), window.addEventListener("unhandledrejection", async function(e) {
    const s = async (n) => {
      if (typeof n.reason != "object")
        return;
      const { message: o, stack: a } = n.reason;
      if (a) {
        for (const i of t)
          if (a.includes(i)) {
            if (v() || K()) {
              D("Unhandled rejection", n);
              return;
            }
            await z(o, a);
          }
      }
    };
    try {
      await s(e);
    } catch (n) {
      console.error(n);
    }
  });
};
function D(t, e = null) {
  !v() && !_() || console.debug("[Kaching Bundles]", t, e);
}
function Tt(t, e = null) {
  !W() && !v() && !_() || console.info("[Kaching Bundles]", t, e);
}
const jt = () => {
  const t = (n) => {
    window.dispatchEvent(new Event(n));
  }, e = history.pushState;
  history.pushState = function(...o) {
    const a = e.apply(this, o);
    return t("pushstate"), t("locationchange"), a;
  };
  const s = history.replaceState;
  history.replaceState = function(...o) {
    const a = s.apply(this, o);
    return t("replacestate"), t("locationchange"), a;
  }, ot(window, "popstate", () => {
    t("locationchange");
  });
}, qt = (t, e, s, n = 0) => {
  let o = Object.getPrototypeOf(t), a;
  for (; o && (a = Object.getOwnPropertyDescriptor(o, e), !a); )
    o = Object.getPrototypeOf(o);
  if (a) {
    if (!a.configurable)
      return;
    Object.defineProperty(t, e, {
      configurable: !0,
      get: function(...i) {
        return a.get.apply(this, i);
      },
      set: function(...i) {
        const u = this[e];
        a.set.apply(this, i);
        const l = this[e];
        return typeof s == "function" && setTimeout(s.bind(this, u, l), n), l;
      }
    });
  }
}, rt = (t, e = document) => {
  try {
    return e.querySelector(t);
  } catch {
    return null;
  }
}, Pt = (t, e = document) => {
  try {
    return [...e.querySelectorAll(t)];
  } catch {
    return [];
  }
}, ot = (t, e, s) => t.addEventListener(e, s), Vt = (t) => document.createElement(t), Mt = (t, e) => t && t.classList.add(e), xt = (t, e, s) => t.setAttribute(e, s), Ft = (t) => Number(t.split("/").pop()), Ut = (t) => t.dataset, Ct = (t) => {
  const e = rt(t);
  if (!e)
    return;
  const s = JSON.parse(e.textContent);
  return D("jsonFromElement", s), s;
}, at = (t, e) => {
  let s = 0, n = t;
  for (; n && n !== e && n !== document.body; )
    s++, n = n.parentNode;
  return n !== e ? 1 / 0 : s;
}, it = (t, e) => {
  if (t === e)
    return t;
  const s = /* @__PURE__ */ new Set();
  let n = t;
  for (; n; )
    s.add(n), n = n.parentElement;
  for (n = e; n; ) {
    if (s.has(n))
      return n;
    n = n.parentElement;
  }
  return document.documentElement;
}, zt = (t, e, s = 1 / 0) => {
  let n = null, o = 1 / 0;
  for (const a of e) {
    const i = it(t, a);
    if (i === document.body || i === document.documentElement)
      continue;
    const u = at(t, i);
    u > s || u < o && (n = a, o = u);
  }
  return n;
}, K = () => {
  const t = document.currentScript;
  return t ? t.src.includes("kaching-bundles-dev") : !1;
}, L = (t, e = {}) => {
  const s = window.Shopify.routes, o = (s && s.root || "/") + t, a = new URLSearchParams();
  for (const [u, l] of Object.entries(e))
    a.append(u, l);
  const i = a.toString();
  return i ? `${o}?${i}` : o;
}, Kt = (t, e) => {
  new MutationObserver((n, o) => {
    for (const a of n)
      a.type === "childList" && a.removedNodes.forEach((i) => {
        i.contains(t) && (o.disconnect(), e());
      });
  }).observe(document.body, { childList: !0, subtree: !0 });
}, Lt = (t, e = 300, s = 100) => {
  let n = 0;
  const o = () => {
    window.Shopify.analytics ? t() : n < e ? (n++, setTimeout(o, s)) : et(
      "shopify_analytics_missing",
      {
        userAgent: navigator.userAgent
      },
      { sampleRate: 0.1 }
    );
  };
  o();
}, ct = async (t, {
  useExternalMetafieldNamespace: e,
  useMetaobjects: s
}) => s ? lt(
  t
) : ut(t), ut = async (t, e) => {
  var n;
  const s = (n = (await t.query(
    `
      query FetchDealBlocks($metafieldNamespace: String!) {
        shop {
          metafield(namespace: $metafieldNamespace, key: "deal_blocks") {
            value
          }
        }
      }
    `,
    {
      variables: {
        metafieldNamespace: "$app:kaching_bundles"
      }
    }
  )).shop.metafield) == null ? void 0 : n.value;
  return s ? JSON.parse(s) : [];
}, lt = async (t, e) => {
  const s = "$app:deal_block", n = [];
  let o = null;
  for (; ; ) {
    const a = await t.query(
      `
        query FetchDealBlockMetaobjects($type: String!, $cursor: String) {
          metaobjects(type: $type, first: 250, after: $cursor) {
            nodes {
              fields {
                key
                value
              }
            }
            pageInfo {
              hasNextPage
              endCursor
            }
          }
        }
      `,
      {
        variables: {
          type: s,
          cursor: o
        }
      }
    );
    for (const i of a.metaobjects.nodes) {
      const u = i.fields.find(
        (l) => l.key === "settings"
      );
      u != null && u.value && n.push(JSON.parse(u.value));
    }
    if (!a.metaobjects.pageInfo.hasNextPage)
      break;
    o = a.metaobjects.pageInfo.endCursor;
  }
  return n;
};
class dt {
  constructor(e, s) {
    this.storefrontApiVersion = "2026-01", this.storefrontAccessToken = s, this.shopifyDomain = e;
  }
  async query(e, s) {
    var u, l;
    const n = (u = s == null ? void 0 : s.variables) != null ? u : {};
    let o = `https://${this.shopifyDomain}/api/${this.storefrontApiVersion}/graphql.json`;
    const a = (l = e.match(/query\s+(\w+)/)) == null ? void 0 : l[1];
    a && (o += `?operation_name=${a}`);
    const i = await (await fetch(o, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": this.storefrontAccessToken
      },
      body: JSON.stringify({
        query: e,
        variables: n
      })
    })).text();
    if (!i)
      throw new Error("Empty graphql response");
    return JSON.parse(i).data;
  }
}
var h = /* @__PURE__ */ ((t) => (t.QuantityBreak = "quantity-break", t.Bxgy = "bxgy", t.Bundle = "bundle", t.MixAndMatch = "mix-and-match", t.Sku = "sku", t))(h || {});
class $ extends Error {
  constructor(e) {
    super(e), this.name = "CartFetchError";
  }
}
const j = "kaching_session_id", $t = async () => {
  try {
    ft();
    const t = R();
    await mt() !== t && await gt(t);
  } catch (t) {
    if (t instanceof $)
      console.error(t);
    else
      throw t;
  }
}, ft = () => {
  const t = new URL(window.location.href), e = new URLSearchParams(t.search), s = e.get("preview_kaching_session_id");
  s && (b.setItem(j, s), e.delete("preview_kaching_session_id"), t.search = e.toString(), window.history.replaceState({}, "", t.toString()));
}, R = () => b.getItem(j) || pt(), pt = () => {
  const t = ht();
  return b.setItem(j, t), t;
}, ht = () => typeof crypto != "undefined" && typeof crypto.randomUUID == "function" ? crypto.randomUUID() : yt(), yt = () => "10000000-1000-4000-8000-100000000000".replace(
  /[018]/g,
  (t) => (+t ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +t / 4).toString(16)
), mt = async () => {
  const t = await fetch(L("cart.js"));
  if (!t.ok)
    throw new $("Failed to fetch cart");
  return (await t.json()).attributes._kaching_session_id;
}, gt = async (t) => await fetch(L("cart/update.js"), {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    attributes: {
      _kaching_session_id: t
    }
  })
}), It = ({
  kachingSessionId: t,
  abTestVariantsCount: e,
  abTestTrafficAllocation: s
}) => {
  const n = parseInt(t.replace(/-/g, "").slice(0, 4), 16) % 256, o = Math.floor(n * 100 / 256);
  if (!s)
    return St(o, e);
  const a = 100 - s;
  if (o < a)
    return 1;
  const i = e - 1;
  if (i === 0)
    return 1;
  const u = s / i, l = Math.floor(
    (o - a) / u
  );
  return Math.min(l + 2, e);
}, St = (t, e) => {
  const s = 100 / e, n = Math.floor(t / s);
  return Math.min(n + 1, e);
};
let y, S = null, J, Q = [];
const Rt = (t) => {
  Q = t;
}, wt = async () => {
  if (S)
    return S;
  S = (async () => {
    if (!y.storefrontAccessToken)
      return;
    const t = new dt(
      y.shopifyDomain,
      y.storefrontAccessToken
    );
    J = await ct(t, {
      useExternalMetafieldNamespace: !1,
      useMetaobjects: y.featureFlags.storefront_metaobjects
    });
  })();
  try {
    await S;
  } catch (t) {
    throw S = null, t;
  }
}, bt = async () => {
  var s;
  await wt();
  const t = J.filter((n) => {
    if (!n.abTestVariantId)
      return !0;
    const o = R(), a = It({
      kachingSessionId: o,
      abTestVariantsCount: n.abTestVariantsCount,
      abTestTrafficAllocation: n.abTestTrafficAllocation
    });
    return n.abTestVariantNumber === a;
  }), e = (s = Q.find(
    (n) => n.locale === y.locale
  )) == null ? void 0 : s.translations;
  return t.map((n) => {
    const o = (e == null ? void 0 : e.dealBlocks[n.id]) || {};
    return vt(n, o);
  });
}, vt = (t, e) => {
  var q, P, V, M, x, F;
  const s = (r) => {
    switch (r.dealBarType) {
      case void 0:
      case h.QuantityBreak:
        return n(r);
      case h.Bxgy:
        return o(r);
      case h.Bundle:
        return a(r);
      case h.Sku:
        return i(r);
      default:
        return null;
    }
  }, n = (r) => ({
    id: r.id,
    title: e[r.title] || r.title,
    mediaImageGID: r.mediaImageGID,
    freeGifts: [
      ...l(r.freeGifts),
      ...m(r.id, t.progressiveGifts)
    ],
    upsells: g(r.upsells),
    dealBarType: h.QuantityBreak,
    quantity: Number(r.quantity),
    discount: w(r.discountType, r.discountValue)
  }), o = (r) => ({
    id: r.id,
    title: e[r.title] || r.title,
    mediaImageGID: r.mediaImageGID,
    freeGifts: [
      ...l(r.freeGifts),
      ...m(r.id, t.progressiveGifts)
    ],
    upsells: g(r.upsells),
    dealBarType: h.Bxgy,
    buyQuantity: Number(r.buyQuantity),
    buyDiscount: w(
      r.buyDiscountType,
      r.buyDiscountValue
    ),
    getQuantity: Number(r.getQuantity),
    getDiscount: w(
      r.getDiscountType,
      r.getDiscountValue
    )
  }), a = (r) => ({
    id: r.id,
    title: e[r.title] || r.title,
    mediaImageGID: r.mediaImageGID,
    freeGifts: [
      ...l(r.freeGifts),
      ...m(r.id, t.progressiveGifts)
    ],
    upsells: g(r.upsells),
    dealBarType: h.Bundle,
    bundleProducts: u(r.bundleProducts)
  }), i = (r) => ({
    id: r.id,
    title: e[r.title] || r.title,
    mediaImageGID: r.mediaImageGID,
    freeGifts: [
      ...l(r.freeGifts),
      ...m(r.id, t.progressiveGifts)
    ],
    upsells: g(r.upsells),
    dealBarType: h.Sku,
    variantIds: r.variantGID ? [p(r.variantGID)] : null
  }), u = (r) => r.map((c) => {
    var d;
    return {
      id: c.id,
      productId: c.productGID === "default" ? "default" : p(c.productGID),
      variantId: c.variantGIDs && ((d = c.variantGIDs) != null && d[0]) ? p(c.variantGIDs[0]) : null,
      variantIds: c.variantGIDs ? c.variantGIDs.map(p) : null,
      quantity: Number(c.quantity),
      discount: w(
        c.discountType,
        c.discountValue
      )
    };
  }), l = (r) => r ? r.filter((d) => d.productGID).map((d) => {
    var E, f, I;
    return {
      id: d.id,
      productId: p(d.productGID),
      variantId: d.variantGIDs && ((E = d.variantGIDs) != null && E[0]) ? p(d.variantGIDs[0]) : null,
      variantIds: d.variantGIDs ? d.variantGIDs.map(p) : null,
      mediaImageGID: (f = d.mediaImageGID) != null ? f : null,
      quantity: Number(d.quantity),
      applyOnlyForSubscriptions: (I = d.applyOnlyForSubscriptions) != null ? I : !1
    };
  }) : [], m = (r, c) => {
    if (!c)
      return [];
    const d = t.dealBars.findIndex((f) => f.id === r) + 1;
    return c.gifts.filter(
      (f) => f.giftType === "product" && f.productGID && Dt(f, d)
    ).map((f) => {
      var I, U, C;
      return {
        id: f.id,
        productId: p(f.productGID),
        variantId: f.variantGIDs && ((I = f.variantGIDs) != null && I[0]) ? p(f.variantGIDs[0]) : null,
        variantIds: f.variantGIDs ? f.variantGIDs.map(p) : null,
        mediaImageGID: (U = f.mediaImageGID) != null ? U : null,
        quantity: Number(f.quantity),
        applyOnlyForSubscriptions: (C = f.applyOnlyForSubscriptions) != null ? C : !1
      };
    });
  }, g = (r) => r ? r.map((c) => {
    var d;
    return {
      id: c.id,
      productId: c.productGID ? p(c.productGID) : null,
      variantId: c.variantGIDs && c.variantGIDs[0] ? p(c.variantGIDs[0]) : null,
      variantIds: c.variantGIDs ? c.variantGIDs.map(p) : null,
      mediaImageGID: (d = c.mediaImageGID) != null ? d : null,
      quantity: Number(c.quantity),
      discount: w(c.discountType, c.discountValue)
    };
  }) : [];
  return {
    id: t.id,
    nanoId: t.nanoId,
    discountName: (q = t.discountName) != null ? q : null,
    collectionBreaksEnabled: (P = t.collectionBreaksEnabled) != null ? P : !1,
    collectionBreaksDealProducts: !!t.collectionBreaksEnabled && ((V = t.collectionBreaks) == null ? void 0 : V.visibility) === "deal-products",
    differentVariantsEnabled: t.differentVariantsEnabled,
    marketId: (M = t.marketId) != null ? M : null,
    excludedMarketIds: (x = t.excludedMarketIds) != null ? x : null,
    currency: (F = t.currency) != null ? F : null,
    dealBars: t.dealBars.filter((r) => "showAsSoldOutEnabled" in r ? !r.showAsSoldOutEnabled : !0).map(s).filter((r) => r !== null)
  };
}, Dt = (t, e) => t.unlockAtBarOnly ? e === t.unlockAtBar : e >= t.unlockAtBar, w = (t, e) => !t || t === "default" ? null : {
  type: t,
  value: Number(e)
}, p = (t) => Number(t.split("/").pop()), Jt = (t) => (y = t, {
  fetchDeals: bt
});
export {
  ct as A,
  It as B,
  Rt as C,
  Mt as D,
  Gt as E,
  _t as F,
  Et as G,
  Jt as H,
  wt as I,
  At as J,
  L as a,
  Ft as b,
  ot as c,
  D as d,
  Ot as e,
  xt as f,
  R as g,
  dt as h,
  Tt as i,
  jt as j,
  Pt as k,
  z as l,
  Vt as m,
  h as n,
  qt as o,
  zt as p,
  rt as q,
  Kt as r,
  et as s,
  v as t,
  _ as u,
  $t as v,
  Lt as w,
  Ct as x,
  Ut as y,
  Nt as z
};
