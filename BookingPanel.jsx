/* Booking flow — date picker + time picker + Google Apps Script emails */
/* global React, Button, Eyebrow, Field, Input, Select, NailPhoto, Icon, useLucide, useWindowWidth, SERVICES, SERVICE_CATEGORIES */

const { useState, useEffect } = React;


/* ===================================================================
   GOOGLE SHEETS API — URL loaded from config.js (gitignored)
=================================================================== */
const SHEETS_API_URL = window.SHEETS_API_URL;

/* ===================================================================
   CALENDAR DATE PICKER
=================================================================== */
const CAL_MONTHS   = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const CAL_WEEKDAYS = ["Su","Mo","Tu","We","Th","Fr","Sa"];

const DatePicker = ({ value, onChange }) => {
  const today = new Date(); today.setHours(0,0,0,0);
  const [viewYear,  setViewYear]  = useState(value ? value.getFullYear() : today.getFullYear());
  const [viewMonth, setViewMonth] = useState(value ? value.getMonth()    : today.getMonth());

  const prevMonth = () => viewMonth === 0  ? (setViewMonth(11), setViewYear(y => y - 1)) : setViewMonth(m => m - 1);
  const nextMonth = () => viewMonth === 11 ? (setViewMonth(0),  setViewYear(y => y + 1)) : setViewMonth(m => m + 1);

  const daysInMonth  = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstWeekday = new Date(viewYear, viewMonth, 1).getDay();

  const isSel  = d => value && value.getDate() === d && value.getMonth() === viewMonth && value.getFullYear() === viewYear;
  const isToday = d => new Date(viewYear, viewMonth, d).toDateString() === today.toDateString();
  const isPast  = d => { const dt = new Date(viewYear, viewMonth, d); dt.setHours(0,0,0,0); return dt < today; };

  const cells = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div>
      {/* Month nav */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
        <button onClick={prevMonth} style={calNavBtn}>‹</button>
        <span style={{ fontFamily:"var(--font-display)", fontSize:20, fontWeight:400, color:"var(--brand)", letterSpacing:"0.06em", textTransform:"uppercase" }}>
          {CAL_MONTHS[viewMonth]} {viewYear}
        </span>
        <button onClick={nextMonth} style={calNavBtn}>›</button>
      </div>

      {/* Weekday headers */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:3, marginBottom:6 }}>
        {CAL_WEEKDAYS.map(d => (
          <div key={d} style={{ fontFamily:"var(--font-sans)", fontSize:9, fontWeight:700, letterSpacing:"0.14em", textTransform:"uppercase", color:"var(--fg-muted)", textAlign:"center", padding:"4px 0" }}>
            {d}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:3 }}>
        {cells.map((day, i) => {
          if (!day) return <div key={`_${i}`} />;
          const sel  = isSel(day);
          const tod  = isToday(day);
          const past = isPast(day);
          return (
            <button
              key={day}
              disabled={past}
              onClick={() => !past && onChange(new Date(viewYear, viewMonth, day))}
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: 12,
                fontWeight: sel ? 700 : 400,
                padding: "10px 2px",
                background: sel ? "#E8174A" : "transparent",
                color: sel ? "#fff" : past ? "rgba(232,23,74,0.22)" : "#E8174A",
                border: tod && !sel ? "1px solid #E8174A" : "1px solid transparent",
                cursor: past ? "default" : "pointer",
                textAlign: "center",
                transition: "background 110ms, color 110ms",
              }}
              onMouseEnter={e => { if (!past && !sel) e.currentTarget.style.background = "rgba(232,23,74,0.1)"; }}
              onMouseLeave={e => { if (!past && !sel) e.currentTarget.style.background = "transparent"; }}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
};

const calNavBtn = {
  background: "none", border: "1px solid var(--hairline)",
  color: "#E8174A", fontSize: 18, padding: "4px 14px",
  cursor: "pointer", lineHeight: 1, fontFamily: "var(--font-sans)",
};

/* ===================================================================
   TIME PICKER
=================================================================== */
const TIME_SLOTS = [
  "9:00 AM","11:00 AM","1:00 PM","3:00 PM","5:00 PM","7:00 PM",
];

const TimePicker = ({ value, onChange, bookedSlots = [], selectedDate, loading = false }) => {
  const now   = new Date();
  const isToday = selectedDate &&
    selectedDate.getFullYear() === now.getFullYear() &&
    selectedDate.getMonth()    === now.getMonth()    &&
    selectedDate.getDate()     === now.getDate();
  const nowMins = now.getHours() * 60 + now.getMinutes();

  return (
    <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:6, opacity: loading ? 0.5 : 1, pointerEvents: loading ? "none" : "auto", transition:"opacity 150ms" }}>
      {TIME_SLOTS.map(slot => {
        const sel      = value === slot;
        const booked   = bookedSlots.includes(slot);
        const isPast   = isToday && parseSlotMinutes(slot) <= nowMins;
        const disabled = booked || isPast || loading;
        return (
          <button
            key={slot}
            disabled={disabled}
            onClick={() => !disabled && onChange(slot)}
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: 11, fontWeight: 600,
              letterSpacing: "0.04em",
              padding: "10px 4px",
              background: sel ? "#E8174A" : disabled ? "rgba(232,23,74,0.06)" : "transparent",
              color:      sel ? "#fff"    : disabled ? "rgba(232,23,74,0.3)"  : "#E8174A",
              border:     disabled ? "1px solid rgba(232,23,74,0.2)" : "1px solid #E8174A",
              cursor:     disabled ? "default" : "pointer",
              textAlign: "center",
              transition: "background 110ms, color 110ms",
              textDecoration: booked ? "line-through" : "none",
            }}
            onMouseEnter={e => { if (!sel && !disabled) e.currentTarget.style.background = "rgba(232,23,74,0.1)"; }}
            onMouseLeave={e => { if (!sel && !disabled) e.currentTarget.style.background = "transparent"; }}
          >
            {slot}
          </button>
        );
      })}
    </div>
  );
};

/* Helper: convert "9:00 AM" → minutes since midnight for comparison */
const parseSlotMinutes = slot => {
  const [timePart, ampm] = slot.split(' ');
  const [h, m] = timePart.split(':').map(Number);
  let hours = h;
  if (ampm === 'PM' && h !== 12) hours += 12;
  if (ampm === 'AM' && h === 12) hours = 0;
  return hours * 60 + m;
};

/* Helper: full service label e.g. "JLF Softgel Xtension — Plain" */
const serviceLabel = svc => svc?.category ? `${svc.category} — ${svc.name}` : (svc?.name || "");

