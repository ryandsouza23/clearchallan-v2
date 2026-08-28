"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { VEHICLE_PROOF, normalise } from "@/lib/challans";
import { markOwnershipProven } from "@/lib/ownership";
import { Ux4gIcon } from "./Ux4gIcon";

/*
  Ownership gate. Three routes, ranked best-first:
    01 DigiLocker — a CONSENT HANDOFF. No Aadhaar field, no OTP, no
       biometrics on this page; Aadhaar is verified inside DigiLocker.
       The handoff is SIMULATED and labelled as such.
    02 Chassis + engine — the accessibility floor: works with no phone.
       Last-five matching against sample records only.
    03 OTP to the registered mobile — deliberately LAST, because the number
       on the RC is often dead. Mock OTP 000000. Six-box input is rendered
       by us (labelled per digit, paste-to-fill, resend timer and attempt
       counter announced via aria-live) using UX4G's otp classes.
  Errors never reveal whether a record exists. Nothing is transmitted.
*/

type Route = "digilocker" | "chassis" | "otp";
type Phase = "choose" | "leaving" | "returning" | "success";

const MOCK_OTP = "000000";

export function GateFlow({
  regNo,
  challanId,
  next,
}: {
  regNo: string;
  challanId?: string;
  next: string;
}) {
  const router = useRouter();
  const [route, setRoute] = useState<Route>("digilocker");
  const [phase, setPhase] = useState<Phase>("choose");
  const [provenVia, setProvenVia] = useState("");

  // Chassis + engine
  const [chassis, setChassis] = useState("");
  const [engine, setEngine] = useState("");
  const [chassisError, setChassisError] = useState(false);

  // OTP
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [attemptsLeft, setAttemptsLeft] = useState(3);
  const [otpStatus, setOtpStatus] = useState("");
  const [resendIn, setResendIn] = useState(0);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Read-aloud
  const [speaking, setSpeaking] = useState(false);
  const regionRef = useRef<HTMLDivElement>(null);

  const proof = VEHICLE_PROOF[normalise(regNo)];

  const nextHref =
    next === "pay" && challanId
      ? `/pay?regNo=${encodeURIComponent(regNo)}&challan=${encodeURIComponent(challanId)}`
      : next === "dispute"
        ? `/dispute?regNo=${encodeURIComponent(regNo)}`
        : `/challans?regNo=${encodeURIComponent(regNo)}`;
  const nextLabel =
    next === "pay"
      ? "Continue to payment"
      : next === "dispute"
        ? "Continue to your dispute"
        : "Back to the challans";

  // Simulated DigiLocker handoff: leaving → returning → success.
  useEffect(() => {
    if (phase === "leaving") {
      const t = setTimeout(() => setPhase("returning"), 1800);
      return () => clearTimeout(t);
    }
    if (phase === "returning") {
      const t = setTimeout(() => {
        markOwnershipProven(regNo);
        setProvenVia("DigiLocker consent (simulated)");
        setPhase("success");
      }, 1800);
      return () => clearTimeout(t);
    }
  }, [phase, regNo]);

  // OTP resend countdown.
  useEffect(() => {
    if (!otpSent || resendIn <= 0) return;
    const t = setInterval(() => setResendIn((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [otpSent, resendIn]);

  // Stop speech on unmount.
  useEffect(() => {
    return () => window.speechSynthesis?.cancel();
  }, []);

  function toggleReadAloud() {
    const synth = window.speechSynthesis;
    if (!synth) {
      setOtpStatus("Read-aloud isn't available in this browser.");
      return;
    }
    if (speaking) {
      synth.cancel();
      setSpeaking(false);
      return;
    }
    const text = regionRef.current?.innerText ?? "";
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    synth.speak(utterance);
    setSpeaking(true);
  }

  function succeed(via: string) {
    markOwnershipProven(regNo);
    setProvenVia(via);
    setPhase("success");
  }

  function submitChassis(e: React.FormEvent) {
    e.preventDefault();
    const ok =
      proof &&
      chassis.trim().toUpperCase() === proof.chassisLast5 &&
      engine.trim().toUpperCase() === proof.engineLast5;
    if (ok) {
      setChassisError(false);
      succeed("chassis and engine numbers (sample records)");
    } else {
      setChassisError(true);
    }
  }

  function sendOtp() {
    setOtpSent(true);
    setOtp(Array(6).fill(""));
    setAttemptsLeft(3);
    setResendIn(30);
    setOtpStatus(
      `A 6-digit code was sent to the registered mobile (sample — the code is ${MOCK_OTP}).`,
    );
  }

  function setOtpDigit(index: number, value: string) {
    const digit = value.replace(/\D/g, "").slice(-1);
    setOtp((prev) => {
      const nextOtp = [...prev];
      nextOtp[index] = digit;
      return nextOtp;
    });
    if (digit && index < 5) otpRefs.current[index + 1]?.focus();
  }

  function onOtpKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  }

  function onOtpPaste(e: React.ClipboardEvent) {
    const digits = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (!digits) return;
    e.preventDefault();
    setOtp(Array.from({ length: 6 }, (_, i) => digits[i] ?? ""));
    otpRefs.current[Math.min(digits.length, 5)]?.focus();
  }

  function verifyOtp() {
    if (otp.join("") === MOCK_OTP) {
      setOtpStatus("Verification successful.");
      succeed("OTP to the registered mobile (sample)");
      return;
    }
    const left = attemptsLeft - 1;
    setAttemptsLeft(left);
    setOtpStatus(
      left > 0
        ? `That code didn't match. ${left} of 3 attempts left — check the sample code and try again.`
        : "No attempts left. Use DigiLocker or the chassis and engine numbers instead — they don't depend on this mobile number.",
    );
  }

  /* ---------- phases ---------- */

  if (phase === "leaving" || phase === "returning") {
    return (
      <div aria-live="polite" className="ux4g-card ux4g-card-outline ux4g-card-vertical">
        <div className="ux4g-card-body text-center">
          <span
            className="ux4g-spinner-primary-full ux4g-spinner-lg"
            role="status"
            aria-label="DigiLocker handoff in progress"
          ></span>
          <p className="ux4g-body-m-strong mt-4 text-ink">
            {phase === "leaving"
              ? "Taking you to DigiLocker…"
              : "Returning from DigiLocker…"}
          </p>
          <p className="ux4g-body-s-default mx-auto mt-2 max-w-[44ch] text-body">
            {phase === "leaving"
              ? "Consent and Aadhaar verification happen inside DigiLocker, never on this page."
              : "Reading the RC you consented to share."}
          </p>
          <p className="mt-3">
            <span className="ux4g-tag ux4g-tag-outline-neutral ux4g-tag-s">
              Simulated
            </span>
          </p>
        </div>
      </div>
    );
  }

  if (phase === "success") {
    return (
      <div className="ux4g-card ux4g-card-outline ux4g-card-vertical">
        <div className="ux4g-card-body text-center">
          <Ux4gIcon
            name="check_circle"
            className="ux4g-fs-24 text-status-success-text"
          />
          <h2 className="ux4g-heading-s-strong mt-2 text-ink">
            It&apos;s your vehicle
          </h2>
          <p className="ux4g-body-m-default mt-2 text-body">
            Ownership of{" "}
            <span className="font-mono text-ink">{regNo}</span> proven via{" "}
            {provenVia}. This holds for the rest of your session.
          </p>
          <p className="mt-2">
            <span className="ux4g-tag ux4g-tag-tonal-success">
              <Ux4gIcon name="verified" /> RC verified
            </span>
          </p>
          <button
            type="button"
            onClick={() => router.push(nextHref)}
            className="ux4g-btn ux4g-btn-primary ux4g-btn-lg mt-4"
          >
            {nextLabel}
          </button>
        </div>
      </div>
    );
  }

  /* ---------- route chooser ---------- */

  return (
    <div ref={regionRef}>
      <div className="flex justify-end">
        <button
          type="button"
          onClick={toggleReadAloud}
          aria-pressed={speaking}
          className="ux4g-btn ux4g-btn-outline-primary ux4g-btn-sm"
        >
          <Ux4gIcon name={speaking ? "stop_circle" : "volume_up"} />{" "}
          {speaking ? "Stop reading" : "Read this page aloud"}
        </button>
      </div>

      <div className="mt-3 grid gap-4">
        {/* 01 — DigiLocker */}
        <section
          className={`ux4g-card ux4g-card-outline ux4g-card-vertical ${route === "digilocker" ? "border-primary" : ""}`}
        >
          <div className="ux4g-card-body">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-mono text-muted">01 · Recommended</p>
                <h2 className="ux4g-title-s-strong mt-1 text-ink">
                  Login with Aadhaar — via DigiLocker
                </h2>
              </div>
              {route !== "digilocker" && (
                <button
                  type="button"
                  className="ux4g-btn ux4g-btn-text-primary ux4g-btn-sm"
                  onClick={() => setRoute("digilocker")}
                >
                  Use this route
                </button>
              )}
            </div>
            {route === "digilocker" && (
              <div className="mt-3">
                <p className="ux4g-body-m-default max-w-[56ch] text-body">
                  Sign in with your Aadhaar identity the safe way:
                  you&apos;ll be taken to DigiLocker to authorise sharing the
                  registration certificate for{" "}
                  <span className="font-mono text-ink">{regNo}</span>. Your
                  Aadhaar number and OTP are entered inside DigiLocker only —
                  a genuine service never asks for them on a page like this.
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setPhase("leaving")}
                    className="ux4g-btn ux4g-btn-primary ux4g-btn-md"
                  >
                    Continue with DigiLocker
                  </button>
                  <span className="ux4g-tag ux4g-tag-outline-neutral ux4g-tag-s">
                    Simulated handoff
                  </span>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* 02 — Chassis + engine */}
        <section
          className={`ux4g-card ux4g-card-outline ux4g-card-vertical ${route === "chassis" ? "border-primary" : ""}`}
        >
          <div className="ux4g-card-body">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-mono text-muted">02</p>
                <h2 className="ux4g-title-s-strong mt-1 text-ink">
                  Chassis + engine number
                </h2>
              </div>
              {route !== "chassis" && (
                <button
                  type="button"
                  className="ux4g-btn ux4g-btn-text-primary ux4g-btn-sm"
                  onClick={() => setRoute("chassis")}
                >
                  Use this route
                </button>
              )}
            </div>
            {route === "chassis" && (
              <form className="mt-3" onSubmit={submitChassis}>
                <p className="ux4g-body-m-default max-w-[56ch] text-body">
                  From the RC papers in the glovebox. Works with no phone and
                  no network on your side. Last five characters of each are
                  enough.
                </p>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <div
                    className={`ux4g-input-container ux4g-input-md ${chassisError ? "ux4g-input-error" : "ux4g-input-default"}`}
                  >
                    <label className="ux4g-label-m-default" htmlFor="chassis5">
                      Chassis number — last 5
                    </label>
                    <div className="ux4g-input">
                      <input
                        className="ux4g-input-input font-mono uppercase"
                        id="chassis5"
                        type="text"
                        maxLength={5}
                        autoComplete="off"
                        spellCheck={false}
                        value={chassis}
                        onChange={(e) => setChassis(e.target.value)}
                        aria-invalid={chassisError}
                        aria-describedby={
                          chassisError ? "chassis-err" : undefined
                        }
                      />
                    </div>
                  </div>
                  <div
                    className={`ux4g-input-container ux4g-input-md ${chassisError ? "ux4g-input-error" : "ux4g-input-default"}`}
                  >
                    <label className="ux4g-label-m-default" htmlFor="engine5">
                      Engine number — last 5
                    </label>
                    <div className="ux4g-input">
                      <input
                        className="ux4g-input-input font-mono uppercase"
                        id="engine5"
                        type="text"
                        maxLength={5}
                        autoComplete="off"
                        spellCheck={false}
                        value={engine}
                        onChange={(e) => setEngine(e.target.value)}
                        aria-invalid={chassisError}
                        aria-describedby={
                          chassisError ? "chassis-err" : undefined
                        }
                      />
                    </div>
                  </div>
                </div>
                {chassisError && (
                  <p
                    id="chassis-err"
                    aria-live="polite"
                    className="ux4g-label-m-default mt-2 text-status-alert-text"
                  >
                    These details don&apos;t match. Check both fields against
                    the RC and try again — the sample values are 48213 and
                    20931.
                  </p>
                )}
                <button
                  type="submit"
                  className="ux4g-btn ux4g-btn-primary ux4g-btn-md mt-3"
                >
                  Verify ownership
                </button>
              </form>
            )}
          </div>
        </section>

        {/* 03 — OTP, deliberately last */}
        <section
          className={`ux4g-card ux4g-card-outline ux4g-card-vertical ${route === "otp" ? "border-primary" : ""}`}
        >
          <div className="ux4g-card-body">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-mono text-muted">03 · Last resort</p>
                <h2 className="ux4g-title-s-strong mt-1 text-ink">
                  OTP to the registered mobile
                </h2>
              </div>
              {route !== "otp" && (
                <button
                  type="button"
                  className="ux4g-btn ux4g-btn-text-primary ux4g-btn-sm"
                  onClick={() => setRoute("otp")}
                >
                  Use this route
                </button>
              )}
            </div>
            {route === "otp" && (
              <div className="mt-3">
                <p className="ux4g-body-m-default max-w-[56ch] text-body">
                  This uses the mobile linked to the vehicle —{" "}
                  <span className="font-mono">{proof?.mobileMasked}</span> —
                  often out of date, which is why it&apos;s the last option.
                </p>
                {!otpSent ? (
                  <button
                    type="button"
                    onClick={sendOtp}
                    className="ux4g-btn ux4g-btn-outline-primary ux4g-btn-md mt-3"
                  >
                    Send OTP
                  </button>
                ) : (
                  <div
                    className="ux4g-otp mt-3"
                    role="group"
                    aria-labelledby="otp-label"
                    aria-describedby="otp-meta"
                  >
                    <div
                      className="ux4g-otp-label ux4g-label-l-default"
                      id="otp-label"
                    >
                      Enter the 6-digit code
                    </div>
                    <div className="ux4g-otp-group mt-2 flex gap-2">
                      {otp.map((digit, i) => (
                        <input
                          key={i}
                          ref={(el) => {
                            otpRefs.current[i] = el;
                          }}
                          className="ux4g-otp-input ux4g-otp-slot font-mono h-12 w-10 border border-rule bg-surface text-center text-lg text-ink"
                          type="text"
                          inputMode="numeric"
                          autoComplete={i === 0 ? "one-time-code" : "off"}
                          maxLength={1}
                          value={digit}
                          aria-label={`OTP digit ${i + 1} of 6`}
                          onChange={(e) => setOtpDigit(i, e.target.value)}
                          onKeyDown={(e) => onOtpKeyDown(i, e)}
                          onPaste={onOtpPaste}
                          disabled={attemptsLeft === 0}
                        />
                      ))}
                    </div>
                    <div
                      className="ux4g-otp-meta ux4g-otp-meta-between mt-2 flex flex-wrap items-center justify-between gap-2"
                      id="otp-meta"
                    >
                      <span
                        aria-live="polite"
                        className="ux4g-label-m-default text-body"
                      >
                        {otpStatus}
                      </span>
                      <button
                        type="button"
                        disabled={resendIn > 0}
                        onClick={sendOtp}
                        className={`ux4g-otp-resend ux4g-label-m-default ${resendIn > 0 ? "ux4g-otp-resend-disabled text-muted" : "text-primary"}`}
                      >
                        {resendIn > 0
                          ? `Resend in 0:${String(resendIn).padStart(2, "0")}`
                          : "Resend OTP"}
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={verifyOtp}
                      disabled={attemptsLeft === 0}
                      className="ux4g-btn ux4g-btn-primary ux4g-btn-md mt-3"
                    >
                      Verify
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
