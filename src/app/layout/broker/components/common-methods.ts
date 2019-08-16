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

    
}