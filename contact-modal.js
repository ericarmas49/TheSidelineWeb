const CONTACT_SUCCESS_MESSAGE =
  "Thank you for reaching out, we will get back to you as soon as possible";
const CONTACT_API_ENDPOINTS = [
  "/api/contact",
  "https://circleblox.wpengine.com/wp-json/sideline/v1/contact",
];

async function submitContactForm(payload) {
  let lastError = null;

  for (const endpoint of CONTACT_API_ENDPOINTS) {
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.status === 404 && endpoint.startsWith("/api")) {
        continue;
      }

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || data.error || "Unable to send your message. Please try again.");
      }

      return data;
    } catch (error) {
      lastError = error;
      if (endpoint.startsWith("/api")) continue;
      throw error;
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error("Unable to send your message. Please try again.");
}

function buildContactMessage(subject, message) {
  const trimmedSubject = String(subject || "").trim();
  const trimmedMessage = String(message || "").trim();

  if (!trimmedSubject) return trimmedMessage;
  return `Subject: ${trimmedSubject}\n\n${trimmedMessage}`;
}

function buildContactModalMarkup() {
  return `
    <div class="sl-contact-modal-backdrop" data-contact-dismiss></div>
    <div
      class="sl-contact-modal-dialog"
      role="dialog"
      aria-modal="true"
      aria-labelledby="sl-contact-modal-title"
    >
      <button type="button" class="sl-contact-modal-close" data-contact-dismiss aria-label="Close contact form">
        <span aria-hidden="true">&times;</span>
      </button>
      <div class="sl-contact-modal-form-view" id="sl-contact-modal-form-view">
        <h2 class="sl-contact-modal-title" id="sl-contact-modal-title">Contact Us</h2>
        <form class="sl-contact-form" id="sl-contact-form" novalidate>
          <div class="sl-contact-field">
            <label class="sl-contact-label" for="sl-contact-name">Name <span class="sl-contact-required">*</span></label>
            <input
              class="sl-contact-input"
              type="text"
              id="sl-contact-name"
              name="name"
              autocomplete="name"
              required
            />
          </div>
          <div class="sl-contact-field">
            <label class="sl-contact-label" for="sl-contact-email">Email <span class="sl-contact-required">*</span></label>
            <input
              class="sl-contact-input"
              type="email"
              id="sl-contact-email"
              name="email"
              autocomplete="email"
              required
            />
          </div>
          <div class="sl-contact-field">
            <label class="sl-contact-label" for="sl-contact-subject">Subject</label>
            <input
              class="sl-contact-input"
              type="text"
              id="sl-contact-subject"
              name="subject"
              autocomplete="off"
            />
          </div>
          <div class="sl-contact-field">
            <label class="sl-contact-label" for="sl-contact-message">Message <span class="sl-contact-required">*</span></label>
            <textarea
              class="sl-contact-textarea"
              id="sl-contact-message"
              name="message"
              rows="5"
              required
            ></textarea>
          </div>
          <p class="sl-contact-error" id="sl-contact-error" hidden></p>
          <button type="submit" class="sl-contact-submit" id="sl-contact-submit">Submit</button>
        </form>
      </div>
      <div class="sl-contact-modal-success-view" id="sl-contact-modal-success-view" hidden>
        <p class="sl-contact-success-message">${CONTACT_SUCCESS_MESSAGE}</p>
        <button type="button" class="sl-contact-submit" data-contact-dismiss>Close</button>
      </div>
    </div>
  `;
}

