# AquaSense — Deployment Guide

Frontend (HTML/CSS/JS) and backend (Flask) ship as **one app**. Pick any platform below.

---

## ▶︎ Local development

```bash
cd FYP
python -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

Opens at <http://localhost:5002>.

> The full `requirement.txt` (singular, with TensorFlow + Rasterio) is for the
> data pipeline only. `requirements.txt` (plural) is the production-ready set
> used by all deployment platforms.

---

## ▶︎ Render.com (recommended — free tier, zero config)

1. Push the repo to GitHub.
2. Go to <https://render.com> → **New +** → **Blueprint**.
3. Pick the repo. Render finds `render.yaml` and provisions automatically.
4. Wait ~3 minutes for the first build. Done.

URL: `https://aquasense-XXX.onrender.com`

To deploy without the blueprint:
- New **Web Service** → connect repo
- Build:  `pip install -r requirements.txt`
- Start:  `gunicorn app:app --bind 0.0.0.0:$PORT --workers 1 --threads 4 --timeout 300`
- Env vars: `PYTHON_VERSION=3.11.9`, `FLASK_ENV=production`

---

## ▶︎ Railway.app

1. <https://railway.app> → **New Project** → **Deploy from GitHub repo**.
2. Railway reads `Procfile` automatically.
3. Optionally set env: `FLASK_ENV=production`.

---

## ▶︎ Fly.io

```bash
brew install flyctl                # macOS
curl -L https://fly.io/install.sh | sh   # Linux

flyctl auth login
flyctl launch --copy-config --no-deploy   # uses fly.toml + Dockerfile
flyctl deploy
```

---

## ▶︎ Docker (any host)

```bash
docker build -t aquasense .
docker run -p 8080:8080 aquasense
```

Opens at <http://localhost:8080>.

To push to a registry:

```bash
docker tag aquasense ghcr.io/<user>/aquasense:latest
docker push ghcr.io/<user>/aquasense:latest
```

---

## ▶︎ Heroku

```bash
heroku create aquasense-yourname
git push heroku main
heroku open
```

Heroku reads `Procfile` and `runtime.txt`.

---

## Notes

- **Memory**: ~512 MB is enough for the production deps (no TensorFlow). Free
  tiers all fit comfortably.
- **First request** trains the ML model — give it 10–15 s. Subsequent
  simulations are sub-second.
- **Long requests**: `gunicorn --timeout 300` is set so the simulation
  endpoint doesn't get killed.
- **TLS / HTTPS**: every platform above terminates TLS for you. The Flask app
  doesn't need a certificate.
- **Plots**: `results/plots/*.png` is generated on each simulation run and
  served by Flask from `/plots/<filename>`.
- **Static files**: Flask serves `static/css/style.css` and `static/js/main.js`
  directly. No CDN setup needed.

---

## Files used for deployment

| File              | Purpose                                  |
| ----------------- | ---------------------------------------- |
| `requirements.txt`| Production Python deps (no TF/rasterio)  |
| `requirement.txt` | Local dev deps (with TF for LSTM compare)|
| `Procfile`        | Heroku / Railway / Render start command  |
| `runtime.txt`     | Python version pin                       |
| `render.yaml`     | Render Blueprint config                  |
| `Dockerfile`      | Docker image (any host)                  |
| `fly.toml`        | Fly.io config                            |
| `.dockerignore`   | Exclude bloat from the image             |
