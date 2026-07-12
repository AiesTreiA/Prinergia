import nodemailer from "nodemailer"

// ─── Transporter ────────────────────────────────────────────────────────────

function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST || "smtp.resend.com",
    port: Number(process.env.EMAIL_SERVER_PORT) || 465,
    secure: true, // port 465 = SSL
    auth: {
      user: process.env.EMAIL_SERVER_USER || "resend",
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
  })
}

const FROM = process.env.EMAIL_FROM || "Prinergia <hola@prinergia.com>"

// ─── Base HTML wrapper ───────────────────────────────────────────────────────

function baseTemplate(content: string, previewText = "") {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  ${previewText ? `<div style="display:none;max-height:0;overflow:hidden;">${previewText}&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;</div>` : ""}
  <title>Prinergia</title>
</head>
<body style="margin:0;padding:0;background-color:#0a0f0a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0a0f0a;min-height:100vh;">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- Logo -->
          <tr>
            <td align="center" style="padding-bottom:32px;">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:linear-gradient(135deg,#2d8a4e,#1f7a45);border-radius:14px;padding:10px 14px;">
                    <span style="color:white;font-size:20px;font-weight:800;letter-spacing:-0.5px;">🌿 Prinergia</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:24px;padding:48px 40px;">
              ${content}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding-top:32px;">
              <p style="color:rgba(255,255,255,0.2);font-size:12px;margin:0 0 8px;">
                © 2024 Prinergia · Todos los derechos reservados
              </p>
              <p style="color:rgba(255,255,255,0.15);font-size:11px;margin:0;">
                Recibiste este correo porque te registraste en Prinergia.
                <a href="#" style="color:rgba(74,222,128,0.5);text-decoration:none;">Cancelar suscripción</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

function ctaButton(label: string, url: string, color = "#2d8a4e") {
  return `
  <table cellpadding="0" cellspacing="0" style="margin:0 auto;">
    <tr>
      <td style="background:linear-gradient(135deg,${color},#1f7a45);border-radius:14px;">
        <a href="${url}"
           style="display:inline-block;padding:14px 32px;color:white;font-size:15px;font-weight:700;text-decoration:none;letter-spacing:-0.2px;">
          ${label} →
        </a>
      </td>
    </tr>
  </table>`
}

function divider() {
  return `<tr><td style="padding:24px 0;"><div style="height:1px;background:rgba(255,255,255,0.07);"></div></td></tr>`
}

function stepRow(number: string, text: string, color = "#2d8a4e") {
  return `
  <tr>
    <td style="padding:8px 0;">
      <table cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <td width="36" style="vertical-align:top;padding-top:2px;">
            <div style="width:28px;height:28px;border-radius:8px;background:rgba(74,222,128,0.12);border:1px solid rgba(74,222,128,0.25);text-align:center;line-height:28px;font-size:13px;font-weight:700;color:${color};">${number}</div>
          </td>
          <td style="padding-left:12px;color:rgba(255,255,255,0.55);font-size:14px;line-height:22px;">${text}</td>
        </tr>
      </table>
    </td>
  </tr>`
}

// ─── Magic Link Email ────────────────────────────────────────────────────────

export async function sendMagicLinkEmail(email: string, url: string) {
  const content = `
    <tr>
      <td align="center" style="padding-bottom:28px;">
        <div style="width:64px;height:64px;border-radius:20px;background:rgba(74,222,128,0.12);border:1px solid rgba(74,222,128,0.25);margin:0 auto 20px;line-height:64px;text-align:center;font-size:28px;">✉️</div>
        <h1 style="color:white;font-size:26px;font-weight:800;margin:0 0 10px;letter-spacing:-0.5px;">Tu enlace de acceso</h1>
        <p style="color:rgba(255,255,255,0.45);font-size:15px;margin:0;line-height:24px;">
          Haz clic en el botón para iniciar sesión en Prinergia.<br/>El enlace expira en 24 horas.
        </p>
      </td>
    </tr>
    <tr>
      <td align="center" style="padding-bottom:32px;">
        ${ctaButton("Entrar a Prinergia", url)}
      </td>
    </tr>
    <tr>
      <td style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:12px;padding:16px 20px;">
        <p style="color:rgba(255,255,255,0.3);font-size:12px;margin:0 0 8px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">O copia este enlace en tu navegador:</p>
        <p style="color:rgba(74,222,128,0.6);font-size:12px;margin:0;word-break:break-all;">${url}</p>
      </td>
    </tr>
    <tr>
      <td style="padding-top:20px;">
        <p style="color:rgba(255,255,255,0.2);font-size:12px;margin:0;text-align:center;">
          Si no solicitaste este enlace, puedes ignorar este correo. Tu cuenta está segura.
        </p>
      </td>
    </tr>
  `

  const html = baseTemplate(
    `<table width="100%" cellpadding="0" cellspacing="0">${content}</table>`,
    "Tu enlace mágico de acceso a Prinergia está aquí"
  )

  const transporter = createTransporter()
  await transporter.sendMail({
    from: FROM,
    to: email,
    subject: "🔐 Tu enlace de acceso a Prinergia",
    html,
    text: `Haz clic en este enlace para entrar a Prinergia: ${url}\n\nEl enlace expira en 24 horas.`,
  })
}

// ─── Welcome: Professional / Therapist ──────────────────────────────────────

export async function sendWelcomeProfessional(data: {
  email: string
  firstName: string
  profession?: string
}) {
  const name = data.firstName || "Profesional"
  const profession = data.profession || "Profesional del bienestar"
  const appUrl = process.env.NEXTAUTH_URL || "http://localhost:3000"

  const content = `
    <tr>
      <td>
        <div style="display:inline-block;background:rgba(74,222,128,0.1);border:1px solid rgba(74,222,128,0.2);border-radius:999px;padding:6px 16px;margin-bottom:24px;">
          <span style="color:hsl(142,70%,60%);font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;">✨ Perfil recibido · En revisión</span>
        </div>
        <h1 style="color:white;font-size:28px;font-weight:800;margin:0 0 12px;letter-spacing:-0.5px;">
          ¡Hola, ${name}! 🌿
        </h1>
        <p style="color:rgba(255,255,255,0.5);font-size:16px;line-height:26px;margin:0 0 28px;">
          Recibimos tu solicitud como <strong style="color:rgba(255,255,255,0.75);">${profession}</strong> en Prinergia. Estamos revisando tu perfil y te contactaremos en las próximas <strong style="color:hsl(142,70%,60%);">24–48 horas</strong>.
        </p>
      </td>
    </tr>

    <tr>
      <td style="background:rgba(74,222,128,0.05);border:1px solid rgba(74,222,128,0.12);border-radius:16px;padding:24px;margin-bottom:28px;">
        <p style="color:rgba(255,255,255,0.4);font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;margin:0 0 16px;">¿Qué sigue?</p>
        <table width="100%" cellpadding="0" cellspacing="0">
          ${stepRow("1", "Nuestro equipo verifica tu información y documentos profesionales")}
          ${stepRow("2", "Recibirás un email de confirmación con tu perfil activo")}
          ${stepRow("3", "Configuras tu calendario, precios y disponibilidad")}
          ${stepRow("4", "¡Empiezas a recibir solicitudes de tus primeros clientes!")}
        </table>
      </td>
    </tr>

    <tr><td style="padding:28px 0 20px;">
      <p style="color:rgba(255,255,255,0.35);font-size:14px;text-align:center;margin:0 0 20px;">
        Mientras tanto, prepara tu foto de perfil y una descripción impactante.
      </p>
    </td></tr>

    <tr>
      <td align="center" style="padding-bottom:28px;">
        ${ctaButton("Ver mi perfil provisional", `${appUrl}/profile`)}
      </td>
    </tr>

    <tr>
      <td style="background:rgba(255,255,255,0.03);border-radius:12px;padding:20px;">
        <p style="color:rgba(255,255,255,0.25);font-size:13px;margin:0;">
          💬 ¿Tienes dudas? Escríbenos a <a href="mailto:hola@prinergia.com" style="color:hsl(142,70%,55%);text-decoration:none;">hola@prinergia.com</a> — respondemos en menos de 24h.
        </p>
      </td>
    </tr>
  `

  const html = baseTemplate(
    `<table width="100%" cellpadding="0" cellspacing="0">${content}</table>`,
    `${name}, tu perfil en Prinergia está en revisión 🌿`
  )

  const transporter = createTransporter()
  await transporter.sendMail({
    from: FROM,
    to: data.email,
    subject: `🌿 Tu perfil está en revisión, ${name}`,
    html,
    text: `Hola ${name}, recibimos tu solicitud como ${profession} en Prinergia. Revisaremos tu perfil en 24-48 horas y te confirmaremos por email.`,
  })
}

// ─── Welcome: Client ─────────────────────────────────────────────────────────

export async function sendWelcomeClient(data: {
  email: string
  firstName?: string
}) {
  const name = data.firstName || "amigo/a"
  const appUrl = process.env.NEXTAUTH_URL || "http://localhost:3000"

  const categories = [
    { emoji: "🧠", label: "Terapia", path: "/search?type=terapia" },
    { emoji: "🧘", label: "Yoga", path: "/search?type=yoga" },
    { emoji: "🎯", label: "Coaching", path: "/search?type=coaching" },
    { emoji: "💃", label: "Biodanza", path: "/search?type=biodanza" },
  ]

  const catCells = categories.map(c => `
    <td width="25%" style="text-align:center;padding:0 6px;">
      <a href="${appUrl}${c.path}" style="text-decoration:none;">
        <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:14px;padding:16px 8px;">
          <div style="font-size:24px;margin-bottom:8px;">${c.emoji}</div>
          <div style="color:rgba(255,255,255,0.55);font-size:12px;font-weight:600;">${c.label}</div>
        </div>
      </a>
    </td>
  `).join("")

  const content = `
    <tr>
      <td>
        <div style="font-size:40px;margin-bottom:16px;">✨</div>
        <h1 style="color:white;font-size:28px;font-weight:800;margin:0 0 12px;letter-spacing:-0.5px;">
          ¡Bienvenido/a, ${name}!
        </h1>
        <p style="color:rgba(255,255,255,0.5);font-size:16px;line-height:26px;margin:0 0 28px;">
          Ya eres parte de Prinergia. Conecta con los mejores profesionales del bienestar cerca de ti y comienza tu camino hacia el equilibrio.
        </p>
      </td>
    </tr>

    <tr>
      <td align="center" style="padding-bottom:32px;">
        ${ctaButton("Buscar profesionales cerca de mí", `${appUrl}/search`)}
      </td>
    </tr>

    <tr>
      <td style="padding-bottom:28px;">
        <p style="color:rgba(255,255,255,0.3);font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;margin:0 0 16px;">Explora por categoría</p>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>${catCells}</tr>
        </table>
      </td>
    </tr>

    <tr>
      <td style="background:rgba(74,222,128,0.05);border:1px solid rgba(74,222,128,0.12);border-radius:16px;padding:24px;">
        <p style="color:rgba(255,255,255,0.4);font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;margin:0 0 14px;">¿Por dónde empezar?</p>
        <table width="100%" cellpadding="0" cellspacing="0">
          ${stepRow("1", "Explora el mapa interactivo y encuentra profesionales cerca de ti")}
          ${stepRow("2", "Revisa perfiles, especialidades y valoraciones de otros usuarios")}
          ${stepRow("3", "Agenda tu primera sesión en minutos, sin complicaciones")}
        </table>
      </td>
    </tr>

    <tr>
      <td style="padding-top:24px;">
        <p style="color:rgba(255,255,255,0.25);font-size:13px;text-align:center;margin:0;">
          ¿Eres profesional del bienestar?
          <a href="${appUrl}/register" style="color:hsl(142,70%,55%);text-decoration:none;font-weight:600;"> Crea tu perfil →</a>
        </p>
      </td>
    </tr>
  `

  const html = baseTemplate(
    `<table width="100%" cellpadding="0" cellspacing="0">${content}</table>`,
    `${name}, tu bienestar comienza ahora ✨`
  )

  const transporter = createTransporter()
  await transporter.sendMail({
    from: FROM,
    to: data.email,
    subject: `✨ Bienvenido/a a Prinergia, ${name}`,
    html,
    text: `Hola ${name}, ya eres parte de Prinergia. Explora nuestros profesionales del bienestar en ${appUrl}/search`,
  })
}

// ─── Welcome: Wellness Center ────────────────────────────────────────────────

export async function sendWelcomeWellnessCenter(data: {
  email: string
  centerName: string
  contactName?: string
}) {
  const center = data.centerName || "tu centro"
  const contact = data.contactName || "Equipo"
  const appUrl = process.env.NEXTAUTH_URL || "http://localhost:3000"

  const checklist = [
    { done: true,  label: "Registro del centro completado" },
    { done: false, label: "Verificación de documentos (24–48 h)" },
    { done: false, label: "Configurar horarios y servicios del centro" },
    { done: false, label: "Agregar a tu equipo de profesionales" },
    { done: false, label: "Publicar tu página pública del centro" },
  ]

  const checklistRows = checklist.map(item => `
    <tr>
      <td style="padding:7px 0;">
        <table cellpadding="0" cellspacing="0">
          <tr>
            <td width="24" style="vertical-align:middle;">
              <div style="width:20px;height:20px;border-radius:6px;${item.done ? "background:linear-gradient(135deg,#2d8a4e,#1f7a45);" : "border:2px solid rgba(255,255,255,0.12);background:rgba(255,255,255,0.04);"}text-align:center;line-height:20px;font-size:11px;color:white;">${item.done ? "✓" : ""}</div>
            </td>
            <td style="padding-left:12px;color:${item.done ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.4)"};font-size:14px;${item.done ? "text-decoration:line-through;" : ""}">${item.label}</td>
          </tr>
        </table>
      </td>
    </tr>
  `).join("")

  const content = `
    <tr>
      <td>
        <div style="display:inline-block;background:rgba(200,160,80,0.1);border:1px solid rgba(200,160,80,0.2);border-radius:999px;padding:6px 16px;margin-bottom:24px;">
          <span style="color:hsl(42,80%,65%);font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;">🏛️ Centro de bienestar · En proceso</span>
        </div>
        <h1 style="color:white;font-size:28px;font-weight:800;margin:0 0 12px;letter-spacing:-0.5px;">
          ¡${center} ya está en Prinergia!
        </h1>
        <p style="color:rgba(255,255,255,0.5);font-size:16px;line-height:26px;margin:0 0 28px;">
          Hola ${contact}, gracias por registrar tu centro. Estamos procesando tu solicitud y pronto podrás gestionar tu equipo, horarios y reservas desde un solo lugar.
        </p>
      </td>
    </tr>

    <tr>
      <td style="background:rgba(200,160,80,0.04);border:1px solid rgba(200,160,80,0.1);border-radius:16px;padding:24px;margin-bottom:28px;">
        <p style="color:rgba(255,255,255,0.3);font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;margin:0 0 16px;">Progreso del onboarding</p>
        <table width="100%" cellpadding="0" cellspacing="0">
          ${checklistRows}
        </table>
      </td>
    </tr>

    <tr>
      <td style="padding:24px 0;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td width="50%" style="padding-right:8px;">
              <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:14px;padding:20px;text-align:center;">
                <div style="font-size:24px;margin-bottom:8px;">👥</div>
                <div style="color:white;font-size:14px;font-weight:700;margin-bottom:4px;">Gestiona tu equipo</div>
                <div style="color:rgba(255,255,255,0.3);font-size:12px;">Agrega profesionales a tu centro</div>
              </div>
            </td>
            <td width="50%" style="padding-left:8px;">
              <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:14px;padding:20px;text-align:center;">
                <div style="font-size:24px;margin-bottom:8px;">📅</div>
                <div style="color:white;font-size:14px;font-weight:700;margin-bottom:4px;">Calendario unificado</div>
                <div style="color:rgba(255,255,255,0.3);font-size:12px;">Gestiona todas las citas</div>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <tr>
      <td align="center" style="padding-bottom:24px;">
        ${ctaButton("Ir al panel del centro", `${appUrl}/profile`, "#7c5c2e")}
      </td>
    </tr>

    <tr>
      <td style="background:rgba(255,255,255,0.03);border-radius:12px;padding:20px;">
        <p style="color:rgba(255,255,255,0.3);font-size:13px;margin:0;">
          🤝 Un especialista de Prinergia se pondrá en contacto contigo para guiarte en los próximos pasos. También puedes escribirnos a <a href="mailto:centros@prinergia.com" style="color:hsl(142,70%,55%);text-decoration:none;">centros@prinergia.com</a>
        </p>
      </td>
    </tr>
  `

  const html = baseTemplate(
    `<table width="100%" cellpadding="0" cellspacing="0">${content}</table>`,
    `${center} ya está en Prinergia 🏛️`
  )

  const transporter = createTransporter()
  await transporter.sendMail({
    from: FROM,
    to: data.email,
    subject: `🏛️ ${center} está casi listo en Prinergia`,
    html,
    text: `Hola ${contact}, ${center} ya está en Prinergia. Estamos revisando tu solicitud en 24-48 horas.`,
  })
}

// ─── Dispatcher ─────────────────────────────────────────────────────────────

export type UserType = "professional" | "client" | "wellness_center"

export async function sendWelcomeEmail(
  type: UserType,
  data: {
    email: string
    firstName?: string
    lastName?: string
    profession?: string
    centerName?: string
    contactName?: string
  }
) {
  switch (type) {
    case "professional":
      return sendWelcomeProfessional({
        email: data.email,
        firstName: data.firstName || "",
        profession: data.profession,
      })
    case "client":
      return sendWelcomeClient({
        email: data.email,
        firstName: data.firstName,
      })
    case "wellness_center":
      return sendWelcomeWellnessCenter({
        email: data.email,
        centerName: data.centerName || data.firstName || "Tu centro",
        contactName: data.contactName || data.firstName,
      })
    default:
      return sendWelcomeClient({ email: data.email, firstName: data.firstName })
  }
}