function bindContactForm({
  form,
  formView,
  successView,
  errorEl,
  submitButton,
  nameInput,
  emailInput,
  messageInput,
  onSuccess,
  onReset,
}) {
  const requiredInputs = [nameInput, emailInput, messageInput].filter(Boolean);

  function clearFieldErrors() {
    requiredInputs.forEach((input) => input.classList.remove("is-invalid"));
  }

  function markRequiredFieldErrors({ name, email, message }) {
    clearFieldErrors();
    if (!name) nameInput?.classList.add("is-invalid");
    if (!email) emailInput?.classList.add("is-invalid");
    if (!message) messageInput?.classList.add("is-invalid");
  }

  function setError(message) {
    if (!errorEl) return;
    if (!message) {
      errorEl.hidden = true;
      errorEl.textContent = "";
      return;
    }

    errorEl.hidden = false;
    errorEl.textContent = message;
  }

  function showFormView() {
    formView?.removeAttribute("hidden");
    successView?.setAttribute("hidden", "");
    clearFieldErrors();
    setError("");
  }

  function showSuccessView() {
    formView?.setAttribute("hidden", "");
    successView?.removeAttribute("hidden");
    setError("");
    onSuccess?.();
  }

  function resetForm() {
    showFormView();
    form?.reset();
    clearFieldErrors();
    setError("");
    submitButton?.removeAttribute("disabled");
    onReset?.();
  }

  requiredInputs.forEach((input) => {
    input.addEventListener("input", () => {
      if (String(input.value || "").trim()) {
        input.classList.remove("is-invalid");
      }
    });
  });

  form?.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearFieldErrors();
    setError("");

    const formData = new FormData(form);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const subject = String(formData.get("subject") || "").trim();
    const message = String(formData.get("message") || "").trim();

    if (!name || !email || !message) {
      markRequiredFieldErrors({ name, email, message });
      setError("Please fill out all required fields");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      emailInput?.classList.add("is-invalid");
      setError("Please enter a valid email address.");
      return;
    }

    submitButton.disabled = true;

    try {
      await submitContactForm({
        name,
        email,
        message: buildContactMessage(subject, message),
      });

      showSuccessView();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unable to send your message. Please try again.");
    } finally {
      submitButton.disabled = false;
    }
  });

  return { showFormView, showSuccessView, resetForm };
}

function bootContactPage() {
  const pageRoot = document.getElementById("sl-contact-page");
  if (!pageRoot) return;

  const form = document.getElementById("sl-contact-form");
  const formView = document.getElementById("sl-contact-page-form-view");
  const successView = document.getElementById("sl-contact-page-success-view");
  const errorEl = document.getElementById("sl-contact-error");
  const submitButton = document.getElementById("sl-contact-submit");
  const resetButton = document.getElementById("sl-contact-page-reset");
  const successMessage = document.getElementById("sl-contact-page-success-message");
  const nameInput = document.getElementById("sl-contact-name");

  if (successMessage) {
    successMessage.textContent = CONTACT_SUCCESS_MESSAGE;
  }

  const contactForm = bindContactForm({
    form,
    formView,
    successView,
    errorEl,
    submitButton,
    nameInput: document.getElementById("sl-contact-name"),
    emailInput: document.getElementById("sl-contact-email"),
    messageInput: document.getElementById("sl-contact-message"),
  });

  resetButton?.addEventListener("click", () => {
    contactForm.resetForm();
    window.setTimeout(() => nameInput?.focus(), 0);
  });

  window.setTimeout(() => nameInput?.focus(), 0);
}

function bootContactModal() {
  const trigger = document.getElementById("sl-footer-contact");
  const triggerHref = trigger?.getAttribute("href") || "";
  const opensModal = trigger && (triggerHref === "#" || triggerHref.endsWith("#"));

  if (!opensModal) return;

  let modal = document.getElementById("sl-contact-modal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "sl-contact-modal";
    modal.className = "sl-contact-modal";
    modal.hidden = true;
    modal.innerHTML = buildContactModalMarkup();
    document.body.appendChild(modal);
  }

  const form = document.getElementById("sl-contact-form");
  const formView = document.getElementById("sl-contact-modal-form-view");
  const successView = document.getElementById("sl-contact-modal-success-view");
  const errorEl = document.getElementById("sl-contact-error");
  const submitButton = document.getElementById("sl-contact-submit");
  const nameInput = document.getElementById("sl-contact-name");
  let lastFocusedElement = null;

  const contactForm = bindContactForm({
    form,
    formView,
    successView,
    errorEl,
    submitButton,
    nameInput,
    emailInput: document.getElementById("sl-contact-email"),
    messageInput: document.getElementById("sl-contact-message"),
  });

  function openModal() {
    lastFocusedElement = document.activeElement;
    contactForm.showFormView();
    form?.reset();
    modal.hidden = false;
    document.body.classList.add("sl-contact-modal-open");
    window.setTimeout(() => nameInput?.focus(), 0);
  }

  function closeModal() {
    modal.hidden = true;
    document.body.classList.remove("sl-contact-modal-open");
    contactForm.resetForm();

    if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
      lastFocusedElement.focus();
    }
  }

  trigger.addEventListener("click", (event) => {
    event.preventDefault();
    openModal();
  });

  modal.querySelectorAll("[data-contact-dismiss]").forEach((element) => {
    element.addEventListener("click", closeModal);
  });

  document.addEventListener("keydown", (event) => {
    if (modal.hidden || event.key !== "Escape") return;
    closeModal();
  });
}

function bootContact() {
  bootContactPage();
  bootContactModal();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootContact);
} else {
  bootContact();
}
