"""Custom tools used by the research agent."""

import httpx
from langchain_core.tools import BaseTool

WOLFRAM_ALPHA_URL = "https://api.wolframalpha.com/v2/query"

# Wolfram|Alpha's edge (nginx) rejects httpx's default "python-httpx/..." User-Agent
# with HTTP 403, so an explicit one is always sent.
USER_AGENT = "rag-app/1.0 (wolfram-alpha tool)"


class WolframAlphaTool(BaseTool):
    """Query the Wolfram|Alpha Full Results API directly.

    We don't use ``langchain_community``'s ``WolframAlphaQueryRun`` (backed by the
    third-party ``wolframalpha`` client) because that client sends httpx's default
    User-Agent -- which Wolfram|Alpha's edge answers with HTTP 403 -- and because
    its strict Content-Type assertion breaks against the current API.
    """

    name: str = "wolfram_alpha"
    description: str = (
        "Useful for performing mathematical calculations and computations. "
        "Input should be a single-line math or computation query, "
        "e.g. '2+2', 'integrate x^2 dx', or 'distance from Earth to Mars'."
    )

    app_id: str

    def _run(self, query: str) -> str:
        try:
            response = httpx.get(
                WOLFRAM_ALPHA_URL,
                params={
                    "appid": self.app_id,
                    "input": query,
                    "output": "json",
                    "format": "plaintext",
                },
                headers={"User-Agent": USER_AGENT},
                timeout=30.0,
            )
            response.raise_for_status()
            query_result = response.json().get("queryresult", {})
        except (httpx.HTTPError, ValueError) as e:
            return f"Wolfram Alpha request failed: {e}"

        if not query_result.get("success"):
            return "Wolfram Alpha was not able to answer that query."

        pods = query_result.get("pods", [])

        for pod in pods:
            if pod.get("primary") or str(pod.get("title", "")).lower() == "result":
                text = self._pod_plaintext(pod)
                if text:
                    return text

        # Fall back to the first non-input pod that actually has content.
        for pod in pods:
            if str(pod.get("title", "")).lower() == "input":
                continue
            text = self._pod_plaintext(pod)
            if text:
                return text

        return "Wolfram Alpha did not return a usable result."

    @staticmethod
    def _pod_plaintext(pod: dict) -> str:
        for subpod in pod.get("subpods", []):
            plaintext = (subpod.get("plaintext") or "").strip()
            if plaintext:
                return plaintext
        return ""
