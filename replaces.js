const replaceContainer = document.getElementById("replaceContainer");
const addPairButton = document.getElementById("addPair");
const removePairButton = document.getElementById("removePair");
const originalTextElement = document.getElementById("originalText");
const resultTextElement = document.getElementById("resultText");

// ページ読み込み時に保存されたデータを取得して表示
window.addEventListener("DOMContentLoaded", () => {
  const savedText = localStorage.getItem("originalText");
  if (savedText !== null) {
      originalTextElement.value = savedText;
  }

  performReplace()
});

// 動的に検索・置換ペアを追加
addPairButton.addEventListener("click", () => {
    const pair = document.createElement("div");
    pair.classList.add("replace-pair");

    pair.innerHTML = `
        <label></label><input type="text" class="searchText" placeholder="">
        →
        <label></label><input type="text" class="replaceText" placeholder="">
        <label class="inline"><input type="checkbox" class="regexToggle">正規表現を使用</label>
        <label class="inline"><input type="checkbox" class="replaceToggle" checked>置換実行</label>
    `;

    replaceContainer.appendChild(pair);
});

// 動的に検索・置換ペアを削除（最低1ペアは残す）
removePairButton.addEventListener("click", () => {
    const pairs = document.querySelectorAll(".replace-pair");
    if (pairs.length > 1) {
        replaceContainer.removeChild(pairs[pairs.length - 1]);
    }
});

// 置換処理
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

        // 改行文字（\n）の実際の改行への変換
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
}

// 入力が変わるたびに置換を実行
originalTextElement.addEventListener("input", performReplace);
replaceContainer.addEventListener("input", performReplace);
