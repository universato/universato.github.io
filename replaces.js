const replaceContainer = document.getElementById("replaceContainer");
const addPairButton = document.getElementById("addPair");
const removePairButton = document.getElementById("removePair");
const originalTextElement = document.getElementById("originalText");
const resultTextElement = document.getElementById("resultText");

// カウント結果を表示する要素
const countCharacterBefore = document.getElementById("countCharacterBefore");
const countCharacterAfter = document.getElementById("countCharacterAfter");
const countCharacterDiff = document.getElementById("countCharacterDiff");

const countQuestionBefore = document.getElementById("countQuestionBefore");
const countQuestionAfter = document.getElementById("countQuestionAfter");
const countQuestionDiff = document.getElementById("countQuestionDiff");

const countFullWidthQuestionBefore = document.getElementById("countFullWidthQuestionBefore");
const countFullWidthQuestionAfter = document.getElementById("countFullWidthQuestionAfter");
const countFullWidthQuestionDiff = document.getElementById("countFullWidthQuestionDiff");

const countNewLineBefore = document.getElementById("countNewLineBefore");
const countNewLineAfter = document.getElementById("countNewLineAfter");
const countNewLineDiff = document.getElementById("countNewLineDiff");

const countReturnBefore = document.getElementById("countReturnBefore");
const countReturnAfter = document.getElementById("countReturnAfter");
const countReturnDiff = document.getElementById("countReturnDiff");

const countFullwidthLeftParenthesisBefore = document.getElementById("countFullwidthLeftParenthesisBefore");
const countFullwidthLeftParenthesisAfter = document.getElementById("countFullwidthLeftParenthesisAfter");
const countFullwidthLeftParenthesisDiff = document.getElementById("countFullwidthLeftParenthesisDiff");

const countFullwidthRightParenthesisBefore = document.getElementById("countFullwidthRightParenthesisBefore");
const countFullwidthRightParenthesisAfter = document.getElementById("countFullwidthRightParenthesisAfter");
const countFullwidthRightParenthesisDiff = document.getElementById("countFullwidthRightParenthesisDiff");

const countLeftParenthesisBefore = document.getElementById("countLeftParenthesisBefore");
const countLeftParenthesisAfter = document.getElementById("countLeftParenthesisAfter");
const countLeftParenthesisDiff = document.getElementById("countLeftParenthesisDiff");

const countRightParenthesisBefore = document.getElementById("countRightParenthesisBefore");
const countRightParenthesisAfter = document.getElementById("countRightParenthesisAfter");
const countRightParenthesisDiff = document.getElementById("countRightParenthesisDiff");

const countStartDivTagBefore = document.getElementById("countStartDivTagBefore");
const countStartDivTagAfter = document.getElementById("countStartDivTagAfter");
const countStartDivTagDiff = document.getElementById("countStartDivTagDiff");

const countEndDivTagBefore = document.getElementById("countEndDivTagBefore");
const countEndDivTagAfter = document.getElementById("countEndDivTagAfter");
const countEndDivTagDiff = document.getElementById("countEndDivTagDiff");


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
    ["(\\d{1,3}) +歳", "$1歳", true, true],
    ["(\\d{1,3}) +才", "$1才", true, true],
    ["（", "(", false, true],
    ["）", ")", false, true],
    ["You tube", "YouTube", false, true],
    ["Youtube", "YouTube", false, true],
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
 * @returns {number} - 出現回数
 */
