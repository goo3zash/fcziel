// ============================================================
// FC ZIEL サイト更新スクリプト
// Google Apps Script に貼り付けて使用
// ============================================================

const OWNER = 'fcziel';
const REPO  = 'fcziel.github.io';

// ── GitHub API ──────────────────────────────────────────────

function getToken() {
  return PropertiesService.getScriptProperties().getProperty('GITHUB_TOKEN');
}

function getFile(path) {
  const res  = UrlFetchApp.fetch(
    `https://api.github.com/repos/${OWNER}/${REPO}/contents/${path}`,
    { headers: { 'Authorization': `Bearer ${getToken()}` } }
  );
  const data = JSON.parse(res.getContentText());
  return {
    content: Utilities.newBlob(Utilities.base64Decode(data.content.replace(/\n/g, ''))).getDataAsString(),
    sha: data.sha
  };
}

function putFile(path, content, sha, message) {
  UrlFetchApp.fetch(
    `https://api.github.com/repos/${OWNER}/${REPO}/contents/${path}`,
    {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${getToken()}`, 'Content-Type': 'application/json' },
      payload: JSON.stringify({
        message,
        content: Utilities.base64Encode(Utilities.newBlob(content, 'UTF-8').getBytes()),
        sha
      })
    }
  );
}

// ── フォーム送信トリガー ────────────────────────────────────

function onFormSubmit(e) {
  const v        = e.namedValues;
  const type     = (v['種別']          || [''])[0].trim();
  const date     = (v['日付']          || [''])[0].trim();  // 例: 5/31（日）
  const time     = (v['時刻']          || [''])[0].trim();  // 例: 10:45
  const opponent = (v['相手チーム']    || [''])[0].trim();
  const venue    = (v['会場']          || [''])[0].trim();
  const result   = (v['結果']          || [''])[0].trim();  // 勝 / 負 / 分
  const scoreH   = (v['FC ZIELスコア'] || [''])[0].trim();
  const scoreA   = (v['相手スコア']    || [''])[0].trim();

  try {
    if (type === '試合結果を登録') {
      addMatchResult(date, time, opponent, venue, result, scoreH, scoreA);
    } else if (type === '次の試合を設定') {
      setNextMatch(date, time, opponent, venue);
    }
  } catch (err) {
    // エラーをメールで通知
    MailApp.sendEmail('zeinokada@gmail.com', '[FC ZIEL] サイト更新エラー', err.toString());
  }
}

// ── 試合結果を登録 ──────────────────────────────────────────

function addMatchResult(date, time, opponent, venue, result, scoreH, scoreA) {
  const map = {
    '勝': { rowClass: 'result-win',  badgeClass: 'badge-win',  badge: '○ 勝', scoreClass: 'win',  mark: '○' },
    '負': { rowClass: 'result-loss', badgeClass: 'badge-loss', badge: '● 負', scoreClass: 'loss', mark: '●' },
    '分': { rowClass: 'result-draw', badgeClass: 'badge-draw', badge: '△ 分', scoreClass: 'draw', mark: '△' },
  };
  const r = map[result] || map['負'];
  const venueShort = venue === '赤羽スポーツの森' ? '赤スポ' : venue === '北運動公園' ? '北運動' : venue;

  // 1. results.html に行追加
  const matchRow =
`            <tr class="${r.rowClass}">
              <td>${date}</td>
              <td>${opponent}</td>
              <td>${venue}</td>
              <td><span class="match-score ${r.scoreClass}">${scoreH} − ${scoreA}</span></td>
              <td><span class="match-badge ${r.badgeClass}">${r.badge}</span></td>
            </tr>`;

  const MARKER = '<!-- ▼ 試合結果をここに追加（新しい順） ▼ -->';
  const rf = getFile('results.html');
  putFile('results.html',
    rf.content.replace(MARKER, MARKER + '\n' + matchRow),
    rf.sha,
    `試合結果追加: ${date} vs ${opponent} ${scoreH}-${scoreA}`
  );

  // 2. index.html のニュース追加 & ポップアップ更新
  const newsItem =
`        <div class="news-item news-result">
          <span class="news-tag tag-result">結果</span>
          <span class="news-date">${date}${time ? ' ' + time : ''}</span>
          <span class="news-body">2部A　<strong>FC ZIEL vs ${opponent}</strong>　@ ${venue}
            <span class="news-score ${r.scoreClass}">${scoreH} - ${scoreA} ${r.mark}</span>
          </span>
        </div>`;

  const popupResult =
`          <!-- POPUP_RESULT_START -->
          <div class="popup-news-item">
            <span class="popup-news-tag tag-result">結果</span>
            <span>${date} FC ZIEL vs ${opponent}　<span class="${r.scoreClass}">${scoreH} - ${scoreA} ${r.mark}</span></span>
          </div>
          <!-- POPUP_RESULT_END -->`;

  const inf = getFile('index.html');
  let html = inf.content;

  html = html.replace('<!-- NEWS_INSERT -->', '<!-- NEWS_INSERT -->\n' + newsItem);
  html = html.replace(
    /<!-- POPUP_RESULT_START -->[\s\S]*?<!-- POPUP_RESULT_END -->/,
    popupResult
  );

  putFile('index.html', html, inf.sha, `試合結果追加: ${date} vs ${opponent}`);
}

// ── 次の試合を設定 ──────────────────────────────────────────

function setNextMatch(date, time, opponent, venue) {
  const venueShort = venue === '赤羽スポーツの森' ? '赤スポ' : venue === '北運動公園' ? '北運動' : venue;
  const datetime   = time ? `${date} ${time}` : date;

  const newsUpcoming =
`        <!-- NEXT_MATCH_START -->
        <div class="news-item news-upcoming">
          <span class="news-tag tag-upcoming">次の試合</span>
          <span class="news-date">${datetime}</span>
          <span class="news-body">2部A　<strong>${opponent} vs FC ZIEL</strong>　@ ${venue}</span>
        </div>
        <!-- NEXT_MATCH_END -->`;

  const popupUpcoming =
`          <!-- POPUP_UPCOMING_START -->
          <div class="popup-news-item">
            <span class="popup-news-tag tag-upcoming">次の試合</span>
            <span>${datetime}　${opponent} vs FC ZIEL　@ ${venueShort}</span>
          </div>
          <!-- POPUP_UPCOMING_END -->`;

  const inf = getFile('index.html');
  let html = inf.content;

  html = html.replace(
    /<!-- NEXT_MATCH_START -->[\s\S]*?<!-- NEXT_MATCH_END -->/,
    newsUpcoming
  );
  html = html.replace(
    /<!-- POPUP_UPCOMING_START -->[\s\S]*?<!-- POPUP_UPCOMING_END -->/,
    popupUpcoming
  );

  putFile('index.html', html, inf.sha, `次の試合更新: ${datetime} vs ${opponent}`);
}
