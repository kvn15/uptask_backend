import { transporter } from "../config/nodemailer";

interface IEmail {
    email: string;
    name: string;
    token: string;
}

export class AuthEmail {
    static sendConfirmationEmail = async ( user: IEmail ) => {
        // Enviar email
        const info = await transporter.sendMail({
            from: 'UpTask <admin@updtask.com>',
            to: user.email,
            subject: 'UpTask - Confirma tu cuenta',
            text: 'UpTask - Confirma tu cuenta',
            html: `
                <p>Hola: ${user.name}, has creado tu cuenta en UpTask, ya casi esta todo listo,  solo debes confirmar tu cuenta. </p>
                <p>Visita el siguiente enlace</p>
                <a href="${process.env.URL_FRONTEND}/auth/confirm-account">Confirmar Cuenta</a>
                <p>Ingresa el código: <b>${user.token}</b></p>
                <p>Este token expira en 10 minutos</p>
            `
        });
    }
    static sendPasswordResetToken = async ( user: IEmail ) => {
        // Enviar email
        const info = await transporter.sendMail({
            from: 'UpTask <admin@updtask.com>',
            to: user.email,
            subject: 'UpTask - Reestablece tu password',
            text: 'UpTask - Reestablece tu password',
            html: `
                <p>Hola: ${user.name}, has solicitado restablecer tu password. </p>
                <p>Visita el siguiente enlace</p>
                <a href="${process.env.URL_FRONTEND}/auth/new-password">Restablecer Password</a>
                <p>Ingresa el código: <b>${user.token}</b></p>
                <p>Este token expira en 10 minutos</p>
            `
        });
    }
}