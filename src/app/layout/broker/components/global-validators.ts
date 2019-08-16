import { AbstractControl, FormGroup } from '@angular/forms';

export class GlobalValidators {
	private static dniPattern = "(^(?!.*([1][2][3][4][5][6][7][8])).*)(^[0-9]{8,8}$)";
	private static cePattern = "^[a-zA-Z0-9]*$";
	// private static legalNamePattern = "^[a-zA-Z\-\,\:\(\)\&\$\#\. ]*$";
	private static legalNamePattern = "^[a-zA-Z0-9\-\,\:\(\)\&\$\#\. ]*$";
	// private static latinTextPattern = "^[a-zA-Z\u00C0-\u024F\' ]*$";
	private static latinTextPattern = "^[A-Za-zÁÉÍÓÚáéíóúÄËÏÖÜäëïöü\' ]*$";

	static getLatinTextPattern(): string | RegExp {
		return this.latinTextPattern;
	}
	static getLegalNamePattern(): string {
		return this.legalNamePattern;
	}
	static getCePattern(): string {
		return this.cePattern;
	}
	static getDniPattern(): string {
		return this.dniPattern;
	}

	/**
   * Validar que todos los caracteres no sean iguales
   * @param control valor de control de formulario
   */
	static notAllCharactersAreEqualValidator(control: AbstractControl): { [key: string]: boolean } | null {
		if (control.value != null && control.value.length == 8) {
			let areAllEqual: boolean = true;
			for (var i = 0; i < control.value.length; i++) {
				if (i > 0) {
					if (control.value.charAt(i) != control.value.charAt(i - 1)) areAllEqual = false;
				}
			}
			if (areAllEqual == true) return { 'AllCharactersAreEqual': true };
			else return null; //validation was passed
		} else {
			return null;
		}
	}

	/**
	 * Validar que todos los caracteres sean solo números
	 * @param control valor de control de formulario
	 */
	static onlyNumberValidator(control: AbstractControl): { [key: string]: boolean } | null {
		if (control.value != null && control.value.toString().trim() != "") {
			if (/^[0-9]+$/.test(control.value)) return null;
			else return { 'IsNotNumber': true };
		} else {
			return null;
		}
	}

	/**
	 * Validar que todos los caracteres sean solo números o caracteres de alfabeto
	 * @param control valor de control de formulario
	 */
	static onlyNumberAndTextValidator(control: AbstractControl): { [key: string]: boolean } | null {
		if (control.value != null && control.value.toString().trim() != "") {
			if (/^[0-96a-zA-Z]+$/.test(control.value)) return null;
			else return { 'IsNotNumberOrText': true };
		} else {
			return null;
		}
	}

	/**
	 * Validar que todos los caracteres sean caracteres de alfabeto y espacios
	 * @param control valor de control de formulario
	 */
	static onlyTextAndSpaceValidator(control: AbstractControl): { [key: string]: boolean } | null {
		if (control.value != null && control.value.toString().trim() != "") {
			if (/^[A-Za-z ]+$/.test(control.value)) return null;
			else return { 'IsNotTextOrSpace': true };
		} else {
			return null;
		}
	}

	/**
	 * Validar que el número de RUC solo pueda empezar con "10", "15", "17" y "20", en caso contrario será considerado no válido
	 * @param control valor de control de formulario
	 */
	static rucNumberValidator(control: AbstractControl): { [key: string]: boolean } | null {
		if (control.value != null && control.value.toString().trim() != "") {
			if (control.value.toString().trim().substring(0, 2) == "10" || control.value.toString().trim().substring(0, 2) == "15"
				|| control.value.toString().trim().substring(0, 2) == "17" || control.value.toString().trim().substring(0, 2) == "20") {
				return null;
			} else return { 'notValidRUC': true };
		} else {
			return null;
		}
	}

	/**
	 * Validar que no haya más de 3 vocales juntas
	 * @param control valor de control de formulario
	 */
	static vowelLimitValidation(control: AbstractControl): { [key: string]: boolean } | null {
		if (control.value != null && control.value.toString().trim() != "") {
			let vowelCount = 0;
			for (let i = 0; i < control.value.toString().trim().length; i++) {
				// if (/[aeiouAEIOU]/.test(control.value.toString().trim().charAt(i))) vowelCount++;
				// else vowelCount = 0;
				if (/[aeiouÁÉÍÓÚáéíóúÄËÏÖÜäëïöü]/.test(control.value.toString().trim().charAt(i))) vowelCount++;
				else if (/[\']/.test(control.value.toString().trim().charAt(i)) == false) vowelCount = 0;

				if (vowelCount > 3) return { 'moreThanThreeVowels': true };
			}
			return null;
		} else {
			return null;
		}
	}

	/**
	 * Validar que no haya 5 consonantes juntas
	 * @param control valor de control de formulario
	 */
	static consonantLimitValidation(control: AbstractControl): { [key: string]: boolean } | null {
		if (control.value != null && control.value.toString().trim() != "") {
			let consonantCount = 0;
			for (let i = 0; i < control.value.toString().trim().length; i++) {
				if (/[qwrtypsdfghjklñzxcvbnm]/.test(control.value.toString().trim().toLowerCase().charAt(i))) consonantCount++;
				else consonantCount = 0;

				if (consonantCount > 6) return { 'moreThanFiveConsonants': true };
			}
			return null;
		} else {
			return null;
		}
	}

	/**
	 * Validar que la fecha de inicio "startDate" no sea posterior a la fecha de fin "endDate"
	 * @param group formulario
	 */
	static dateSort(group: FormGroup): any {
		if (group) {
			if (group.get("startDate").value > group.get("endDate").value) {
				return { datesNotSortedCorrectly: true };
			} else {
				return null;
			}
		}

		return null;
	}

	/**
	 * Validar que la fecha no sea menor a 01/01/1900
	 * @param control valor de control de formulario
	 */
	static tooOldDateValidator(control: AbstractControl): { [key: string]: boolean } | null {
		if (control.value != null && control.value.toString().trim() != "") {
			if (control.value <= new Date("01/01/1900")) return { 'tooOldDate': true };
			return null;
		} else {
			return null;
		}
	}

	/**
	 * Validar la fecha para un componente personalizado
	 * @param control valor de control de formulario
	 */
	static notValidDate(control: AbstractControl): { [key: string]: boolean } | null {
		if (control.value != null && control.value.toString().trim() != "") {
			if (control.value.toString().trim() == "Invalid Date") return { 'InvalidDate': true };
			else return null; //validation was passed
		} else {
			return null;
		}
	}

}
