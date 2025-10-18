const replaceContainer = document.getElementById("replaceContainer");
const originalTextElement = document.getElementById("originalText");
const resultTextElement = document.getElementById("resultText");
const jsonInput = document.getElementById("jsonInput");

const staticsElement = document.getElementById("statics");

// デフォルトの置換ルール
const defaultReplacements = {
  "replacements": [
    { "before": "\\n", "after": "", "regex": true, "enabled": true },
    { "before": "\\?", "after": "?\\n", "regex": true, "enabled": true },
    { "before": "？", "after": "？\\n", "regex": true, "enabled": true },
    { "before": "(\\d+)\\n", "after": "$1,", "regex": true, "enabled": true },
    { "before": "</?div>", "after": "<br>", "regex": true, "enabled": true },
    { "before": "(<br>)+", "after": "<br>", "regex": true, "enabled": true },
    { "before": "(\\d+) +年", "after": "$1年", "regex": true, "enabled": true },
    { "before": "(\\d{1,2}) +月", "after": "$1月", "regex": true, "enabled": true },
    { "before": "(\\d{1,2}) +日", "after": "$1日", "regex": true, "enabled": true },
    { "before": "年 +(\\d{1,2})", "after": "年$1", "regex": true, "enabled": true },
    { "before": "月 +(\\d{1,2})", "after": "月$1", "regex": true, "enabled": true },
    { "before": "(\\d{1,3}) +歳", "after": "$1歳", "regex": true, "enabled": true },
    { "before": "(\\d{1,3}) +才", "after": "$1才", "regex": true, "enabled": true },
    { "before": "(\\d{1,2}) +日", "after": "$1日", "regex": true, "enabled": true },
    { "before": "（", "after": "(", "regex": false, "enabled": true },
    { "before": "）", "after": ")", "regex": false, "enabled": true },
    { "before": "You tube", "after": "YouTube", "regex": false, "enabled": true },
    { "before": "Youtube", "after": "YouTube", "regex": false, "enabled": true },
    { "before": "(\\d{1,4})-(\\d{1,2})-(\\d{1,2})", "after": "$1年$2月$3日", "regex": true, "enabled": false },
    { "before": "(\\d{1,4})/(\\d{1,2})/(\\d{1,2})", "after": "$1年$2月$3日", "regex": true, "enabled": false },
    { "before": "年0(\\d)月", "after": "年$1月", "regex": true, "enabled": false },
    { "before": "月0(\\d)日", "after": "月$1日", "regex": true, "enabled": false },
    { "before": "\\* (.+)（(.+)）\\n", "after": "|-\\n| $2 || $1\\n", "regex": true, "enabled": false },
  ]
};

// ページ読み込み時に保存されたデータを取得して表示
window.addEventListener("DOMContentLoaded", () => {
  console.log("DOMContentLoaded: イベント発火");
  const savedText = localStorage.getItem("originalText");
  if (savedText !== null) {
      originalTextElement.value = savedText;
      console.log("DOMContentLoaded: originalTextをロードしました");
  }

  const savedJson = localStorage.getItem("replacementsJson");
  if (savedJson !== null) {
      jsonInput.value = savedJson;
      console.log("DOMContentLoaded: replacementsJsonをロードしました");
  } else {
      jsonInput.value = JSON.stringify(defaultReplacements, null, 2);
      console.log("DOMContentLoaded: defaultReplacementsをセットしました");
  }
  renderReplacePairsFromJson();
  performReplace();
  document.body.classList.add("loaded"); // ページを表示
  console.log("DOMContentLoaded: 初期化処理完了");
});

// JSONから置換ペアをレンダリングする関数
function renderReplacePairsFromJson() {
  console.log("renderReplacePairsFromJson: 開始");
  replaceContainer.innerHTML = ""; // 既存のペアをクリア
  let replacementsData = { "replacements": [] };
  try {
    replacementsData = JSON.parse(jsonInput.value);
    localStorage.setItem("replacementsJson", jsonInput.value);
    console.log("renderReplacePairsFromJson: JSONをパースしました", replacementsData);
  } catch (e) {
    console.error("JSONパースエラー:", e);
    replaceContainer.innerHTML = `<div style="color: red;">JSONの形式が正しくありません。</div>`;
    console.log("renderReplacePairsFromJson: JSONパースエラーメッセージを表示");
    return;
  }

  if (!replacementsData.replacements || !Array.isArray(replacementsData.replacements)) {
    replaceContainer.innerHTML = `<div style="color: red;">JSONには 'replacements' 配列が必要です。</div>`;
    console.log("renderReplacePairsFromJson: 'replacements' 配列エラーメッセージを表示");
    return;
  }

  console.log("renderReplacePairsFromJson: replaceContainer.innerHTMLをクリア");
  replacementsData.replacements.forEach((replace) => {
    const pair = document.createElement("div");
    pair.classList.add("replace-pair");

    const beforeText = replace.before !== undefined ? replace.before : "";
    const afterText = replace.after !== undefined ? replace.after : "";
    const isRegex = replace.regex === true;
    const isEnabled = replace.enabled !== false; // デフォルトはtrue

    pair.innerHTML = `
      <label></label><input type="text" class="searchText" value="${beforeText}">
      →
      <label></label><input type="text" class="replaceText" value="${afterText}">
      <label class="inline"><input type="checkbox" class="regexToggle" ${isRegex ? "checked" : ""}>正規表現を使用</label>
      <label class="inline"><input type="checkbox" class="replaceToggle" ${isEnabled ? "checked" : ""}>置換実行</label>
    `;
    replaceContainer.appendChild(pair);
  });
  console.log("renderReplacePairsFromJson: 置換ペアをレンダリングしました");
  performReplace(); // UIが更新されたら置換を再実行
  console.log("renderReplacePairsFromJson: 終了");
}

