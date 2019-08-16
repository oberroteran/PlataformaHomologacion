import { AbstractControl } from '@angular/forms';
function getIndexBy(array: Array<{}>, { name, value }): number {
  for (let i = 0; i < array.length; i++) {
    if (array[i][name] === value) {
      return i;
    }
  }
  return -1;
}

function sortArray(array, property, direction) {
  array.sort(function compare(a, b) {
    let comparison = 0;
    if (a[property] > b[property]) {
      comparison = 1 * direction;
    } else if (a[property] < b[property]) {
      comparison = -1 * direction;
    }
    return comparison;
  });
  return array;
}

function arrayMove(arr, fromIndex, toIndex) {
  const element = arr[fromIndex];
  arr.splice(fromIndex, 1);
  arr.splice(toIndex, 0, element);
}

function sortArrayByProperty(prop, arr) {
  prop = prop.split('.');
  const len = prop.length;

  arr.sort(function (a, b) {
    let i = 0;
    let key;

    while (i < len) {
      key = prop[i];

      if (!a.hasOwnProperty(key)) {
        return 1;
      }
      if (!b.hasOwnProperty(key)) {
        return -1;
      }

      a = a[key];
      b = b[key];
      i++;
    }
    if (a < b) {
      return -1;
    } else if (a > b) {
      return 1;
    } else {
      return 0;
    }
  });
  return arr;
}

function convertDateToStringOracle(fec: Date): string {
  const tsTofec = new Date(fec);
  let hdia = tsTofec.getUTCDate().toString();
  let hmes = (tsTofec.getUTCMonth() + 1).toString();
  const hanio = tsTofec.getUTCFullYear().toString();
  if (hmes.length <= 1) {
    hmes = '0' + hmes;
  }
  if (hdia.length <= 1) {
    hdia = '0' + hdia;
  }
  return hdia + '-' + hmes + '-' + hanio;
}

function validateMinDate(control: AbstractControl) {
  if (control.value !== undefined && control.value !== '' && control.value !== null) {
    const Modalidad = JSON.parse(sessionStorage.getItem('Modalidad'));
    const tCertificado = Modalidad && Modalidad['tipoCertificado'];
    if (tCertificado === 1) {
      return true;
    }
    const arrFecha = control.value.toString().split('-');
    const inputDay = +arrFecha[2];
    const inputMonth = +arrFecha[1];
    const inputYear = +arrFecha[0];
    const currDate = new Date();
    const currDay = currDate.getDate();
    const currMonth = currDate.getMonth() + 1;
    const currYear = currDate.getFullYear();

    if (inputYear < currYear) {
      return { minDate: true };
    } else if (inputMonth < currMonth && inputYear === currYear) {
      return { minDate: true };
    } else if (
      inputDay < currDay &&
      (inputMonth === currMonth && inputYear >= currYear)
    ) {
      return { minDate: true };
    }
    return null;
  }
  return { minDate: true };
}

export { getIndexBy, arrayMove, sortArrayByProperty, sortArray, validateMinDate, convertDateToStringOracle };
