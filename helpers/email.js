import nodemailer from "nodemailer"

export const emailRegistro = async (datos) => {
    const { email, nombre, token} = datos

    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        }
    });

    // informacion del email
    const info = await transport.sendMail({
        from: "UpTask - Administrador de proectos <cuentas@uptask,com>",
        to: email,
        subject: "UPTask comprueba tu cuetnta",
        text: "compureba tu cuenbta",
        html: `<p>Hola ${nombre} compureba tu cuenta en UpTask </p>
        <a href="${process.env.FRONTEND_URL}/confirmar/${token}">comprobar cuenta</a>
        <p>Si no creates la cuenta, ignorar</p>
        `
    })
}

export const emailOlvidePassword = async (datos) => {
    const { email, nombre, token} = datos

    // TODO: mover hacia variables de entrono
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
    });

    // informacion del email
    const info = await transport.sendMail({
        from: "UpTask - Administrador de proectos <cuentas@uptask,com>",
        to: email,
        subject: "UPTask restablecer tu password",
        text: "restablecer tu password",
        html: `<p>Hola ${nombre} has solicitado resptablecer tu password </p>
        <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Restablecer password</a>
        <p>Si no lo solicitaste igorarlo</p>
        `
    })
}