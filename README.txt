BR MASOOM — PUBG Sensitivity Finder
==================================

Contents:
- index.html
- style.css
- script.js
- logo.svg
- README.txt

HOW TO USE
1) Unzip the package.
2) (Optional) Edit 'script.js' and replace:
   const OPENAI_API_KEY = "YOUR_OPENAI_API_KEY_HERE";
   with your actual OpenAI API key if you understand the security implications.

IMPORTANT SECURITY NOTE
- Putting your OpenAI API key directly in client-side JavaScript will expose it publicly.
- Recommended safer options:
  1) Create a small server (Node/Express, Cloudflare Worker, or Netlify Function) that holds the key and forwards requests.
  2) Use GitHub Actions / server-side environment variables if you add a backend.
- If you still want a quick test and accept the risk, replacing the placeholder will make the chat work from the public page.

DEPLOY ON GITHUB PAGES (quick)
1) Create a new public repository on GitHub.
2) Upload all files (Add file → Upload files).
3) Settings → Pages → Branch: main → Save.
4) Visit: https://{yourusername}.github.io/{repo-name}/

Need more help deploying a serverless proxy for secure AI usage? Ask me and I will provide the exact Node/Cloudflare Worker script and step-by-step setup.

Enjoy — BR MASOOM team.
