const replaceContainer = document.getElementById("replaceContainer");
const addPairButton = document.getElementById("addPair");
const removePairButton = document.getElementById("removePair");
const originalTextElement = document.getElementById("originalText");
const resultTextElement = document.getElementById("resultText");

const staticsElement = document.getElementById("statics");

// // カウント結果を表示する要素
// const countCharacterBefore = document.getElementById("countCharacterBefore");
// const countCharacterAfter = document.getElementById("countCharacterAfter");
// let countCharacterDiff = document.getElementById("countCharacterDiff");

// ページ読み込み時に保存されたデータを取得して表示
window.addEventListener("DOMContentLoaded", () => {
  const savedText = localStorage.getItem("originalText");
  if (savedText !== null) {
      originalTextElement.value = savedText;
  }

  const replaces = [
    ["\\n", "", true, true],
    ["\\?", "?\\n", true, true],
    ["？", "？\\n", true, true],
    ["(\\d+)\\n", "$1,", true, true],
    ["</?div>", "<br>", true, true],
    ["(<br>)+", "<br>", true, true],
    ["(\\d+) +年", "$1年", true, true],
    ["(\\d{1,2}) +月", "$1月", true, true],
    ["(\\d{1,2}) +日", "$1日", true, true],
    ["年 +(\\d{1,2})", "年$1", true, true],
    ["月 +(\\d{1,2})", "月$1", true, true],
    ["(\\d{1,3}) +歳", "$1歳", true, true],
    ["(\\d{1,3}) +才", "$1才", true, true],
    ["(\\d{1,2}) +日", "$1日", true, true],
    ["（", "(", false, true],
    ["）", ")", false, true],
    ["You tube", "YouTube", false, true],
    ["Youtube", "YouTube", false, true],
    ["(\\d{1,4})-(\\d{1,2})-(\\d{1,2})", "$1年$2月$3日", true, false],
    ["(\\d{1,4})/(\\d{1,2})/(\\d{1,2})", "$1年$2月$3日", true, false]
  ];

  replaces.forEach((replace) => {
    const [beforeText, afterText, isCheckedRegex] = replace;

    const pair = document.createElement("div");
    pair.classList.add("replace-pair");

    pair.innerHTML = `
      <label></label><input type="text" class="searchText" value="${beforeText}">
      →
      <label></label><input type="text" class="replaceText" value="${afterText}">
      <label class="inline"><input type="checkbox" class="regexToggle" ${isCheckedRegex ? "checked" : ""}>正規表現を使用</label>
      <label class="inline"><input type="checkbox" class="replaceToggle" checked>置換実行</label>`;
    replaceContainer.appendChild(pair);
  })

  document.body.classList.add("loaded");

  performReplace()
});

// 動的に検索・置換ペアを追加
addPairButton.addEventListener("click", () => {
    const pair = document.createElement("div");
    pair.classList.add("replace-pair");

    pair.innerHTML = `
        <label></label><input type="text" class="searchText" value="">
        →
        <label></label><input type="text" class="replaceText" value="">
        <label class="inline"><input type="checkbox" class="regexToggle">正規表現を使用</label>
        <label class="inline"><input type="checkbox" class="replaceToggle" checked>置換実行</label>
    `;

    replaceContainer.appendChild(pair);
});

// 動的に検索・置換ペアを削除(最低1ペアは残す)
removePairButton.addEventListener("click", () => {
    const pairs = document.querySelectorAll(".replace-pair");
    if (pairs.length > 1) {
        replaceContainer.removeChild(pairs[pairs.length - 1]);
    }
});

document.getElementById("toggleAllOn").addEventListener("click", () => {
  document.querySelectorAll(".replaceToggle").forEach(checkbox => {
    checkbox.checked = true;
  });
});

document.getElementById("toggleAllOff").addEventListener("click", () => {
  document.querySelectorAll(".replaceToggle").forEach(checkbox => {
    checkbox.checked = false;
  });
});