/* Helper: format a Date object nicely */
const formatDate = d =>
  d ? d.toLocaleDateString("en-US", { weekday:"long", month:"long", day:"numeric", year:"numeric" }) : "";

/* Helper: YYYY-MM-DD key used as the Sheets row identifier */
const formatDateKey = d => {
  if (!d) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

/* ===================================================================
   BOOKING PANEL  — tabs: BOOK | SERVICES | GIFT VOUCHER
   Steps: 0 = pick service/date/time  |  1 = guest details  |  2 = confirmed
=================================================================== */
const BookingPanel = ({ initialService, onClose, onConfirm }) => {
  useLucide();
  const [tab,  setTab]  = useState("book");
  const [step, setStep] = useState(0);

  const [service,      setService]      = useState(initialService || SERVICES[0]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  const [firstName,       setFirstName]       = useState("");
  const [lastName,        setLastName]        = useState("");
  const [email,           setEmail]           = useState("");
  const [phone,           setPhone]           = useState("");
  const [address,         setAddress]         = useState("");
  const [specialCode,     setSpecialCode]     = useState("");
  const [requests,        setRequests]        = useState("");
  const [appliedVoucher,  setAppliedVoucher]  = useState(null);

  const [submitting,  setSubmitting]  = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const w        = useWindowWidth();
  const isMobile = w <= 768;

  const handleConfirm = async () => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      await fetch(SHEETS_API_URL, {
        method: "POST",
        mode:   "no-cors",
        body:   JSON.stringify({
          type:          "booking",
          date:          formatDateKey(selectedDate),
          time:          selectedTime,
          service:       serviceLabel(service),
          service_price: service.price,
          name:          `${firstName} ${lastName}`.trim(),
          client_email:  email,
          phone:            phone ? `+63${phone}` : "",
          address,
          notes:            requests || "",
          booking_date:     formatDate(selectedDate),
          voucher_code:     appliedVoucher?.code     || "",
          voucher_discount: appliedVoucher?.amount   || "",
        }),
      });
      if (appliedVoucher) {
        fetch(SHEETS_API_URL, {
          method: "POST", mode: "no-cors",
          body: JSON.stringify({ type: "redeem", code: appliedVoucher.code }),
        });
      }
    } catch (_) {}
    setStep(2);
    onConfirm && onConfirm({ service, date: formatDate(selectedDate), time: selectedTime, firstName, lastName });
    setSubmitting(false);
  };

  const tabStyle = id => ({
    fontFamily: "var(--font-sans)", fontSize: 10, fontWeight: 700,
    letterSpacing: "0.16em", textTransform: "uppercase",
    padding: "10px 18px",
    border: "1px solid var(--hairline)",
    borderBottom: tab === id ? "1px solid var(--surface)" : "1px solid var(--hairline)",
    background: tab === id ? "var(--surface)" : "transparent",
    color: "var(--brand)", cursor: "pointer",
    marginBottom: tab === id ? -1 : 0,
    position: "relative", zIndex: tab === id ? 1 : 0,
  });

  return (
    <section style={{ background:"var(--bg)", padding: isMobile ? "24px 16px 80px" : "40px 32px 96px", minHeight:"80vh" }}>
      <div style={{ maxWidth:960, margin:"0 auto" }}>

        {/* Back */}
        <button
          onClick={onClose}
          style={{ background:"none", border:"none", fontFamily:"var(--font-sans)", fontSize:10, fontWeight:700, letterSpacing:"0.18em", textTransform:"uppercase", color:"var(--fg-muted)", cursor:"pointer", display:"flex", alignItems:"center", gap:6, marginBottom:20 }}
        >
          <Icon name="arrow-left" size={12} stroke={2} /> Back
        </button>

        {/* Tab bar */}
        <div style={{ display:"flex", gap:0, marginBottom:0, overflowX: isMobile ? "auto" : "visible", WebkitOverflowScrolling:"touch" }}>
          {[["book","Book"],["services","Services"],["voucher","Gift Voucher"]].map(([id, label]) => (
            <button key={id} onClick={() => setTab(id)} style={tabStyle(id)}>{label}</button>
          ))}
          <div style={{ flex:1, borderBottom:"1px solid var(--hairline)" }} />
        </div>

        {/* Tab content */}
        <div style={{ background:"var(--surface)", border:"1px solid var(--hairline)", borderTop:"none", padding: isMobile ? "20px 16px" : "32px 28px" }}>

          {tab === "book" && step === 0 && (
            <BookStep0
              service={service}           setService={setService}
              selectedDate={selectedDate} setSelectedDate={setSelectedDate}
              selectedTime={selectedTime} setSelectedTime={setSelectedTime}
              onContinue={() => setStep(1)}
              isMobile={isMobile}
            />
          )}

          {tab === "book" && step === 1 && (
            <BookStep1
              service={service}
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              firstName={firstName}             setFirstName={setFirstName}
              lastName={lastName}               setLastName={setLastName}
              email={email}                     setEmail={setEmail}
              phone={phone}                     setPhone={setPhone}
              address={address}                 setAddress={setAddress}
              specialCode={specialCode}         setSpecialCode={setSpecialCode}
              requests={requests}               setRequests={setRequests}
              appliedVoucher={appliedVoucher}   onVoucherApplied={setAppliedVoucher}
              onBack={() => setStep(0)}
              onConfirm={handleConfirm}
              submitting={submitting}
              submitError={submitError}
              isMobile={isMobile}
            />
          )}

          {tab === "book" && step === 2 && (
            <ConfirmedScreen
              booking={{ service, date: formatDate(selectedDate), time: selectedTime, firstName, rawDate: selectedDate }}
              onHome={onClose}
            />
          )}

          {tab === "services" && <ServicesTab />}
          {tab === "voucher"  && <GiftVoucherTab />}
        </div>
      </div>
    </section>
  );
};

