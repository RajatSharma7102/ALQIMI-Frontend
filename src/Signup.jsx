import { useState } from "react";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\+?[\d\s\-().]{7,20}$/;
const PW_RE    = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

const INITIAL = {
  email: "", firstName: "", password: "", lastName: "",
  confirmPassword: "", organization: "", phone: "", position: "",
};

function validate(name, value, allValues) {
  switch (name) {
    case "email":
      return EMAIL_RE.test(value.trim()) ? "" : "Please enter a valid email address.";
    case "firstName":
      return value.trim() ? "" : "First name is required.";
    case "lastName":
      return value.trim() ? "" : "Last name is required.";
    case "organization":
      return value.trim() ? "" : "Organization is required.";
    case "phone":
      return PHONE_RE.test(value.trim()) ? "" : "Enter a valid phone number (e.g. +91 9876543210).";
    case "password":
      return PW_RE.test(value)
        ? ""
        : "Min 8 chars with uppercase, lowercase, and a number.";
    case "confirmPassword":
      if (!value.trim()) return "Please confirm your password.";
      return value === allValues.password ? "" : "Passwords do not match.";
    default:
      return "";
  }
}

const REQUIRED = ["email","firstName","password","lastName","confirmPassword","organization","phone"];

function PasswordField({ id, name, label, value, onChange, onBlur, error, touched, required }) {
  const [show, setShow] = useState(false);
  const stateClass = touched ? (error ? "invalid" : "valid") : "";

  return (
    <div>           
      <label className="forge-label" htmlFor={id}>
        {label}{required && <span className="req">*</span>}
      </label>
      <div className={`pw-wrapper ${stateClass}`}>
        <input
          id={id}
          name={name}
          type={show ? "text" : "password"}
          className={`forge-input ${touched ? (error ? "is-invalid" : "is-valid") : ""}`}
          placeholder={label}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          autoComplete={id === "password" ? "new-password" : "off"}
        />
        <button
          type="button"
          className="btn-eye"
          onClick={() => setShow(s => !s)}
          aria-label="Toggle visibility"
        >
          <i className={`bi ${show ? "bi-eye" : "bi-eye-slash"}`} />
        </button>
      </div>
      <div className="field-error">{touched && error}</div>
    </div>
  );
}
            
function TextField({ id, name, label, type = "text", placeholder, value, onChange, onBlur, error, touched, required }) {
  return (
    <div>
      <label className="forge-label" htmlFor={id}>
        {label}{required && <span className="req">*</span>}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        className={`forge-input ${touched ? (error ? "is-invalid" : "is-valid") : ""}`}
        placeholder={placeholder || label}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
      />
      <div className="field-error">{touched && error}</div>
    </div>
  );
}

export default function RegistrationForm() {
  const [values,  setValues]  = useState(INITIAL);
  const [errors,  setErrors]  = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [toast,   setToast]   = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newValues = { ...values, [name]: value };
    setValues(newValues);
    if (touched[name]) {
      const err = validate(name, value, newValues);
      setErrors(prev => ({ ...prev, [name]: err }));
      if (name === "password" && touched.confirmPassword) {
        setErrors(prev => ({
          ...prev,
          confirmPassword: validate("confirmPassword", newValues.confirmPassword, newValues),
        }));
      }
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrors(prev => ({ ...prev, [name]: validate(name, value, values) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newTouched = REQUIRED.reduce((acc, k) => ({ ...acc, [k]: true }), {});
    setTouched(prev => ({ ...prev, ...newTouched }));

    const newErrors = REQUIRED.reduce((acc, k) => ({
      ...acc, [k]: validate(k, values[k], values),
    }), {});
    setErrors(newErrors);

    if (Object.values(newErrors).some(Boolean)) return;

    setLoading(true);
    try {
      
      await new Promise(r => setTimeout(r, 1200)); 

      setValues(INITIAL);
      setErrors({});
      setTouched({});
      setToast(true);
      setTimeout(() => setToast(false), 3500);
    } catch (err) {
      alert(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const field = (name) => ({
    name,
    value: values[name],
    onChange: handleChange,
    onBlur: handleBlur,
    error: errors[name],
    touched: !!touched[name],
  });

  return (
    <>
      {toast && (
        <div className="toast-success">
          <i className="bi bi-check-circle-fill" />
          Registration successful!
        </div>
      )}

      <div className="forge-card">

        <form onSubmit={handleSubmit} noValidate>
          <div className="row row-gap">

            <div className="col-12 col-sm-6">
              <TextField id="email" label="Email Address" type="email"
                placeholder="Email" required {...field("email")} />
            </div>

            <div className="col-12 col-sm-6">
              <TextField id="firstName" label="First Name"
                placeholder="First Name" required {...field("firstName")} />
            </div>

            <div className="col-12 col-sm-6">
              <PasswordField id="password" label="Password" required {...field("password")} />
            </div>

            <div className="col-12 col-sm-6">
              <TextField id="lastName" label="Last Name"
                placeholder="Last Name" required {...field("lastName")} />
            </div>

            <div className="col-12 col-sm-6">
              <PasswordField id="confirmPassword" label="Confirm Password" required {...field("confirmPassword")} />
            </div>

            <div className="col-12 col-sm-6">
              <TextField id="organization" label="Organization"
                placeholder="Organization" required {...field("organization")} />
            </div>

            <div className="col-12 col-sm-6">
              <TextField id="phone" label="Phone Number" type="tel"
                placeholder="Phone Number with country code" required {...field("phone")} />
            </div>

            <div className="col-12 col-sm-6">
              <TextField id="position" label="Position"
                placeholder="Position" {...field("position")} />
            </div>

          </div>

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? "Submitting…" : "Submit"}
          </button>
        </form>
      </div>
    </>
  );
}