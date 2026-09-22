export async function readJson<T = any>(response: Response): Promise<T> {
  const contentType = response.headers.get("content-type") || "";
  const text = await response.text();

  if (!contentType.includes("application/json")) {
    const preview = text.replace(/\s+/g, " ").slice(0, 180);
    throw new Error(
      response.ok
        ? "الخادم أعاد استجابة غير صالحة بدل JSON"
        : `خطأ من الخادم (${response.status}). ${preview}`,
    );
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error("استجابة الخادم غير صالحة (JSON)");
  }
}