/* ===================================================================
   STEP 0 — service + date picker + time picker
=================================================================== */
const BookStep0 = ({ service, setService, selectedDate, setSelectedDate, selectedTime, setSelectedTime, onContinue, isMobile }) => {
  const [bookedSlots,  setBookedSlots]  = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  useEffect(() => {
    if (!selectedDate || SHEETS_API_URL === "YOUR_APPS_SCRIPT_URL") return;
    setBookedSlots([]);
    setLoadingSlots(true);
    fetch(`${SHEETS_API_URL}?date=${formatDateKey(selectedDate)}`)
      .then(r => r.json())
      .then(data => {
        const booked = data.bookedTimes || [];
        setBookedSlots(booked);
        setSelectedTime(curr => booked.includes(curr) ? null : curr);
      })
      .catch(() => {})
      .finally(() => setLoadingSlots(false));
  }, [selectedDate]);

  const canContinue = service && selectedDate && selectedTime && !loadingSlots;
  const hint = !service ? "Select a service to begin" : !selectedDate ? "Now pick a date" : !selectedTime ? "Almost there — pick a time" : null;

  return (
    <div style={{ display:"grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? 36 : 52, alignItems:"start" }}>

      {/* ---- Left: service selector ---- */}
      <div>
        <Eyebrow style={{ marginBottom:14 }}>Choose a service</Eyebrow>
        <div style={{ border:"1px solid var(--hairline)" }}>
          {SERVICE_CATEGORIES.map(cat => (
            <div key={cat.id}>
              {/* Category header */}
              <div style={{
                fontFamily:"var(--font-sans)", fontSize:9, fontWeight:700,
                letterSpacing:"0.18em", textTransform:"uppercase",
                color:"var(--fg-muted)", padding:"8px 14px",
                background:"rgba(232,23,74,0.04)",
                borderBottom:"1px solid var(--hairline)",
              }}>
                {cat.name}
              </div>
              {cat.items.map(s => {
                const sel = service && service.id === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => setService(s)}
                    style={{
                      display:"flex", justifyContent:"space-between", alignItems:"center",
                      width:"100%", padding:"11px 14px",
                      background: sel ? "#E8174A" : "transparent",
                      border:"none", borderBottom:"1px solid var(--hairline)",
                      cursor:"pointer", textAlign:"left",
                      transition:"background 120ms",
                    }}
                    onMouseEnter={e => { if (!sel) e.currentTarget.style.background = "rgba(232,23,74,0.06)"; }}
                    onMouseLeave={e => { if (!sel) e.currentTarget.style.background = "transparent"; }}
                  >
                    <div>
                      <span style={{ fontFamily:"var(--font-sans)", fontSize:11, fontWeight:700, letterSpacing:"0.06em", textTransform:"uppercase", color: sel ? "#fff" : "#E8174A" }}>
                        {s.name}
                      </span>
                      <span style={{ fontFamily:"var(--font-sans)", fontSize:10, color: sel ? "rgba(255,255,255,0.7)" : "var(--fg-muted)", marginLeft:8 }}>
                        {s.duration}
                      </span>
                    </div>
                    <span style={{ fontFamily:"var(--font-sans)", fontSize:11, fontWeight:700, color: sel ? "#fff" : "#E8174A", flexShrink:0, marginLeft:12 }}>
                      {s.price}
                    </span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* ---- Right: date + time ---- */}
      <div>
        <Eyebrow style={{ marginBottom:14 }}>Pick a date</Eyebrow>
        <DatePicker value={selectedDate} onChange={d => { setSelectedDate(d); setSelectedTime(null); }} />

        {selectedDate && (
          <>
            <div style={{ borderTop:"1px solid var(--hairline)", margin:"24px 0 16px" }} />
            <Eyebrow style={{ marginBottom:14 }}>Pick a time</Eyebrow>
            {loadingSlots && (
              <p style={{ fontFamily:"var(--font-sans)", fontSize:11, fontStyle:"italic", color:"var(--fg-muted)", margin:"0 0 10px" }}>
                Checking availability…
              </p>
            )}
            <TimePicker value={selectedTime} onChange={setSelectedTime} bookedSlots={bookedSlots} selectedDate={selectedDate} loading={loadingSlots} />
          </>
        )}

        <div style={{ marginTop:28 }}>
          <Button variant="filled" size="lg" onClick={onContinue} disabled={!canContinue}>
            Continue to details
          </Button>
          {hint && (
            <p style={{ fontFamily:"var(--font-sans)", fontSize:11, fontStyle:"italic", color:"var(--fg-muted)", margin:"10px 0 0" }}>
              {hint}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

/* ===================================================================
   STEP 1 — guest details
=================================================================== */
const BookStep1 = ({ service, selectedDate, selectedTime, firstName, setFirstName, lastName, setLastName, email, setEmail, phone, setPhone, address, setAddress, specialCode, setSpecialCode, requests, setRequests, appliedVoucher, onVoucherApplied, onBack, onConfirm, submitting, submitError, isMobile }) => {
  const [voucherLoading, setVoucherLoading] = useState(false);
  const [voucherError,   setVoucherError]   = useState(null);
  const [touched,        setTouched]        = useState(false);

  const phoneValid = phone.length === 10 || phone.length === 11;
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const formValid  = !!firstName.trim() && !!lastName.trim() && emailValid && phoneValid && !!address.trim();
  const errStyle   = { fontFamily:"var(--font-sans)", fontSize:11, color:"#c0392b", marginTop:4, fontStyle:"italic" };

  const applyVoucher = async () => {
    if (!specialCode.trim()) return;
    setVoucherLoading(true);
    setVoucherError(null);
    onVoucherApplied(null);
    try {
      const res  = await fetch(`${SHEETS_API_URL}?code=${encodeURIComponent(specialCode.trim().toUpperCase())}`);
      const data = await res.json();
      if (data.found && data.status === 'Active') {
        onVoucherApplied({ code: data.code, amount: data.amount });
      } else if (data.found) {
        setVoucherError('This voucher has already been redeemed.');
      } else {
        setVoucherError('Voucher code not found.');
      }
    } catch (_) {
      setVoucherError('Could not verify — check your connection.');
    }
    setVoucherLoading(false);
  };

  return (
  <div>
    {/* Booking summary */}
    <div style={{ marginBottom:16 }}>
      <div style={{ marginBottom:4 }}>
        <span style={{ fontFamily:"var(--font-sans)", fontSize:9, fontWeight:700, letterSpacing:"0.18em", textTransform:"uppercase", color:"var(--fg-muted)", display:"block", marginBottom:4 }}>
          {service.category}
        </span>
        <h2 style={{ fontFamily:"var(--font-display)", fontSize: isMobile ? "clamp(18px,5vw,28px)" : "clamp(22px,3vw,36px)", fontWeight:400, color:"var(--brand)", letterSpacing:"0.04em", textTransform:"uppercase", margin:0 }}>
          {service.name}
        </h2>
      </div>
      <div style={{ display:"flex", flexWrap:"wrap", alignItems:"center", gap:"6px 0" }}>
        <span style={{ fontFamily:"var(--font-sans)", fontSize:12, color:"var(--fg-muted)" }}>
          {formatDate(selectedDate)} · {selectedTime} ·{" "}
          <span style={{ textDecoration: appliedVoucher ? "line-through" : "none" }}>{service.price}</span>
        </span>
        {appliedVoucher && (
          <span style={{ fontFamily:"var(--font-sans)", fontSize:11, fontWeight:700, color:"#1a7a3c", marginLeft:8 }}>
            — {appliedVoucher.amount} voucher applied
          </span>
        )}
      </div>
    </div>

    <hr style={{ border:"none", borderTop:"1px solid var(--hairline)", margin:"16px 0 20px" }} />

    <button onClick={onBack} style={{ fontFamily:"var(--font-sans)", fontSize:10, fontWeight:700, letterSpacing:"0.14em", textTransform:"uppercase", color:"var(--fg-muted)", background:"none", border:"none", cursor:"pointer", padding:0, marginBottom:24 }}>
      ‹ Change date or service
    </button>

    {/* Form */}
    <div style={{ maxWidth:640 }}>
      <p style={{ fontFamily:"var(--font-sans)", fontSize:10, fontWeight:700, letterSpacing:"0.18em", textTransform:"uppercase", color:"var(--brand)", margin:"0 0 16px" }}>
        Your details
      </p>
      <div style={{ display:"grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap:12, marginBottom:20 }}>
        <Field label="First name *">
          <Input value={firstName} onChange={e => setFirstName(e.target.value)} />
          {touched && !firstName.trim() && <span style={errStyle}>Required.</span>}
        </Field>
        <Field label="Last name *">
          <Input value={lastName} onChange={e => setLastName(e.target.value)} />
          {touched && !lastName.trim() && <span style={errStyle}>Required.</span>}
        </Field>
      </div>
      <div style={{ display:"grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap:12, marginBottom:20 }}>
        <Field label="Email *">
          <Input value={email} onChange={e => setEmail(e.target.value)} />
          {touched && !emailValid && <span style={errStyle}>{!email.trim() ? "Required." : "Enter a valid email address."}</span>}
        </Field>
        <Field label="Phone *">
          <div style={{ display:"flex" }}>
            <span style={{
              display:"flex", alignItems:"center",
              padding:"0 12px",
              border:"1px solid var(--brand)", borderRight:"none",
              fontFamily:"var(--font-sans)", fontSize:13, fontWeight:600,
              color:"var(--brand)", background:"rgba(232,23,74,0.04)",
              whiteSpace:"nowrap", flexShrink:0,
            }}>+63</span>
            <Input
              value={phone}
              onChange={e => setPhone(e.target.value.replace(/\D/g, "").slice(0, 11))}
              style={{ borderLeft:"none" }}
            />
          </div>
          {touched && !phoneValid && <span style={errStyle}>{phone.length === 0 ? "Required." : "Must be 10 or 11 digits."}</span>}
        </Field>
      </div>
      <div style={{ marginBottom:20 }}>
        <Field label="Address *">
          <Input value={address} onChange={e => setAddress(e.target.value)} />
          {touched && !address.trim() && <span style={errStyle}>Required.</span>}
        </Field>
      </div>
      <div style={{ marginBottom:20 }}>
        <Field label="Special requests">
          <textarea
            rows={4}
            value={requests}
            onChange={e => setRequests(e.target.value)}
            style={{ fontFamily:"var(--font-sans)", fontSize:13, padding:"10px 12px", border:"1px solid var(--brand)", borderRadius:0, background:"#fff", color:"var(--brand)", outline:"none", resize:"vertical", width:"100%" }}
          />
        </Field>
      </div>
      <div style={{ marginBottom:20 }}>
        <Field label="Promo / special code">
          <div style={{ display:"flex", gap:8 }}>
            <Input
              value={specialCode}
              onChange={e => {
                setSpecialCode(e.target.value);
                if (appliedVoucher) onVoucherApplied(null);
                setVoucherError(null);
              }}
              onKeyDown={e => e.key === "Enter" && applyVoucher()}
              style={{ flex:1 }}
            />
            <Button variant="primary" size="md" onClick={applyVoucher} disabled={voucherLoading || !specialCode.trim()}>
              {voucherLoading ? "…" : "Apply"}
            </Button>
          </div>
          {appliedVoucher && (
            <p style={{ fontFamily:"var(--font-sans)", fontSize:11, color:"#1a7a3c", margin:"6px 0 0" }}>
              ✓ {appliedVoucher.amount} voucher applied
            </p>
          )}
          {voucherError && (
            <p style={{ fontFamily:"var(--font-sans)", fontSize:11, color:"#c0392b", margin:"6px 0 0" }}>
              ✗ {voucherError}
            </p>
          )}
        </Field>
      </div>
    </div>

    {submitError && (
      <p style={{ fontFamily:"var(--font-sans)", fontSize:12, color:"#c0392b", margin:"16px 0 0", fontStyle:"italic" }}>
        ⚠ {submitError}
      </p>
    )}

    <div style={{ marginTop:16, display:"flex", gap:12, flexWrap:"wrap", alignItems:"center" }}>
      <Button variant="filled" size={isMobile ? "md" : "lg"} onClick={() => { setTouched(true); if (formValid) onConfirm(); }} disabled={submitting}>
        {submitting ? "Sending…" : "Complete booking"}
      </Button>
      <Button variant="primary" size={isMobile ? "md" : "lg"} onClick={onBack} disabled={submitting}>Back</Button>
    </div>
  </div>
  );
};

/* ===================================================================
   CONFIRMED SCREEN
=================================================================== */
const ConfirmedScreen = ({ booking, onHome }) => {
  const addToCalendar = () => {
    const { service, rawDate, time } = booking;

    /* Parse "9:00 AM" → local hours + minutes */
    const [timePart, ampm] = time.split(' ');
    let [h, m] = timePart.split(':').map(Number);
    if (ampm === 'PM' && h !== 12) h += 12;
    if (ampm === 'AM' && h === 12) h = 0;

    const start = new Date(rawDate);
    start.setHours(h, m, 0, 0);

    /* Parse duration string e.g. "1 hr", "1.5 hrs", "45 min" — default 90 min */
    let durationMins = 90;
    if (service?.duration) {
      const hrMatch  = service.duration.match(/(\d+\.?\d*)\s*hr/);
      const minMatch = service.duration.match(/(\d+)\s*min/);
      if (hrMatch || minMatch) {
        durationMins = 0;
        if (hrMatch)  durationMins += Math.round(parseFloat(hrMatch[1]) * 60);
        if (minMatch) durationMins += parseInt(minMatch[1]);
      }
    }

    const end = new Date(start.getTime() + durationMins * 60000);
    const fmt = d => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Nails by Jano//Booking//EN',
      'BEGIN:VEVENT',
      'UID:' + Date.now() + '@nailsbyjano',
      'DTSTART:' + fmt(start),
      'DTEND:'   + fmt(end),
      'SUMMARY:' + (serviceLabel(service) || 'Nail Appointment') + ' – Nails by Jano',
      'LOCATION:831-A Fullon St. Dagupan Tondo\\, Manila',
      'DESCRIPTION:Nails by Jano appointment. Payment: GCash or cash on the day.',
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = 'nailsbyjano-appointment.ics';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ textAlign:"center", padding:"48px 0" }}>
      <h1 style={{ fontFamily:"var(--font-display)", fontSize:"clamp(40px,6vw,80px)", fontWeight:400, color:"var(--brand)", letterSpacing:"0.04em", textTransform:"uppercase", margin:"0 0 16px", lineHeight:1 }}>
        You're booked.
      </h1>
      <p style={{ fontFamily:"var(--font-sans)", fontSize:10, fontWeight:700, letterSpacing:"0.18em", textTransform:"uppercase", color:"var(--fg-muted)", maxWidth:440, margin:"0 auto 4px" }}>
        {booking?.service?.category}
      </p>
      <p style={{ fontFamily:"var(--font-sans)", fontSize:14, lineHeight:1.7, color:"var(--fg-muted)", maxWidth:440, margin:"0 auto 6px" }}>
        {booking?.service?.name}
      </p>
      <p style={{ fontFamily:"var(--font-sans)", fontSize:13, color:"var(--fg-muted)", maxWidth:440, margin:"0 auto 28px" }}>
        {booking?.date}{booking?.time ? ` · ${booking.time}` : ""}
      </p>
      <p style={{ fontFamily:"var(--font-sans)", fontSize:13, lineHeight:1.75, color:"var(--fg-muted)", maxWidth:400, margin:"0 auto 32px", fontStyle:"italic" }}>
        Payment via GCash or cash on the day. Come with bare nails — I'll handle the rest.
      </p>
      <div style={{ display:"flex", gap:12, justifyContent:"center" }}>
        <Button variant="primary" onClick={onHome}>Back to home</Button>
        <Button variant="filled" onClick={addToCalendar}>Add to calendar</Button>
      </div>
    </div>
  );
};

/* ===================================================================
   SERVICES TAB
=================================================================== */
const ServicesTab = () => {
  const [open, setOpen] = useState(SERVICE_CATEGORIES[0].id);
  return (
    <div style={{ maxWidth:600 }}>
      {SERVICE_CATEGORIES.map(cat => (
        <div key={cat.id} style={{ borderBottom:"1px solid var(--hairline)" }}>
          <button
            onClick={() => setOpen(open === cat.id ? null : cat.id)}
            style={{ width:"100%", background:"none", border:"none", padding:"16px 0", display:"flex", justifyContent:"space-between", alignItems:"center", cursor:"pointer" }}
          >
            <span style={{ fontFamily:"var(--font-display)", fontSize:22, fontWeight:400, color:"var(--brand)", letterSpacing:"0.06em", textTransform:"uppercase" }}>
              {cat.name}
            </span>
            <span style={{ color:"var(--brand)", fontSize:18 }}>{open === cat.id ? "−" : "+"}</span>
          </button>
          {open === cat.id && (
            <div style={{ paddingBottom:12 }}>
              {cat.items.map(item => (
                <div key={item.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", padding:"8px 0", borderTop:"1px solid var(--hairline)" }}>
                  <div>
                    <span style={{ fontFamily:"var(--font-sans)", fontSize:12, fontWeight:700, color:"var(--brand)", letterSpacing:"0.06em", textTransform:"uppercase" }}>{item.name}</span>
                    <span style={{ fontFamily:"var(--font-sans)", fontSize:11, color:"var(--fg-muted)", marginLeft:10 }}>{item.duration}</span>
                    {item.desc ? <span style={{ fontFamily:"var(--font-sans)", fontSize:10, fontStyle:"italic", color:"var(--fg-muted)", marginLeft:10 }}>{item.desc}</span> : null}
                  </div>
                  <span style={{ fontFamily:"var(--font-sans)", fontSize:12, fontWeight:700, color:"var(--brand)", flexShrink:0, marginLeft:16 }}>{item.price}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

/* ===================================================================
   GIFT VOUCHER TAB
=================================================================== */
const generateVoucherCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const seg = () => Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `NBJ-${seg()}-${seg()}`;
};

const VoucherCard = ({ amount, code }) => (
  <div style={{
    width: "100%", maxWidth: 440, margin: "0 auto",
    aspectRatio: "85/54",
    background: "linear-gradient(135deg, #E8174A 0%, #C0103C 60%, #9a0c2e 100%)",
    borderRadius: 14,
    padding: "20px 24px",
    position: "relative",
    overflow: "hidden",
    boxShadow: "0 12px 40px rgba(232,23,74,0.4)",
    display: "flex", flexDirection: "column", justifyContent: "space-between",
    userSelect: "none",
  }}>
    {/* Decorative circles */}
    <div style={{ position:"absolute", top:-50, right:-50, width:180, height:180, borderRadius:"50%", background:"rgba(255,255,255,0.07)", pointerEvents:"none" }} />
    <div style={{ position:"absolute", bottom:-70, left:-30, width:220, height:220, borderRadius:"50%", background:"rgba(255,255,255,0.05)", pointerEvents:"none" }} />
    <div style={{ position:"absolute", top:"38%", left:0, right:0, height:1, background:"rgba(255,255,255,0.15)", pointerEvents:"none" }} />

    {/* Top row */}
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", position:"relative" }}>
      <div>
        <div style={{ fontFamily:"var(--font-display)", fontSize:"clamp(13px,3vw,18px)", fontWeight:400, letterSpacing:"0.1em", textTransform:"uppercase", color:"#fff" }}>
          Nails by Jano
        </div>
        <div style={{ fontFamily:"var(--font-sans)", fontSize:9, fontWeight:700, letterSpacing:"0.18em", textTransform:"uppercase", color:"rgba(255,255,255,0.6)", marginTop:2 }}>
          Tondo, Manila
        </div>
      </div>
      <div style={{ textAlign:"right" }}>
        <div style={{ fontFamily:"var(--font-sans)", fontSize:8, fontWeight:700, letterSpacing:"0.2em", textTransform:"uppercase", color:"rgba(255,255,255,0.5)" }}>Gift</div>
        <div style={{ fontFamily:"var(--font-sans)", fontSize:8, fontWeight:700, letterSpacing:"0.2em", textTransform:"uppercase", color:"rgba(255,255,255,0.5)" }}>Voucher</div>
      </div>
    </div>

    {/* Center */}
    <div style={{ textAlign:"center", position:"relative" }}>
      <div style={{ fontFamily:"var(--font-display)", fontSize:"clamp(22px,6vw,38px)", fontWeight:300, color:"#fff", letterSpacing:"0.1em", textTransform:"uppercase", lineHeight:1, marginBottom:5 }}>
        Gift Voucher
      </div>
      <div style={{ fontFamily:"var(--font-sans)", fontSize:9, letterSpacing:"0.16em", textTransform:"uppercase", color:"rgba(255,255,255,0.65)" }}>
        The gift of beautiful nails
      </div>
    </div>

    {/* Bottom row */}
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", position:"relative" }}>
      <div>
        {code && (
          <div style={{ fontFamily:"var(--font-sans)", fontSize:9, fontWeight:700, letterSpacing:"0.12em", color:"rgba(255,255,255,0.9)", marginBottom:3 }}>
            {code}
          </div>
        )}
        <div style={{ fontFamily:"var(--font-sans)", fontSize:8, color:"rgba(255,255,255,0.45)", letterSpacing:"0.1em", textTransform:"uppercase" }}>
          Valid 1 year · GCash or cash
        </div>
      </div>
      <div style={{ textAlign:"right" }}>
        <div style={{ fontFamily:"var(--font-sans)", fontSize:8, color:"rgba(255,255,255,0.5)", letterSpacing:"0.14em", textTransform:"uppercase", marginBottom:2 }}>Value</div>
        <div style={{ fontFamily:"var(--font-display)", fontSize:"clamp(18px,4vw,28px)", fontWeight:400, color:"#fff", letterSpacing:"0.04em", lineHeight:1 }}>
          {amount}
        </div>
      </div>
    </div>
  </div>
);

const VOUCHER_AMOUNTS = ["₱500", "₱1,000", "₱1,500", "₱2,000"];

const GiftVoucherTab = () => {
  const [step,           setStep]           = useState(0);
  const [amount,         setAmount]         = useState("₱500");
  const [customAmount,   setCustomAmount]   = useState("");
  const [recipientName,  setRecipientName]  = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [senderName,     setSenderName]     = useState("");
  const [message,        setMessage]        = useState("");
  const [refNumber,      setRefNumber]      = useState("");
  const [submitting,     setSubmitting]     = useState(false);

  const w        = useWindowWidth();
  const isMobile = w <= 768;

  const displayAmount = amount === "custom"
    ? (customAmount ? `₱${customAmount}` : "₱—")
    : amount;

  const canProceed = !!recipientName.trim() && !!recipientEmail.trim() && !!senderName.trim() &&
    (amount !== "custom" || !!customAmount);

  const handleSubmitPending = async () => {
    setSubmitting(true);
    try {
      await fetch(SHEETS_API_URL, {
        method: "POST",
        mode:   "no-cors",
        body:   JSON.stringify({
          type:             "pending_voucher",
          recipient_name:   recipientName,
          recipient_email:  recipientEmail,
          sender_name:      senderName,
          voucher_amount:   displayAmount,
          personal_message: message || "—",
          payment_ref:      refNumber,
        }),
      });
    } catch (_) {}
    setStep(2);
    setSubmitting(false);
  };

  const reset = () => {
    setStep(0); setAmount("₱500"); setCustomAmount(""); setRecipientName("");
    setRecipientEmail(""); setSenderName(""); setMessage(""); setRefNumber("");
  };

  /* ── Step 2: pending confirmation ── */
  if (step === 2) return (
    <div style={{ maxWidth:480, margin:"0 auto", textAlign:"center", padding:"8px 0 24px" }}>
      <div style={{ width:64, height:64, borderRadius:"50%", background:"#fdf0f4", border:"2px solid var(--brand)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 20px", fontSize:28 }}>✓</div>
      <h2 style={{ fontFamily:"var(--font-display)", fontSize:"clamp(24px,5vw,40px)", fontWeight:400, color:"var(--brand)", letterSpacing:"0.04em", textTransform:"uppercase", margin:"0 0 12px" }}>
        Payment Submitted
      </h2>
      <p style={{ fontFamily:"var(--font-sans)", fontSize:13, color:"var(--fg-muted)", margin:"0 0 8px", lineHeight:1.7 }}>
        We received your payment details. The owner will verify your GCash payment and send the voucher to <strong>{recipientName}</strong> once confirmed.
      </p>
      <p style={{ fontFamily:"var(--font-sans)", fontSize:11, color:"var(--fg-muted)", fontStyle:"italic", margin:"0 0 28px" }}>
        Reference no: {refNumber}
      </p>
      <Button variant="primary" onClick={reset}>Send another voucher</Button>
    </div>
  );

  /* ── Step 1: payment screen ── */
  if (step === 1) return (
    <div style={{ maxWidth:480, margin:"0 auto", padding:"8px 0 24px" }}>
      <button onClick={() => setStep(0)} style={{ fontFamily:"var(--font-sans)", fontSize:10, fontWeight:700, letterSpacing:"0.14em", textTransform:"uppercase", color:"var(--fg-muted)", background:"none", border:"none", cursor:"pointer", padding:0, marginBottom:24 }}>
        ‹ Back
      </button>
      <Eyebrow style={{ marginBottom:8 }}>Step 2 of 2 — Payment</Eyebrow>
      <h2 style={{ fontFamily:"var(--font-display)", fontSize:"clamp(22px,4vw,34px)", fontWeight:400, color:"var(--brand)", letterSpacing:"0.04em", textTransform:"uppercase", margin:"0 0 24px" }}>
        Complete Payment
      </h2>

      {/* Amount due */}
      <div style={{ background:"#fdf0f4", border:"1px solid var(--brand)", padding:"16px 20px", marginBottom:24, textAlign:"center" }}>
        <div style={{ fontFamily:"var(--font-sans)", fontSize:9, fontWeight:700, letterSpacing:"0.2em", textTransform:"uppercase", color:"var(--fg-muted)", marginBottom:6 }}>Amount to Pay</div>
        <div style={{ fontFamily:"var(--font-display)", fontSize:44, fontWeight:400, color:"var(--brand)", letterSpacing:"0.04em", lineHeight:1 }}>{displayAmount}</div>
      </div>

      {/* QR Code */}
      <div style={{ textAlign:"center", marginBottom:24 }}>
        <div style={{ fontFamily:"var(--font-sans)", fontSize:9, fontWeight:700, letterSpacing:"0.2em", textTransform:"uppercase", color:"var(--fg-muted)", marginBottom:12 }}>Scan to Pay via GCash</div>
        <img
          src="assets/qr/gcash-qr.jpg"
          alt="GCash QR Code"
          style={{ width:"100%", maxWidth:220, display:"block", margin:"0 auto", border:"1px solid var(--hairline)" }}
        />
        <p style={{ fontFamily:"var(--font-sans)", fontSize:11, color:"var(--fg-muted)", margin:"10px 0 0", fontStyle:"italic" }}>
          Open GCash → Scan QR → Pay {displayAmount}
        </p>
      </div>

      {/* Reference number */}
      <div style={{ marginBottom:28 }}>
        <Field label="GCash Reference Number *">
          <Input
            value={refNumber}
            onChange={e => setRefNumber(e.target.value)}
          />
        </Field>
        <p style={{ fontFamily:"var(--font-sans)", fontSize:11, color:"var(--fg-muted)", margin:"6px 0 0", fontStyle:"italic" }}>
          Found in GCash → Transaction History after paying.
        </p>
      </div>

      <Button variant="filled" size="lg" onClick={handleSubmitPending} disabled={!refNumber.trim() || submitting}>
        {submitting ? "Submitting…" : "Submit for Verification"}
      </Button>
    </div>
  );

  /* ── Step 0: form ── */
  return (
    <div style={{ maxWidth:560, margin:"0 auto" }}>
      <VoucherCard amount={displayAmount} />

      <div style={{ marginTop:28 }}>
        <Eyebrow style={{ marginBottom:12 }}>Select amount</Eyebrow>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8, marginBottom:10 }}>
          {VOUCHER_AMOUNTS.map(a => {
            const sel = amount === a;
            return (
              <button key={a} onClick={() => setAmount(a)} style={{
                fontFamily:"var(--font-sans)", fontSize:12, fontWeight:700,
                padding:"10px 4px", textAlign:"center",
                background: sel ? "#E8174A" : "transparent",
                color: sel ? "#fff" : "#E8174A",
                border: "1px solid #E8174A", cursor:"pointer",
                transition:"background 110ms, color 110ms",
              }}>
                {a}
              </button>
            );
          })}
        </div>
        <button onClick={() => setAmount("custom")} style={{
          fontFamily:"var(--font-sans)", fontSize:10, fontWeight:700,
          letterSpacing:"0.14em", textTransform:"uppercase",
          background: amount === "custom" ? "#E8174A" : "transparent",
          color: amount === "custom" ? "#fff" : "#E8174A",
          border:"1px solid #E8174A", padding:"8px 16px",
          cursor:"pointer", marginBottom: amount === "custom" ? 10 : 24,
          transition:"background 110ms, color 110ms",
        }}>
          Custom amount
        </button>
        {amount === "custom" && (
          <div style={{ marginBottom:24 }}>
            <Field label="Amount (₱)">
              <Input value={customAmount} onChange={e => setCustomAmount(e.target.value.replace(/\D/g,''))} />
            </Field>
          </div>
        )}

        <div style={{ display:"grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap:14, marginBottom:14 }}>
          <Field label="Recipient name *">
            <Input value={recipientName} onChange={e => setRecipientName(e.target.value)} />
          </Field>
          <Field label="Recipient email *">
            <Input type="email" value={recipientEmail} onChange={e => setRecipientEmail(e.target.value)} />
          </Field>
        </div>
        <div style={{ marginBottom:14 }}>
          <Field label="From *">
            <Input value={senderName} onChange={e => setSenderName(e.target.value)} />
          </Field>
        </div>
        <div style={{ marginBottom:24 }}>
          <Field label="Personal message">
            <textarea
              rows={3}
              value={message}
              onChange={e => setMessage(e.target.value)}
              style={{ fontFamily:"var(--font-sans)", fontSize:13, padding:"10px 12px", border:"1px solid var(--brand)", borderRadius:0, background:"#fff", color:"var(--brand)", outline:"none", resize:"vertical", width:"100%" }}
            />
          </Field>
        </div>

        <Button variant="filled" size="lg" onClick={() => setStep(1)} disabled={!canProceed}>
          Proceed to Payment
        </Button>
      </div>
    </div>
  );
};

/* ===================================================================
   VOUCHER LOOKUP — owner tool
=================================================================== */
const VoucherLookup = () => {
  const [code,         setCode]         = useState('');
  const [loading,      setLoading]      = useState(false);
  const [result,       setResult]       = useState(null);
  const [redeeming,    setRedeeming]    = useState(false);
  const [redeemed,     setRedeemed]     = useState(false);

  const [pendingList,  setPendingList]  = useState([]);
  const [pendingLoad,  setPendingLoad]  = useState(true);
  const [approvingIdx, setApprovingIdx] = useState(null);

  useEffect(() => {
    const load = async () => {
      setPendingLoad(true);
      try {
        const res  = await fetch(`${SHEETS_API_URL}?pending=true`);
        const data = await res.json();
        setPendingList(Array.isArray(data.pending) ? data.pending : []);
      } catch (_) {
        setPendingList([]);
      }
      setPendingLoad(false);
    };
    load();
  }, []);

  const approvePending = async (row, idx) => {
    setApprovingIdx(idx);
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const seg   = () => Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    const code  = `NBJ-${seg()}-${seg()}`;
    try {
      await fetch(SHEETS_API_URL, {
        method: 'POST', mode: 'no-cors',
        body: JSON.stringify({
          type:             'approve_voucher',
          voucher_code:     code,
          recipient_name:   row.recipient_name,
          recipient_email:  row.recipient_email,
          sender_name:      row.sender_name,
          voucher_amount:   row.voucher_amount,
          personal_message: row.personal_message,
          payment_ref:      row.payment_ref,
          row_index:        row.row_index,
        }),
      });
      setPendingList(list => list.filter((_, i) => i !== idx));
    } catch (_) {}
    setApprovingIdx(null);
  };

  const check = async () => {
    if (!code.trim()) return;
    setLoading(true); setResult(null); setRedeemed(false);
    try {
      const res  = await fetch(`${SHEETS_API_URL}?code=${encodeURIComponent(code.trim().toUpperCase())}`);
      const data = await res.json();
      setResult(data);
    } catch (_) {
      setResult({ found: false, error: 'Connection error — check your internet.' });
    }
    setLoading(false);
  };

  const markRedeemed = async () => {
    setRedeeming(true);
    try {
      await fetch(SHEETS_API_URL, {
        method: 'POST', mode: 'no-cors',
        body: JSON.stringify({ type: 'redeem', code: result.code }),
      });
    } catch (_) {}
    setRedeemed(true);
    setResult(r => ({ ...r, status: 'Redeemed' }));
    setRedeeming(false);
  };

  const isActive   = result?.found && !redeemed && result.status === 'Active';
  const isRedeemed = result?.found && (redeemed  || result.status === 'Redeemed');

  const rowStyle  = { display:'flex', justifyContent:'space-between', alignItems:'baseline', padding:'8px 0', borderBottom:'1px solid var(--hairline)' };
  const lblStyle  = { fontFamily:'var(--font-sans)', fontSize:9, fontWeight:700, letterSpacing:'0.18em', textTransform:'uppercase', color:'var(--fg-muted)', flexShrink:0, marginRight:16 };
  const valStyle  = { fontFamily:'var(--font-sans)', fontSize:13, color:'var(--brand)', textAlign:'right' };

  return (
    <div style={{ maxWidth:520, margin:'0 auto', padding:'56px 20px 96px' }}>
      <Eyebrow style={{ marginBottom:12 }}>Owner</Eyebrow>
      <h1 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(32px,5vw,56px)', fontWeight:400, color:'var(--brand)', letterSpacing:'0.04em', textTransform:'uppercase', margin:'0 0 32px', lineHeight:1 }}>
        Voucher Lookup
      </h1>

      {/* ---- Pending Approvals ---- */}
      <div style={{ marginBottom:40 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
          <Eyebrow style={{ margin:0 }}>Pending Approvals</Eyebrow>
          {pendingList.length > 0 && (
            <span style={{ fontFamily:'var(--font-sans)', fontSize:9, fontWeight:700, letterSpacing:'0.12em', background:'#E8174A', color:'#fff', borderRadius:99, padding:'2px 8px' }}>
              {pendingList.length}
            </span>
          )}
        </div>

        {pendingLoad && (
          <p style={{ fontFamily:'var(--font-sans)', fontSize:11, fontStyle:'italic', color:'var(--fg-muted)', margin:0 }}>Loading…</p>
        )}

        {!pendingLoad && pendingList.length === 0 && (
          <p style={{ fontFamily:'var(--font-sans)', fontSize:11, fontStyle:'italic', color:'var(--fg-muted)', margin:0 }}>No pending vouchers.</p>
        )}

        {!pendingLoad && pendingList.map((row, idx) => (
          <div key={idx} style={{ border:'1px solid var(--brand)', padding:'18px 20px', marginBottom:12 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12 }}>
              <div>
                <div style={{ fontFamily:'var(--font-sans)', fontSize:11, fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase', color:'var(--brand)', marginBottom:2 }}>
                  {row.recipient_name}
                </div>
                <div style={{ fontFamily:'var(--font-sans)', fontSize:11, color:'var(--fg-muted)' }}>
                  {row.recipient_email}
                </div>
              </div>
              <div style={{ fontFamily:'var(--font-display)', fontSize:22, fontWeight:400, color:'var(--brand)', letterSpacing:'0.04em', flexShrink:0, marginLeft:12 }}>
                {row.voucher_amount}
              </div>
            </div>
            <div style={{ borderTop:'1px solid var(--hairline)', paddingTop:10, marginBottom:12 }}>
              {[
                ['From',    row.sender_name],
                ['GCash Ref', row.payment_ref],
                ['Submitted', row.submitted_at],
                ...(row.personal_message && row.personal_message !== '—' ? [['Message', row.personal_message]] : []),
              ].map(([label, value]) => (
                <div key={label} style={{ display:'flex', justifyContent:'space-between', padding:'4px 0', gap:12 }}>
                  <span style={lblStyle}>{label}</span>
                  <span style={{ fontFamily:'var(--font-sans)', fontSize:12, color:'var(--brand)', textAlign:'right', wordBreak:'break-all' }}>{value}</span>
                </div>
              ))}
            </div>
            <Button variant="filled" size="md" onClick={() => approvePending(row, idx)} disabled={approvingIdx === idx}>
              {approvingIdx === idx ? 'Approving…' : 'Approve & Send Voucher'}
            </Button>
          </div>
        ))}
      </div>

      <hr style={{ border:'none', borderTop:'1px solid var(--hairline)', marginBottom:32 }} />

      {/* ---- Code lookup ---- */}
      <Eyebrow style={{ marginBottom:12 }}>Look up a voucher</Eyebrow>
      <div style={{ display:'flex', gap:8, marginBottom:28 }}>
        <Input
          value={code}
          onChange={e => setCode(e.target.value.toUpperCase())}
          placeholder="NBJ-XXXX-XXXX"
          onKeyDown={e => e.key === 'Enter' && check()}
          style={{ flex:1, letterSpacing:'0.08em' }}
        />
        <Button variant="filled" onClick={check} disabled={loading || !code.trim()}>
          {loading ? 'Checking…' : 'Check'}
        </Button>
      </div>

      {/* Not found */}
      {result && !result.found && (
        <div style={{ border:'1px solid var(--hairline)', padding:'20px 24px' }}>
          <p style={{ fontFamily:'var(--font-sans)', fontSize:13, color:'#c0392b', margin:0 }}>
            Voucher code not found.{result.error ? ' ' + result.error : ''}
          </p>
        </div>
      )}

      {/* Found */}
      {result?.found && (
        <div style={{ border:'1px solid var(--brand)', padding:'24px 28px' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
            <span style={{ fontFamily:'var(--font-sans)', fontSize:9, fontWeight:700, letterSpacing:'0.18em', textTransform:'uppercase', color:'var(--brand)' }}>
              Voucher Found
            </span>
            <span style={{
              fontFamily:'var(--font-sans)', fontSize:9, fontWeight:700,
              letterSpacing:'0.14em', textTransform:'uppercase',
              padding:'3px 10px',
              color:      isActive ? '#1a7a3c' : '#b0879a',
              border:`1px solid ${isActive ? '#1a7a3c' : '#b0879a'}`,
            }}>
              {isActive ? '● Active' : 'Redeemed'}
            </span>
          </div>

          <div style={{ marginBottom:20 }}>
            {[
              ['Code',         result.code],
              ['Amount',       result.amount],
              ['From',         result.sender_name],
              ['To',           result.recipient_name],
              ['Email',        result.recipient_email],
              ['Date sent',    result.date_sent],
              ...(result.date_redeemed ? [['Redeemed on', result.date_redeemed]] : []),
            ].map(([label, value]) => (
              <div key={label} style={rowStyle}>
                <span style={lblStyle}>{label}</span>
                <span style={valStyle}>{value}</span>
              </div>
            ))}
          </div>

          {isActive && (
            <Button variant="filled" onClick={markRedeemed} disabled={redeeming}>
              {redeeming ? 'Saving…' : 'Mark as Redeemed'}
            </Button>
          )}
          {isRedeemed && (
            <p style={{ fontFamily:'var(--font-sans)', fontSize:11, color:'#b0879a', fontStyle:'italic', margin:0 }}>
              This voucher has already been redeemed.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

Object.assign(window, { BookingPanel, ConfirmedScreen, VoucherLookup });
