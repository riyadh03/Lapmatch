import Constants from "expo-constants"

function getDevMachineHost() {
  const hostUri =
    Constants.expoConfig?.hostUri ||
    Constants.expoConfig?.debuggerHost ||
    Constants.manifest?.debuggerHost ||
    Constants.manifest2?.extra?.expoClient?.hostUri

  if (!hostUri || typeof hostUri !== "string") {
    return null
  }

  return hostUri.split(":")[0]
}

export function getApiUrl() {
  const envUrl = process.env.EXPO_PUBLIC_API_URL
  if (envUrl) {
    return envUrl
  }

  const host = getDevMachineHost()
  if (host) {
    return `http://${host}:8000`
  }

  return null
}

export async function apiFetch(path, options = {}) {
  const apiUrl = getApiUrl()
  if (!apiUrl) {
    throw new Error(
      "API base URL not resolved. Set EXPO_PUBLIC_API_URL (ex: http://192.168.1.50:8000) and restart Expo."
    )
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`
  const res = await fetch(`${apiUrl}${normalizedPath}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  })

  const contentType = res.headers.get("content-type") || ""
  const isJson = contentType.includes("application/json")
  const body = isJson ? await res.json() : await res.text()

  if (!res.ok) {
    throw new Error(typeof body === "string" ? body : JSON.stringify(body))
  }

  return body
}
