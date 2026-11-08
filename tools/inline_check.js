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

  function ha(v) { return fmt.format(Math.round(v || 0)) + " ha"; }
  function resumo(v) {
    v = v || 0;
    if (v >= 1e6) return (v / 1e6).toFixed(2).replace(".", ",") + " M ha";
    if (v >= 1e4) return fmt.format(Math.round(v / 1e3)) + " mil ha";
    if (v >= 1e3) return (v / 1e3).toFixed(1).replace(".", ",") + " mil ha";
    return fmt.format(Math.round(v)) + " ha";
  }
  function pct(v, t) { return t > 0 ? (100 * v / t).toFixed(1).replace(".", ",") + "%" : "0%"; }

  /* ---- dados ---- */
  var ANOS = DADOS.anos;              // [1985..2025]
  var UFS = DADOS.ufs;                // [ [codigo, label], ... ]
  var CLS = {};
  DADOS.classes.forEach(function (p) { CLS[p[0]] = p[1]; });

  /* índice por UF: key "o-d" -> {v, d, p, dv: [[cid,a]...], dd: [[cid,a]...]} */
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

  function classesDe(mapOuArr) {
    var arr = Array.isArray(mapOuArr)
      ? mapOuArr.map(function (c) { return { id: c[0], area: c[1] }; })
      : Object.keys(mapOuArr).map(function (k) { return { id: +k, area: mapOuArr[k] }; });
    return arr.sort(function (a, b) { return b.area - a.area; });
  }

  /* ---- console ---- */
  var selO = $("ano-origem"), selD = $("ano-destino"), selUF = $("uf-select");
  var O0 = 2018, D0 = 2024;   // janela padrão — mesma do levantamento anterior

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

  function janela() { return [+selO.value, +selD.value]; }

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
    var rankDesc = "Área que virou soja e a que deixou de ser soja entre " + o + " e " + dd + ", por unidade federativa, em hectares.";
    $("rank-desc").textContent = rankDesc;
    $("comp-v-hint").textContent = "Composição das áreas que viraram soja (" + resumo(r.v) + ") pelas classes de uso no ano de origem (" + o + ").";
    $("comp-d-hint").textContent = "Composição das áreas que deixaram de ser soja (" + resumo(r.d) + ") pelas classes de uso no ano de destino (" + dd + ").";
    return r;
  }

  function renderRanking(r) {
    var lista = [];
    UFS.forEach(function (u, i) {
      var rec = ufPair(i, +selO.value, +selD.value);
      lista.push({ label: u[1], i: i, v: rec.v, d: rec.d });
    });
    lista.sort(function (a, b) { return (b.v - a.v) || (b.d - a.d); });
    var comTransicao = lista.filter(function (e) { return e.v > 0 || e.d > 0; });
    if (!comTransicao.length) {
      $("rank-list").innerHTML = "";
      $("rank-empty").hidden = false;
      $("rank-empty").textContent = r.p > 0
        ? "Nesta janela a soja só permaneceu — nenhuma área virou ou deixou de ser soja."
        : "Nenhuma transição registrada no Brasil nesta janela — a classe Soja não estava presente nos anos selecionados.";
      return;
    }
    $("rank-empty").hidden = true;
    var maxV = lista.reduce(function (a, e) { return Math.max(a, e.v); }, 0) || 1;
    var maxD = lista.reduce(function (a, e) { return Math.max(a, e.d); }, 0) || 1;
    var html = "", ordem = 0;
    lista.forEach(function (e) {
      if (e.v <= 0 && e.d <= 0) return;
      ordem++;
      var wV = Math.max(1.5, 100 * e.v / maxV);
      html += '<div class="rank-row"><div class="rank-head">'
        + '<span class="pos num">' + String(ordem).padStart(2, "0") + '</span>'
        + '<span class="uf">' + e.label + '</span>'
        + '<span class="val num">' + resumo(e.v) + (e.d > 0 ? ' <small>· −' + resumo(e.d) + '</small>' : '') + '</span></div>'
        + '<div class="bars"><div class="bar-track"><div class="bar" style="width:' + (e.v > 0 ? wV.toFixed(1) : "0") + '%"></div></div>';
      if (e.d > 0) {
        html += '<div class="bar-track"><div class="bar deixou" style="width:' + Math.max(1.5, 100 * e.d / maxD).toFixed(1) + '%"></div></div>';
      } else {
        html += '<div class="bar-track"><div class="bar-zero-fill"></div></div>';
      }
      html += '</div></div>';
    });
    $("rank-list").innerHTML = html;
  }

  function renderComp(total, mapArr, barId, legId) {
    var comps = classesDe(mapArr).filter(function (c) { return c.area > 0; });
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

  function renderFicha() {
    var o = +selO.value, dd = +selD.value;
    var ui = +selUF.value;
    var nome = ui < 0 ? "Brasil (todas as UFs)" : UFS[ui][1];
    var rec;
    if (ui < 0) {
      var r = agrega(o, dd);
      rec = { v: r.v, d: r.d, p: r.p, dv: r.dv, dd: r.dd };
    } else {
      rec = ufPair(ui, o, dd);
    }
    var panel = $("state-panel");
    var totalUFs = (rec.v + rec.d + rec.p);
    if (!totalUFs) {
      panel.innerHTML = '<div class="state-empty">Nenhuma área da classe Soja registrada entre ' + o + ' e ' + dd + ' para esta seleção. Experimente outra janela no console acima.</div>';
      return;
    }
    var tot = '<div class="state-tot">'
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
            + '<div class="line"><span class="nm">' + CLS[c.id] + '</span><span class="v num">' + ha(c.area) + ' <span style="color:var(--vazio)">(' + pct(c.area, totalUFs) + ')</span></span></div>'
            + '<div class="cbar"><i style="width:' + Math.max(1.5, 100 * c.area / max).toFixed(1) + '%;background:' + cor + '"></i></div></div>';
        }).join("") + '</div></div>';
    }
    panel.innerHTML = tot
      + '<div class="state-cols">'
      + coluna("Origem da soja nova", "Em que uso a terra estava antes de virar soja, em " + o + ".", rec.dv, "Nenhuma área virou soja nesta seleção na janela analisada.")
      + coluna("Destino da soja perdida", "Para qual uso a terra foi quando deixou de ser soja, em " + dd + ".", rec.dd, "Nenhuma área deixou de ser soja nesta seleção na janela analisada.")
      + '</div>'
      + '<p class="hint" style="margin-top:16px">' + nome + " · " + o + " → " + dd + (ui < 0 ? " · " + r.n + " UFs com soja" : "") + '</p>';
  }

  function renderEvo() {
    var o = +selO.value;
    var ui = +selUF.value;
    var nome = ui < 0 ? "Brasil (todas as UFs)" : UFS[ui][1];
    var base, nTem = 0;
    var serie = [];
    for (var dd = o + 1; dd <= ANOS[ANOS.length - 1]; dd++) {
      var rec = ui < 0 ? agrega(o, dd) : ufPair(ui, o, dd);
      if (rec.v || rec.d || rec.p) nTem++;
      serie.push({ ano: dd, v: rec.v, d: rec.d, p: rec.p });
    }
    $("evo-sub").textContent = "Origem fixa em " + o + " · destino em cada ano seguinte · " + nome;
    if (!nTem) {
      $("evo-empty").hidden = false;
      $("evo-cols").innerHTML = "";
      $("evo-axis").innerHTML = "";
      $("evo-titulo").textContent = nome;
      return;
    }
    $("evo-empty").hidden = true;
    $("evo-titulo").textContent = nome + " · trajetórias da soja de " + o;
    var maxV = serie.reduce(function (a, s) { return Math.max(a, s.v); }, 0) || 1;
    var maxD = serie.reduce(function (a, s) { return Math.max(a, s.d); }, 0) || 1;
    var cols = "", axis = "";
    serie.forEach(function (s, i) {
      var hV = s.v > 0 ? Math.max(0.8, 50 * s.v / maxV) : 0;
      var hD = s.d > 0 ? Math.max(0.8, 50 * s.d / maxD) : 0;
      var t = "title=\"" + s.ano + " · virou: " + fmt.format(Math.round(s.v)) + " ha · deixou: " + fmt.format(Math.round(s.d)) + " ha · permaneceu: " + fmt.format(Math.round(s.p)) + " ha\"";
      cols += '<div class="evo-col">'
        + '<div class="evo-zone up" ' + t + '><i style="height:' + hV.toFixed(2) + '%"></i></div>'
        + '<div class="evo-zone down" ' + t + '><i style="height:' + hD.toFixed(2) + '%"></i></div>'
        + '</div>';
      axis += '<span>' + ((s.ano === o + 1 || s.ano === ANOS[ANOS.length - 1] || s.ano % 5 === 0) ? s.ano : "") + '</span>';
    });
    $("evo-cols").innerHTML = cols;
    $("evo-axis").innerHTML = axis;
  }

  function renderAll() {
    var r = renderResumo();
    renderRanking(r);
    renderComp(r.v, r.dv, "comp-bar", "comp-legend");
    renderComp(r.d, r.dd, "comp-bar-d", "comp-legend-d");
    renderFicha();
    renderEvo();
  }

  selO.addEventListener("change", function () {
    opcoesDestino();
    renderAll();
  });
  selD.addEventListener("change", renderAll);
  selUF.addEventListener("change", function () { renderFicha(); renderEvo(); });

  /* --- cobertura estática (UFs sem soja) --- */
  $("cob-zero").textContent = SEM_DADOS.join(" · ") || "—";
  $("cob-zero2").textContent = SEM_DADOS.join(", ") || "—";

  renderAll();
})();
