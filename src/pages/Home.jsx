import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Login from "../components/auth/Login";
import Footer from "../components/common/Footer";

export default function Home() {
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);

  return (
    <div className="bg-[#0a0f1f] text-white">

      {/* ================= LOGIN MODAL ================= */}
      {showLogin && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center"
          onClick={() => setShowLogin(false)}
        >
          <Login
            onClose={() => setShowLogin(false)}
            onSuccess={(path) => navigate(path)}
          />
        </div>
      )}

      {/* ================= SECTION 1: HERO ================= */}
      <section className="relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-indigo-600/30 rounded-full blur-[160px]" />
        <div className="absolute top-20 right-0 w-[400px] h-[400px] bg-cyan-500/20 rounded-full blur-[160px]" />

        <div className="relative max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

            {/* LEFT */}
            <div>
              <span className="inline-block mb-6 px-5 py-2 rounded-full bg-white/10 text-indigo-300 text-sm">
                🎓 Smart Student Management Platform
              </span>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight">
                Manage Students, <br />
                <span className="text-indigo-400">
                  Track Performance & Grow Faster
                </span>
              </h1>

              <p className="mt-8 text-lg text-slate-300 max-w-xl leading-relaxed">
                A powerful education platform to manage students, tests,
                homework, performance analytics and communication — all from
                one modern dashboard.
              </p>

              <div className="flex flex-wrap gap-5 mt-10">
                <button
                  onClick={() => setShowLogin(true)}
                  className="bg-indigo-600 hover:bg-indigo-700 px-8 py-4 rounded-2xl font-semibold shadow-xl transition"
                >
                  Student Login
                </button>

                <button
                  onClick={() => setShowLogin(true)}
                  className="border border-white/20 px-8 py-4 rounded-2xl hover:bg-white/10 transition"
                >
                  Admin Login
                </button>
              </div>
            </div>

            {/* RIGHT - DASHBOARD PREVIEW */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl shadow-2xl">
              <p className="text-sm text-slate-400 mb-4">📊 Live Dashboard Preview</p>

              <div className="grid grid-cols-2 gap-6">
                {[
                  { label: "Students", value: "1200+" },
                  { label: "Active Batches", value: "18" },
                  { label: "Avg Performance", value: "82%" },
                  { label: "Growth Rate", value: "+48%" },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="bg-[#0f172a] border border-white/10 rounded-2xl p-6"
                  >
                    <p className="text-3xl font-bold">{item.value}</p>
                    <p className="text-sm text-slate-400 mt-1">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= SECTION 2: FEATURES ================= */}
      <section className="bg-[#0f172a] py-28">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16">
          <h2 className="text-4xl font-bold text-center mb-16">
            Everything You Need in One Platform
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Student Management",
                desc: "Centralized student profiles with batch, class, contact and performance data.",
                icon: "👨‍🎓",
              },
              {
                title: "Tests & Results",
                desc: "Upload tests, track marks, analyze strengths and weaknesses easily.",
                icon: "📝",
              },
              {
                title: "Homework Tracking",
                desc: "Assign homework, set deadlines and track completion status.",
                icon: "📚",
              },
              {
                title: "Announcements",
                desc: "Instant communication with students through smart announcements.",
                icon: "📢",
              },
            ].map((f, i) => (
              <div
                key={i}
                className="bg-[#0b1120] border border-white/10 rounded-3xl p-8 hover:scale-105 transition"
              >
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{f.title}</h3>
                <p className="text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= SECTION 3: ANALYTICS / INSIGHTS ================= */}
      <section className="py-28 bg-gradient-to-r from-indigo-600 to-cyan-600">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

          <div>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Powerful Academic Analytics
            </h2>

            <p className="text-indigo-100 text-lg mb-10 max-w-xl">
              Visualize performance trends, attendance patterns and academic
              growth using real-time data insights.
            </p>

            <ul className="space-y-4 text-lg">
              <li>✅ Monthly performance tracking</li>
              <li>✅ Batch-wise analytics</li>
              <li>✅ Student growth insights</li>
              <li>✅ Admin-level control</li>
            </ul>
          </div>

          <div className="bg-white/15 backdrop-blur-xl rounded-3xl p-10 shadow-xl">
            <p className="text-sm mb-6">📈 Sample Performance Overview</p>

            <div className="space-y-5">
              {["Jan", "Feb", "Mar", "Apr", "May"].map((m, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{m}</span>
                    <span>{60 + i * 8}%</span>
                  </div>
                  <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-white rounded-full"
                      style={{ width: `${60 + i * 8}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ================= SECTION 4: CTA ================= */}
      <section className="bg-[#0b1120] py-28">
        <div className="max-w-[1000px] mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Transform Student Management?
          </h2>

          <p className="text-slate-400 text-lg mb-10">
            Join institutes that are already improving efficiency, transparency
            and academic results.
          </p>

          <button
            onClick={() => setShowLogin(true)}
            className="bg-indigo-600 hover:bg-indigo-700 px-12 py-4 rounded-2xl font-semibold text-lg shadow-xl transition"
          >
            Get Started Now
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
