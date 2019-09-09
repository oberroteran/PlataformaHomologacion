export class CommonMethods {
    /**
   * Convierte una lista en un texto html para ser mostrado en los pop-up de alerta
   * @param list lista ingresada
   * @returns  string en html
   */
    static listToString(list: String[]): string {
        let output = "";
        if (list != null && list.length > 0) {
            list.forEach(function (item) {
                output = output + item + " <br>"
            });
        }
        return output;
    }

    static isNumber(input: any): boolean {
        if (input == null || input.toString().trim() == "") return false;
        else return !isNaN(input);
    }
    static ConvertToReadableNumber(input: any) {
        if (this.isNumber(input)) return input;
        else return 0;
    }


}