function countOccurrences(text, target) {
  const regex = new RegExp(target.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g');
  const matches = text.match(regex);
  return matches ? matches.length : 0;
}

/**
 * テキストエリアの内容をカウントして結果を更新する関数
 */
function updateCounts() {
  // テキストエリアの内容
  const beforeText = originalTextElement.value;
  const afterText = resultTextElement.value;

  // 全体の文字数カウント
  const beforeCharacterCount = beforeText.length;
  const afterCharacterCount = afterText.length;
  countCharacterBefore.textContent = beforeCharacterCount;
  countCharacterAfter.textContent = afterCharacterCount;
  countCharacterDiff.textContent = afterCharacterCount - beforeCharacterCount;

  // 半角クエスチョンマーク `?` のカウント
  const beforeQuestionCount = countOccurrences(beforeText, "?");
  const afterQuestionCount = countOccurrences(afterText, "?");
  countQuestionBefore.textContent = beforeQuestionCount;
  countQuestionAfter.textContent = afterQuestionCount;
  countQuestionDiff.textContent = afterQuestionCount - beforeQuestionCount;

  // 全角クエスチョンマーク `？` のカウント
  const beforeFullWidthQuestionCount = countOccurrences(beforeText, "？");
  const afterFullWidthQuestionCount = countOccurrences(afterText, "？");
  countFullWidthQuestionBefore.textContent = beforeFullWidthQuestionCount;
  countFullWidthQuestionAfter.textContent = afterFullWidthQuestionCount;
  countFullWidthQuestionDiff.textContent = afterFullWidthQuestionCount - beforeFullWidthQuestionCount;

  // 改行\nのカウント
  const beforeNewLineCount = countOccurrences(beforeText, "\n");
  const afterNewLineCount = countOccurrences(afterText, "\n");
  countNewLineBefore.textContent = beforeNewLineCount;
  countNewLineAfter.textContent = afterNewLineCount;
  countNewLineDiff.textContent = afterNewLineCount - beforeNewLineCount;

  // 改行\rのカウント
  const beforeReturnCount = countOccurrences(beforeText, "\r");
  const afterReturnCount = countOccurrences(afterText, "\r");
  countReturnBefore.textContent = beforeReturnCount;
  countReturnAfter.textContent = afterReturnCount;
  countReturnDiff.textContent = afterReturnCount - beforeReturnCount;

  // 全角丸括弧 `（` のカウント
  const beforeFullwidthLeftParenthesisCount = countOccurrences(beforeText, "（");
  const afterFullwidthLeftParenthesisCount = countOccurrences(afterText, "（");
  countFullwidthLeftParenthesisBefore.textContent = beforeFullwidthLeftParenthesisCount;
  countFullwidthLeftParenthesisAfter.textContent = afterFullwidthLeftParenthesisCount;
  countFullwidthLeftParenthesisDiff.textContent = afterFullwidthLeftParenthesisCount - beforeFullwidthLeftParenthesisCount;

  // 全角丸括弧 `）` のカウント
  const beforeFullwidthRightParenthesisCount = countOccurrences(beforeText, "）");
  const afterFullwidthRightParenthesisCount = countOccurrences(afterText, "）");
  countFullwidthRightParenthesisBefore.textContent = beforeFullwidthRightParenthesisCount;
  countFullwidthRightParenthesisAfter.textContent = afterFullwidthRightParenthesisCount;
  countFullwidthRightParenthesisDiff.textContent = afterFullwidthRightParenthesisCount - beforeFullwidthRightParenthesisCount;

  // 半角丸括弧 `(` のカウント
  const beforeLeftParenthesisCount = countOccurrences(beforeText, "(");
  const afterLeftParenthesisCount = countOccurrences(afterText, "(");
  countLeftParenthesisBefore.textContent = beforeLeftParenthesisCount;
  countLeftParenthesisAfter.textContent = afterLeftParenthesisCount;
  countLeftParenthesisDiff.textContent = afterLeftParenthesisCount - beforeLeftParenthesisCount;

  // 半角丸括弧 `)` のカウント
  const beforeRightParenthesisCount = countOccurrences(beforeText, ")");
  const afterRightParenthesisCount = countOccurrences(afterText, ")");
  countRightParenthesisBefore.textContent = beforeRightParenthesisCount;
  countRightParenthesisAfter.textContent = afterRightParenthesisCount;
  countRightParenthesisDiff.textContent = afterRightParenthesisCount - beforeRightParenthesisCount;

  // <div>のカウント
  const beforeStartDivTagCount = countOccurrences(beforeText, "<div>");
  const afterStartDivTagCount = countOccurrences(afterText, "<div>");
  countStartDivTagBefore.textContent = beforeStartDivTagCount;
  countStartDivTagAfter.textContent = afterStartDivTagCount;
  countStartDivTagDiff.textContent = afterStartDivTagCount - beforeStartDivTagCount;

  // </div>のカウント
  const beforeEndDivTagCount = countOccurrences(beforeText, "</div>");
  const afterEndDivTagCount = countOccurrences(afterText, "</div>");
  countEndDivTagBefore.textContent = beforeEndDivTagCount;
  countEndDivTagAfter.textContent = afterEndDivTagCount;
  countEndDivTagDiff.textContent = afterEndDivTagCount - beforeEndDivTagCount;
}

// 入力が変わるたびに置換を実行
originalTextElement.addEventListener("input", performReplace);
replaceContainer.addEventListener("input", performReplace);
