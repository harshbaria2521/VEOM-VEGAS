"""
SVI — AI Mental Health Companion (India)
Streamlit frontend
"""

import base64
from pathlib import Path

import streamlit as st
import requests

BACKEND_URL = "https://svi-8pm5.onrender.com/ask"
BG_IMAGE_PATH = Path(__file__).parent / "quiet_horizon_bg.png"
LOGO_PATH = Path(__file__).parent / "svi_logo.png"


@st.cache_data
def _load_bg_b64(path: Path) -> str:
    return base64.b64encode(path.read_bytes()).decode()


st.set_page_config(
    page_title="SVI",
    page_icon=str(LOGO_PATH) if LOGO_PATH.exists() else "🌿",
    layout="centered",
    initial_sidebar_state="expanded",
)

_logo_b64 = _load_bg_b64(LOGO_PATH) if LOGO_PATH.exists() else ""
_logo_img_tag = (
    f'<img src="data:image/png;base64,{_logo_b64}" class="sf-logo" alt="SVI">'
    if _logo_b64
    else "🌿"
)

_bg_b64 = _load_bg_b64(BG_IMAGE_PATH) if BG_IMAGE_PATH.exists() else ""

# Build the background rule in Python rather than always embedding a url(...):
# an empty/invalid data URI can make some browsers drop the *entire*
# background-image declaration, which was falling back to Streamlit's dark
# theme (the washed-out gray look). Fall back to a plain calm gradient instead.
if _bg_b64:
    _bg_rule = (
        "background-image: linear-gradient(rgba(253,252,248,0.30), rgba(253,252,248,0.55)), "
        f'url("data:image/png;base64,{_bg_b64}");\n'
        "        background-size: cover;\n"
        "        background-position: center;\n"
        "        background-attachment: fixed;"
    )
else:
    _bg_rule = "background: linear-gradient(180deg, #EAF1EC 0%, #F3EEE2 100%);"

