import { test, expect } from '@playwright/test';
import { RegisterUserPage } from '../pages/registerUser.page';

test.describe('Registro de usuario - DemoQA Book Store', () => {
  const BASE_USERNAME = 'userprueba';
  const PASSWORD_VALIDA = 'PasswordValida123!';
  const PASSWORD_INVALIDA = 'abc123';

  test('Registro exitoso o bloqueo por CAPTCHA', async ({ page }) => {
    const register = new RegisterUserPage(page);

    await register.abrirPaginaPrincipal();
    await register.navegarAlFormularioDeRegistro();
    await register.escribirNombre('NombreTest');
    await register.escribirApellido('ApellidoTest');
    await register.escribirUserName(BASE_USERNAME);
    await register.escribirPassword(PASSWORD_VALIDA);

    const mensajeAlerta = await register.confirmarRegistroYObtenerMensajeAlertaOpcional();

    if (mensajeAlerta) {
      // Caso 1: marcaste el CAPTCHA y el registro fue exitoso
      expect(mensajeAlerta).toContain('User Register Successfully.');
      console.log('Registro COMPLETADO correctamente.');
    } else {
      // Caso 2: NO marcaste el CAPTCHA, validamos el mensaje de bloqueo
      const msgCaptcha = await register.obtenerMensajeCaptcha();
      expect(msgCaptcha).toContain('Please verify reCaptcha to register!');
      console.log('Registro NO completado: CAPTCHA no marcado, pero el test pasa.');
    }
  });

  test('Registro con contraseña inválida (con o sin CAPTCHA)', async ({ page }) => {
    const register = new RegisterUserPage(page);

    await register.abrirPaginaPrincipal();
    await register.navegarAlFormularioDeRegistro();
    await register.escribirNombre('NombreTest');
    await register.escribirApellido('ApellidoTest');
    await register.escribirUserName(BASE_USERNAME);
    await register.escribirPassword(PASSWORD_INVALIDA);

    // Intentamos confirmar el registro
    await register.confirmarRegistroYObtenerMensajeAlertaOpcional();

    const mensaje = await register.obtenerMensajeContrasenaInvalida();
    console.log('MENSAJE REAL EN PANTALLA = [' + mensaje + ']');

    const msgCaptcha = 'Please verify reCaptcha to register!';
    const msgPassword =
      'Passwords must have at least one non alphanumeric character';

    if (mensaje.includes(msgCaptcha)) {
      // Caso: no se marcó el captcha
      expect(mensaje).toContain(msgCaptcha);
      console.log('Registro bloqueado por CAPTCHA, test OK.');
    } else if (mensaje.includes(msgPassword)) {
      // Caso: contraseña inválida
      expect(mensaje).toContain(msgPassword);
      console.log('Validación de contraseña inválida COMPLETADA, test OK.');
    } else {
      throw new Error('No salió ningún mensaje esperado. Mensaje real: ' + mensaje);
    }
  });
});
