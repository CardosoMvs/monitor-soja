// Espelho do script inline de index.html (raiz) — regenerado por extração.
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var fmt = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 0 });

  /* cores OFICIAIS da Coleção 11 do MapBiomas (legenda publicada em 13/08/2026) */
  var CORES = {
    3: "#1f8d49", 4: "#7dc975", 5: "#04381d", 6: "#007785", 7: "#228c70", 9: "#7a5900",
    11: "#517979", 12: "#d6bc74", 15: "#ede8e3", 20: "#db7093", 21: "#fffec3",
    23: "#ffa07a", 24: "#49271e", 25: "#db4d4f", 29: "#ad5100", 30: "#9c0027",
    31: "#091077", 32: "#fc8114", 33: "#2532e4", 35: "#9065d0", 40: "#c71585",
    41: "#f54ca9", 46: "#d68fe2", 47: "#9932cc", 48: "#e6ccff", 49: "#02d659",
    50: "#ffaa5f", 62: "#ff69b4", 75: "#757272", 84: "#81dbbf", 91: "#403d3e",
    39: "#f5b3c8"
  };
  var PALETA = ["#2e7d5b", "#d9c87c", "#9aa5a0", "#dcc06a", "#6f8fb5", "#a8c48a", "#c06058", "#e2b93b", "#5fb37a", "#b58fb5"];
  function corCls(id) {
    if (CORES[id] != null) return CORES[id];
    var s = String(CLS[id] || "");
    var h = 0;
    for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
    return PALETA[h % PALETA.length];
  }
  /* interpolação hex para rampas do mapa */
  function hex2rgb(h) { return [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)]; }
  function mix(a, b, t) {
    var c1 = hex2rgb(a), c2 = hex2rgb(b);
    return "rgb(" + Math.round(c1[0] + (c2[0] - c1[0]) * t) + "," + Math.round(c1[1] + (c2[1] - c1[1]) * t) + "," + Math.round(c1[2] + (c2[2] - c1[2]) * t) + ")";
  }
  function mixHex(a, b, t) {
    var c1 = hex2rgb(a), c2 = hex2rgb(b);
    function hx(x) { var s = Math.round(Math.max(0, Math.min(255, x))).toString(16); return s.length < 2 ? "0" + s : s; }
    return "#" + hx(c1[0] + (c2[0] - c1[0]) * t) + hx(c1[1] + (c2[1] - c1[1]) * t) + hx(c1[2] + (c2[2] - c1[2]) * t);
  }
  var RAMPA = { virou: ["#edf1e6", "#184b39"], deixou: ["#f2e9db", "#8a4a12"], perm: ["#edf1eb", "#414f47"], sojad: ["#e8efeb", "#0e6a56"] };
  var SALDO_POS = "#2e7d5b", SALDO_NEG = "#b06010", SALDO_MEIO = "#eff1ea", SALDO_NEG_CLARO = "#f2ece2";

  function ha(v) { return fmt.format(Math.round(v || 0)) + " ha"; }
  function resumo(v) {
    v = v || 0;
    var neg = v < 0; v = Math.abs(v);
    var s;
    if (v >= 1e6) s = (v / 1e6).toFixed(2).replace(".", ",") + " M ha";
    else if (v >= 1e4) s = fmt.format(Math.round(v / 1e3)) + " mil ha";
    else if (v >= 1e3) s = (v / 1e3).toFixed(1).replace(".", ",") + " mil ha";
    else s = fmt.format(Math.round(v)) + " ha";
    return neg ? "−" + s : s;
  }
  function pct(v, t) { return t > 0 ? (100 * v / t).toFixed(1).replace(".", ",") + "%" : "0%"; }
  function corSaldo(v, maxAbs) {
    if (!maxAbs) return SALDO_MEIO;
    var t = Math.pow(Math.min(Math.abs(v) / maxAbs, 1), 0.45);
    return v >= 0 ? mix(SALDO_MEIO, SALDO_POS, t) : mix(SALDO_NEG_CLARO, SALDO_NEG, t);
  }

  /* ---- dados ---- */
  var ANOS = DADOS.anos;
  var UFS = DADOS.ufs;
  var CLS = {};
  DADOS.classes.forEach(function (p) { CLS[p[0]] = p[1]; });

  var IDX = DADOS.t.map(function (grupos) {
    var m = {};
    grupos.forEach(function (g) {
      var k = g[0] + "-" + g[1];
      var rec = m[k] || (m[k] = { v: 0, d: 0, p: 0, dv: null, dd: null });
      var s = 0;
      g[3].forEach(function (c) { s += c[1]; });
      if (g[2] === 0) { rec.v = s; rec.dv = g[3]; }
      else if (g[2] === 1) { rec.d = s; rec.dd = g[3]; }
      else { rec.p = s; }
    });
    return m;
  });
  var SEM_DADOS = [];
  UFS.forEach(function (u, i) {
    var tem = false;
    for (var k in IDX[i]) { tem = true; break; }
    if (!tem) SEM_DADOS.push(u[1]);
  });

  function ufPair(i, o, dd) { return IDX[i][o + "-" + dd] || { v: 0, d: 0, p: 0, dv: null, dd: null }; }

  function agrega(o, dd) {
    var k = o + "-" + dd;
    var r = { v: 0, d: 0, p: 0, dv: {}, dd: {}, n: 0 };
    IDX.forEach(function (m) {
      var rec = m[k];
      if (!rec) return;
      r.v += rec.v; r.d += rec.d; r.p += rec.p;
      if (rec.v || rec.d || rec.p) r.n++;
      if (rec.dv) rec.dv.forEach(function (c) { r.dv[c[0]] = (r.dv[c[0]] || 0) + c[1]; });
      if (rec.dd) rec.dd.forEach(function (c) { r.dd[c[0]] = (r.dd[c[0]] || 0) + c[1]; });
    });
    return r;
  }

  function classesDe(src) {
    var arr = Array.isArray(src)
      ? src.map(function (c) { return { id: c[0], area: c[1] }; })
      : Object.keys(src).map(function (k) { return { id: +k, area: src[k] }; });
    return arr.sort(function (a, b) { return b.area - a.area; });
  }

  /* siglas (minúsculas, como os ids do SVG do mapa) */
  var CODE2SIGLA = {
    Acre: "ac", Alagoas: "al", Amapa: "ap", Amazonas: "am", Bahia: "ba", Ceara: "ce",
    Distrito_Federal: "df", Espirito_Santo: "es", Goias: "go", Maranhao: "ma",
    Mato_Grosso: "mt", Mato_Grosso_Do_Sul: "ms", Minas_Gerais: "mg", Para: "pa",
    Paraiba: "pb", Parana: "pr", Pernambuco: "pe", Piaui: "pi", Rio_De_Janeiro: "rj",
    Rio_Grande_Do_Norte: "rn", Rio_Grande_Do_Sul: "rs", Rondonia: "ro", Roraima: "rr",
    Santa_Catarina: "sc", Sao_Paulo: "sp", Sergipe: "se", Tocantins: "to"
  };
  var SIGLA2IDX = {};
  UFS.forEach(function (u, i) { SIGLA2IDX[CODE2SIGLA[u[0]]] = i; });

  /* ---- console ---- */
  var selO = $("ano-origem"), selD = $("ano-destino"), selUF = $("escopo");
  var O0 = 2018, D0 = 2024;

  ANOS.slice(0, -1).forEach(function (a) {
    var o = document.createElement("option");
    o.value = a; o.textContent = a;
    selO.appendChild(o);
  });
  function opcoesDestino() {
    var o = +selO.value;
    selD.innerHTML = "";
    ANOS.forEach(function (a) {
      if (a <= o) return;
      var op = document.createElement("option");
      op.value = a; op.textContent = a;
      selD.appendChild(op);
    });
    if (+selD.value > o || !selD.options.length) selD.value = ANOS[ANOS.length - 1];
  }
  opcoesDestino();
  selO.value = String(O0); selD.value = String(D0);

  var brOpt = document.createElement("option");
  brOpt.value = "-1";
  brOpt.textContent = "Brasil (todas as UFs)";
  selUF.appendChild(brOpt);
  UFS.forEach(function (u, i) {
    var o = document.createElement("option");
    o.value = String(i);
    o.textContent = u[1];
    selUF.appendChild(o);
  });

  /* ---- estado da seleção de estado(s) ---- */
  var MODO = "um";       // "um" | "comparar"
  var MAX_CMP = 5;
  var SELS = [];         // índices de UF em modo comparar (ordem de marcação)

  function setModo(m) {
    MODO = m;
    $("mode-um").className = m === "um" ? "on" : "";
    $("mode-cmp").className = m === "comparar" ? "on" : "";
    var cmp = m === "comparar";
    $("cmp-count").hidden = !cmp;
    $("uf-chips").className = cmp ? "show" : "";
    $("state-panel").hidden = cmp;
    $("cmp-grid").hidden = !cmp;
    $("cmp-empty").hidden = !cmp || SELS.length > 0;
    $("evo-single").hidden = cmp || !serieTem();
    $("evo-multi").hidden = !cmp;
    if (cmp && !SELS.length) prefillCmp();
    renderFicha();
    renderEvo();
    renderMapa();
    renderMatriz();
  }
  function serieTem() {
    if (+selUF.value < 0) return true;
    var o = +selO.value;
    for (var dd = o + 1; dd <= ANOS[ANOS.length - 1]; dd++) {
      var r = ufPair(+selUF.value, o, dd);
      if (r.v || r.d || r.p) return true;
    }
    return false;
  }
  function prefillCmp() {
    var o = +selO.value, dd = +selD.value;
    var rank = UFS.map(function (u, i) { return { i: i, v: ufPair(i, o, dd).v }; })
      .sort(function (a, b) { return b.v - a.v; }).slice(0, 4).map(function (x) { return x.i; });
    rank.forEach(function (i) { $("chip-" + i).checked = true; });
    SELS = rank.slice();
    syncChipsUI();
  }
  function syncChipsUI() {
    SELS.forEach(function (i) { $("chip-" + i).classList.add("on"); });
    UFS.forEach(function (u, i) {
      var el = $("chip-" + i);
      if (el) el.classList.toggle("on", el.checked);
    });
    $("cmp-count").textContent = SELS.length + " de " + MAX_CMP + " selecionados";
    var lotado = SELS.length >= MAX_CMP;
    UFS.forEach(function (u, i) {
      var el = $("chip-" + i);
      if (el) el.classList.toggle("max", lotado && !el.checked);
    });
    $("cmp-empty").hidden = SELS.length > 0;
  }

  /* chips */
  UFS.forEach(function (u, i) {
    var lb = document.createElement("label");
    lb.className = "chip";
    lb.id = "chipbox-" + i;
    var inp = document.createElement("input");
    inp.type = "checkbox";
    inp.id = "chip-" + i;
    inp.addEventListener("change", function () {
      if (inp.checked) {
        if (SELS.length >= MAX_CMP) { inp.checked = false; return; }
        SELS.push(i);
      } else {
        SELS = SELS.filter(function (x) { return x !== i; });
      }
      syncChipsUI();
      renderFicha();
      renderEvo();
      renderMapa();
    });
    var txt = document.createElement("span");
    txt.textContent = u[1];
    lb.appendChild(inp);
    lb.appendChild(txt);
    $("uf-chips").appendChild(lb);
  });
  $("mode-um").addEventListener("click", function () { setModo("um"); });
  $("mode-cmp").addEventListener("click", function () { setModo("comparar"); });

  /* ---- renders ---- */
  function renderResumo() {
    var o = +selO.value, dd = +selD.value;
    var ui = +selUF.value;
    var br = agrega(o, dd);
    var r;
    if (ui < 0) {
      r = br;
    } else {
      var rec = ufPair(ui, o, dd);
      r = { v: rec.v || 0, d: rec.d || 0, p: rec.p || 0, dv: rec.dv || [], dd: rec.dd || [], n: 1 };
    }
    $("badge-valor").textContent = resumo(r.v);
    $("badge-rotulo").textContent = "viraram soja · " + o + " → " + dd;
    $("janela-txt").textContent = o + " → " + dd;
    $("st-soja-dd").textContent = resumo(r.v + r.p);
    $("st-virou").textContent = resumo(r.v);
    $("st-deixou").textContent = resumo(r.d);
    $("st-perm").textContent = resumo(r.p);
    $("st-saldo").textContent = resumo(r.v - r.d);
    $("st-ufs").textContent = ui < 0 ? (r.n + " de 27") : pct(r.v + r.p, br.v + br.p);
    $("st-ufs-l").textContent = ui < 0 ? "UFs com soja na janela" : "Soja do escopo ÷ soja do Brasil";
    $("rank-desc").textContent = "Barra única empilhada por UF — virou (verde), deixou de ser (âmbar) e permaneceu (cinza) entre " + o + " e " + dd + ", em hectares, numa única escala para preservar as proporções reais." + (ui >= 0 ? " O estado do escopo aparece destacado." : "");
    $("comp-v-hint").textContent = "Composição das áreas que viraram soja (" + resumo(r.v) + ") pelas classes de uso no ano de início (" + o + ").";
    $("comp-d-hint").textContent = "Composição das áreas que deixaram de ser soja (" + resumo(r.d) + ") pelas classes de uso no ano de fim (" + dd + ").";
    return r;
  }

  function renderRanking(r) {
    var o = +selO.value, dd = +selD.value;
    var ui = +selUF.value;
    var lista = UFS.map(function (u, i) {
      var rec = ufPair(i, o, dd);
      return { i: i, label: u[1], v: rec.v || 0, d: rec.d || 0, p: rec.p || 0 };
    });
    lista.forEach(function (e) { e.t = e.v + e.d + e.p; });
    lista.sort(function (a, b) { return (b.v - a.v) || (b.d - a.d); });
    var comArea = lista.filter(function (e) { return e.t > 0; });
    var maxT = lista.reduce(function (a, e) { return Math.max(a, e.t); }, 0) || 1;
    if (!comArea.length) {
      $("rank-list").innerHTML = "";
      $("rank-empty").hidden = false;
      $("rank-empty").textContent = "Nenhuma área da classe Soja registrada nesta janela — a classe não estava presente nos anos selecionados.";
      $("rank-scale").textContent = "";
      return;
    }
    $("rank-empty").hidden = true;
    $("rank-scale").textContent = "Uma barra empilhada por UF, numa única escala (maior UF da janela: " + resumo(maxT) + "): o que virou (verde), o que deixou de ser (âmbar) e o que permaneceu (cinza) têm entre si e entre estados a proporção real. Valores dentro da barra quando cabem; no direito, “mant.” = soja no ano final (virou + permaneceu) e o saldo líquido.";
    var html = "", ordem = 0;
    comArea.forEach(function (e) {
      ordem++;
      var largura = 100 * e.t / maxT;
      function seg(cls, area) {
        if (area <= 0) return "";
        var frac = area / e.t;
        var rot = frac >= 0.12 ? '<span class="seg-rot num">' + resumo(area) + '</span>' : "";
        return '<span class="seg ' + cls + '" style="flex:' + area + '" title="' + pct(area, e.t) + '">' + rot + '</span>';
      }
      html += '<div class="rank-row' + (MODO === "um" && e.i === ui ? ' hl' : '') + '"><div class="rank-head">'
        + '<span class="pos num">' + String(ordem).padStart(2, "0") + '</span>'
        + '<span class="uf">' + e.label + '</span>'
        + '<span class="val num">' + resumo(e.v + e.p) + ' mant. · saldo ' + resumo(e.v - e.d) + '</span></div>'
        + '<div class="bar-track"><div class="bar-stack" style="width:' + largura.toFixed(1) + '%">'
        + seg("seg-se", e.v) + seg("seg-sd", e.d) + seg("seg-sp", e.p)
        + '</div></div></div>';
    });
    $("rank-list").innerHTML = html;
  }

  function renderEstrutura(r) {
    var t = r.v + r.d + r.p;
    $("estrutura-hint").textContent = "Proporção de cada movimento sobre o total de área envolvida (" + resumo(t) + ") na trajetória " + +selO.value + " → " + +selD.value + ".";
    $("estrutura-bar").innerHTML = t > 0
      ? '<span class="seg seg-se" style="flex:' + r.v + '" title="' + pct(r.v, t) + '"></span>'
        + '<span class="seg seg-sd" style="flex:' + r.d + '" title="' + pct(r.d, t) + '"></span>'
        + '<span class="seg seg-sp" style="flex:' + r.p + '" title="' + pct(r.p, t) + '"></span>'
      : '<span class="seg" style="flex:1"></span>';
    $("estrutura-legend").innerHTML = [
      { sw: "var(--forest)", nm: "Virou soja", v: r.v },
      { sw: "var(--atencao)", nm: "Deixou de ser soja", v: r.d },
      { sw: "var(--perm)", nm: "Permaneceu soja", v: r.p }
    ].map(function (c) {
      return '<div class="comp-item"><span class="sw" style="background:' + c.sw + '"></span>'
        + '<span class="nm">' + c.nm + '</span><span class="pv num">' + pct(c.v, t) + ' · ' + resumo(c.v) + '</span></div>';
    }).join("");
  }

  function renderComp(total, src, barId, legId) {
    var comps = classesDe(src).filter(function (c) { return c.area > 0; });
    if (!comps.length) {
      $(barId).innerHTML = '<span class="seg" style="flex:1"></span>';
      $(legId).innerHTML = '<div class="comp-item"><span class="nm" style="color:var(--muted)">Sem área registrada nesta janela.</span></div>';
      return;
    }
    var top = comps.slice(0, 8), resto = comps.slice(8);
    var segs = top.concat([{ id: null, area: resto.reduce(function (a, c) { return a + c.area; }, 0) }]).filter(function (c) { return c.area > 0; });
    $(barId).innerHTML = segs.map(function (c) {
      var cor = c.id === null ? "#c3cdc6" : (CORES[c.id] || corCls(c.id));
      return '<span class="seg" style="flex:' + Math.max(c.area, 0.01) + ';background:' + cor + '" title="' + (c.id === null ? "Outras classes" : CLS[c.id]) + '"></span>';
    }).join("");
    $(legId).innerHTML = segs.map(function (c) {
      var cor = c.id === null ? "#c3cdc6" : (CORES[c.id] || corCls(c.id));
      return '<div class="comp-item"><span class="sw" style="background:' + cor + '"></span>'
        + '<span class="nm">' + (c.id === null ? "Outras classes" : CLS[c.id]) + '</span>'
        + '<span class="pv num">' + pct(c.area, total) + ' · ' + resumo(c.area) + '</span></div>';
    }).join("");
  }

  /* ---- mapa ---- */
  var svgNS = "http://www.w3.org/2000/svg";
  var SVG = null;
  if (DADOS.mapa) {
    SVG = document.createElementNS(svgNS, "svg");
    SVG.setAttribute("viewBox", DADOS.mapa.viewBox);
    DADOS.mapa.locs.forEach(function (l) {
      var p = document.createElementNS(svgNS, "path");
      p.setAttribute("d", l[1]);
      p.setAttribute("id", "mp-" + l[0]);
      SVG.appendChild(p);
    });
    $("brazil-map").appendChild(SVG);
  }
  var tip = $("mapa-tip");

  function gK(metrica) { return metrica.charAt(1); }
  function siglaDe(id) { return id.slice(id.indexOf("-") + 1); }
  function valoresMapa(o, dd, metrica) {
    return UFS.map(function (u, i) {
      var r = ufPair(i, o, dd);
      if (metrica === "virou") return r.v;
      if (metrica === "deixou") return r.d;
      if (metrica === "perm") return r.p;
      if (metrica === "sojad") return r.v + r.p;
      if (metrica.charAt(0) === "g" && metrica.length === 2) {
        var s = 0, ids = GRUPOS[+metrica.charAt(1)].ids;
        (r.dv || []).forEach(function (c) { if (ids[c[0]]) s += c[1]; });
        return s;
      }
      return r.v - r.d;
    });
  }

  function renderMapa() {
    if (!SVG) return;
    var o = +selO.value, dd = +selD.value;
    var metrica = $("mapa-metrica").value;
    var vals = valoresMapa(o, dd, metrica);
    var max = vals.reduce(function (a, v) { return Math.max(a, Math.abs(v)); }, 0) || 0;
    var min = metrica === "saldo" ? Math.min.apply(null, vals) : 0;
    var maxPos = Math.max.apply(null, vals);
    var dmap = {
      virou: "área que virou soja", deixou: "área que deixou de ser soja",
      saldo: "área líquida (virou − deixou)", perm: "área que permaneceu soja",
      sojad: "área total de soja no ano final"
    };
    if (metrica.charAt(0) === "g") dmap[metrica] = "área vinda de " + GRUPOS[+gK(metrica)].tit;
    $("mapa-desc").textContent = "Cada UF pintada pela " + dmap[metrica] + " entre " + o + " e " + dd + ".";
    if (max <= 0) {
      SVG.querySelectorAll("path").forEach(function (p) { p.setAttribute("fill", "#edf1eb"); });
      $("mapa-grad").style.background = "#edf1eb";
      $("mapa-min").textContent = "0"; $("mapa-max").textContent = "sem dados";
      $("mapa-top").innerHTML = '<li><span class="uf" style="color:var(--muted)">Nenhum valor nesta janela.</span></li>';
    } else {
      SVG.querySelectorAll("path").forEach(function (p) {
        var i = SIGLA2IDX[p.id.slice(3)];
        var v = vals[i];
        var cor;
        if (metrica === "saldo") cor = corSaldo(v, max);
        else {
          var r = metrica.charAt(0) === "g" ? GRUPOS[+gK(metrica)].rampa : RAMPA[metrica];
          cor = mix(r[0], r[1], Math.pow(Math.max(v, 0) / max, 0.45));
        }
        p.setAttribute("fill", cor);
      });
      var grad;
      if (metrica === "saldo") {
        grad = "linear-gradient(90deg," + SALDO_NEG + "," + SALDO_MEIO + " 50%," + SALDO_POS + ")";
        $("mapa-min").textContent = "−" + resumo(Math.abs(min)).replace("−", "");
        $("mapa-max").textContent = "+" + resumo(maxPos).replace("+", "");
      } else {
        var rg = metrica.charAt(0) === "g" ? GRUPOS[+gK(metrica)].rampa : RAMPA[metrica];
        grad = "linear-gradient(90deg," + rg[0] + "," + rg[1] + ")";
        $("mapa-min").textContent = "0";
        $("mapa-max").textContent = resumo(max);
      }
      $("mapa-grad").style.background = grad;
      var top = vals.map(function (v, i) { return { i: i, v: v }; })
        .sort(function (a, b) { return Math.abs(b.v) - Math.abs(a.v); }).slice(0, 5);
      $("mapa-top").innerHTML = top.map(function (x, k) {
        return '<li><span class="pos num">' + (k + 1) + '.</span><span class="uf">' + UFS[x.i][1] + '</span><span class="v num">' + resumo(x.v) + '</span></li>';
      }).join("");
    }
    marcaSelecao();
  }

  function marcaSelecao() {
    if (!SVG) return;
    SVG.querySelectorAll("path").forEach(function (p) {
      p.classList.remove("sel"); p.classList.remove("cmp");
    });
    if (MODO === "um" && +selUF.value >= 0) {
     var p = document.getElementById("mp-" + CODE2SIGLA[UFS[+selUF.value][0]]);
      if (p) p.classList.add("sel");
    } else if (MODO === "comparar") {
      SELS.forEach(function (i) {
        var p = document.getElementById("mp-" + CODE2SIGLA[UFS[i][0]]);
        if (p) p.classList.add("cmp");
      });
    }
  }

  if (SVG) {
    SVG.addEventListener("mousemove", function (e) {
      var path = e.target.closest ? e.target.closest("path") : null;
      if (!path) { tip.style.opacity = 0; return; }
      var i = SIGLA2IDX[path.id.slice(3)];
      if (i == null) { tip.style.opacity = 0; return; }
      var o = +selO.value, dd = +selD.value;
      var r = ufPair(i, o, dd);
      tip.innerHTML = '<div class="t-nome">' + UFS[i][1] + '</div>'
        + '<div class="t-metrica num">soja em ' + dd + ': ' + resumo(r.v + r.p) + '</div>'
        + '<div class="num">' + resumo(r.v) + ' virou · ' + resumo(r.d).replace("−", "") + ' deixou</div>'
        + '<div class="num">' + resumo(r.p) + ' permaneceu · saldo ' + resumo(r.v - r.d) + '</div>';
      var rect = $("map-plot").getBoundingClientRect();
      var x = Math.min(Math.max(e.clientX - rect.left, 90), rect.width - 90);
      tip.style.left = x + "px";
      tip.style.top = (e.clientY - rect.top) + "px";
      tip.style.opacity = 1;
    });
    SVG.addEventListener("mouseleave", function () { tip.style.opacity = 0; });
      SVG.addEventListener("click", function (e) {
      var path = e.target.closest ? e.target.closest("path") : null;
      if (!path) return;
      var i = SIGLA2IDX[path.id.slice(3)];
      if (i == null) return;
      selUF.value = String(i);
      setModo("um");
    });
  }
  $("mapa-metrica").addEventListener("change", renderMapa);

  /* ---- um mapa por grupo de origem da soja nova ---- */
  function idsSet(arr) {
    var s = {};
    arr.forEach(function (x) { s[x] = 1; });
    return s;
  }
  /* paleta dos 6 grupos definida pelo projeto: cor base = ponto máximo da rampa */
  var BASE6 = [
    { tit: "Soja em {o} e {d}", cor: "#E83E8C", ids: null },
    { tit: "Outras culturas → soja", cor: "#A000D8", ids: [9, 18, 19, 20, 35, 36, 40, 41, 46, 47, 48, 62] },
    { tit: "Pastagem → soja", cor: "#E99400", ids: [15] },
    { tit: "Mosaico de usos → soja", cor: "#FFD21A", ids: [21, 26] },
    { tit: "Vegetação nativa → soja", cor: "#238B57", ids: [1, 3, 4, 5, 6, 7, 10, 11, 12, 13, 29, 32, 49, 50, 77, 84] },
    { tit: "Demais classes → soja", cor: "#777777", ids: [23, 24, 25, 30, 31, 33, 75, 91] }
  ];
  var GRUPOS = BASE6.map(function (g) {
    return { tit: g.tit, cor: g.cor, ids: g.ids ? idsSet(g.ids) : null,
             rampa: [mixHex("#fafbf9", g.cor, 0.16), g.cor] };
  });
  var GSvg = {};
  function buildGroupSvgs() {
    if (!DADOS.mapa || $ ("grupos-grid").children.length) return;
    var html = "";
    GRUPOS.forEach(function (g, k) {
      html += '<div class="mini-map"><h4 id="gtitle-' + k + '"></h4>'
        + '<div class="mm-plot"><div class="bmap" id="gmap-' + k + '"></div>'
        + '<div class="map-tip num" id="gtip-' + k + '"></div></div>'
        + '<div class="scale"><span id="gscalemin-' + k + '">0</span><span class="grad" id="gscale-' + k + '"></span>'
        + '<span id="gscalemax-' + k + '">—</span></div>'
        + '<p class="hint num" id="gtot-' + k + '">—</p></div>';
    });
    $("grupos-grid").innerHTML = html;
    GRUPOS.forEach(function (g, k) {
      var svg = document.createElementNS(svgNS, "svg");
      svg.setAttribute("viewBox", DADOS.mapa.viewBox);
      DADOS.mapa.locs.forEach(function (l) {
        var p = document.createElementNS(svgNS, "path");
        p.setAttribute("d", l[1]);
        p.setAttribute("id", "gm" + k + "-" + l[0]);
        svg.appendChild(p);
      });
      GSvg[k] = svg;
      $("gmap-" + k).appendChild(svg);
      svg.addEventListener("mousemove", function (e) {
        var path = e.target.closest ? e.target.closest("path") : null;
        var tip = $("gtip-" + k);
        if (!path) { tip.style.opacity = 0; return; }
        var i = SIGLA2IDX[siglaDe(path.id)];
        if (i == null) { tip.style.opacity = 0; return; }
        var o = +selO.value, dd = +selD.value;
        var r = ufPair(i, o, dd);
        var v = k === 0 ? r.p : somaGrupo(recGrupos(k, r));
        var rt = r.v + r.p;
        tip.innerHTML = '<div class="t-nome">' + UFS[i][1] + '</div>'
          + '<div class="t-metrica num">' + gTitle(k) + ': ' + resumo(v) + '</div>'
          + (rt > 0 ? '<div class="num">' + pct(v, rt) + ' da soja da UF nesta janela</div>' : "");
        var plot = $("gmap-" + k).getBoundingClientRect();
        var x = Math.min(Math.max(e.clientX - plot.left, 80), plot.width - 80);
        tip.style.left = x + "px";
        tip.style.top = (e.clientY - plot.top) + "px";
        tip.style.opacity = 1;
      });
      svg.addEventListener("mouseleave", function () { $("gtip-" + k).style.opacity = 0; });
      svg.addEventListener("click", function (e) {
        var path = e.target.closest ? e.target.closest("path") : null;
        if (!path) return;
        var i = SIGLA2IDX[siglaDe(path.id)];
        if (i == null) return;
        selUF.value = String(i);
        setModo("um");
      });
    });
  }
  function gTitle(k) {
    var g = GRUPOS[k];
    return g.ids === null ? "Soja em " + selO.value + " e " + selD.value : g.tit;
  }
  function recGrupos(k, r) { return (r.dv || []); }
  function somaGrupo(arr) { return arr.reduce(function (a, c) { return a + c[1]; }, 0); }

  function renderGrupos() {
    var o = +selO.value, dd = +selD.value;
    buildGroupSvgs();
    if (!DADOS.mapa) return;
    var tot = [], max = [], nativaVals = [];
    GRUPOS.forEach(function (g, k) {
      $("gtitle-" + k).textContent = k === 0
        ? "Soja em " + o + " e " + dd
        : g.tit + " · " + o + " → " + dd;
    });
    GRUPOS.forEach(function (g, k) {
      var vals = UFS.map(function (u, i) {
        var r = ufPair(i, o, dd);
        if (k === 0) return r.p;
        var s = 0;
        (r.dv || []).forEach(function (c) { if (g.ids[c[0]]) s += c[1]; });
        return s;
      });
      var mx = vals.reduce(function (a, v) { return Math.max(a, v); }, 0);
      tot[k] = vals.reduce(function (a, v) { return a + v; }, 0);
      max[k] = mx;
      if (k === 4) nativaVals = vals;
      GSvg[k].querySelectorAll("path").forEach(function (p) {
        var v = vals[SIGLA2IDX[siglaDe(p.id)]];
        p.setAttribute("fill", mx > 0 && v > 0
          ? mix(g.rampa[0], g.rampa[1], Math.pow(v / mx, 0.45))
          : "#f2f4ef");
      });
      var grad = "linear-gradient(90deg," + g.rampa[0] + "," + g.rampa[1] + ")";
      $("gscale-" + k).style.background = grad;
      $("gscalemax-" + k).textContent = resumo(mx);
      var topUF = "";
      var bi = 0;
      vals.forEach(function (v, i) { if (v > vals[bi]) bi = i; });
      if (mx > 0) topUF = " · maior: " + UFS[bi][1] + " (" + pct(vals[bi], tot[k]) + ")";
      $("gtot-" + k).textContent = "Brasil: " + resumo(tot[k]) + topUF;
    });
    /* resumo dos seis grupos */
    var base6 = tot[0] + tot[1] + tot[2] + tot[3] + tot[4] + tot[5];
    $("g-leg-hint").textContent = "Área de cada grupo sobre o total envolvido (" + resumo(base6) + ") na janela " + o + " → " + dd + ".";
    $("g-leg").innerHTML = GRUPOS.map(function (g, k) {
      return '<li><span class="sw" style="background:' + g.rampa[1] + '"></span>'
        + '<span class="nm">' + gTitle(k) + '</span>'
        + '<span class="pv num">' + resumo(tot[k]) + ' · ' + pct(tot[k], base6) + '</span></li>';
    }).join("");
    /* top nativa */
    var nt = nativaVals.map(function (v, i) { return { i: i, v: v }; })
      .sort(function (a, b) { return b.v - a.v; }).filter(function (x) { return x.v > 0; }).slice(0, 6);
    $("grupos-top-nativa").innerHTML = nt.length
      ? nt.map(function (x, k) {
        return '<li><span class="pos num">' + (k + 1) + '.</span><span class="uf">' + UFS[x.i][1]
          + '</span><span class="v num">' + resumo(x.v) + '</span></li>';
      }).join("")
      : '<li><span class="uf" style="color:var(--muted)">Nenhuma área desta origem na janela.</span></li>';
  }

  /* ---- matriz origem × destino ---- */
  function escopoMatriz() {
    if (MODO === "comparar") return -1;                 // Brasil
    return +selUF.value;                                 // inclui -1 = Brasil
  }
  function corMetrica(metrica, v, max) {
    if (metrica === "saldo") return corSaldo(v, max);
    var r = metrica.charAt(0) === "g" ? GRUPOS[+gK(metrica)].rampa : RAMPA[metrica];
    return mix(r[0], r[1], Math.pow(Math.max(v, 0) / max, 0.45));
  }
  function renderMatriz() {
    var o0 = ANOS[0], oMax = ANOS[ANOS.length - 2], dMax = ANOS[ANOS.length - 1];
    var metrica = $("matriz-metrica").value;
    var ui = escopoMatriz();
    var nome = ui < 0 ? "Brasil (todas as UFs)" : UFS[ui][1];
    $("matriz-escopo").textContent = "Escopo: " + nome
      + (MODO === "comparar" ? " · no modo comparar a matriz mostra o Brasil" : "")
      + ". 820 janelas de uma vez.";
    function val(o, d) {
      var m = ui < 0 ? agrega(o, d) : ufPair(ui, o, d);
      if (metrica === "virou") return m.v;
      if (metrica === "deixou") return m.d;
      if (metrica === "perm") return m.p;
      if (metrica === "sojad") return m.v + m.p;
      if (metrica.charAt(0) === "g" && metrica.length === 2) {
        var ids = GRUPOS[+gK(metrica)].ids;
        if (!m.dv) return 0;
        if (m.dv.forEach) {
          return m.dv.reduce(function (a, c) { return a + (ids[c[0]] ? c[1] : 0); }, 0);
        }
        return Object.keys(m.dv).reduce(function (a, k) { return a + (ids[+k] ? m.dv[k] : 0); }, 0);
      }
      return m.v - m.d;
    }
    var max = 0, minS = 0, maxPos = 0;
    var ANOS_S1 = ANOS.slice(0, -1), ANOS_D = ANOS.slice(1);
    ANOS_S1.forEach(function (o) {
      ANOS_D.forEach(function (d) {
        if (d <= o) return;
        var v = val(o, d);
        max = Math.max(max, Math.abs(v));
        minS = Math.min(minS, v); maxPos = Math.max(maxPos, v);
      });
    });
    var linhas = "";
    ANOS_D.forEach(function (d) {
      linhas += '<div class="mx-h"><span>' + d + '</span></div>';
    });
    ANOS_S1.forEach(function (o) {
      linhas += '<div class="mx-lbl num">' + o + '</div>';
      ANOS_D.forEach(function (d) {
        if (d <= o) { linhas += '<i class="mx-e"></i>'; return; }
        var v = val(o, d);
        var cor = max > 0 ? corMetrica(metrica, v, max) : "#edf1eb";
        var m = ui < 0 ? agrega(o, d) : ufPair(ui, o, d);
        linhas += '<div class="mx-c" data-o="' + o + '" data-d="' + d + '" style="background:' + cor
          + '" title="' + o + ' → ' + d + ' · virou ' + resumo(m.v) + ' · deixou ' + resumo(m.d)
          + ' · permaneceu ' + resumo(m.p) + '"></div>';
      });
    });
    $("matriz-grid").innerHTML = '<div class="mx-lbl" style="text-align:left;padding-right:5px;line-height:normal;font-size:0.55rem">origem ↓<br>destino →</div>' + linhas;
    if (max <= 0) {
      $("matriz-grad").style.background = "#edf1eb";
      $("matriz-min").textContent = "0"; $("matriz-max").textContent = "sem dados";
    } else if (metrica === "saldo") {
      $("matriz-grad").style.background = "linear-gradient(90deg," + SALDO_NEG + "," + SALDO_MEIO + " 50%," + SALDO_POS + ")";
      $("matriz-min").textContent = "−" + resumo(Math.abs(minS));
      $("matriz-max").textContent = "+" + resumo(maxPos);
    } else {
      var rgm = metrica.charAt(0) === "g" ? GRUPOS[+gK(metrica)].rampa : RAMPA[metrica];
      $("matriz-grad").style.background = "linear-gradient(90deg," + rgm[0] + "," + rgm[1] + ")";
      $("matriz-min").textContent = "0";
      $("matriz-max").textContent = resumo(max);
    }
  }
  $("matriz-metrica").addEventListener("change", renderMatriz);
  $("matriz-grid").addEventListener("click", function (e) {
    var c = e.target.closest ? e.target.closest(".mx-c") : null;
    if (!c) return;
    selO.value = c.getAttribute("data-o");
    opcoesDestino();
    selD.value = c.getAttribute("data-d");
    renderAll();
  });

  /* ---- funil origem → soja → destino (SVG sankey) ---- */
  function trunc(s, n) { return s.length > n ? s.slice(0, n - 1) + "…" : s; }
  function funilSVG(o, dd, nome) {
    var ui = +selUF.value;
    var rec;
    if (ui < 0) { var r = agrega(o, dd); rec = { v: r.v, d: r.d, dv: r.dv, dd: r.dd }; }
    else rec = ufPair(ui, o, dd);
    var Vs = classesDe(rec.dv || []).filter(function (c) { return c.area > 0; });
    var Ds = classesDe(rec.dd || []).filter(function (c) { return c.area > 0; });
    if (!Vs.length || !Ds.length) {
      return '<p class="hint" style="margin-top:10px">Funil disponível quando há área entrando <em>e</em> saindo de soja nesta janela — ajuste os anos de início e fim no console para ver outro trecho da série.</p>';
    }
    function pack(lst) {
      var t = lst.slice(0, 7);
      var resto = lst.slice(7);
      if (resto.length) t.push({ id: null, area: resto.reduce(function (a, c) { return a + c.area; }, 0) });
      return t;
    }
    Vs = pack(Vs); Ds = pack(Ds);
    var W = 980, GL = 176, BOXW = 200, CXL = 430, CW = 120, HL = 235;
    var tV = Vs.reduce(function (a, c) { return a + c.area; }, 0);
    var tD = Ds.reduce(function (a, c) { return a + c.area; }, 0);

    function fitas(lst, total, YTOP, right) {
      // fitas diagonais da coluna de classes até o nó central (desenhadas primeiro)
      var frags = "", y = YTOP, cum = 0;
      var xCaixa = right ? W - GL - BOXW : GL + BOXW;
      var xCentro = right ? CXL + CW : CXL;
      lst.forEach(function (c) {
        var h = HL * c.area / total;
        var cy = YTOP + (cum / total) * HL;
        var rh = Math.max(1.2, HL * c.area / total);
        var nm = c.id === null ? "Outras classes" : CLS[c.id];
        var cor = c.id === null ? "#c3cdc6" : (CORES[c.id] || corCls(c.id));
        frags += '<path class="fita" d="M' + xCaixa + ',' + y + ' L' + xCentro + ',' + cy
          + ' L' + xCentro + ',' + (cy + rh) + ' L' + xCaixa + ',' + (y + h) + ' Z" fill="' + cor
          + '" opacity="0.38"><title>' + nm + ' — ' + resumo(c.area) + ' (' + pct(c.area, total) + ')</title></path>';
        y += h;
        cum += c.area;
      });
      return frags;
    }
    function caixas(lst, total, YTOP, right) {
      // coluna de classes flush (sem buracos) + rótulos externos com valor e %
      var frags = "", y = YTOP;
      var bx = right ? W - GL - BOXW : GL;
      var tx = right ? bx + BOXW + 14 : 6;
      lst.forEach(function (c) {
        var h = HL * c.area / total;
        var nm = c.id === null ? "Outras classes" : CLS[c.id];
        var cor = c.id === null ? "#c3cdc6" : (CORES[c.id] || corCls(c.id));
        frags += '<rect x="' + bx + '" y="' + y + '" width="' + BOXW + '" height="' + h + '" fill="' + cor + '"><title>' + nm + ' — ' + resumo(c.area) + ' (' + pct(c.area, total) + ')</title></rect>';
        if (h >= 14) {
          frags += '<text x="' + tx + '" y="' + (y + h / 2 - 2) + '" font-size="12.5" font-weight="700" fill="#18362d">' + trunc(nm, 21) + '</text>'
            + '<text x="' + tx + '" y="' + (y + h / 2 + 12) + '" font-size="11.5" font-weight="600" fill="#5f7169">' + resumo(c.area) + ' · ' + pct(c.area, total) + '</text>';
        }
        y += h;
      });
      return frags;
    }
    var Y1T = 20, Y1 = 30, Y2T = Y1 + HL + 42, Y2 = Y2T + 10, H = Y2 + HL + 26;
    var xm = CXL + CW / 2;
    return '<svg class="fsvg" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Fluxos de uso da terra entre '
      + o + ' e ' + dd + ' (sankey)">'
      + '<text x="' + (W / 2) + '" y="' + Y1T + '" text-anchor="middle" font-size="14" font-weight="800" fill="#18362d">De onde veio a soja nova — ' + nome + ' · ' + o + ' → ' + dd + '</text>'
      + fitas(Vs, tV, Y1, false)
      + caixas(Vs, tV, Y1, false)
      + '<rect x="' + CXL + '" y="' + Y1 + '" width="' + CW + '" height="' + HL + '" rx="5" style="fill:var(--forest)"><title>Soja nova total — ' + resumo(tV) + '</title></rect>'
      + '<text x="' + xm + '" y="' + (Y1 + HL / 2 - 2) + '" text-anchor="middle" font-size="13" font-weight="800" fill="#fff">VIRAM SOJA</text>'
      + '<text x="' + xm + '" y="' + (Y1 + HL / 2 + 16) + '" text-anchor="middle" font-size="13.5" font-weight="800" fill="#dce89b">' + resumo(tV) + '</text>'
      + '<text x="' + (W / 2) + '" y="' + Y2T + '" text-anchor="middle" font-size="14" font-weight="800" fill="#18362d">Para onde foi a soja que saiu — ' + o + ' → ' + dd + '</text>'
      + fitas(Ds, tD, Y2, true)
      + caixas(Ds, tD, Y2, true)
      + '<rect x="' + CXL + '" y="' + Y2 + '" width="' + CW + '" height="' + HL + '" rx="5" style="fill:var(--atencao)"><title>Soja perdida total — ' + resumo(tD) + '</title></rect>'
      + '<text x="' + xm + '" y="' + (Y2 + HL / 2 - 2) + '" text-anchor="middle" font-size="13" font-weight="800" fill="#fff">SAIU DE SOJA</text>'
      + '<text x="' + xm + '" y="' + (Y2 + HL / 2 + 16) + '" text-anchor="middle" font-size="13.5" font-weight="800" fill="#fff">' + resumo(tD) + '</text>'
      + '</svg>';
  }

  /* ---- ficha: um estado (expandido) ---- */
  function renderFicha() {
    if (MODO === "comparar") { renderComparar(); return; }
    var o = +selO.value, dd = +selD.value;
    var ui = +selUF.value;
    var nome = ui < 0 ? "Brasil (todas as UFs)" : UFS[ui][1];
    var rec, r = null;
    if (ui < 0) { r = agrega(o, dd); rec = { v: r.v, d: r.d, p: r.p, dv: r.dv, dd: r.dd }; }
    else { rec = ufPair(ui, o, dd); }
    var panel = $("state-panel");
    var tot = rec.v + rec.d + rec.p;
    if (!tot) {
      panel.innerHTML = '<div class="state-empty">Nenhuma área da classe Soja registrada entre ' + o + ' e ' + dd + ' para esta seleção. Experimente outra janela no console acima.</div>';
      marcaSelecao();
      return;
    }
    var totHtml = '<div class="state-tot">'
      + '<div class="kv"><div class="k">Soja em ' + dd + '</div><div class="n num">' + ha(rec.v + rec.p) + '</div></div>'
      + '<div class="kv"><div class="k">Virou soja</div><div class="n num">' + ha(rec.v) + '</div></div>'
      + '<div class="kv"><div class="k">Deixou de ser soja</div><div class="n num">' + ha(rec.d) + '</div></div>'
      + '<div class="kv"><div class="k">Permaneceu soja</div><div class="n num">' + ha(rec.p) + '</div></div>'
      + '<div class="kv"><div class="k">Saldo</div><div class="n num">' + ha(rec.v - rec.d) + '</div></div>'
      + '</div>';
    function coluna(titulo, hint, arr, emptyMsg) {
      var cls = classesDe(arr).filter(function (c) { return c.area > 0; });
      if (!cls.length) return '<div class="state-cols-col"><h3>' + titulo + '</h3><p class="hint">' + emptyMsg + '</p></div>';
      var max = cls[0].area;
      return '<div class="state-cols-col"><h3>' + titulo + '</h3><p class="hint">' + hint + '</p>'
        + '<div class="cls-list">' + cls.slice(0, 12).map(function (c) {
          var cor = CORES[c.id] || corCls(c.id);
          return '<div class="cls-item"><span class="sw" style="background:' + cor + '"></span>'
            + '<div class="line"><span class="nm">' + CLS[c.id] + '</span><span class="v num">' + ha(c.area) + ' <span style="color:var(--vazio)">(' + pct(c.area, tot) + ')</span></span></div>'
            + '<div class="cbar"><i style="width:' + Math.max(1.5, 100 * c.area / max).toFixed(1) + '%;background:' + cor + '"></i></div></div>';
        }).join("") + '</div></div>';
    }
    panel.innerHTML = totHtml
      + '<div class="state-cols">'
      + coluna("Origem da soja nova", "Em que uso a terra estava antes de virar soja, em " + o + ".", rec.dv, "Nenhuma área virou soja nesta seleção na janela analisada.")
      + coluna("Destino da soja perdida", "Para qual uso a terra foi quando deixou de ser soja, em " + dd + ".", rec.dd, "Nenhuma área deixou de ser soja nesta seleção na janela analisada.")
      + '</div>'
      + '<p class="hint" style="margin-top:16px">' + nome + " · " + o + " → " + dd + (ui < 0 && r ? " · " + r.n + " UFs com soja" : "") + '</p>'
      + '<div class="funil-wrap"><h3>Fluxos da janela</h3>'
      + '<p class="hint" style="margin-top:2px">Largura proporcional à área de cada classe. Passe o mouse nas caixas e fitas para ver os valores.</p>'
      + funilSVG(o, dd, nome)
      + '</div>';
    marcaSelecao();
  }

  /* ---- ficha: comparar estados ---- */
  function miniTop3(arr, ano, tipo) {
    var cls = classesDe(arr || []).filter(function (c) { return c.area > 0; }).slice(0, 3);
    return '<div><div class="col-tit">' + tipo + " (" + ano + ')</div>'
      + (cls.length
        ? cls.map(function (c) {
          return '<div class="li"><span class="nm">' + CLS[c.id] + '</span><span class="vv num">' + resumo(c.area) + '</span></div>';
        }).join("")
        : '<div class="hint">sem área</div>')
      + '</div>';
  }
  function renderComparar() {
    var o = +selO.value, dd = +selD.value;
    var grid = $("cmp-grid");
    if (!SELS.length) { grid.innerHTML = ""; return; }
    grid.innerHTML = SELS.map(function (i) {
      var rec = ufPair(i, o, dd);
      var t = rec.v + rec.d + rec.p;
      var bar = t > 0
        ? '<div class="cmp-bar">'
          + '<span class="seg seg-se" style="flex:' + rec.v + '" title="' + pct(rec.v, t) + '"></span>'
          + '<span class="seg seg-sd" style="flex:' + rec.d + '" title="' + pct(rec.d, t) + '"></span>'
          + '<span class="seg seg-sp" style="flex:' + rec.p + '" title="' + pct(rec.p, t) + '"></span>'
          + '</div>'
        : '<div class="cmp-bar"><span class="seg" style="flex:1"></span></div>';
      var vals = '<div class="cmp-vals num">'
        + '<span class="key"><span class="sw" style="background:var(--forest)"></span> Soja em ' + dd + ': ' + resumo(rec.v + rec.p) + '</span>'
        + '<span class="key"><span class="sw" style="background:var(--forest)"></span> Virou: ' + resumo(rec.v) + '</span>'
        + '<span class="key"><span class="sw" style="background:var(--atencao)"></span> Deixou: ' + resumo(rec.d).replace("−", "") + '</span>'
        + '<span class="key"><span class="sw" style="background:var(--perm)"></span> Permaneceu: ' + resumo(rec.p) + '</span>'
        + '</div>';
      var saldoCor = rec.v - rec.d >= 0 ? "var(--ok)" : "var(--atencao)";
      return '<div class="cmp-card"><div class="cmp-head"><h4>' + UFS[i][1] + '</h4>'
        + '<span class="saldo num" style="color:' + saldoCor + '">saldo ' + resumo(rec.v - rec.d) + '</span></div>'
        + bar + vals
        + (t > 0
          ? '<div class="cmp-cols">' + miniTop3(rec.dv, o, "Origem") + miniTop3(rec.dd, dd, "Destino") + '</div>'
          : '<p class="hint" style="margin-top:10px">Sem soja registrada nesta UF nesta janela.</p>')
        + '</div>';
    }).join("");
  }

  /* ---- evolução ---- */
  function serieOrigem(ui, o) {
    var serie = [];
    var tem = false;
    for (var dd = o + 1; dd <= ANOS[ANOS.length - 1]; dd++) {
      var rec = ui < 0 ? agrega(o, dd) : ufPair(ui, o, dd);
      if (rec.v || rec.d || rec.p) tem = true;
      serie.push({ ano: dd, v: rec.v, d: rec.d, p: rec.p });
    }
    return { serie: serie, tem: tem };
  }
  function colunas(serie, hVmax, hDmax, mini) {
    var cols = "";
    serie.forEach(function (s) {
      var hV = s.v > 0 ? Math.max(0.8, 50 * s.v / hVmax) : 0;
      var hD = s.d > 0 ? Math.max(0.8, 50 * s.d / hDmax) : 0;
      var t = 'title="' + s.ano + ' · virou ' + fmt.format(Math.round(s.v)) + ' ha · deixou ' + fmt.format(Math.round(s.d)) + ' ha · permaneceu ' + fmt.format(Math.round(s.p)) + ' ha"';
      cols += '<div class="evo-col">'
        + '<div class="evo-zone up" ' + t + '>' + (s.v > 0 ? '<i style="height:' + hV.toFixed(2) + '%"></i>' : "") + '</div>'
        + '<div class="evo-zone down" ' + t + '>' + (s.d > 0 ? '<i style="height:' + hD.toFixed(2) + '%"></i>' : "") + '</div>'
        + '</div>';
    });
    return cols;
  }
  /* leitura de valores da evolução (painel sempre visível; hover atualiza) */
  var S1 = null, IDXD = 0;
  function roHtml(s) {
    return '<span class="ano">' + s.ano + '</span>'
      + '<span><span class="swmini" style="background:var(--forest)"></span>virou <span class="num" style="color:var(--ok)">' + resumo(s.v) + '</span></span>'
      + '<span><span class="swmini" style="background:var(--atencao)"></span>deixou <span class="num" style="color:var(--atencao)">' + resumo(s.d) + '</span></span>'
      + '<span><span class="swmini" style="background:var(--perm)"></span>permaneceu <span class="num">' + resumo(s.p) + '</span></span>';
  }
  function idxMaxV(serie) {
    var m = 0;
    serie.forEach(function (x, k) { if (x.v > serie[m].v) m = k; });
    return m;
  }
  function renderEvo() {
    var o = +selO.value;
    var ultimo = ANOS[ANOS.length - 1];
    if (MODO === "comparar") {
      $("evo-titulo").textContent = "Comparando trajetórias";
      $("evo-sub").textContent = "Origem fixa em " + o + " · mini-múltiplos por estado · passe o mouse para ler os valores";
      S1 = null;
      var multi = $("evo-multi");
      if (!SELS.length) { multi.innerHTML = ""; $("evo-empty").hidden = false; $("evo-empty").textContent = "Selecione estados na seção “Um estado ou comparação” para ver suas trajetórias aqui."; return; }
      var dados = [];
      var blocks = SELS.map(function (i) {
        var s = serieOrigem(i, o);
        var maxV = s.serie.reduce(function (a, x) { return Math.max(a, x.v); }, 0) || 1;
        var maxD = s.serie.reduce(function (a, x) { return Math.max(a, x.d); }, 0) || 1;
        dados.push({ serie: s.serie, def: idxMaxV(s.serie) });
        return '<div class="mini-evo"><h4>' + UFS[i][1] + '</h4>'
          + '<div class="evo-cols">' + colunas(s.serie, maxV, maxD) + '</div>'
          + '<div class="evo-readout num"></div>'
          + '<p class="hint" style="margin-top:4px">origem ' + o + (s.tem ? "" : " · sem soja registrada") + '</p></div>';
      }).join("");
      $("evo-empty").hidden = true;
      multi.innerHTML = blocks;
      Array.prototype.forEach.call(multi.children, function (card, k) {
        var dd = dados[k];
        var ro = card.querySelector(".evo-readout");
        var cols = card.querySelector(".evo-cols");
        ro.innerHTML = roHtml(dd.serie[dd.def]);
        card.addEventListener("mousemove", function (e) {
          var col = e.target.closest(".evo-col");
          if (!col) return;
          var i = Array.prototype.indexOf.call(cols.children, col);
          if (dd.serie[i]) ro.innerHTML = roHtml(dd.serie[i]);
        });
        card.addEventListener("mouseleave", function () { ro.innerHTML = roHtml(dd.serie[dd.def]); });
      });
      return;
    }
    var ui = +selUF.value;
    var nome = ui < 0 ? "Brasil (todas as UFs)" : UFS[ui][1];
    var s = serieOrigem(ui, o);
    $("evo-sub").textContent = "Origem fixa em " + o + " · destino em cada ano seguinte · " + nome;
    $("evo-titulo").textContent = nome + " · trajetórias da soja de " + o;
    if (!s.tem) {
      S1 = null;
      $("evo-single").hidden = true;
      $("evo-empty").hidden = false;
      $("evo-cols").innerHTML = ""; $("evo-axis").innerHTML = ""; $("evo-cols-p").innerHTML = "";
      return;
    }
    $("evo-single").hidden = false;
    $("evo-empty").hidden = true;
    var maxV = s.serie.reduce(function (a, x) { return Math.max(a, x.v); }, 0) || 1;
    var maxD = s.serie.reduce(function (a, x) { return Math.max(a, x.d); }, 0) || 1;
    var maxP = s.serie.reduce(function (a, x) { return Math.max(a, x.p); }, 0) || 1;
    $("evo-scale").textContent = "Escalas — virou até " + resumo(maxV) + " · deixou até " + resumo(maxD)
      + " · permaneceu até " + resumo(maxP) + " (cada cor na própria escala).";
    S1 = s.serie;
    IDXD = idxMaxV(s.serie);
    $("evo-readout").innerHTML = roHtml(S1[IDXD]);
    $("evo-cols").innerHTML = colunas(s.serie, maxV, maxD, false);
    var axis = "";
    s.serie.forEach(function (x) {
      axis += '<span>' + ((x.ano === o + 1 || x.ano === ultimo || x.ano % 5 === 0) ? x.ano : "") + '</span>';
    });
    $("evo-axis").innerHTML = axis;
    var pcols = "";
    s.serie.forEach(function (x, k) {
      var h = x.p > 0 ? Math.max(0.8, 100 * x.p / maxP) : 0;
      pcols += '<div class="evo-col"><div class="evo-zone pz" title="' + x.ano + ' · permaneceu ' + fmt.format(Math.round(x.p)) + ' ha">'
        + (x.p > 0 ? '<i style="height:' + h.toFixed(2) + '%"></i>' : "") + '</div></div>';
    });
    $("evo-cols-p").innerHTML = pcols;
  }

  /* ---- ligações ---- */
  /* leitura de valores da evolução: hover nas colunas atualiza o painel */
  $("evo-single").addEventListener("mousemove", function (e) {
    var col = e.target.closest && e.target.closest(".evo-col");
    if (!col || !S1) return;
    var i = Array.prototype.indexOf.call(col.parentNode.children, col);
    if (S1[i]) $("evo-readout").innerHTML = roHtml(S1[i]);
  });
  $("evo-single").addEventListener("mouseleave", function () {
    if (S1) $("evo-readout").innerHTML = roHtml(S1[IDXD]);
  });

  function renderAll() {
    var r = renderResumo();
    renderRanking(r);
    renderEstrutura(r);
    renderComp(r.v, r.dv, "comp-bar", "comp-legend");
    renderComp(r.d, r.dd, "comp-bar-d", "comp-legend-d");
    renderMapa();
    renderGrupos();
    renderMatriz();
    renderFicha();
    renderEvo();
  }

  selO.addEventListener("change", function () { opcoesDestino(); renderAll(); });
  selD.addEventListener("change", renderAll);
  selUF.addEventListener("change", renderAll);

  $("cob-zero").textContent = SEM_DADOS.join(" · ") || "—";
  $("cob-zero2").textContent = SEM_DADOS.join(", ") || "—";

  renderAll();
})();