// 置換ペアUIからJSONを更新する関数
function updateJsonInputFromPairs() {
  const replacements = [];
  document.querySelectorAll(".replace-pair").forEach(pair => {
    const before = pair.querySelector(".searchText").value;
    const after = pair.querySelector(".replaceText").value;
    const regex = pair.querySelector(".regexToggle").checked;
    const enabled = pair.querySelector(".replaceToggle").checked;

    const replacement = { before, after };
    if (regex) replacement.regex = true;
    if (!enabled) replacement.enabled = false;
    replacements.push(replacement);
  });
  jsonInput.value = JSON.stringify({ replacements }, null, 2);
  localStorage.setItem("replacementsJson", jsonInput.value);
  performReplace(); // JSONが更新されたら置換を再実行
}

// JSON入力が変更されたらUIを更新
jsonInput.addEventListener("input", renderReplacePairsFromJson);

// 置換ペアUIが変更されたらJSONを更新
replaceContainer.addEventListener("input", updateJsonInputFromPairs);

// 動的に検索・置換ペアを追加
document.getElementById("addPair").addEventListener("click", () => {
    const replacementsData = JSON.parse(jsonInput.value);
    replacementsData.replacements.push({ "before": "", "after": "", "regex": false, "enabled": true });
    jsonInput.value = JSON.stringify(replacementsData, null, 2);
    renderReplacePairsFromJson();
});

// 動的に検索・置換ペアを削除(最低1ペアは残す)
document.getElementById("removePair").addEventListener("click", () => {
    let replacementsData = JSON.parse(jsonInput.value);
    if (replacementsData.replacements.length > 1) {
        replacementsData.replacements.pop();
        jsonInput.value = JSON.stringify(replacementsData, null, 2);
        renderReplacePairsFromJson();
    }
});

document.getElementById("toggleAllOn").addEventListener("click", () => {
  let replacementsData = JSON.parse(jsonInput.value);
  replacementsData.replacements.forEach(r => r.enabled = true);
  jsonInput.value = JSON.stringify(replacementsData, null, 2);
  renderReplacePairsFromJson();
});

document.getElementById("toggleAllOff").addEventListener("click", () => {
  let replacementsData = JSON.parse(jsonInput.value);
  replacementsData.replacements.forEach(r => r.enabled = false);
  jsonInput.value = JSON.stringify(replacementsData, null, 2);
  renderReplacePairsFromJson();
});



// 置換処理・置換前後の変化も反映。
function performReplace() {
    console.log("performReplace: 開始");
    const originalText = originalTextElement.value;
    localStorage.setItem("originalText", originalText);
    console.log("performReplace: originalTextをlocalStorageに保存");

    let replacementsData = { "replacements": [] };
    try {
      replacementsData = JSON.parse(jsonInput.value);
      console.log("performReplace: JSONをパースしました", replacementsData);
    } catch (e) {
      console.error("JSONパースエラー (performReplace):", e);
      resultTextElement.value = "JSONの形式が正しくありません。";
      console.log("performReplace: JSONパースエラーメッセージを表示");
      return;
    }

    if (!replacementsData.replacements || !Array.isArray(replacementsData.replacements)) {
      resultTextElement.value = "JSONには 'replacements' 配列が必要です。";
      console.log("performReplace: 'replacements' 配列エラーメッセージを表示");
      return;
    }

    let result = originalText;
    replacementsData.replacements.forEach((replace) => {
        const searchText = replace.before;
        let replaceText = replace.after;
        const useRegex = replace.regex === true;
        const enabled = replace.enabled !== false;

        if(!enabled){
          console.log(`performReplace: 置換をスキップ (before: ${searchText})`);
          return; // スキップ
        }

        // 改行文字(\n)の実際の改行への変換
        replaceText = replaceText.replace(/\\n/g, "\n");

        try {
            if (searchText) {
                if (useRegex) {
                    const regex = new RegExp(searchText, "g"); // 正規表現モード
                    result = result.replace(regex, replaceText);
                    console.log(`performReplace: 正規表現置換実行 (before: ${searchText}, after: ${replaceText})`);
                } else {
                    const escapedSearchText = searchText.replace(
                        /[-/\\^$*+?.()|[\]{}]/g,
                        "\\$&"
                    ); // エスケープ
                    const regex = new RegExp(escapedSearchText, "g");
                    result = result.replace(regex, replaceText);
                    console.log(`performReplace: リテラル置換実行 (before: ${searchText}, after: ${replaceText})`);
                }
            }
        } catch (error) {
            resultTextElement.value = "正規表現の構文エラーがあります。確認してください。";
            console.error("performReplace: 正規表現構文エラー:", error);
        }
    });

    resultTextElement.value = result;
    console.log("performReplace: 結果テキストを更新");

    updateCounts()
    console.log("performReplace: 終了");
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
