import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Html5QrcodeScanner } from "html5-qrcode";

// ============ STYLES ============
const colors = {
  primary: "#6366f1",
  primaryDark: "#4f46e5",
  secondary: "#8b5cf6",
  success: "#22c55e",
  danger: "#ef4444",
  warning: "#f59e0b",
  dark: "#1e1b4b",
  light: "#f8fafc",
  glass: "rgba(255, 255, 255, 0.1)",
  glassBorder: "rgba(255, 255, 255, 0.2)",
};

const styles = {
  app: {
    minHeight: "100vh",
    background: `linear-gradient(135deg, ${colors.dark} 0%, #312e81 50%, ${colors.primary} 100%)`,
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    color: "white",
    overflow: "hidden",
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "20px",
    minHeight: "100vh",
  },
  header: {
    textAlign: "center",
    paddingTop: "40px",
    marginBottom: "40px",
  },
  logo: {
    fontSize: "3.5rem",
    fontWeight: "800",
    background: "linear-gradient(135deg, #fff 0%, #c7d2fe 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    marginBottom: "8px",
    letterSpacing: "-2px",
  },
  tagline: {
    fontSize: "1.1rem",
    opacity: 0.8,
    fontWeight: "300",
    letterSpacing: "2px",
    textTransform: "uppercase",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "24px",
    padding: "20px 0",
  },
  card: {
    background: colors.glass,
    backdropFilter: "blur(20px)",
    border: `1px solid ${colors.glassBorder}`,
    borderRadius: "20px",
    padding: "32px 24px",
    cursor: "pointer",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    textAlign: "center",
    position: "relative",
    overflow: "hidden",
  },
  cardHover: {
    transform: "translateY(-8px) scale(1.02)",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.4)",
    border: `1px solid ${colors.primary}`,
  },
  cardIcon: {
    fontSize: "3rem",
    marginBottom: "16px",
    display: "block",
  },
  cardTitle: {
    fontSize: "1.25rem",
    fontWeight: "600",
    marginBottom: "8px",
  },
  cardDesc: {
    fontSize: "0.9rem",
    opacity: 0.7,
    lineHeight: 1.5,
  },
  innerCard: {
    background: "rgba(255, 255, 255, 0.95)",
    color: "#1e1b4b",
    padding: "32px",
    borderRadius: "20px",
    width: "100%",
    maxWidth: "400px",
    margin: "24px auto",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
  },
  input: {
    width: "100%",
    padding: "16px 20px",
    fontSize: "1rem",
    border: "2px solid #e2e8f0",
    borderRadius: "12px",
    outline: "none",
    transition: "all 0.2s ease",
    boxSizing: "border-box",
  },
  inputFocus: {
    borderColor: colors.primary,
    boxShadow: `0 0 0 3px ${colors.primary}33`,
  },
  button: {
    background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
    color: "white",
    border: "none",
    padding: "16px 32px",
    fontSize: "1rem",
    fontWeight: "600",
    borderRadius: "12px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    width: "100%",
    marginTop: "16px",
  },
  buttonHover: {
    transform: "translateY(-2px)",
    boxShadow: "0 10px 20px -5px rgba(99, 102, 241, 0.5)",
  },
  backButton: {
    background: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    color: "white",
    padding: "12px 24px",
    borderRadius: "50px",
    cursor: "pointer",
    fontSize: "0.9rem",
    fontWeight: "500",
    transition: "all 0.2s ease",
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
  },
  pageTitle: {
    fontSize: "2rem",
    fontWeight: "700",
    marginTop: "24px",
    marginBottom: "8px",
  },
  pageSubtitle: {
    opacity: 0.7,
    marginBottom: "32px",
  },
  resultBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "12px 24px",
    borderRadius: "50px",
    fontSize: "1.1rem",
    fontWeight: "600",
    marginTop: "20px",
  },
  successBadge: {
    background: `${colors.success}20`,
    color: colors.success,
    border: `2px solid ${colors.success}`,
  },
  dangerBadge: {
    background: `${colors.danger}20`,
    color: colors.danger,
    border: `2px solid ${colors.danger}`,
  },
  tabContainer: {
    display: "flex",
    gap: "8px",
    justifyContent: "center",
    flexWrap: "wrap",
    marginBottom: "24px",
  },
  tab: {
    padding: "10px 20px",
    borderRadius: "50px",
    cursor: "pointer",
    fontSize: "0.9rem",
    fontWeight: "500",
    transition: "all 0.2s ease",
    border: "none",
  },
  tabActive: {
    background: "white",
    color: colors.dark,
  },
  tabInactive: {
    background: "rgba(255, 255, 255, 0.1)",
    color: "white",
  },
  emergencyCard: {
    background: `linear-gradient(135deg, ${colors.danger} 0%, #dc2626 100%)`,
    padding: "20px",
    borderRadius: "16px",
    marginBottom: "16px",
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  pharmacyCard: {
    background: "white",
    padding: "16px 20px",
    borderRadius: "12px",
    marginBottom: "12px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  },
  loader: {
    width: "24px",
    height: "24px",
    border: "3px solid rgba(255,255,255,0.3)",
    borderTop: "3px solid white",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  teamCard: {
    background: "rgba(255, 255, 255, 0.95)",
    color: colors.dark,
    padding: "32px",
    borderRadius: "20px",
    textAlign: "center",
    minWidth: "280px",
  },
  socialLink: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "8px 16px",
    borderRadius: "8px",
    background: "#f1f5f9",
    color: colors.dark,
    textDecoration: "none",
    fontSize: "0.9rem",
    margin: "4px",
    transition: "all 0.2s ease",
  },
};

// ============ COMPONENTS ============

// Animated Card Component
function FeatureCard({ icon, title, description, onClick, color }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      style={{
        ...styles.card,
        ...(isHovered ? styles.cardHover : {}),
        background: isHovered
          ? `linear-gradient(135deg, ${color}20 0%, ${colors.glass} 100%)`
          : colors.glass,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <span style={{ ...styles.cardIcon, color: color }}>{icon}</span>
      <h3 style={styles.cardTitle}>{title}</h3>
      <p style={styles.cardDesc}>{description}</p>
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "4px",
          background: color,
          transform: isHovered ? "scaleX(1)" : "scaleX(0)",
          transition: "transform 0.3s ease",
        }}
      />
    </div>
  );
}