// 置換処理・置換前後の変化も反映。
function performReplace() {
    const originalText = originalTextElement.value;
    const searchInputs = document.querySelectorAll(".searchText");
    const replaceInputs = document.querySelectorAll(".replaceText");
    const regexToggles = document.querySelectorAll(".regexToggle");
    const replaceToggles = document.querySelectorAll(".replaceToggle");

    localStorage.setItem("originalText", originalText);

    let result = originalText;
    searchInputs.forEach((searchInput, index) => {
        const searchText = searchInput.value;
        let replaceText = replaceInputs[index].value;
        const useRegex = regexToggles[index].checked;
        const replace = replaceToggles[index].checked;

        if(!replace){
          return; // スキップ
        }

        // 改行文字(\n)の実際の改行への変換
        replaceText = replaceText.replace(/\\n/g, "\n");

        try {
            if (searchText) {
                if (useRegex) {
                    const regex = new RegExp(searchText, "g"); // 正規表現モード
                    result = result.replace(regex, replaceText);
                } else {
                    const escapedSearchText = searchText.replace(
                        /[-/\\^$*+?.()|[\]{}]/g,
                        "\\$&"
                    ); // エスケープ
                    const regex = new RegExp(escapedSearchText, "g");
                    result = result.replace(regex, replaceText);
                }
            }
        } catch (error) {
            resultTextElement.value = "正規表現の構文エラーがあります。確認してください。";
        }
    });

    resultTextElement.value = result;

    updateCounts()
}

// ファイル選択時の処理
fileInput.addEventListener("change", (event) => {
  const file = event.target.files[0];

  if (!file) {
    console.log("[ALERT] File not Found");
    return;
  }

  const reader = new FileReader();
  // ファイル読み込み完了時の処理
  reader.onload = (e) => {
      originalTextElement.value = e.target.result;
      performReplace();
  };
  reader.readAsText(file); // ファイルをテキストとして読み込む
});

/**
 * 指定した文字の出現回数をカウントする関数
 * @param {string} text - 対象の文字列
 * @param {string} target - カウントする文字
 * @param {boolean} useRegex - target を正規表現として扱うかどうか
 * @returns {number} - 出現回数
 */
function countOccurrences(text, target, useRegex) {
  if (!useRegex) {
    target = target.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
  }
  const regex = new RegExp(target, 'g');
  const matches = text.match(regex);
  return matches ? matches.length : 0;
}

function addCountElement(search, displayText, useRegex) {
  const beforeText = originalTextElement.value;
  const afterText = resultTextElement.value;
  const beforeCount = countOccurrences(beforeText, search, useRegex);
  const afterCount = countOccurrences(afterText, search, useRegex);
  const diffCount = beforeCount - afterCount;

  const counter = document.createElement("div");

  counter.innerHTML = `
    ${displayText ? displayText : search}
    <span>${beforeCount}</span>→
    <span>${afterCount}</span>
    (<span>${diffCount}</span>)
  `;

  staticsElement.appendChild(counter);
}

/**
 * テキストエリアの内容をカウントして結果を更新する関数
 */
function updateCounts() {
  // テキストエリアの内容
  const beforeText = originalTextElement.value;
  const afterText = resultTextElement.value;

  staticsElement.innerHTML = `
    <div>文字数:
        <span id="countCharacterBefore"></span>→
        <span id="countCharacterAfter"></span>
        (<span id="countCharacterDiff"></span>)
    </div>
  `

  const countCharacterBefore = document.getElementById("countCharacterBefore");
  const countCharacterAfter = document.getElementById("countCharacterAfter");
  const countCharacterDiff = document.getElementById("countCharacterDiff");

  // 全体の文字数カウント
  const beforeCharacterCount = beforeText.length;
  const afterCharacterCount = afterText.length;
  countCharacterBefore.textContent = beforeCharacterCount;
  countCharacterAfter.textContent = afterCharacterCount;
  countCharacterDiff.textContent = afterCharacterCount - beforeCharacterCount;

  addCountElement("?", "半角？");
  addCountElement("？", "全角？");
  addCountElement("\n", "改行\\n");
  addCountElement("\r", "改行\\r");
  addCountElement("（", "全角（");
  addCountElement("）", "全角）");
  addCountElement("(", "半角(");
  addCountElement(")", "半角)");
  addCountElement("<div>", "&lt;div&gt;");
  addCountElement("</div>", "&lt;/div&gt;");
  addCountElement("\\d+", "\\d+", true);
  addCountElement("\\d+ +", "\\d+&nbsp;+", true);
  addCountElement(" +\\d+", "&nbsp;+\\d+", true);
  addCountElement("\\d+ +年", "\\d+ +年", true);
  addCountElement("\\d+ +月", "\\d+ +月", true);
  addCountElement("\\d+ +日", "\\d+ +日", true);
}

// 入力が変わるたびに置換を実行
originalTextElement.addEventListener("input", performReplace);
replaceContainer.addEventListener("input", performReplace);