# ---------------------------------------------------------------------------
# Style
# ---------------------------------------------------------------------------
_css = """
    <style>
    @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Karla:wght@400;500;600;700&display=swap');

    :root {
        --surface: #FDFCF8;
        --ink: #263230;
        --ink-soft: #64716C;
        --sage: #3E6259;
        --sage-soft: #E4EAE5;
        --sage-line: #C9D6CD;
        --marigold: #C98A3A;
        --marigold-soft: #F5E9D4;
        --hairline: #E2DFD3;
    }

    html, body, [class*="css"] { font-family: 'Karla', sans-serif; }

    .stApp {
        background-color: #F3EEE2;
        __BG_RULE__
        color: var(--ink);
    }

    #MainMenu, footer, header[data-testid="stHeader"] { visibility: hidden; height: 0; }
    .block-container { padding-top: 2.2rem; padding-bottom: 6.5rem; max-width: 700px; }

    @media (prefers-reduced-motion: reduce) {
        * { animation: none !important; transition: none !important; }
    }

    .sf-content { position: relative; z-index: 1; }

    /* ---- App bar ---- */
    .sf-header {
        display: flex;
        align-items: baseline;
        gap: 0.6rem;
        margin: 0.35rem 0 0.1rem 0;
        animation: sf-rise 0.6s ease-out;
    }
    @keyframes sf-rise {
        from { opacity: 0; transform: translateY(6px); }
        to { opacity: 1; transform: translateY(0); }
    }
    .sf-header h1 {
        font-family: 'Fraunces', serif;
        font-weight: 500;
        font-size: 1.7rem;
        letter-spacing: 0.01em;
        color: var(--ink);
        margin: 0;
    }
    .sf-logo {
        width: 34px;
        height: 34px;
        border-radius: 50%;
        flex-shrink: 0;
    }
    .sf-side-title .sf-logo {
        width: 26px;
        height: 26px;
        vertical-align: middle;
        margin-right: 0.2rem;
    }
    .sf-header span {
        color: var(--sage);
        font-size: 0.92rem;
        font-family: 'Karla', sans-serif;
        font-style: italic;
    }
    .sf-tagline {
        color: var(--ink-soft);
        font-size: 0.95rem;
        margin: 0.2rem 0 1.4rem 0;
        max-width: 58ch;
        line-height: 1.55;
    }

    /* back control: compact, quiet, circular */
    div[data-testid="column"]:first-of-type div.stButton > button {
        width: 2.4rem;
        padding: 0.3rem 0;
        border-radius: 50%;
        font-size: 1.1rem;
        background: transparent;
        border: 1px solid var(--hairline);
        color: var(--ink-soft);
    }
    /* counselor pill: the one bold accent gesture in the bar */
    div[data-testid="column"]:last-of-type div.stButton > button {
        background: var(--sage);
        color: #FDFCF8;
        border: none;
        font-size: 0.85rem;
        white-space: nowrap;
    }
    div[data-testid="column"]:last-of-type div.stButton > button:hover {
        background: #2F4E46;
        color: #FDFCF8;
    }

    /* ---- Chat bubbles ---- */
    .sf-row { display: flex; margin-bottom: 1.05rem; align-items: flex-end; gap: 0.5rem; }
    .sf-row.user { justify-content: flex-end; }
    .sf-row.assistant { justify-content: flex-start; }

    .sf-avatar {
        width: 30px; height: 30px;
        border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
        font-family: 'Fraunces', serif;
        font-size: 0.78rem;
        flex-shrink: 0;
    }
    .sf-avatar.assistant { background: var(--sage-soft); color: var(--sage); border: 1px solid var(--sage-line); }
    .sf-avatar.user { background: var(--marigold-soft); color: var(--marigold); border: 1px solid var(--marigold); }

    .sf-bubble {
        max-width: 74%;
        padding: 0.8rem 1.05rem;
        line-height: 1.6;
        font-size: 0.98rem;
    }
    .sf-bubble.user {
        background: var(--sage);
        color: #FDFCF8;
        border-radius: 18px 18px 4px 18px;
    }
    .sf-bubble.assistant {
        background: #F1EFE5;
        border: 1px solid var(--hairline);
        color: var(--ink);
        border-radius: 18px 18px 18px 4px;
        box-shadow: 0 1px 0 rgba(38, 50, 48, 0.03);
    }
    .sf-bubble.crisis {
        background: var(--marigold-soft);
        border: 1px solid var(--marigold);
        color: var(--ink);
        border-radius: 18px 18px 18px 4px;
    }
    .sf-bubble.therapist {
        background: var(--sage-soft);
        border: 1px solid var(--sage-line);
        color: var(--ink);
        border-radius: 18px 18px 18px 4px;
        white-space: pre-line;
    }

    .sf-call-btn {
        display: inline-block;
        margin-top: 0.6rem;
        background: var(--sage);
        color: #FDFCF8 !important;
        font-weight: 600;
        padding: 0.45rem 0.9rem;
        border-radius: 20px;
        text-decoration: none !important;
        font-size: 0.88rem;
    }

    /* ---- Empty state ---- */
    .sf-empty {
        border: 1px solid var(--hairline);
        background: rgba(253, 252, 248, 0.6);
        border-radius: 16px;
        padding: 1.8rem;
        color: var(--ink-soft);
        font-size: 0.97rem;
        text-align: center;
        margin-top: 0.5rem;
        line-height: 1.6;
    }

    /* ---- Chat input ---- */
    [data-testid="stChatInput"] {
        background: transparent;
        border-top: none;
        padding-bottom: 1rem;
    }
    [data-testid="stChatInput"] > div {
        background: var(--ink) !important;
        border: 1px solid var(--ink) !important;
        border-radius: 24px !important;
        box-shadow: 0 2px 12px rgba(38, 50, 48, 0.18);
    }
    [data-testid="stChatInput"] textarea {
        font-family: 'Karla', sans-serif;
        color: #FFFFFF !important;
        caret-color: #FFFFFF;
    }
    [data-testid="stChatInput"] textarea::placeholder {
        color: rgba(255, 255, 255, 0.55);
    }

    /* ---- Sidebar ---- */
    section[data-testid="stSidebar"] {
        background: var(--surface);
        border-right: 1px solid var(--hairline);
    }
    .sf-side-title {
        font-family: 'Fraunces', serif;
        font-size: 1.3rem;
        color: var(--sage);
        margin-bottom: 0.3rem;
    }
    .sf-side-block {
        border-top: 1px solid var(--hairline);
        padding-top: 0.9rem;
        margin-top: 0.9rem;
        font-size: 0.88rem;
        color: var(--ink-soft);
        line-height: 1.65;
    }
    .sf-side-block a { color: var(--sage); font-weight: 600; }
    .sf-side-block b { color: var(--ink); }

    div.stButton > button {
        background: var(--sage-soft);
        color: var(--sage);
        border: 1px solid var(--sage-line);
        border-radius: 20px;
        font-weight: 600;
        width: 100%;
        transition: background 0.2s ease, color 0.2s ease;
    }
    div.stButton > button:hover {
        background: var(--sage);
        color: #FDFCF8;
    }
    </style>
    """