// Loading Spinner
function Loader() {
  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "20px" }}>
      <div style={styles.loader} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// Back Button Component
function BackButton({ onClick }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      style={{
        ...styles.backButton,
        background: isHovered ? "rgba(255, 255, 255, 0.2)" : "rgba(255, 255, 255, 0.1)",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      ← Back to Home
    </button>
  );
}

// Primary Button
function PrimaryButton({ children, onClick, loading, disabled }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      style={{
        ...styles.button,
        ...(isHovered && !disabled ? styles.buttonHover : {}),
        opacity: disabled ? 0.6 : 1,
        cursor: disabled ? "not-allowed" : "pointer",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading ? (
        <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
          <div style={{ ...styles.loader, width: "18px", height: "18px" }} />
          Processing...
        </span>
      ) : (
        children
      )}
    </button>
  );
}

// Input Field
function InputField({ value, onChange, placeholder, icon }) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div style={{ position: "relative" }}>
      {icon && (
        <span
          style={{
            position: "absolute",
            left: "16px",
            top: "50%",
            transform: "translateY(-50%)",
            opacity: 0.5,
          }}
        >
          {icon}
        </span>
      )}
      <input
        style={{
          ...styles.input,
          ...(isFocused ? styles.inputFocus : {}),
          paddingLeft: icon ? "48px" : "20px",
        }}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
    </div>
  );
} 

