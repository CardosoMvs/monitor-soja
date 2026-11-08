// Espelho do script inline de index.html (raiz) — regenerado por extração.
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var fmt = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 0 });

  /* cores indicativas por classe (não oficiais MapBiomas) */
  var CORES = {
    3: "#2e7d5b", 4: "#79c486", 5: "#57a37a", 6: "#5fb37a", 7: "#66a9a0",
    9: "#6f8fb5", 11: "#7aa6c2", 12: "#a8c48a", 13: "#c9dfae", 15: "#d9c87c",
    20: "#c99a6b", 21: "#9aa5a0", 23: "#e0d3a3", 24: "#c06058", 25: "#b9b1a3",
    29: "#a8a299", 30: "#8d9298", 31: "#5f7fa8", 32: "#93b7a8", 33: "#7aa6c2",
    35: "#c7a15c", 40: "#e2b93b", 41: "#dcc06a", 46: "#8a6f52", 47: "#d8b268",
    48: "#c49a4f", 49: "#4d9e78", 50: "#90c290", 62: "#c9b6d9", 75: "#b58fb5",
    84: "#8fb0bb", 91: "#8f9d95"
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
  var RAMPA = { virou: ["#edf1e6", "#184b39"], deixou: ["#f2e9db", "#8a4a12"], perm: ["#edf1eb", "#414f47"] };
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
  var selO = $("ano-origem"), selD = $("ano-destino"), selUF = $("uf-select");
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
    $("uf-label").hidden = cmp;
    $("uf-select").hidden = cmp;
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
    var r = agrega(o, dd);
    $("badge-valor").textContent = resumo(r.v);
    $("badge-rotulo").textContent = "viraram soja · " + o + " → " + dd;
    $("janela-txt").textContent = o + " → " + dd;
    $("st-virou").textContent = resumo(r.v);
    $("st-deixou").textContent = resumo(r.d);
    $("st-perm").textContent = resumo(r.p);
    $("st-saldo").textContent = resumo(r.v - r.d);
    $("st-ufs").textContent = r.n + " de 27";
    $("rank-desc").textContent = "Área que virou soja (verde), a que deixou de ser soja (âmbar) e a que permaneceu soja (cinza) entre " + o + " e " + dd + ", por unidade federativa, em hectares.";
    $("comp-v-hint").textContent = "Composição das áreas que viraram soja (" + resumo(r.v) + ") pelas classes de uso no ano de origem (" + o + ").";
    $("comp-d-hint").textContent = "Composição das áreas que deixaram de ser soja (" + resumo(r.d) + ") pelas classes de uso no ano de destino (" + dd + ").";
    return r;
  }

  function renderRanking(r) {
    var o = +selO.value, dd = +selD.value;
    var lista = UFS.map(function (u, i) {
      var rec = ufPair(i, o, dd);
      return { label: u[1], v: rec.v, d: rec.d, p: rec.p };
    });
    lista.sort(function (a, b) { return (b.v - a.v) || (b.d - a.d); });
    var comTransicao = lista.filter(function (e) { return e.v > 0 || e.d > 0; });
    var maxV = lista.reduce(function (a, e) { return Math.max(a, e.v); }, 0) || 1;
    var maxD = lista.reduce(function (a, e) { return Math.max(a, e.d); }, 0) || 1;
    var maxP = lista.reduce(function (a, e) { return Math.max(a, e.p); }, 0) || 1;
    if (!comTransicao.length && maxP === 0) {
      $("rank-list").innerHTML = "";
      $("rank-empty").hidden = false;
      $("rank-empty").textContent = "Nenhuma área da classe Soja registrada nesta janela — a classe não estava presente nos anos selecionados.";
      return;
    }
    $("rank-empty").hidden = true;
    var html = "", ordem = 0;
    lista.forEach(function (e) {
      if (e.v <= 0 && e.d <= 0 && e.p <= 0) return;
      ordem++;
      html += '<div class="rank-row"><div class="rank-head">'
        + '<span class="pos num">' + String(ordem).padStart(2, "0") + '</span>'
        + '<span class="uf">' + e.label + '</span>'
        + '<span class="val num">' + resumo(e.v)
        + (e.d > 0 ? ' <small>· −' + resumo(e.d).replace("−", "") + '</small>' : '')
        + '</span></div>'
        + '<div class="bars">'
        + '<div class="bar-track"><div class="bar" style="width:' + (e.v > 0 ? Math.max(1.5, 100 * e.v / maxV).toFixed(1) : "0") + '%"></div></div>'
        + (e.d > 0
          ? '<div class="bar-track"><div class="bar deixou" style="width:' + Math.max(1.5, 100 * e.d / maxD).toFixed(1) + '%"></div></div>'
          : '<div class="bar-track"><div class="bar-zero-fill"></div></div>')
        + (e.p > 0
          ? '<div class="bar-track"><div class="bar perm" style="width:' + Math.max(1.5, 100 * e.p / maxP).toFixed(1) + '%"></div></div>'
          : '<div class="bar-track"><div class="bar-zero-fill"></div></div>')
        + '</div></div>';
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
        + '<span class="nm">' + c.nm + '</span><span class="pv num">' + pct(c.v, t) + '</span></div>';
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
        + '<span class="pv num">' + pct(c.area, total) + '</span></div>';
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

  function valoresMapa(o, dd, metrica) {
    return UFS.map(function (u, i) {
      var r = ufPair(i, o, dd);
      if (metrica === "virou") return r.v;
      if (metrica === "deixou") return r.d;
      if (metrica === "perm") return r.p;
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
    $("mapa-desc").textContent = "Cada UF pintada pela " + ({
      virou: "área que virou soja", deixou: "área que deixou de ser soja",
      saldo: "área líquida (virou − deixou)", perm: "área que permaneceu soja"
    })[metrica] + " entre " + o + " e " + dd + ".";
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
          var r = RAMPA[metrica];
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
        grad = "linear-gradient(90deg," + RAMPA[metrica][0] + "," + RAMPA[metrica][1] + ")";
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
        + '<div class="t-metrica num">' + resumo(r.v - r.d) + ' de saldo</div>'
        + '<div class="num">' + resumo(r.v) + ' virou · ' + resumo(r.d).replace("−", "") + ' deixou</div>'
        + '<div class="num">' + resumo(r.p) + ' permaneceu</div>';
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
      + '<p class="hint" style="margin-top:16px">' + nome + " · " + o + " → " + dd + (ui < 0 && r ? " · " + r.n + " UFs com soja" : "") + '</p>';
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
  function renderEvo() {
    var o = +selO.value;
    var ultimo = ANOS[ANOS.length - 1];
    if (MODO === "comparar") {
      $("evo-titulo").textContent = "Comparando trajetórias";
      $("evo-sub").textContent = "Origem fixa em " + o + " · mini-múltiplos por estado";
      var multi = $("evo-multi");
      if (!SELS.length) { multi.innerHTML = ""; $("evo-empty").hidden = false; $("evo-empty").textContent = "Selecione estados na seção “Um estado ou comparação” para ver suas trajetórias aqui."; return; }
      var blocks = SELS.map(function (i) {
        var s = serieOrigem(i, o);
        var maxV = s.serie.reduce(function (a, x) { return Math.max(a, x.v); }, 0) || 1;
        var maxD = s.serie.reduce(function (a, x) { return Math.max(a, x.d); }, 0) || 1;
        return '<div class="mini-evo"><h4>' + UFS[i][1] + '</h4>'
          + '<div class="evo-cols">' + colunas(s.serie, maxV, maxD) + '</div>'
          + '<p class="hint" style="margin-top:4px">origem ' + o + (s.tem ? "" : " · sem soja registrada") + '</p></div>';
      }).join("");
      $("evo-empty").hidden = true;
      multi.innerHTML = blocks;
      return;
    }
    var ui = +selUF.value;
    var nome = ui < 0 ? "Brasil (todas as UFs)" : UFS[ui][1];
    var s = serieOrigem(ui, o);
    $("evo-sub").textContent = "Origem fixa em " + o + " · destino em cada ano seguinte · " + nome;
    $("evo-titulo").textContent = nome + " · trajetórias da soja de " + o;
    if (!s.tem) {
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
  function renderAll() {
    var r = renderResumo();
    renderRanking(r);
    renderEstrutura(r);
    renderComp(r.v, r.dv, "comp-bar", "comp-legend");
    renderComp(r.d, r.dd, "comp-bar-d", "comp-legend-d");
    renderMapa();
    renderFicha();
    renderEvo();
  }

  selO.addEventListener("change", function () { opcoesDestino(); renderAll(); });
  selD.addEventListener("change", renderAll);
  selUF.addEventListener("change", function () { renderFicha(); renderEvo(); });

  $("cob-zero").textContent = SEM_DADOS.join(" · ") || "—";
  $("cob-zero2").textContent = SEM_DADOS.join(", ") || "—";

  renderAll();
})();
