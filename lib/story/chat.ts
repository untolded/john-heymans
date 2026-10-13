/**
 * The code ChatGPT writes in the story: the scraper at the start of John's
 * algorithm, which pulls one week of the world ranking into a table. Shown
 * exactly as written (media/ChatGPT code example.txt); code is not copy, so
 * it is not translated.
 */
const SOURCE = `def scrape_world_ranking(rank_date: str, session: requests.Session | None = None) -> pd.DataFrame:
    client = session or requests.Session()
    response = client.get(
        _ranking_url(rank_date),
        headers={"User-Agent": USER_AGENT},
        timeout=REQUEST_TIMEOUT,
    )
    response.raise_for_status()
    soup = BeautifulSoup(response.text, "html.parser")
    table = soup.select_one("table")
    if table is None:
        raise ValueError(
            f"No ranking table found for {rank_date}; the site may now render it with JavaScript."
        )

    headers = [_clean_text(th.get_text(" ", strip=True)) for th in table.select("thead th")]
    rows: list[dict[str, object]] = []
    for row in table.select("tbody tr"):
        cells = row.find_all("td")
        if not cells:
            continue
        values = [_clean_text(cell.get_text(" ", strip=True)) for cell in cells]
        athlete_id = row.get("data-id", "")
        record: dict[str, object] = {
            "Ranking": values[0] if len(values) > 0 else "",
            "Name": values[1] if len(values) > 1 else "",
            "Birth": values[2] if len(values) > 2 else "",
            "Country": values[3] if len(values) > 3 else "",
            "Ranking Pts": values[4] if len(values) > 4 else "",
            "Type of Event": values[5] if len(values) > 5 else "",
            "Athlete ID": athlete_id,
            "Date Ranking": rank_date,
        }
        if headers:
            for index, header in enumerate(headers):
                if header and index < len(values):
                    record.setdefault(header, values[index])
        rows.append(record)

    result = pd.DataFrame(rows)
    if not result.empty:
        result["Ranking"] = pd.to_numeric(result["Ranking"], errors="coerce")
        result["Ranking Pts"] = pd.to_numeric(result["Ranking Pts"], errors="coerce")
    return result`;

export const CODE = SOURCE.split("\n");

export type Token = { t: string; k?: "com" | "str" | "num" | "key" | "fn" | "arg" };

const TOKEN =
  /(#.*$)|(f?"[^"]*")|(\b\d[\d_,]*\b)|(\b(?:def|return|for|in|if|else|not|is|or|and|continue|raise|import|from|None|True|False)\b)|(\b[a-zA-Z_]\w*(?=\())|(\b[a-z_]\w*(?==[^=]))/g;

/** A small Python highlighter: enough for the code on screen. */
export function highlight(line: string): Token[] {
  const out: Token[] = [];
  let last = 0;
  for (const m of line.matchAll(TOKEN)) {
    if (m.index! > last) out.push({ t: line.slice(last, m.index) });
    const k = m[1] ? "com" : m[2] ? "str" : m[3] ? "num" : m[4] ? "key" : m[5] ? "fn" : "arg";
    out.push({ t: m[0], k });
    last = m.index! + m[0].length;
  }
  if (last < line.length) out.push({ t: line.slice(last) });
  return out;
}
