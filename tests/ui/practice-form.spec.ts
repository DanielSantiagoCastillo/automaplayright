import { test, expect } from '@playwright/test';
import { PracticeFormPage } from '../pages/practiceForm.page';

test.describe('Practice Form - DemoQA', () => {
  test('Registrar estudiante con todos los datos válidos', async ({ page }) => {
    const form = new PracticeFormPage(page);

    await form.abrirPaginaPracticeForm();

    await form.escribirFirstName('Juan');
    await form.escribirLastName('Pérez');
    await form.escribirEmail('juan.perez@example.com');
    await form.seleccionarGenero('Male');
    await form.escribirMobileNumber('3001234567');
    await form.seleccionarFechaNacimiento('14 Jan 1995');
    await form.escribirSubject('Maths');
    await form.seleccionarHobbies('Sports, Reading');
    await form.cargarImagenValida(); // asegúrate de que la ruta del PNG exista
    await form.escribirCurrentAddress('Calle falsa 123, Ciudad X');
    await form.seleccionarEstado('NCR');
    await form.seleccionarCiudad('Delhi');
    await form.clickSubmit();
  });
});