// ============ MAIN APP ============
function App() {
  const [page, setPage] = useState("home");
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Test Medicine State
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [medicine, setMedicine] = useState(null);
  const [verifyLoading, setVerifyLoading] = useState(false);

  // Pharmacy State
  const [search, setSearch] = useState("");
  const [pharmacies, setPharmacies] = useState([]);
  const [alternative, setAlternative] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);

  // AI State
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);

  // SOS State
  const [activeVideo, setActiveVideo] = useState("cpr");

  const scannerRef = useRef(null);

  // Page transition
  const changePage = (newPage) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setPage(newPage);
      setIsTransitioning(false);
    }, 200);
  };

  // Scanner setup
  useEffect(() => {
    if (page === "test") {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(() => {});
        scannerRef.current = null;
      }

      const scanner = new Html5QrcodeScanner(
        "reader",
        { fps: 10, qrbox: { width: 250, height: 250 } },
        false
      );

      scanner.render(
        (decodedText) => {
          setInput(decodedText);
          scanner.clear();
        },
        () => {}
      );

      scannerRef.current = scanner;
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(() => {});
      }
    };
  }, [page]);

  //Speaker
  const speakText = (text) => {
    const speech = new
  SpeechSynthesisUtterance(text);
    speech.lang = "en-IN";
    window.speechSynthesis.speak(speech);
};

  // API calls
  const verify = async () => {
    if (!input.trim()) return;
    setVerifyLoading(true);
    setResult("");
    try {
      const res = await axios.post("http://localhost:5000/verify", { input });
      if (res.data.status === "genuine") {
        setResult("genuine");
        setMedicine(res.data.medicine);
      } else {
        setResult("suspicious");
        setMedicine(null);
      }
    } catch (error) {
      setResult("error");
    }
    setVerifyLoading(false);
  };

  const searchMedicine = async () => {
    if (!search.trim()) return;
    setSearchLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/search-medicine", { name: search });
      if (res.data.found) {
        setPharmacies(res.data.pharmacies);
        setAlternative(null);
      } else {
        setPharmacies([]);
        setAlternative(res.data.alternative);
      }
    } catch (error) {
      setPharmacies([]);
    }
    setSearchLoading(false);
  };

  const askAI = async () => {
    if (!question.trim()) return;
    setAiLoading(true);
    const userQ = question;
    setQuestion("");
    setChatHistory((prev) => [...prev, { type: "user", text: userQ }]);

    try {
      const res = await axios.post("http://localhost:5000/ask-ai", { question: userQ });
      setChatHistory((prev) => [...prev, { type: "ai", text: res.data.answer }]);
      setAnswer(res.data.answer);
      speakText(res.data.answer);
    } catch (error) {
      setChatHistory((prev) => [...prev, { type: "ai", text: "Sorry, I couldn't process that." }]);
    }
    setAiLoading(false);



    
  };

  const startListening = () => {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert("Voice not supported");
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = "en-IN";

  recognition.start();

  recognition.onresult = async (event) => {
    const voiceText = event.results[0][0].transcript;

    // UI me show karega
    setQuestion(voiceText);

    // DIRECT API CALL (no askAI)
    try {
      setAiLoading(true);

      const res = await axios.post("http://localhost:5000/ask-ai", {
        question: voiceText,
      });

      setChatHistory((prev) => [
        ...prev,
        { type: "user", text: voiceText },
        { type: "ai", text: res.data.answer },
      ]);

      speakText(res.data.answer);
    } catch (error) {
      console.error("Voice AI Error:", error);
    }

    setAiLoading(false);
  };
};




  const pageWrapperStyle = {
    opacity: isTransitioning ? 0 : 1,
    transform: isTransitioning ? "translateY(20px)" : "translateY(0)",
    transition: "all 0.2s ease",
  };

  // ============ HOME PAGE ============
  if (page === "home") {
    return (
      <div style={styles.app}>
        <div style={{ ...styles.container, ...pageWrapperStyle }}>
          <header style={styles.header}>
            <h1 style={styles.logo}>ScanRx</h1>
            <p style={styles.tagline}>Scan · Verify · Stay Safe</p>
          </header>

          <div style={styles.grid}>
            <FeatureCard
              icon="🔬"
              title="Test Medicine"
              description="Scan barcode to verify authenticity instantly"
              color="#22c55e"
              onClick={() => changePage("test")}
            />
            <FeatureCard
              icon="🏥"
              title="Find Pharmacy"
              description="Locate nearby pharmacies with your medicine in stock"
              color="#3b82f6"
              onClick={() => changePage("pharmacy")}
            />
            <FeatureCard
              icon="🤖"
              title="AI Assistant"
              description="Get instant answers to health-related questions"
              color="#8b5cf6"
              onClick={() => changePage("ai")}
            />
            <FeatureCard
              icon="👨‍⚕️"
              title="Contact Doctor"
              description="Quick access to verified medical professionals"
              color="#06b6d4"
              onClick={() => changePage("doctor")}
            />
            <FeatureCard
              icon="🚨"
              title="Emergency SOS"
              description="Emergency numbers and first-aid guidance"
              color="#ef4444"
              onClick={() => changePage("sos")}
            />
            <FeatureCard
              icon="ℹ️"
              title="About Us"
              description="Learn more about the team behind ScanRx"
              color="#f59e0b"
              onClick={() => changePage("about")}
            />
            <FeatureCard
              icon="🎤"
              title="Voice Assistant"
              description="Speak your symptoms and get instant AI help"
              color="#ec4899"
              onClick={() => changePage("voice")}
            />
          </div>
        </div>
      </div>
    );
  }

  // ============ TEST PAGE ============
  if (page === "test") {
    return (
      <div style={styles.app}>
        <div style={{ ...styles.container, ...pageWrapperStyle }}>
          <BackButton onClick={() => changePage("home")} />

          <div style={{ textAlign: "center" }}>
            <h2 style={styles.pageTitle}>🔬 Verify Medicine</h2>
            <p style={styles.pageSubtitle}>
              Scan barcode or enter code manually to check authenticity
            </p>
          </div>

          <div
            id="reader"
            style={{
              width: "100%",
              maxWidth: "350px",
              margin: "0 auto 24px",
              borderRadius: "16px",
              overflow: "hidden",
            }}
          />

          <div style={styles.innerCard}>
            <InputField
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter barcode number..."
              icon="📦"
            />

            <PrimaryButton onClick={verify} loading={verifyLoading} disabled={!input.trim()}>
              Verify Medicine
            </PrimaryButton>

            {result === "genuine" && (
              <div style={{ marginTop: "24px", animation: "fadeIn 0.3s ease" }}>
                <div style={{ ...styles.resultBadge, ...styles.successBadge }}>
                  ✓ Verified Genuine
                </div>
                {medicine && (
                  <div style={{ marginTop: "16px", textAlign: "left" }}>
                    <p style={{ fontWeight: "600", fontSize: "1.1rem" }}>{medicine.name}</p>
                    <p style={{ opacity: 0.7 }}>{medicine.manufacturer}</p>
                  </div>
                )}
              </div>
            )}

            {result === "suspicious" && (
              <div style={{ marginTop: "24px" }}>
                <div style={{ ...styles.resultBadge, ...styles.dangerBadge }}>
                  ⚠ Suspicious / Not Found
                </div>
                <p style={{ marginTop: "12px", fontSize: "0.9rem", opacity: 0.7 }}>
                  This medicine could not be verified. Please consult a pharmacist.
                </p>
              </div>
            )}
          </div>
        </div>
        <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
      </div>
    );
  }

  // ============ PHARMACY PAGE ============
  if (page === "pharmacy") {
    return (
      <div style={styles.app}>
        <div style={{ ...styles.container, ...pageWrapperStyle }}>
          <BackButton onClick={() => changePage("home")} />

          <div style={{ textAlign: "center" }}>
            <h2 style={styles.pageTitle}>🏥 Find Pharmacy</h2>
            <p style={styles.pageSubtitle}>Search for medicines and find nearby availability</p>
          </div>

          <div style={styles.innerCard}>
            <InputField
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Enter medicine name..."
              icon="💊"
            />

            <PrimaryButton onClick={searchMedicine} loading={searchLoading} disabled={!search.trim()}>
              Search Pharmacies
            </PrimaryButton>

            {pharmacies.length > 0 && (
              <div style={{ marginTop: "24px" }}>
                <p style={{ fontWeight: "600", marginBottom: "12px" }}>
                  Found at {pharmacies.length} location(s):
                </p>
                {pharmacies.map((p, i) => (
                  <div key={i} style={styles.pharmacyCard}>
                    <div>
                      <p style={{ fontWeight: "600", margin: 0 }}>{p.pharmacy_name}</p>
                      <p style={{ fontSize: "0.85rem", opacity: 0.7, margin: 0 }}>{p.location}</p>
                    </div>
                    <span style={{ fontSize: "1.5rem" }}>📍</span>
                  </div>
                ))}
              </div>
            )}

            {alternative && (
              <div
                style={{
                  marginTop: "24px",
                  padding: "16px",
                  background: "#fef3c7",
                  borderRadius: "12px",
                  border: "1px solid #f59e0b",
                }}
              >
                <p style={{ margin: 0, color: "#92400e" }}>
                  <strong>💡 Try alternative:</strong> {alternative}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ============ AI PAGE ============
  if (page === "ai") {
    return (
      <div style={styles.app}>
        <div style={{ ...styles.container, ...pageWrapperStyle }}>
          <BackButton onClick={() => changePage("home")} />

          <div style={{ textAlign: "center" }}>
            <h2 style={styles.pageTitle}>🤖 AI Health Assistant</h2>
            <p style={styles.pageSubtitle}>Powered by Gemini — Ask any health-related question</p>
          </div>

          <div style={{ ...styles.innerCard, maxWidth: "500px" }}>
            {/* Chat History */}
            <div
              style={{
                maxHeight: "300px",
                overflowY: "auto",
                marginBottom: "20px",
                padding: "8px",
              }}
            >
              {chatHistory.length === 0 && (
                <p style={{ textAlign: "center", opacity: 0.5, padding: "40px 0" }}>
                  Ask me anything about health, medicine, or symptoms...
                </p>
              )}
              {chatHistory.map((msg, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent: msg.type === "user" ? "flex-end" : "flex-start",
                    marginBottom: "12px",
                  }}
                >
                  <div
                    style={{
                      maxWidth: "80%",
                      padding: "12px 16px",
                      borderRadius: msg.type === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                      background: msg.type === "user" ? colors.primary : "#f1f5f9",
                      color: msg.type === "user" ? "white" : colors.dark,
                      fontSize: "0.95rem",
                      lineHeight: 1.5,
                    }}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {aiLoading && <Loader />}
            </div>

            <div style={{ display: "flex", gap: "12px" }}>
              <div style={{ flex: 1 }}>
                <InputField
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Type your question..."
                />
              </div>
              <button
                onClick={askAI}
                disabled={!question.trim() || aiLoading}
                style={{
                  ...styles.button,
                  width: "auto",
                  marginTop: 0,
                  padding: "16px 24px",
                  opacity: !question.trim() || aiLoading ? 0.6 : 1,
                }}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============ DOCTOR PAGE ============
  if (page === "doctor") {
    const doctors = [
      { name: "Dr. Sharma", specialty: "General Physician", phone: "9876543210", available: true },
      { name: "Dr. Mehta", specialty: "Cardiologist", phone: "9123456780", available: true },
      { name: "Dr. Gupta", specialty: "Pediatrician", phone: "9988776655", available: false },
    ];

    return (
      <div style={styles.app}>
        <div style={{ ...styles.container, ...pageWrapperStyle }}>
          <BackButton onClick={() => changePage("home")} />

          <div style={{ textAlign: "center" }}>
            <h2 style={styles.pageTitle}>👨‍⚕️ Contact Doctor</h2>
            <p style={styles.pageSubtitle}>Verified medical professionals ready to help</p>
          </div>

          <div style={{ maxWidth: "500px", margin: "0 auto" }}>
            {doctors.map((doc, i) => (
              <div
                key={i}
                style={{
                  ...styles.innerCard,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "16px",
                }}
              >
                <div>
                  <p style={{ fontWeight: "600", fontSize: "1.1rem", margin: "0 0 4px 0" }}>
                    {doc.name}
                  </p>
                  <p style={{ opacity: 0.7, margin: "0 0 8px 0", fontSize: "0.9rem" }}>
                    {doc.specialty}
                  </p>
                  <p style={{ margin: 0, fontSize: "0.95rem" }}>📞 {doc.phone}</p>
                </div>
                <div
                  style={{
                    padding: "6px 12px",
                    borderRadius: "50px",
                    fontSize: "0.8rem",
                    fontWeight: "500",
                    background: doc.available ? "#dcfce7" : "#fee2e2",
                    color: doc.available ? "#166534" : "#991b1b",
                  }}
                >
                  {doc.available ? "Available" : "Busy"}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ============ SOS PAGE ============
  if (page === "sos") {
    const emergencyNumbers = [
      { name: "Ambulance", number: "108", icon: "🚑" },
      { name: "Police", number: "100", icon: "👮" },
      { name: "Fire", number: "101", icon: "🔥" },
      { name: "Women Helpline", number: "1091", icon: "🆘" },
    ];

    const videos = {
      cpr: { title: "CPR", url: "https://www.youtube.com/embed/TsJ49Np3HS0" },
      choking: { title: "Choking", url: "https://www.youtube.com/embed/GymXjJJ7Ugo" },
      heatstroke: { title: "Heat Stroke", url: "https://www.youtube.com/embed/jvGC_dQJUtE" },
      snakebite: { title: "Snake Bite", url: "https://www.youtube.com/embed/CXu23ENOAg4" },
      asthma: { title: "Asthma", url: "https://www.youtube.com/embed/hdVKpUR513M" },
      dehydration: { title: "Dehydration", url: "https://www.youtube.com/embed/DXo5hmiFQmQ" },
    };

    return (
      <div style={styles.app}>
        <div style={{ ...styles.container, ...pageWrapperStyle }}>
          <BackButton onClick={() => changePage("home")} />

          <div style={{ textAlign: "center" }}>
            <h2 style={styles.pageTitle}>🚨 Emergency SOS</h2>
            <p style={styles.pageSubtitle}>Quick access to emergency services and first-aid guides</p>
          </div>

          {/* Emergency Numbers */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
              gap: "12px",
              marginBottom: "32px",
            }}
          >
            {emergencyNumbers.map((item, i) => (
              <a
                key={i}
                href={`tel:${item.number}`}
                style={{
                  ...styles.emergencyCard,
                  textDecoration: "none",
                  color: "white",
                  justifyContent: "center",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                <span style={{ fontSize: "2rem" }}>{item.icon}</span>
                <span style={{ fontWeight: "600" }}>{item.name}</span>
                <span style={{ fontSize: "1.5rem", fontWeight: "700" }}>{item.number}</span>
              </a>
            ))}
          </div>

          {/* First Aid Videos */}
          <div style={{ ...styles.innerCard, maxWidth: "600px" }}>
            <h3 style={{ margin: "0 0 20px 0", textAlign: "center" }}>🎥 First Aid Guides</h3>

            {/* Tabs */}
            <div style={styles.tabContainer}>
              {Object.entries(videos).map(([key, video]) => (
                <button
                  key={key}
                  style={{
                    ...styles.tab,
                    ...(activeVideo === key ? styles.tabActive : styles.tabInactive),
                    color: activeVideo === key ? colors.dark : "rgba(0,0,0,0.5)",
                    background: activeVideo === key ? colors.primary : "#f1f5f9",
                    ...(activeVideo === key && { color: "white" }),
                  }}
                  onClick={() => setActiveVideo(key)}
                >
                  {video.title}
                </button>
              ))}
            </div>

            {/* Video Player */}
            <div style={{ borderRadius: "12px", overflow: "hidden", background: "#000" }}>
              <iframe
                width="100%"
                height="280"
                src={videos[activeVideo].url}
                title={videos[activeVideo].title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============ ABOUT PAGE ============
  if (page === "about") {
    const team = [
      {
        name: "Divyanshi Shishodia",
        role: "Full Stack Developer",
        phone: "9833078242",
        email: "shishodia.divyanshi25@gmail.com",
        linkedin: "https://www.linkedin.com/in/divyanshi-shishodia-b3b516355",
        github: "https://github.com/divyanshishishodia",
      },
      {
        name: "Deepika Nautiyal",
        role: "Full Stack Developer",
        phone: "8273063261",
        email: "deepikanautiyal597@gmail.com",
        linkedin: "https://in.linkedin.com/in/deepika-nautiyal-a7b734381",
        github: "https://github.com/dewep794",
      },
    ];

    return (
      <div style={styles.app}>
        <div style={{ ...styles.container, ...pageWrapperStyle }}>
          <BackButton onClick={() => changePage("home")} />

          <div style={{ textAlign: "center" }}>
            <h2 style={styles.pageTitle}>ℹ️ About ScanRx</h2>
            <p style={styles.pageSubtitle}>
              Healthcare should be safe, simple, and accessible to everyone.
            </p>
          </div>

          <div
            style={{
              display: "flex",
              gap: "24px",
              justifyContent: "center",
              flexWrap: "wrap",
              marginTop: "32px",
            }}
          >
            {team.map((member, i) => (
              <div key={i} style={styles.teamCard}>
                <div
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                    margin: "0 auto 16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "2rem",
                    color: "white",
                  }}
                >
                  {member.name.charAt(0)}
                </div>
                <h3 style={{ margin: "0 0 4px 0" }}>{member.name}</h3>
                <p style={{ opacity: 0.7, margin: "0 0 12px 0", fontSize: "0.9rem" }}>
                  {member.role}
                </p>
                <p style={{ fontSize: "0.85rem", margin: "4px 0" }}>📞 {member.phone}</p>
                <p
                  style={{
                    fontSize: "0.8rem",
                    margin: "4px 0 16px",
                    opacity: 0.7,
                    wordBreak: "break-all",
                  }}
                >
                  {member.email}
                </p>
                <div>
                  <a href={member.linkedin} target="_blank" rel="noreferrer" style={styles.socialLink}>
                    💼 LinkedIn
                  </a>
                  <a href={member.github} target="_blank" rel="noreferrer" style={styles.socialLink}>
                    🐙 GitHub
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: "48px", opacity: 0.8 }}>
            <p style={{ fontSize: "1.1rem", fontStyle: "italic" }}>
              "ScanRx is not just an app — it's a step towards safer lives."
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  //VOICE ASSISTANT PAGE
  if (page === "voice") {
  return (
    <div style={styles.app}>
      <div style={{ ...styles.container, ...pageWrapperStyle }}>
        <BackButton onClick={() => changePage("home")} />

        <div style={{ textAlign: "center" }}>
          <h2 style={styles.pageTitle}>🎤 Voice Assistant</h2>
          <p style={styles.pageSubtitle}>
            Speak and get AI response instantly 
            please wait for 15-20 seconds to hear the response
          </p>
        </div>

        <div style={{ ...styles.innerCard, maxWidth: "500px" }}>
          <button
            onClick={startListening}
            style={{
              ...styles.button,
              background: "#ec4899"
            }}
          >
            🎤 Start Speaking
          </button>

          <p style={{ marginTop: "20px", fontWeight: "500" }}>
            You said: {question}
          </p>

          <p style={{ marginTop: "10px" }}>
            AI: {answer}
          </p>
        </div>
      </div>
    </div>
  );
}


  return null;
}

export default App;