st.markdown(_css.replace("__BG_RULE__", _bg_rule), unsafe_allow_html=True)

if not _bg_b64:
    st.warning(
        "Background artwork not found — place `quiet_horizon_bg.png` in the same "
        "folder as this file for the full look.",
        icon="🖼️",
    )

st.markdown('<div class="sf-content">', unsafe_allow_html=True)

# ---------------------------------------------------------------------------
# State
# ---------------------------------------------------------------------------
if "chat_history" not in st.session_state:
    st.session_state.chat_history = []

# ---------------------------------------------------------------------------
# Sidebar
# ---------------------------------------------------------------------------
with st.sidebar:
    st.markdown(
        f'<div class="sf-side-title">{_logo_img_tag} SVI</div>',
        unsafe_allow_html=True,
    )
    st.markdown(
        "A quiet space to talk things through. SVI listens and offers "
        "guidance, but it isn't a therapist and can't replace one."
    )

    if st.button("Start a new conversation"):
        st.session_state.chat_history = []
        st.rerun()

    lang_options = [
        ("English", "en", "English"),
        ("Hindi (हिन्दी)", "hi", "हिन्दी"),
        ("Marathi (मराठी)", "mr", "मराठी"),
        ("Gujarati (ગુજરાતી)", "gu", "ગુજરાતી"),
        ("Tamil (தமிழ்)", "ta", "தமிழ்"),
        ("Bengali (বাংলা)", "bn", "বাংলা"),
        ("Telugu (తెలుగు)", "te", "తెలుగు"),
        ("Kannada (ಕನ್ನಡ)", "kn", "ಕನ್ನಡ"),
        ("Malayalam (മലയാളം)", "ml", "മലയാളം"),
        ("Punjabi (ਪੰਜਾਬੀ)", "pa", "ਪੰਜਾਬੀ"),
    ]
    selected_lang_idx = st.selectbox(
        "Language / भाषा चुनें",
        range(len(lang_options)),
        format_func=lambda i: lang_options[i][0],
        key="sf_lang",
    )
    chosen_lang_name, chosen_lang_code, chosen_native_name = lang_options[
        selected_lang_idx
    ]

    st.markdown(
        """
        <div class="sf-side-block">
        <b>If you're in immediate danger</b><br>
        Call <a href="tel:112">112</a> right away, or reach out to someone
        you trust and stay with them.
        </div>
        <div class="sf-side-block">
        <b>24/7 support — India</b><br>
        Tele-MANAS: <a href="tel:14416">14416</a>
        or <a href="tel:18008914416">1-800-891-4416</a>, free and confidential.
        </div>
        <div class="sf-side-block">
        <b>Ongoing support</b><br>
        SVI can suggest licensed therapists near you and a booking link
        whenever that feels useful — just ask.
        </div>
        <div class="sf-side-block">
        Built for people in India, referencing only India-based helplines.
        </div>
        """,
        unsafe_allow_html=True,
    )

# ---------------------------------------------------------------------------
# App bar — back control, title, "talk to a counselor" pill
# ---------------------------------------------------------------------------
bar_l, bar_m, bar_r = st.columns([1, 4, 2.6])
with bar_l:
    if st.button("←", key="back_btn", help="Start a new conversation"):
        st.session_state.chat_history = []
        st.rerun()
with bar_m:
    st.markdown(
        f'<div class="sf-header">{_logo_img_tag}<h1>SVI</h1><span>a quiet place to talk</span></div>',
        unsafe_allow_html=True,
    )
with bar_r:
    if st.button("Talk to a counselor", key="counselor_btn"):
        st.session_state.pending_message = (
            "Can you help me find a therapist or counselor near me?"
        )

st.markdown(
    """
    <div class="sf-tagline">
    Share what's on your mind, at whatever pace feels right. Support resources
    are always a click away in the sidebar.
    </div>
    """,
    unsafe_allow_html=True,
)

# ---------------------------------------------------------------------------
# Chat history
# ---------------------------------------------------------------------------
if not st.session_state.chat_history:
    st.markdown(
        '<div class="sf-empty">Nothing here yet. Type below to start — '
        "there's no wrong way to begin.</div>",
        unsafe_allow_html=True,
    )

for msg in st.session_state.chat_history:
    role = msg["role"]
    if role == "user":
        st.markdown(
            f'<div class="sf-row user"><div class="sf-bubble user">{msg["content"]}</div>'
            '<div class="sf-avatar user">You</div></div>',
            unsafe_allow_html=True,
        )
    else:
        tool = msg.get("tool")
        avatar = '<div class="sf-avatar assistant">S</div>'
        if tool == "emergency_call_tool":
            st.markdown(
                f"""<div class="sf-row assistant">{avatar}
                    <div class="sf-bubble crisis">{msg["content"]}
                    <br><a class="sf-call-btn" href="tel:112">Call 112 now</a>
                    </div></div>""",
                unsafe_allow_html=True,
            )
        elif tool == "find_nearby_therapists_by_location":
            st.markdown(
                f'<div class="sf-row assistant">{avatar}<div class="sf-bubble therapist">{msg["content"]}</div></div>',
                unsafe_allow_html=True,
            )
        else:
            st.markdown(
                f'<div class="sf-row assistant">{avatar}<div class="sf-bubble assistant">{msg["content"]}</div></div>',
                unsafe_allow_html=True,
            )

st.markdown("</div>", unsafe_allow_html=True)

# ---------------------------------------------------------------------------
# Input
# ---------------------------------------------------------------------------
typed_input = st.chat_input("What's on your mind today?")
user_input = st.session_state.pop("pending_message", None) or typed_input

if user_input:
    st.session_state.chat_history.append({"role": "user", "content": user_input})

    with st.spinner("SVI is taking a moment..."):
        try:
            resp = requests.post(
                BACKEND_URL,
                json={
                    "message": user_input,
                    "language": chosen_lang_name.split(" ")[0],
                    "lang_code": chosen_lang_code,
                    "native_name": chosen_native_name,
                },
                timeout=30,
            )
            resp.raise_for_status()
            data = resp.json()
            reply = (
                data.get("response")
                or "I'm here, but I didn't quite catch that — could you say it another way?"
            )
            tool_called = data.get("tool_called")
        except requests.exceptions.RequestException:
            reply = (
                "I'm having trouble reaching the server right now. If you need "
                "help urgently, please call 112 or Tele-MANAS at 14416 directly."
            )
            tool_called = None

    st.session_state.chat_history.append(
        {"role": "assistant", "content": reply, "tool": tool_called}
    )
    st.rerun()
